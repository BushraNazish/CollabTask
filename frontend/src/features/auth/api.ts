import { api } from "@/services/api";
import {
  type AuthResponse,
  type LoginPayload,
  type RegisterPayload,
  type SessionUser,
} from "./types";

function mapAuthResponse(res: AuthResponse): { token: string; user: SessionUser } {
  return {
    token: res.token,
    user: {
      id: res.userId,
      name: res.name,
      email: res.email,
      role: res.role,
    },
  };
}

export async function login(payload: LoginPayload) {
  const { data } = await api.post<AuthResponse>("/api/auth/login", payload);
  return mapAuthResponse(data);
}

export async function register(payload: RegisterPayload) {
  const { data } = await api.post<AuthResponse>("/api/auth/register", payload);
  return mapAuthResponse(data);
}

export async function fetchMe() {
  const { data } = await api.get<SessionUser>("/api/users/me");
  return data;
}
