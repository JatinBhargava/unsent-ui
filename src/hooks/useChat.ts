import { useEffect, useRef, useState, useCallback } from "react";
import { ChatClient, type ChatMessage } from "../services/Chat";
import { useAuth } from "../contexts/AuthContext";

export interface ChatEntry {
  senderId: string;
  messageText: string;
  timestamp: string;
}

export function useChat(
  activeFriendId: string | null,
  overrideUserId?: string | null,
) {
  const { token, userId: authUserId } = useAuth();
  const userId = overrideUserId ?? authUserId;
  const clientRef = useRef<ChatClient | null>(null);
  const [messagesByFriend, setMessagesByFriend] = useState<
    Record<string, ChatEntry[]>
  >({});
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!token || !userId) return;

    const client = new ChatClient(
      token,
      () => setConnected(true),
      () => setConnected(false),
    );

    clientRef.current = client;
    client.activate();

    const unsub = client.subscribe(
      `/user/queue/messages`,
      (msg: ChatMessage) => {
        const friendId =
          msg.senderId === userId ? msg.receiverId : msg.senderId;
        setMessagesByFriend((prev) => ({
          ...prev,
          [friendId]: [
            ...(prev[friendId] ?? []),
            {
              senderId: msg.senderId,
              messageText: msg.messageText,
              timestamp: msg.timestamp ?? new Date().toISOString(),
            },
          ],
        }));
      },
    );

    return () => {
      unsub();
      client.deactivate();
      clientRef.current = null;
      setConnected(false);
    };
  }, [token, userId]);

  const sendMessage = useCallback(
    (content: string) => {
      if (!clientRef.current || !userId || !activeFriendId) return;

      const msg: ChatMessage = {
        senderId: userId,
        receiverId: activeFriendId,
        messageText: content,
        timestamp: new Date().toISOString(),
      };

      clientRef.current.send(msg);

      // Optimistic local append — shows immediately regardless of WS state
      setMessagesByFriend((prev) => ({
        ...prev,
        [activeFriendId]: [
          ...(prev[activeFriendId] ?? []),
          {
            senderId: userId,
            messageText: content,
            timestamp: msg.timestamp!,
          },
        ],
      }));
    },
    [userId, activeFriendId],
  );

  const messages: ChatEntry[] = activeFriendId
    ? (messagesByFriend[activeFriendId] ?? [])
    : [];

  return { messages, sendMessage, connected };
}
