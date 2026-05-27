import { getApiBaseUrl } from "../config/api";

const API_BASE_URL = getApiBaseUrl();

export interface DiaryEntry {
  userId: string;
  title?: string;
  content: string;
  visibility: "Public" | "Private";
  status: string;
}

export interface DiaryRecord {
  recordId: number;
  userId: string;
  title: string;
  content: string;
  visibility: "Public" | "Private";
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export async function createDiaryEntry(entry: DiaryEntry) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/diary`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    throw new Error("Failed to create diary entry");
  }

  return response.json();
}

export async function getDiaries() {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/diary`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch diaries");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching diaries:", error);
    throw error;
  }
}

export async function getDiaryById(id: number) {
  const response = await fetch(`${API_BASE_URL}/diary/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch diary");
  }

  return response.json();
}
