import { useProjects, useCreateProject } from "@/features/projects/useProjects";
import { useTasks } from "@/features/tasks/useTasks";
import { useTeams } from "@/features/teams/useTeams";
import { useAuth } from "@/features/auth/AuthContext";
import {
  Layout,
  CheckSquare,
  Users,
  TrendingUp,
  Plus,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { useForm } from "react-hook-form";


type CreateProjectForm = {
  projectName: string;
  description: string;
  status: "PLANNING" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  teamId: string;
  endDate?: string;
};

function Dashboard() {
  const { user } = useAuth();
  const { data: projects, isLoading: pLoading } = useProjects();
  const { data: tasks, isLoading: tLoading } = useTasks();
  const { data: teams, isLoading: tmLoading } = useTeams();
  const createProject = useCreateProject();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const form = useForm<CreateProjectForm>({
    defaultValues: {
      projectName: "",
      description: "",
      status: "PLANNING",
      priority: "MEDIUM",
      teamId: "",
      endDate: "",
    },
  });

  const teamOptions = useMemo(() => {
    return (teams ?? []).map((t) => ({
      id: t.teamId,
      label: t.teamName,
    }));
  }, [teams]);

  const handleCreate = form.handleSubmit(async (values) => {
    try {
      await createProject.mutateAsync({
        projectName: values.projectName,
        description: values.description,
        status: values.status,
        priority: values.priority,
        team: values.teamId ? { teamId: Number(values.teamId) } : undefined,
        endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined,
      });
      setIsProjectModalOpen(false);
      form.reset();
    } catch (e) {
      console.error(e);
    }
  });

  // Calculate stats
  const totalProjects = projects?.length || 0;

  const pendingTasks =
    tasks?.filter((t) => t.status !== "COMPLETED").length || 0;
  const totalTeams = teams?.length || 0;

  const stats = [
    {
      label: "Total Projects",
      value: totalProjects,
      trend: "+12%",
      icon: Layout,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Pending Tasks",
      value: pendingTasks,
      trend: "-5%",
      icon: CheckSquare,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Active Teams",
      value: totalTeams,
      trend: "+2",
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 rounded-3xl bg-gradient-to-br from-brand-900 to-brand-800 p-8 text-white shadow-xl shadow-brand-900/20 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <h1 className="font-display text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(" ")[0] || "User"}! 👋
          </h1>
          <p className="text-brand-100/90">
            You have <span className="font-bold text-white">{pendingTasks}</span>{" "}
            tasks pending for today. Let's get to work.
          </p>
        </div>
        {user?.role !== "MEMBER" && (
          <Button
            onClick={() => {
              form.reset();
              setIsProjectModalOpen(true);
            }}
            className="bg-white text-brand-900 hover:bg-brand-50 border-transparent shadow-lg transition-transform hover:scale-105"
          >
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lg"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-ink-500">{stat.label}</p>
                {pLoading || tLoading || tmLoading ? (
                  <Skeleton className="mt-2 h-8 w-16" />
                ) : (
                  <h3 className="mt-2 font-display text-3xl font-bold text-ink-900">
                    {stat.value}
                  </h3>
                )}
              </div>
              <div
                className={cn(
                  "rounded-xl p-3 transition-colors group-hover:bg-opacity-80",
                  stat.bg,
                  stat.color
                )}
              >
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <span className="flex items-center font-medium text-green-600">
                <TrendingUp className="mr-1 h-3 w-3" />
                {stat.trend}
              </span>
              <span className="text-ink-400">vs last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Recent Projects */}
        <div className="rounded-2xl border border-surface-200 bg-white/60 p-6 backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-ink-900">
              Recent Projects
            </h3>
            <Link
              to="/projects"
              className="flex items-center text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 hover:underline"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {pLoading
              ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)
              : projects?.slice(0, 3).map((project) => (
                <div
                  key={project.projectId}
                  className="flex items-center justify-between rounded-xl border border-surface-100 bg-white p-4 transition-all hover:border-brand-200 hover:shadow-md hover:scale-[1.01]"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                      <Layout className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-ink-900">
                        {project.projectName}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-ink-500">
                        <span
                          className={cn(
                            "inline-block h-2 w-2 rounded-full",
                            project.status === "COMPLETED"
                              ? "bg-green-500"
                              : "bg-blue-500"
                          )}
                        />
                        {project.status.replace("_", " ")}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="rounded-2xl border border-surface-200 bg-white/60 p-6 backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-ink-900">
              My Tasks
            </h3>
            <Link
              to="/tasks"
              className="flex items-center text-sm font-medium text-brand-600 transition-colors hover:text-brand-700 hover:underline"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {tLoading
              ? [1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)
              : tasks?.slice(0, 3).map((task) => (
                <div
                  key={task.taskId}
                  className="group flex items-start gap-4 rounded-xl border border-surface-100 bg-white p-4 transition-all hover:border-brand-200 hover:shadow-md hover:scale-[1.01]"
                >
                  <div
                    className={cn(
                      "mt-1 h-5 w-5 rounded-full border-2 transition-colors",
                      task.status === "COMPLETED"
                        ? "border-green-500 bg-green-500"
                        : "border-surface-300 group-hover:border-brand-400"
                    )}
                  />
                  <div className="flex-1">
                    <h4
                      className={cn(
                        "font-medium text-ink-900 transition-all",
                        task.status === "COMPLETED" &&
                        "text-ink-400 line-through"
                      )}
                    >
                      {task.title}
                    </h4>
                    <div className="mt-1 flex items-center gap-4 text-xs text-ink-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {task.dueDate || "No date"}
                      </span>
                      <span
                        className={cn(
                          "rounded px-1.5 py-0.5 font-medium",
                          task.priority === "HIGH"
                            ? "bg-red-50 text-red-700"
                            : "bg-surface-100 text-ink-600"
                        )}
                      >
                        {task.priority}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <Modal
        open={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        title="Create project"
      >
        <form className="space-y-4" onSubmit={handleCreate}>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-ink-800">
              Project Name <span className="text-red-500">*</span>
            </label>
            <Input
              {...form.register("projectName", { required: "This field cannot be empty" })}
              placeholder="e.g. Website Redesign"
              className={cn(form.formState.errors.projectName && "border-red-500 focus:border-red-500 focus:ring-red-500/10")}
            />
            {form.formState.errors.projectName && (
              <p className="text-xs text-red-500">{form.formState.errors.projectName.message}</p>
            )}
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-ink-800">
              Description
            </label>
            <Input
              {...form.register("description")}
              placeholder="Brief details about the project..."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-ink-800">
                Status <span className="text-red-500">*</span>
              </label>
              <Select {...form.register("status", { required: "This field cannot be empty" })}>
                <option value="PLANNING">Planning</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-ink-800">
                Priority <span className="text-red-500">*</span>
              </label>
              <Select {...form.register("priority", { required: "This field cannot be empty" })}>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </Select>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-semibold text-ink-800">
                Assign Team <span className="text-red-500">*</span>
              </label>
              <Select
                {...form.register("teamId", { required: "This field cannot be empty" })}
                className={cn(form.formState.errors.teamId && "border-red-500 focus:border-red-500 focus:ring-red-500/10")}
              >
                <option value="">Select a team...</option>
                {teamOptions.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.label}
                  </option>
                ))}
              </Select>
              {form.formState.errors.teamId && (
                <p className="text-xs text-red-500">{form.formState.errors.teamId.message}</p>
              )}
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-semibold text-ink-800">
                Deadline
              </label>
              <Input
                type="date"
                {...form.register("endDate")}
              />
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsProjectModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createProject.isPending}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Dashboard;
