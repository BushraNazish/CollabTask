import { api } from "@/services/api";
import { type AppUser } from "./types";

export async function fetchUsers() {
  const { data } = await api.get<AppUser[]>("/api/users");
  return data;
}

export async function updateUser({
  userId,
  data,
}: {
  userId: number;
  data: Partial<AppUser>;
}) {
  const { data: updatedUser } = await api.put<AppUser>(
    `/api/users/${userId}`,
    data,
  );
  return updatedUser;
}

export async function deleteUser(userId: number) {
  await api.delete(`/api/users/${userId}`);
}
