import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTeam, fetchTeams } from "./api";
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
