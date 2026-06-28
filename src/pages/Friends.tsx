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
  const [isCalling, setIsCalling] = useState(false);
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

  const handleStartCall = () => {
    setIsCalling(true);
    window.setTimeout(() => setIsCalling(false), 8000);
  };

  const pending = requests.filter((r) => r.uiStatus === "incoming");
  const activeFriend =
    friendList.find((f) => f.userId === activeFriendId) ?? null;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee]">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />

      <div className="relative z-10 will-change-transform flex justify-center px-4 py-8 sm:px-6 sm:py-12">
      <div className="w-full max-w-5xl">
        <Navbar />

        <header className="mb-8 sm:mb-12 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
            Your <span className="italic">Friends</span>
          </h1>
          <p className="mt-3 sm:mt-4 text-gray-600 text-xs sm:text-sm max-w-2xl mx-auto px-2 leading-relaxed">
            Review requests and chat with your friends.
          </p>
        </header>

        <section className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Friends
            </p>
            <p className="mt-1 text-2xl font-semibold text-gray-900">
              {friendList.length}
            </p>
          </div>
          <div className="rounded-2xl border border-gray-200/80 bg-white/80 p-4 text-center">
            <p className="text-xs uppercase tracking-wider text-gray-500">
              Pending
            </p>
            <p className="mt-1 text-2xl font-semibold text-amber-600">
              {pending.length}
            </p>
          </div>
        </section>

        {error && (
          <p className="mb-4 text-center text-sm text-red-600">{error}</p>
        )}

        {/* Incoming requests */}
        {!loading && pending.length > 0 && (
          <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {pending.map((user) => (
              <article
                key={user.sender_id}
                className="rounded-3xl border border-gray-200/80 bg-[#fffefc] p-5 shadow-[0_10px_22px_rgba(17,24,39,0.06)] ring-1 ring-white/80"
              >
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  @{user.username}
                </p>
                <h3 className="mt-1 text-xl font-semibold tracking-tight text-gray-900">
                  {user.displayName}
                </h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    disabled={actionPending === user.sender_id}
                    onClick={() => handleAccept(user)}
                    className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
                  >
                    Accept
                  </button>
                </div>
              </article>
            ))}
          </section>
        )}

        {loading && (
          <p className="mb-6 text-center text-sm text-gray-500">Loading...</p>
        )}

        {/* Chat section */}
        <section className="rounded-3xl border border-gray-200/80 bg-[#fffefc] p-5 shadow-[0_10px_22px_rgba(17,24,39,0.06)] ring-1 ring-white/80 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight text-gray-900">
              Chat & Voice Call
            </h2>
            <span
              className={`flex items-center gap-1.5 text-xs ${connected ? "text-emerald-600" : "text-gray-400"}`}
            >
              <span
                className={`h-2 w-2 rounded-full ${connected ? "bg-emerald-500" : "bg-gray-300"}`}
              />
              {connected ? "Connected" : "Connecting..."}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <aside className="rounded-2xl border border-gray-200/80 bg-white p-3 lg:col-span-1">
              <p className="mb-2 text-xs uppercase tracking-wider text-gray-500">
                Friend List
              </p>
              {friendList.length === 0 && (
                <p className="text-sm text-gray-500">No friends yet.</p>
              )}
              <div className="space-y-2">
                {friendList.map((friend) => (
                  <button
                    key={friend.userId}
                    onClick={() => setActiveFriendId(friend.userId)}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm transition ${
                      activeFriend?.userId === friend.userId
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    }`}
                  >
                    {friend.displayName}
                    <span className="ml-1 text-xs opacity-70">
                      @{friend.username}
                    </span>
                  </button>
                ))}
              </div>
            </aside>

            <div className="rounded-2xl border border-gray-200/80 bg-white p-4 lg:col-span-2">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {activeFriend
                      ? activeFriend.displayName
                      : "No friend selected"}
                  </p>
                  {activeFriend && (
                    <p className="text-xs text-gray-500">
                      @{activeFriend.username}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleStartCall}
                  disabled={!activeFriend}
                  className={`rounded-full px-4 py-2 text-xs font-medium transition disabled:opacity-40 ${
                    isCalling
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-gray-900 text-white hover:bg-black"
                  }`}
                >
                  {isCalling ? "Calling..." : "Voice Call"}
                </button>
              </div>

              <div className="mb-3 h-56 overflow-y-auto rounded-xl border border-gray-200 bg-stone-50 p-3">
                {!activeFriend ? (
                  <p className="text-sm text-gray-500">
                    Add or accept friends to start chatting.
                  </p>
                ) : conversationLoading ? (
                  <p className="text-sm text-gray-500">Loading messages...</p>
                ) : allMessages.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No messages yet. Say hi.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {allMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow-sm ${
                          msg.senderId === resolvedUserId
                            ? "ml-auto bg-gray-900 text-white"
                            : "bg-white text-gray-800"
                        }`}
                      >
                        {msg.messageText}
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2"
              >
                <input
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Type a message..."
                  disabled={!activeFriend}
                  className="w-full rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-40"
                />
                <button
                  type="submit"
                  disabled={!activeFriend}
                  className="rounded-full bg-gray-900 px-4 py-2.5 text-xs font-medium text-white hover:bg-black disabled:opacity-40"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>
    </div>
    </div>
  );
}
