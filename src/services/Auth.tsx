import type { LoginRequest } from "../types/LoginRequest";
import type { RegisterRequest } from "../types/RegisterRequest";
import { getApiBaseUrl } from "../config/api";
import axios from "axios";

const API_BASE_URL = getApiBaseUrl();

export async function registerUser(formData: RegisterRequest) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });
  if (!response.ok) {
    throw new Error("Failed to register user");
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
    });

    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getUserById(userId: number | string) {
  try {
    const response = await axios.get(`${API_BASE_URL}/auth/user/${userId}`);

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
      payload
    );
    return response.data;
  } catch (error) {
    console.error("❌ Error updating user profile:", error);
    throw error;
  }
}
