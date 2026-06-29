import { useEffect, useRef, useState, useCallback } from "react";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import {
  getIncomingRequests,
  acceptFriendRequest,
  getFriendList,
  fetchUserById,
  type FriendRequest,
  type FriendProfile,
} from "../services/Friends";
import { getUserByEmail } from "../services/User";
import { useChat } from "../hooks/useChat";
import {
  fetchConversation,
  fetchConversationByUsers,
  type ConversationMessage,
} from "../services/Chat";

type UIStatus = "incoming" | "accepted";

interface FriendEntry extends FriendRequest {
  uiStatus: UIStatus;
}

function toUIStatus(code: string): UIStatus {
  if (code === "FRS02") return "accepted";
  return "incoming";
}

export default function Friends() {
  const { email, token } = useAuth();
  const [resolvedUserId, setResolvedUserId] = useState<string | null>(null);
  const [requests, setRequests] = useState<FriendEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionPending, setActionPending] = useState<string | null>(null);
  const [friendList, setFriendList] = useState<FriendProfile[]>([]);
  const [activeFriendId, setActiveFriendId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [conversationMessages, setConversationMessages] = useState<
    Record<string, ConversationMessage[]>
  >({});
  const [conversationLoading, setConversationLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages: wsMessages, sendMessage, connected } = useChat(
    activeFriendId,
    resolvedUserId,
  );

  useEffect(() => {
    if (!email) return;
    getUserByEmail(email)
      .then((user) => setResolvedUserId(user.userId))
      .catch(() => setError("Failed to resolve user."));
  }, [email]);

  useEffect(() => {
    if (!resolvedUserId) return;
    getFriendList(resolvedUserId)
      .then((ids) => Promise.all(ids.map((id) => fetchUserById(id))))
      .then((profiles) => {
        setFriendList(profiles);
        setActiveFriendId((prev) => prev ?? profiles[0]?.userId ?? null);
      })
      .catch(() => {});
  }, [resolvedUserId]);

  useEffect(() => {
    if (!resolvedUserId) return;
    setLoading(true);
    getIncomingRequests(resolvedUserId)
      .then((users) => {
        const entries = users
          .map((u) => ({ ...u, uiStatus: toUIStatus(u.request_status) }))
          .filter(
            (u): u is FriendEntry =>
              u.uiStatus === "incoming" || u.uiStatus === "accepted",
          );
        setRequests(entries);
      })
      .catch(() => setError("Failed to load friend requests."))
      .finally(() => setLoading(false));
  }, [resolvedUserId]);

  // Load conversation from API whenever active friend changes
  const loadConversation = useCallback(
    async (friendId: string) => {
      if (!resolvedUserId || !token) return;
      try {
        const relationship = await fetchConversationByUsers(
        resolvedUserId,
        friendId,
        token,
      );
      if (!relationship) return;
      const msgs = await fetchConversation(relationship.conversationId, token);
        setConversationMessages((prev) => ({ ...prev, [friendId]: msgs }));
      } catch {
        // keep existing messages on failure
      }
    },
    [resolvedUserId, token],
  );

  useEffect(() => {
    if (!activeFriendId) return;
    setConversationLoading(true);
    loadConversation(activeFriendId).finally(() =>
      setConversationLoading(false),
    );
  }, [activeFriendId, loadConversation]);

  const handleAccept = async (sender: FriendEntry) => {
    if (!resolvedUserId) return;
    setActionPending(sender.sender_id);
    try {
      await acceptFriendRequest(sender.sender_id, sender.receiver_id);
      setRequests((prev) =>
        prev.filter((r) => r.sender_id !== sender.sender_id),
      );
      const ids = await getFriendList(resolvedUserId);
      const profiles = await Promise.all(ids.map((id) => fetchUserById(id)));
      setFriendList(profiles);
    } catch {
      setError("Failed to accept request.");
    } finally {
      setActionPending(null);
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFriendId || !messageInput.trim()) return;
    sendMessage(messageInput.trim());
    setMessageInput("");
    // Re-fetch conversation after short delay to pick up persisted message
    setTimeout(() => loadConversation(activeFriendId), 800);
  };

  // Scroll to bottom whenever messages change
  const apiMessages = activeFriendId
    ? (conversationMessages[activeFriendId] ?? [])
    : [];
  const apiKeys = new Set(
    apiMessages.map((m) => `${m.senderId}:${m.messageText}`),
  );
  const pendingWs = wsMessages.filter(
    (m) => !apiKeys.has(`${m.senderId}:${m.messageText}`),
  );
  const allMessages = [
    ...apiMessages,
    ...pendingWs.map((m) => ({
      conversationId: "",
      senderId: m.senderId,
      messageText: m.messageText,
    })),
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [allMessages.length]);



  const pending = requests.filter((r) => r.uiStatus === "incoming");
  const activeFriend =
    friendList.find((f) => f.userId === activeFriendId) ?? null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee]">
      <div className="pointer-events-none absolute -top-24 -left-24 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-cyan-200/40 blur-3xl" />

      <div className="relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
          <Navbar />
        </div>

        {/* Header */}
        <header className="text-center max-w-xl mx-auto px-4 pt-4 sm:pt-6 pb-6 sm:pb-8">
          <p className="text-[10px] sm:text-xs tracking-widest uppercase text-gray-400 mb-2">
            {friendList.length} friends · {pending.length} pending
          </p>
          <h1 className="text-2xl sm:text-4xl font-semibold tracking-tight text-gray-900">
            Your <span className="italic text-amber-700/80">circle</span>
          </h1>
          <p className="mt-2 text-gray-500 text-xs sm:text-sm leading-relaxed">
            Chat with friends and manage incoming requests.
          </p>
        </header>

        <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-16">
          {error && <p className="mb-4 text-center text-sm text-red-500">{error}</p>}
          {loading && <p className="text-center text-sm text-gray-400 py-8">Loading…</p>}

          {/* Incoming requests */}
          {!loading && pending.length > 0 && (
            <section className="mb-6">
              <p className="mb-3 text-xs font-medium uppercase tracking-wider text-gray-400">
                Requests · {pending.length}
              </p>
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {pending.map((user) => {
                  const fi = (user.displayName || user.username || "?").slice(0, 2).toUpperCase();
                  return (
                    <article key={user.sender_id} className="snap-start shrink-0 w-52 rounded-2xl border border-gray-200/80 bg-white p-4 space-y-3">
                      <div className="h-10 w-10 rounded-full bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center text-sm font-semibold text-amber-700">
                        {fi}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 leading-tight">{user.displayName}</h3>
                        <p className="text-xs text-gray-400">@{user.username}</p>
                      </div>
                      <button
                        disabled={actionPending === user.sender_id}
                        onClick={() => handleAccept(user)}
                        className="w-full rounded-full bg-gray-900 text-white py-1.5 text-xs font-medium hover:bg-black transition disabled:opacity-50"
                      >
                        {actionPending === user.sender_id ? "Accepting…" : "Accept"}
                      </button>
                    </article>
                  );
                })}
              </div>
            </section>
          )}

          {/* Chat panel */}
          <div className="rounded-3xl border border-gray-200/80 bg-white overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.06)]">

            {/* Mobile: horizontal friend avatar row */}
            {friendList.length > 0 && (
              <div className="sm:hidden flex items-center gap-4 overflow-x-auto px-4 py-3 border-b border-gray-100 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {friendList.map((friend) => {
                  const isActive = activeFriend?.userId === friend.userId;
                  const fi = (friend.displayName || "?").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <button key={friend.userId} onClick={() => setActiveFriendId(friend.userId)} className="flex flex-col items-center gap-1 shrink-0">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold ring-2 transition ${isActive ? "bg-gray-900 text-white ring-gray-900" : "bg-gray-100 text-gray-600 ring-transparent"}`}>
                        {fi}
                      </div>
                      <span className={`text-[10px] truncate max-w-12 ${isActive ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                        {friend.displayName?.split(" ")[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex h-125 sm:h-140">

              {/* Desktop sidebar */}
              <div className="hidden sm:flex w-60 flex-col border-r border-gray-100 shrink-0">
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Friends</span>
                  <span className={`flex items-center gap-1 text-[10px] ${connected ? "text-emerald-500" : "text-gray-300"}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${connected ? "bg-emerald-500" : "bg-gray-300"}`} />
                    {connected ? "live" : "…"}
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto py-2">
                  {friendList.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-8 px-4 leading-relaxed">No friends yet.<br/>Accept a request to start.</p>
                  ) : (
                    friendList.map((friend) => {
                      const isActive = activeFriend?.userId === friend.userId;
                      const fi = (friend.displayName || "?").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();
                      return (
                        <button
                          key={friend.userId}
                          onClick={() => setActiveFriendId(friend.userId)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition ${isActive ? "bg-gray-50" : "hover:bg-gray-50/60"}`}
                        >
                          <div className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-[10px] font-bold transition ${isActive ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}>
                            {fi}
                          </div>
                          <div className="min-w-0">
                            <p className={`text-sm font-medium truncate ${isActive ? "text-gray-900" : "text-gray-700"}`}>{friend.displayName}</p>
                            <p className="text-[10px] text-gray-400 truncate">@{friend.username}</p>
                          </div>
                          {isActive && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-gray-900 shrink-0" />}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Chat area */}
              <div className="flex-1 flex flex-col min-w-0">

                {/* Chat header */}
                <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between shrink-0">
                  {activeFriend ? (
                    <div className="flex items-center gap-2.5">
                      <div className="h-8 w-8 rounded-full bg-gray-900 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        {(activeFriend.displayName || "?").split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 leading-tight">{activeFriend.displayName}</p>
                        <p className="text-[10px] text-gray-400">@{activeFriend.username}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400">Select a friend to chat</p>
                  )}
                  <span className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-300 cursor-not-allowed select-none" title="Coming soon">
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.64 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.5a16 16 0 0 0 6 6l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    Call
                  </span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-2">
                  {!activeFriend ? (
                    <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                      <span className="text-3xl">💬</span>
                      <p className="text-sm">Pick someone to chat with</p>
                    </div>
                  ) : conversationLoading ? (
                    <div className="flex items-center justify-center h-full text-sm text-gray-400">Loading…</div>
                  ) : allMessages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center gap-1.5 text-gray-400">
                      <p className="text-sm">No messages yet.</p>
                      <p className="text-xs">Say hi to {activeFriend.displayName} 👋</p>
                    </div>
                  ) : (
                    allMessages.map((msg, idx) => (
                      <div key={idx} className={`flex ${msg.senderId === resolvedUserId ? "justify-end" : "justify-start"}`}>
                        <div className={`max-w-[72%] rounded-2xl px-3 py-2 text-sm leading-relaxed ${msg.senderId === resolvedUserId ? "bg-gray-900 text-white rounded-br-sm" : "bg-gray-100 text-gray-800 rounded-bl-sm"}`}>
                          {msg.messageText}
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <form onSubmit={handleSendMessage} className="px-4 py-3 border-t border-gray-100 flex items-center gap-2 shrink-0">
                  <input
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder={activeFriend ? `Message ${activeFriend.displayName}…` : "Select a friend first"}
                    disabled={!activeFriend}
                    className="flex-1 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-40"
                  />
                  <button
                    type="submit"
                    disabled={!activeFriend || !messageInput.trim()}
                    className="h-9 w-9 shrink-0 flex items-center justify-center rounded-full bg-gray-900 text-white hover:bg-black disabled:opacity-40 transition"
                  >
                    <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
