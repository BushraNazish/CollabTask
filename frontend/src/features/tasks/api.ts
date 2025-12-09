import { api } from "@/services/api";
import { type Task } from "./types";

export async function fetchTasks() {
  const { data } = await api.get<Task[]>("/api/tasks");
  return data;
}

export async function createTask(payload: Partial<Task> & { title: string }) {
  const { data } = await api.post<Task>("/api/tasks", payload);
  return data;
}
