import { isTokenExpired, refreshAccessToken } from "./validateToken";

const BASE_URL: string =
  (process.env.BACKEND_BASE_URL as string) || "http://localhost:4000";

interface ApiRequestOptions {
  headers?: Record<string, string>;
  [key: string]: any;
}

async function apiRequest<T = any>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  let token = localStorage.getItem("token");

  if (token && isTokenExpired(token)) {
    const refresh = await refreshAccessToken();
    token = refresh ? localStorage.getItem("token") : null;
  }
  let response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });

  if (response.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      token = localStorage.getItem("token");
      response = await fetch(`${BASE_URL}${endpoint}`, {
        ...options,
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
          ...options.headers,
        },
      });
    }
  }

  if (!response.ok) {
    let errorMessage = `API error: ${response.status}`;
    try {
      const errBody = await response.json();
      if (errBody.error) {
        errorMessage = errBody.error; // your BadException sends { error: "..." }
      }
    } catch (_) {
      // ignore JSON parse failure
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export default apiRequest;
