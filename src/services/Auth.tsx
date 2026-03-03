import type { LoginRequest } from "../types/LoginRequest";
import type { RegisterRequest } from "../types/RegisterRequest";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8081";

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
