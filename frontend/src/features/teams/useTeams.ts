import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTeam, fetchTeams, updateTeam, deleteTeam } from "./api";
import { type Team } from "./types";

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: fetchTeams,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTeam,
    onSuccess: (created) => {
      queryClient.setQueryData<Team[]>(["teams"], (old) =>
        old ? [created, ...old] : [created],
      );
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ teamId, data }: { teamId: number; data: { teamName: string; description?: string } }) =>
      updateTeam(teamId, data),
    onSuccess: (updated: Team) => {
      queryClient.setQueryData<Team[]>(["teams"], (old) =>
        old ? old.map((team) => (team.teamId === updated.teamId ? updated : team)) : [],
      );
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  return useMutation<void, Error, number>({
    mutationFn: deleteTeam,
    onSuccess: (_, teamId) => {
      queryClient.setQueryData<Team[]>(["teams"], (old) =>
        old ? old.filter((team) => team.teamId !== teamId) : [],
      );
    },
  });
}
