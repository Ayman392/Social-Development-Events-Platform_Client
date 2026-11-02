import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Use this instead of fetch() for any request that needs a logged-in user.
// It gets a fresh token and sends it with the request.
export async function apiFetch(path: string, options: RequestInit = {}) {
  const { data } = await authClient.token();

  const headers = new Headers(options.headers);
  if (data?.token) {
    headers.set("Authorization", `Bearer ${data.token}`);
  }

  return fetch(`${API_URL}${path}`, { ...options, headers });
}