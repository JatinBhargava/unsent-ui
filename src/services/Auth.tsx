import type { LoginRequest } from "../types/LoginRequest";
import type { RegisterRequest } from "../types/RegisterRequest";
import { getApiBaseUrl } from "../config/api";
import axios from "axios";

const API_BASE_URL = getApiBaseUrl();

function authHeaders() {
  const token = localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function registerUser(formData: RegisterRequest) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    const err = new Error(body?.message || "Failed to register user") as Error & { code?: string };
    err.code = body?.code;
    throw err;
  }
  return response.json();
}

export async function loginUser(formData: LoginRequest) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    throw new Error("Failed to login");
  }
  return response.json();
}

export async function getUserByEmail(email: string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/user`, {
      params: {
        email: email,
      },
      headers: authHeaders(),
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getUserById(userId: number | string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/user/${userId}`, {
      headers: authHeaders(),
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export interface PublicUser {
  userId: string;
  username: string;
  displayName: string;
}

// Use this instead of getUserById whenever you only need to show another
// user's name (feed byline, friends list) — it omits gender/dateOfBirth/email.
export async function getPublicUserById(userId: number | string): Promise<PublicUser> {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/user/${userId}/public`, {
      headers: authHeaders(),
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export interface UpdateUserProfilePayload {
  displayName?: string;
  gender?: string;
  date_of_birth?: string;
  bio?: string;
}

export async function updateUserProfile(
  userId: number | string,
  payload: UpdateUserProfilePayload
) {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/auth/user/${userId}/profile`,
      payload,
      { headers: authHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error updating user profile:", error);
    throw error;
  }
}
