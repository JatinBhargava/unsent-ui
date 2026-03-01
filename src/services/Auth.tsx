import type { LoginRequest } from "../types/LoginRequest";
import type { RegisterRequest } from "../types/RegisterRequest";

const baseurl = 'https://unsent-api-1-0-0-snapshot.onrender.com';

export async function registerUser(formData: RegisterRequest) {
  const response = await fetch(`${baseurl}/auth/register`, {
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
  const response = await fetch(`${baseurl}/auth/login`, {
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
