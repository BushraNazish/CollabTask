export type UserRole = "ADMIN" | "MANAGER" | "MEMBER";

export type SessionUser = {
  id?: number;
  name: string;
  email: string;
  role: UserRole;
};

export type AuthResponse = {
  token: string;
  userId?: number;
  email: string;
  name: string;
  role: UserRole;
  message: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
};

export type LoginPayload = {
  email: string;
  password: string;
};
