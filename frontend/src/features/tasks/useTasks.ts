import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, fetchTasks } from "./api";
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
