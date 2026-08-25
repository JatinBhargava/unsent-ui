import { getApiBaseUrl } from "../config/api";

const API_BASE_URL = getApiBaseUrl();

export interface PostcardRequest {
  /** Where the postcard is delivered. */
  toEmail: string;
  /** What the recipient is called in the greeting — optional. */
  toName?: string;
  /** Signed at the bottom of the letter — optional. */
  fromName?: string;
  senderId?: string;
  message: string;
}

export interface PostcardResponse {
  postcardId?: string;
  toEmail?: string;
  sentAt?: string;
}

export async function sendPostcard(
  postcard: PostcardRequest,
): Promise<PostcardResponse> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/postcard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(postcard),
  });

  if (!response.ok) {
    // The backend names the reason a postcard bounced (bad address, rate
    // limit), and that reads better in the toast than a generic failure.
    const body = await response.json().catch(() => ({}));
    throw new Error(body?.message || "Failed to send postcard");
  }

  if (response.status === 204) {
    return {};
  }

  return response.json();
}
