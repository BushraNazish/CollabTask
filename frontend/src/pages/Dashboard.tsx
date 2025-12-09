import { useMemo } from "react";
import { useProjects } from "@/features/projects/useProjects";
import { useTasks } from "@/features/tasks/useTasks";
import { useTeams } from "@/features/teams/useTeams";
import { Skeleton } from "@/components/ui/Skeleton";
import { normalizeError } from "@/services/errors";

type StatCardProps = {
  label: string;
  value: string | number;
  loading?: boolean;
  error?: string;
};

function StatCard({ label, value, loading, error }: StatCardProps) {
  return (
    <div className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm">
      <p className="text-sm text-ink-500">{label}</p>
      {loading ? (
        <Skeleton className="mt-2 h-8 w-16" />
      ) : error ? (
        <p className="mt-2 text-xs text-red-600">{error}</p>
      ) : (
        <p className="text-3xl font-semibold text-ink-900">{value}</p>
      )}
    </div>
  );
}

function Dashboard() {
  const {
    data: projects,
    isLoading: loadingProjects,
    isError: projectsError,
    error: projectsErrObj,
  } = useProjects();
  const {
    data: tasks,
    isLoading: loadingTasks,
    isError: tasksError,
    error: tasksErrObj,
  } = useTasks();
  const {
    data: teams,
    isLoading: loadingTeams,
    isError: teamsError,
    error: teamsErrObj,
  } = useTeams();

  const stats = useMemo(() => {
    const taskTotal = tasks?.length ?? 0;
    const taskDone = tasks?.filter((t) => t.status === "COMPLETED").length ?? 0;
    const projectTotal = projects?.length ?? 0;
    const projectActive =
      projects?.filter((p) => p.status === "IN_PROGRESS").length ?? 0;
    const teamTotal = teams?.length ?? 0;
    return {
      taskTotal,
      taskDone,
      projectTotal,
      projectActive,
      teamTotal,
    };
  }, [tasks, projects, teams]);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold text-ink-500">Overview</p>
        <h2 className="text-2xl font-semibold text-ink-900">
          Welcome to CollabTask
        </h2>
        <p className="text-sm text-ink-600">
          Quick snapshot of projects, tasks, and teams.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Projects (active)"
          value={`${stats.projectActive}/${stats.projectTotal}`}
          loading={loadingProjects}
          error={
            projectsError ? normalizeError(projectsErrObj).message : undefined
          }
        />
        <StatCard
          label="Tasks (completed)"
          value={`${stats.taskDone}/${stats.taskTotal}`}
          loading={loadingTasks}
          error={tasksError ? normalizeError(tasksErrObj).message : undefined}
        />
        <StatCard
          label="Teams"
          value={stats.teamTotal}
          loading={loadingTeams}
          error={teamsError ? normalizeError(teamsErrObj).message : undefined}
        />
      </div>
    </div>
  );
}

export default Dashboard;
