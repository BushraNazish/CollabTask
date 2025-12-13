import { api } from "@/services/api";
import { type Team } from "./types";

export async function fetchTeams() {
  const { data } = await api.get<Team[]>("/api/teams");
  return data;
}

export async function createTeam(payload: { teamName: string; description?: string }) {
  const { data } = await api.post<Team>("/api/teams", payload);
  return data;
}

export async function updateTeam(teamId: number, payload: { teamName: string; description?: string }) {
  const { data } = await api.put<Team>(`/api/teams/${teamId}`, payload);
  return data;
}

export async function deleteTeam(teamId: number) {
  await api.delete(`/api/teams/${teamId}`);
}
