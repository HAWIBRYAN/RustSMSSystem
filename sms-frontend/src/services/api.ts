// src/services/api.ts
export interface SMSPayload {
  recipient: string;
  content: string;
}

export interface SMS extends SMSPayload {
  id: number;
  created_at: string;
}

const API_URL = "http://127.0.0.1:3000"; // your Axum backend

export async function sendSMS(payload: SMSPayload): Promise<SMS> {
  const res = await fetch(`${API_URL}/sms`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.error || "Failed to send SMS");
  }

  return res.json();
}

export async function fetchSMS(): Promise<SMS[]> {
  const res = await fetch(`${API_URL}/sms`);
  if (!res.ok) throw new Error("Failed to fetch SMS");
  return res.json();
}
