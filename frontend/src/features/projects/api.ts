import { api } from "@/services/api";
import { type Project } from "./types";

export async function fetchProjects() {
  const { data } = await api.get<Project[]>("/api/projects");
  return data;
}


export async function createProject(payload: Partial<Project> & { projectName: string }) {
  const { data } = await api.post<Project>("/api/projects", payload);
  return data;
}


export async function updateProject({ projectId, ...payload }: Partial<Project> & { projectId: number }) {
  const { data } = await api.put<Project>(`/api/projects/${projectId}`, payload);
  return data;
}

export async function deleteProject(projectId: number) {
  await api.delete(`/api/projects/${projectId}`);
}
