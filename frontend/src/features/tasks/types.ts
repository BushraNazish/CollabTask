import { type Project } from "@/features/projects/types";
import { type SessionUser } from "@/features/auth/types";

export type TaskStatus = "TO_DO" | "IN_PROGRESS" | "COMPLETED";
export type TaskPriority = "HIGH" | "MEDIUM" | "LOW";

export type Task = {
  taskId: number;
  title: string;
  description?: string;
  project?: Partial<Project>;
  assignedTo?: SessionUser;
  createdBy?: SessionUser;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: string;
  createdAt?: string;
};
