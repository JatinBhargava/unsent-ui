import { getApiBaseUrl } from "../config/api";

const API_BASE_URL = getApiBaseUrl();

export interface User {
  id: string;
  email: string;
  username?: string;
  [key: string]: unknown;
}

export async function getUserByEmail(email: string): Promise<User> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  if (!email) {
    throw new Error("Email is required");
  }

  const response = await fetch(
    `${API_BASE_URL}/users/email/${encodeURIComponent(email)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch user by email");
  }

  return response.json();
}

export async function getUser(userId: string): Promise<User> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch user");
  }

  return response.json();
}
