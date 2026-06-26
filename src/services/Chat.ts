import { Client, type IMessage } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { getApiBaseUrl } from "../config/api";

export interface ConversationMessage {
  conversationId: string;
  messageText: string;
  senderId: string;
}

export async function fetchConversation(
  conversationId: string,
  token: string,
): Promise<ConversationMessage[]> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/messages/conversation/${conversationId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch conversation");
  const body = await res.json();
  return body.data ?? [];
}

export interface ConversationRelationship {
  conversationId: string;
  senderId: string;
  receiverId: string;
}

export async function fetchConversationByUsers(
  senderId: string,
  receiverId: string,
  token: string,
): Promise<ConversationRelationship | null> {
  const base = getApiBaseUrl();
  const res = await fetch(
    `${base}/messages/conversation?senderId=${senderId}&receiverId=${receiverId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!res.ok) return null;
  const body = await res.json();
  return body.data ?? null;
}

export interface ChatMessage {
  senderId: string;
  receiverId: string;
  messageText: string;
  timestamp?: string;
}

export type MessageHandler = (msg: ChatMessage) => void;

export class ChatClient {
  private client: Client;
  private _connected = false;
  private pendingSubscriptions: Array<{ fn: () => void; cancelled: boolean }> =
    [];
  private onConnectCb?: () => void;
  private onDisconnectCb?: () => void;

  get connected() {
    return this._connected;
  }

  constructor(
    token: string,
    onConnectCb?: () => void,
    onDisconnectCb?: () => void,
  ) {
    this.onConnectCb = onConnectCb;
    this.onDisconnectCb = onDisconnectCb;
    const baseUrl = getApiBaseUrl();

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${baseUrl}/ws-chat`),
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      onConnect: () => {
        this._connected = true;
        this.onConnectCb?.();
        // flush pending subscriptions that haven't been cancelled
        for (const entry of this.pendingSubscriptions) {
          if (!entry.cancelled) entry.fn();
        }
        this.pendingSubscriptions = [];
      },
      onDisconnect: () => {
        this._connected = false;
        this.onDisconnectCb?.();
      },
      onStompError: (frame) => {
        console.error(
          "[ChatClient] STOMP error:",
          frame.headers["message"],
          frame.body,
        );
      },
      onWebSocketError: (evt) => {
        console.error("[ChatClient] WebSocket error:", evt);
      },
    });
  }

  activate() {
    this.client.activate();
  }

  deactivate() {
    this.client.deactivate();
    this._connected = false;
  }

  subscribe(destination: string, handler: MessageHandler): () => void {
    const doSubscribe = () => {
      const sub = this.client.subscribe(destination, (frame: IMessage) => {
        try {
          const msg: ChatMessage = JSON.parse(frame.body);
          handler(msg);
        } catch {
          // malformed frame — ignore
        }
      });
      return () => sub.unsubscribe();
    };

    if (this._connected) {
      return doSubscribe();
    }

    // Queue until connected, but track cancellation
    let unsub: (() => void) | null = null;
    const entry = {
      cancelled: false,
      fn: () => {
        unsub = doSubscribe();
      },
    };
    this.pendingSubscriptions.push(entry);

    return () => {
      entry.cancelled = true;
      unsub?.();
    };
  }

  send(msg: ChatMessage): boolean {
    if (!this.client.connected) {
      console.warn(
        "[ChatClient] send() called but STOMP not connected — message dropped",
      );
      return false;
    }
    this.client.publish({
      destination: "/app/chat.send",
      body: JSON.stringify(msg),
    });
    return true;
  }
}
