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

export async function updateTask({ taskId, ...payload }: Partial<Task> & { taskId: number }) {
  const { data } = await api.put<Task>(`/api/tasks/${taskId}`, payload);
  return data;
}

export async function deleteTask(taskId: number) {
  await api.delete(`/api/tasks/${taskId}`);
}
