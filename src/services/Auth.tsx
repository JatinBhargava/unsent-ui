 import type { RegisterRequest } from "../types/RegisterRequest";

export async function registerUser(formData : RegisterRequest) {
    const response = await fetch("http://localhost:8080/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
    });
    if (!response.ok) {
        throw new Error("Failed to register user");
    }
    return response.json();
}