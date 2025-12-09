import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, fetchProjects } from "./api";
import { type Project } from "./types";

export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createProject,
    onSuccess: (created) => {
      queryClient.setQueryData<Project[]>(["projects"], (old) =>
        old ? [created, ...old] : [created],
      );
    },
  });
}
