import { type UserRole } from "@/features/auth/types";

export type ProjectStatus =
  | "PLANNING"
  | "IN_PROGRESS"
  | "ON_HOLD"
  | "COMPLETED";

export type ProjectPriority = "HIGH" | "MEDIUM" | "LOW";

export type Team = {
  teamId: number;
  teamName?: string;
  description?: string;
  createdAt?: string;
};

export type UserSummary = {
  userId?: number;
  name: string;
  email: string;
  role: UserRole;
};

export type Project = {
  projectId: number;
  projectName: string;
  description?: string;
  team: Team;
  status: ProjectStatus;
  priority: ProjectPriority | string;
  startDate?: string;
  endDate?: string;
  createdBy?: UserSummary;
  createdAt?: string;
};
