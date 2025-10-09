import apiRequest from "./apiClient";

interface AuthResponse {
  message: string;
  token?: string;
  data?: any;
}

export async function signup(user: {
  username: string;
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiRequest("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

export async function signin(user: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  return apiRequest("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(user),
  });
}

export async function logout(): Promise<AuthResponse> {
  return apiRequest("/api/auth/logout", {
    method: "POST",
  });
}
