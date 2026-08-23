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
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/diary/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch diary");
  }

  return response.json();
}

export async function updateDiaryEntry(
  id: number,
  entry: { title: string; content: string; visibility: string; status: string },
) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/diary/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(entry),
  });

  if (!response.ok) {
    throw new Error("Failed to update diary entry");
  }

  return response.json();
}

export async function submitContribution(diaryId: number, userId: string, content: string) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/diary/contribution/${diaryId}/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userId, content }),
  });

  if (!response.ok) {
    throw new Error("Failed to submit contribution");
  }

  if (response.status === 204) {
    return { success: true };
  }

  return response.json();
}

export interface ContributionRequest {
  contributionId: string;
  contributorId: string;
  authorId: string;
  content: string;
  parentEntryId: number;
  status: string;
  storyId: string;
}

export async function getPendingContributions(diaryId: number): Promise<ContributionRequest[]> {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/diary/contribution/${diaryId}/pending`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch pending contributions");
  }

  const json = await response.json();
  const data = json.data ?? json;
  return Array.isArray(data) ? data : [data];
}

export async function acceptContribution(contributionId: string) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/diary/contribution/${contributionId}/accept`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to accept contribution");
  }

  if (response.status === 204) return { success: true };
  return response.json();
}

export async function rejectContribution(contributionId: string) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/diary/contribution/${contributionId}/reject`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to reject contribution");
  }

  if (response.status === 204) return { success: true };
  return response.json();
}

export async function deleteDiaryEntry(id: number) {
  const token = localStorage.getItem("authToken");

  if (!token) {
    throw new Error("No authentication token found");
  }

  const response = await fetch(`${API_BASE_URL}/diary/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete diary entry");
  }

  // 204 No Content means successful deletion with no response body
  if (response.status === 204) {
    return { success: true };
  }

  return response.json();
}
