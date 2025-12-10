import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createProject, fetchProjects, updateProject, deleteProject } from "./api";
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


export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProject,
    onSuccess: (updated) => {
      queryClient.setQueryData<Project[]>(["projects"], (old) =>
        old
          ? old.map((p) => (p.projectId === updated.projectId ? updated : p))
          : [updated],
      );
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProject,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Project[]>(["projects"], (old) =>
        old ? old.filter((p) => p.projectId !== deletedId) : []
      );
    },
  });
}
