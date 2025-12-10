import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, fetchTasks, updateTask, deleteTask } from "./api";
import { type Task } from "./types";

export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTask,
    onSuccess: (created) => {
      queryClient.setQueryData<Task[]>(["tasks"], (old) =>
        old ? [created, ...old] : [created],
      );
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData<Task[]>(["tasks"], (old) =>
        old ? old.filter((t) => t.taskId !== deletedId) : []
      );
    },
  });
}
