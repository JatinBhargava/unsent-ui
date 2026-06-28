import { useEffect, useRef, useState, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import { fetchConversation, type ConversationMessage } from "../services/Chat";
import { useChat } from "../hooks/useChat";

export default function Conversation() {
  const { id: conversationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId, token } = useAuth();

  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const queryReceiverId = new URLSearchParams(location.search).get("receiverId");
  const stateReceiverId =
    (location.state as { receiverId?: string } | null)?.receiverId ?? null;
  const [receiverId, setReceiverId] = useState<string | null>(
    stateReceiverId ?? queryReceiverId,
  );
  const receiverIdRef = useRef(receiverId);
  useEffect(() => {
    receiverIdRef.current = receiverId;
  }, [receiverId]);

  const { messages: wsMessages, sendMessage: wsSend, connected } = useChat(
    receiverId,
    userId,
  );

  const loadMessages = useCallback(async () => {
    if (!conversationId || !token) return;
    try {
      const msgs = await fetchConversation(conversationId, token);
      setMessages(msgs);
      // Derive receiverId from the first message sent by someone else
      if (!receiverIdRef.current && userId) {
        const other = msgs.find((m) => m.senderId !== String(userId));
        if (other) setReceiverId(other.senderId);
      }
    } catch {
      // keep existing messages on failure
    }
  }, [conversationId, token, userId]);

  // Initial load
  useEffect(() => {
    setLoading(true);
    loadMessages().finally(() => setLoading(false));
  }, [loadMessages]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, wsMessages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const text = messageInput.trim();
    if (!text || !receiverId) return;
    wsSend(text);
    setMessageInput("");
    // Re-fetch after a short delay to get the server-persisted message
    setTimeout(() => loadMessages(), 800);
  };

  // Merge: API messages are the source of truth.
  // Append any real-time WS messages not yet confirmed by the API
  // (avoids duplicates after the re-fetch arrives).
  const apiKeys = new Set(
    messages.map((m) => `${m.senderId}:${m.messageText}`),
  );
  const pendingWs = wsMessages
    .filter((m) => !apiKeys.has(`${m.senderId}:${m.messageText}`))
    .map((m) => ({
      conversationId: conversationId!,
      senderId: m.senderId,
      messageText: m.messageText,
    }));
  const allMessages: ConversationMessage[] = [...messages, ...pendingWs];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f2ee] px-4 sm:px-6 py-8 sm:py-12 flex justify-center">
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-amber-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-20 h-72 w-72 rounded-full bg-cyan-200/45 blur-3xl" />

      <div className="relative z-10 will-change-transform w-full max-w-2xl">
        <Navbar />

        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white/70 px-4 py-2 text-sm text-gray-700 backdrop-blur-sm transition hover:bg-white"
        >
          ← Back
        </button>

        <div
          className="flex flex-col rounded-3xl border border-gray-200/80 bg-[#fffefc] shadow-[0_10px_22px_rgba(17,24,39,0.06)] ring-1 ring-white/80 overflow-hidden"
          style={{ height: "70vh" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white/60">
            <div>
              <p className="font-semibold text-gray-900">Conversation</p>
              <p className="text-xs text-gray-500">#{conversationId}</p>
            </div>
            <span
              className={`flex items-center gap-1.5 text-xs ${
                connected ? "text-emerald-600" : "text-gray-400"
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  connected ? "bg-emerald-500" : "bg-gray-300"
                }`}
              />
              {connected ? "Connected" : "Connecting..."}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {loading ? (
              <p className="text-center text-sm text-gray-500 pt-8">
                Loading messages...
              </p>
            ) : allMessages.length === 0 ? (
              <p className="text-center text-sm text-gray-500 pt-8">
                No messages yet. Say hi!
              </p>
            ) : (
              allMessages.map((msg, idx) => {
                const isMine = String(msg.senderId) === String(userId);
                return (
                  <div
                    key={idx}
                    className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                        isMine
                          ? "bg-gray-900 text-white"
                          : "bg-white text-gray-800 border border-gray-100"
                      }`}
                    >
                      {msg.messageText}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={handleSend}
            className="flex items-center gap-2 px-4 py-3 border-t border-gray-100 bg-white/80"
          >
            <input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              className="w-full rounded-full border border-gray-300 bg-white px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
            <button
              type="submit"
              disabled={!messageInput.trim() || !receiverId}
              className="rounded-full bg-gray-900 px-4 py-2.5 text-xs font-medium text-white hover:bg-black disabled:opacity-40"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
