import { useProjects, useCreateProject } from "@/features/projects/useProjects";
import { useTasks } from "@/features/tasks/useTasks";
import { useTeams } from "@/features/teams/useTeams";
import { useAuth } from "@/features/auth/AuthContext";
import {
  Layout,
  CheckSquare,
  Users,
  Plus,
  Calendar,
  ArrowRight,
  Filter,
  Check,
} from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";
import { useState, useMemo, useRef, useEffect } from "react";
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

type ProjectStatus = "PLANNING" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED";
type TaskStatus = "TO_DO" | "IN_PROGRESS" | "COMPLETED";

function Dashboard() {
  const { user } = useAuth();
  const { data: projects, isLoading: pLoading } = useProjects();
  const { data: tasks, isLoading: tLoading } = useTasks();
  const { data: teams, isLoading: tmLoading } = useTeams();
  const createProject = useCreateProject();
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<ProjectStatus[]>(["IN_PROGRESS"]);
  const [selectedTaskStatuses, setSelectedTaskStatuses] = useState<TaskStatus[]>(["TO_DO", "IN_PROGRESS"]);
  const [openFilterId, setOpenFilterId] = useState<string | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);

  // Close filter on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setOpenFilterId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const toggleStatus = (status: ProjectStatus) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const toggleTaskStatus = (status: TaskStatus) => {
    setSelectedTaskStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // Calculate stats
  const filteredProjectsCount =
    projects?.filter((p) => selectedStatuses.includes(p.status as ProjectStatus)).length || 0;

  const filteredTasksCount =
    tasks?.filter((t) => selectedTaskStatuses.includes(t.status as TaskStatus)).length || 0;

  const getProjectsTitle = () => {
    if (selectedStatuses.length === 0) return "No Projects Selected";
    if (selectedStatuses.length === 4) return "Total Projects";
    if (selectedStatuses.length === 1) {
      const statusMap: Record<string, string> = {
        PLANNING: "Planning",
        IN_PROGRESS: "Ongoing",
        ON_HOLD: "On Hold",
        COMPLETED: "Completed"
      };
      return `${statusMap[selectedStatuses[0]]} Projects`;
    }
    return `Projects (${selectedStatuses.length})`;
  };

  const getTasksTitle = () => {
    if (selectedTaskStatuses.length === 0) return "No Tasks Selected";
    if (selectedTaskStatuses.length === 3) return "Total Tasks";
    if (selectedTaskStatuses.length === 2 && !selectedTaskStatuses.includes("COMPLETED")) {
      return "Pending Tasks";
    }
    if (selectedTaskStatuses.length === 1) {
      const statusMap: Record<string, string> = {
        TO_DO: "To Do",
        IN_PROGRESS: "In Progress",
        COMPLETED: "Completed"
      };
      return `${statusMap[selectedTaskStatuses[0]]} Tasks`;
    }
    return `Tasks (${selectedTaskStatuses.length})`;
  };

  const totalPendingTasks =
    tasks?.filter((t) => t.status !== "COMPLETED").length || 0;

  const totalTeams = teams?.length || 0;

  const stats = [
    {
      id: "projects",
      label: getProjectsTitle(),
      value: filteredProjectsCount,
      trend: "+12%",
      icon: Layout,
      color: "text-blue-600",
      bg: "bg-blue-50",
      link: `/projects?status=${selectedStatuses.join(",")}`,
      isFilterable: true,
      filterOptions: ["PLANNING", "IN_PROGRESS", "ON_HOLD", "COMPLETED"],
      selectedOptions: selectedStatuses,
      onToggle: toggleStatus,
    },
    {
      id: "tasks",
      label: getTasksTitle(),
      value: filteredTasksCount,
      trend: "-5%",
      icon: CheckSquare,
      color: "text-amber-600",
      bg: "bg-amber-50",
      link: `/tasks?status=${selectedTaskStatuses.join(",")}`,
      isFilterable: true,
      filterOptions: ["TO_DO", "IN_PROGRESS", "COMPLETED"],
      selectedOptions: selectedTaskStatuses,
      onToggle: toggleTaskStatus,
    },
    {
      id: "teams",
      label: "Active Teams",
      value: totalTeams,
      trend: "+2",
      icon: Users,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
      link: "/teams",
      isFilterable: false,
    },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      {/* Welcome Section - Premium Gradient */}
      <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-r from-teal-800 to-emerald-600 p-10 text-white shadow-2xl shadow-emerald-900/20">
        <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-3">

            <h1 className="font-display text-4xl font-bold tracking-tight">
              Welcome back, {user?.name?.split(" ")[0] || "User"}!
            </h1>
            <p className="text-lg text-emerald-50/90 max-w-xl">
              You have <span className="font-bold text-white">{totalPendingTasks}</span>{" "}
              tasks pending review today. Your productivity streak is looking great.
            </p>
          </div>
          {user?.role !== "MEMBER" && (
            <Button
              onClick={() => {
                form.reset();
                setIsProjectModalOpen(true);
              }}
              className="bg-white/10 text-white hover:bg-white/20 border-white/20 backdrop-blur-md shadow-xl transition-all hover:scale-105 hover:shadow-2xl h-12 px-6"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Project
            </Button>
          )}
        </div>
      </div>

      {/* Stats Grid - Elevated Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className="group relative rounded-2xl bg-white p-6 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_-12px_rgba(0,0,0,0.12)] hover:ring-1 hover:ring-brand-500/10"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-ink-400">
                  {stat.label}
                </p>

                {pLoading || tLoading || tmLoading ? (
                  <Skeleton className="mt-3 h-10 w-24" />
                ) : (
                  <h3 className="mt-2 font-display text-4xl font-bold text-ink-900 tracking-tight">
                    {stat.value}
                  </h3>
                )}
              </div>

              <div
                className="relative -mt-2 flex gap-2"
                ref={openFilterId === stat.id ? filterRef : null}
              >
                {/* Filter Button */}
                {stat.isFilterable && stat.filterOptions && stat.onToggle && stat.selectedOptions && (
                  <>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenFilterId(openFilterId === stat.id ? null : stat.id);
                      }}
                      className={cn(
                        "rounded-full p-1.5 bg-surface-50 text-ink-400 hover:bg-surface-100 hover:text-ink-600 focus:outline-none transition-colors",
                        openFilterId === stat.id && "bg-surface-100 text-ink-600"
                      )}
                    >
                      <Filter className="h-4 w-4" />
                    </button>

                    {openFilterId === stat.id && (
                      <div className="absolute right-0 top-9 z-50 w-48 rounded-lg border border-surface-200 bg-white p-2 shadow-lg animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                        <div className="mb-2 px-2 text-[10px] font-semibold uppercase text-ink-400">Filter by Status</div>
                        {stat.filterOptions.map(status => (
                          <button
                            key={status}
                            onClick={(e) => {
                              e.preventDefault();
                              if (stat.onToggle) stat.onToggle(status as any);
                            }}
                            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs font-medium text-ink-600 hover:bg-surface-50"
                          >
                            <div
                              className={cn(
                                "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                                stat.selectedOptions && stat.selectedOptions.includes(status as any)
                                  ? "border-brand-600 bg-brand-600 text-white"
                                  : "border-ink-300 bg-white"
                              )}
                            >
                              {stat.selectedOptions && stat.selectedOptions.includes(status as any) && (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                            <span>{status.replace("_", " ")}</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                )}

                <div
                  className={cn(
                    "rounded-xl p-2 transition-transform duration-300 group-hover:scale-110 h-fit",
                    stat.bg,
                    stat.color
                  )}
                >
                  <stat.icon className="h-4 w-4" />
                </div>
              </div>
            </div>

            {stat.link && (
              <div className="mt-6 flex items-center justify-end border-t border-surface-100 pt-4">
                <Link
                  to={stat.link}
                  className="flex items-center gap-1 text-xs font-medium text-brand-600 transition-colors hover:text-brand-700 hover:underline"
                >
                  View Details <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
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
    </div >
  );
}

export default Dashboard;
