import { api } from "@/services/api";
import { type AppUser } from "./types";

export async function fetchUsers() {
  const { data } = await api.get<AppUser[]>("/api/users");
  return data;
}
