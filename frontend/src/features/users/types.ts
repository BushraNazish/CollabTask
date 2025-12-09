import { type UserRole } from "@/features/auth/types";

export type AppUser = {
  userId: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
};
