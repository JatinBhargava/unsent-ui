import { getApiBaseUrl } from "../config/api";

const API_BASE_URL = getApiBaseUrl();

export type FriendRequestStatusCode = "FRS01" | "FRS02" | "FRS03";

export interface FriendRequest {
  sender_id: string;
  receiver_id: string;
  request_status: FriendRequestStatusCode;
  displayName: string;
  username: string;
}

function authHeaders() {
  const token = localStorage.getItem("authToken");
  if (!token) throw new Error("No authentication token found");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// FRS01 = pending (requested), FRS02 = accepted (friends/reading), FRS03 = rejected
export async function sendFriendRequest(
  senderId: string,
  receiverId: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/friends/send/friend/request`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ receiver_id: receiverId, sender_id: senderId }),
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    console.error("[sendFriendRequest] 400 response:", errBody);
    throw new Error("Failed to send friend request");
  }
}

export async function getFriendRequestStatus(
  senderId: string,
  receiverId: string,
): Promise<FriendRequestStatusCode> {
  const response = await fetch(
    `${API_BASE_URL}/friends/request/status?senderId=${senderId}&receiverId=${receiverId}`,
    { method: "GET", headers: authHeaders() },
  );

  if (!response.ok) throw new Error("Failed to fetch friend request status");

  const data = await response.json();
  return data.request_status as FriendRequestStatusCode;
}

interface RawFriendRequest {
  sender_id: string;
  receiver_id: string;
  request_status: FriendRequestStatusCode;
}

export interface FriendProfile {
  userId: string;
  displayName: string;
  username: string;
}

export async function fetchUserById(userId: string): Promise<FriendProfile> {
  const response = await fetch(`${API_BASE_URL}/auth/user/${userId}`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (!response.ok) throw new Error(`Failed to fetch user ${userId}`);
  return response.json();
}

export async function getIncomingRequests(userId: string): Promise<FriendRequest[]> {
  const response = await fetch(
    `${API_BASE_URL}/friends/request/recived?receiverId=${userId}`,
    { method: "GET", headers: authHeaders() },
  );

  if (!response.ok) throw new Error("Failed to fetch friend requests");

  const body: { data: RawFriendRequest[] } = await response.json();

  return Promise.all(
    body.data.map(async (req) => {
      const profile = await fetchUserById(req.sender_id);
      return { ...req, displayName: profile.displayName, username: profile.username };
    }),
  );
}

export async function acceptFriendRequest(
    senderId: string, receiverId: string
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/friends/accept/friend/request`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({sender_id: senderId, receiver_id: receiverId}),
  });

  if (!response.ok) throw new Error("Failed to accept friend request");
}

export async function rejectFriendRequest(
  senderId: string,
  receiverId: string,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/reject/friend/request`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ sender_id: senderId, receiver_id: receiverId }),
  });

  if (!response.ok) throw new Error("Failed to reject friend request");
}

export async function getFriendList(userId: string): Promise<string[]> {
  const response = await fetch(
    `${API_BASE_URL}/relationship/user/friend/list?userId=${userId}`,
    { method: "GET", headers: authHeaders() },
  );

  if (!response.ok) throw new Error("Failed to fetch friend list");

  const body: { data: { friendId: string }[] } = await response.json();
  return body.data.map((item) => item.friendId);
}
