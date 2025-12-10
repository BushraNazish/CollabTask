import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/features/auth/AuthContext";
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from "@/features/projects/useProjects";
import { useTeams } from "@/features/teams/useTeams";
import { normalizeError } from "@/services/errors";
import { formatDate } from "@/types/date";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import {
  Folder,
  Plus,
  Search,
  Calendar,
  MoreVertical,
  Filter,

  Users,
  Edit2,
  Trash2,
  Circle,
  Flag,
  ChevronDown,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { type Project } from "@/features/projects/types";

type CreateProjectForm = {
  projectName: string;
  description: string;
  status: "PLANNING" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  teamId: string;
  endDate?: string;
};

const statusColors = {
  PLANNING: "bg-slate-100 text-slate-700 border-slate-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
  ON_HOLD: "bg-amber-50 text-amber-700 border-amber-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const priorityColors = {
  CRITICAL: "text-red-700 bg-red-50 border-red-200",
  HIGH: "text-orange-700 bg-orange-50 border-orange-200",
  MEDIUM: "text-blue-700 bg-blue-50 border-blue-200",
  LOW: "text-slate-600 bg-slate-50 border-slate-200",
};

function ProjectsPage() {
  const { user } = useAuth();
  const { data, isLoading, isError, error } = useProjects();
  const { data: teams } = useTeams();
  const createProject = useCreateProject();
  const updateProject = useUpdateProject();
  const deleteProject = useDeleteProject();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [teamFilter, setTeamFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deletingProject, setDeletingProject] = useState<Project | null>(null);

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

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((project) => {
      const matchesSearch = project.projectName
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || project.status === statusFilter;
      const matchesPriority = priorityFilter === "ALL" || project.priority === priorityFilter;
      const matchesTeam = teamFilter === "ALL" || project.team?.teamId.toString() === teamFilter;
      const matchesDate = !dateFilter || project.endDate === dateFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesTeam && matchesDate;
    });
  }, [data, search, statusFilter, priorityFilter, teamFilter, dateFilter]);

  const teamOptions = useMemo(() => {
    return (teams ?? []).map((t) => ({
      id: t.teamId,
      label: t.teamName,
    }));
  }, [teams]);

  const handleConfigs = (project: Project) => {
    setActiveMenuId(null);
    setEditingProject(project);
    form.setValue("projectName", project.projectName);
    form.setValue("description", project.description || "");
    form.setValue("status", project.status);
    form.setValue("priority", (project.priority as "HIGH" | "MEDIUM" | "LOW") || "MEDIUM");
    form.setValue("teamId", project.team?.teamId?.toString() || "");
    const formattedDate = project.endDate ? new Date(project.endDate).toISOString().split('T')[0] : "";
    form.setValue("endDate", formattedDate);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    form.reset({
      projectName: "",
      description: "",
      status: "PLANNING",
      priority: "MEDIUM",
      teamId: "",
      endDate: "",
    });
  };

  const handleDelete = (project: Project) => {
    setDeletingProject(project);
    setActiveMenuId(null);
  };

  const confirmDelete = async () => {
    if (deletingProject) {
      await deleteProject.mutateAsync(deletingProject.projectId);
      setDeletingProject(null);
    }
  };

  const handleCreateOrUpdate = form.handleSubmit(async (values) => {
    try {
      if (editingProject) {
        await updateProject.mutateAsync({
          projectId: editingProject.projectId,
          projectName: values.projectName,
          description: values.description,
          status: values.status,
          priority: values.priority,
          team: values.teamId ? { teamId: Number(values.teamId) } : undefined,
          endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined,
        });
      } else {
        await createProject.mutateAsync({
          projectName: values.projectName,
          description: values.description,
          status: values.status,
          priority: values.priority,
          team: values.teamId ? { teamId: Number(values.teamId) } : undefined,
          endDate: values.endDate ? new Date(values.endDate).toISOString() : undefined,
        });
      }
      closeModal();
    } catch (e) {
      console.error(e);
    }
  });

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink-900">
              Projects
            </h1>
            <p className="mt-1 text-ink-500">
              Manage and track all your team initiatives.
            </p>
          </div>
          <div className="flex gap-2">
            {user?.role !== "MEMBER" && (
              <Button
                onClick={() => {
                  setEditingProject(null);
                  form.reset({
                    projectName: "",
                    description: "",
                    status: "PLANNING",
                    priority: "MEDIUM",
                    teamId: "",
                    endDate: "",
                  });
                  setIsModalOpen(true);
                }}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            )}
          </div>
        </div>



        {/* Overlay to close menus */}
        {activeMenuId !== null && (
          <div
            className="fixed inset-0 z-10"
            onClick={() => setActiveMenuId(null)}
          />
        )}

        {/* Professional Filter Bar */}
        <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5">
            {/* Top Row: Search & Reset */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="h-10 w-full rounded-xl border border-surface-200 bg-surface-50 pl-10 pr-4 text-sm text-ink-900 transition-all hover:bg-surface-100 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button
                onClick={() => {
                  setSearch("");
                  setStatusFilter("ALL");
                  setPriorityFilter("ALL");
                  setTeamFilter("ALL");
                  setDateFilter("");
                }}
                className="group flex items-center gap-2 rounded-xl border border-dashed border-surface-300 px-4 py-2 text-sm font-medium text-ink-500 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-700 active:scale-95"
              >
                <X className="h-4 w-4 transition-transform group-hover:rotate-90" />
                Reset Filters
              </button>
            </div>

            <div className="h-px bg-surface-100" />

            {/* Bottom Row: Filters */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {/* Status Filter */}
              <div className="relative">
                <Circle className={cn("absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors", statusFilter !== "ALL" ? "text-brand-500" : "text-ink-400")} />
                <select
                  className={cn(
                    "h-10 w-full appearance-none rounded-xl border bg-surface-50 pl-10 pr-8 text-sm text-ink-700 transition-all hover:bg-surface-100 hover:border-surface-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10",
                    statusFilter !== "ALL" && "border-brand-500 bg-brand-50/50 font-medium text-brand-700"
                  )}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="ALL">All Status</option>
                  <option value="PLANNING">Planning</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="ON_HOLD">On Hold</option>
                  <option value="COMPLETED">Completed</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400 pointer-events-none" />
              </div>

              {/* Priority Filter */}
              <div className="relative">
                <Flag className={cn("absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors", priorityFilter !== "ALL" ? "text-brand-500" : "text-ink-400")} />
                <select
                  className={cn(
                    "h-10 w-full appearance-none rounded-xl border bg-surface-50 pl-10 pr-8 text-sm text-ink-700 transition-all hover:bg-surface-100 hover:border-surface-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10",
                    priorityFilter !== "ALL" && "border-brand-500 bg-brand-50/50 font-medium text-brand-700"
                  )}
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                >
                  <option value="ALL">All Priorities</option>
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400 pointer-events-none" />
              </div>

              {/* Team Filter */}
              <div className="relative">
                <Users className={cn("absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors", teamFilter !== "ALL" ? "text-brand-500" : "text-ink-400")} />
                <select
                  className={cn(
                    "h-10 w-full appearance-none rounded-xl border bg-surface-50 pl-10 pr-8 text-sm text-ink-700 transition-all hover:bg-surface-100 hover:border-surface-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10",
                    teamFilter !== "ALL" && "border-brand-500 bg-brand-50/50 font-medium text-brand-700"
                  )}
                  value={teamFilter}
                  onChange={(e) => setTeamFilter(e.target.value)}
                >
                  <option value="ALL">All Teams</option>
                  {teamOptions.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400 pointer-events-none" />
              </div>

              {/* Date Filter */}
              <div className="relative">
                <Calendar className={cn("absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors", dateFilter ? "text-brand-500" : "text-ink-400")} />
                <input
                  type="date"
                  className={cn(
                    "h-10 w-full appearance-none rounded-xl border bg-surface-50 pl-10 pr-4 text-sm text-ink-700 transition-all hover:bg-surface-100 hover:border-surface-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10",
                    dateFilter && "border-brand-500 bg-brand-50/50 font-medium text-brand-700"
                  )}
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Grid Content */}
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-2xl border border-surface-200 bg-white p-6"
              >
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="mt-4 h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-2/3" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-800">
            <p className="font-medium">Error loading projects</p>
            <p className="text-sm opacity-80">{normalizeError(error).message}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-300 bg-surface-50 p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 text-ink-400">
              <Folder className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink-900">
              No projects found
            </h3>
            <p className="mt-1 max-w-sm text-sm text-ink-500">
              Try adjusting your search or filters, or create a new project to get
              started.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((project) => (
              <div
                key={project.projectId}
                className={cn(
                  "group relative flex flex-col justify-between rounded-2xl border border-surface-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-md",
                  activeMenuId === project.projectId ? "z-30 relative" : ""
                )}
              >
                <div>
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Folder className="h-5 w-5" />
                    </div>
                    <div className="relative">
                      {user?.role !== "MEMBER" && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveMenuId(activeMenuId === project.projectId ? null : project.projectId);
                            }}
                            className="rounded-lg p-2 text-ink-400 hover:bg-surface-50 hover:text-ink-600"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>

                          {activeMenuId === project.projectId && (
                            <div className="absolute right-0 top-full z-20 mt-1 w-32 rounded-xl border border-surface-200 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95 duration-100">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleConfigs(project);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-600 hover:bg-surface-50 hover:text-ink-900"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                                Edit
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(project);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-ink-900">
                    {project.projectName}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-500 line-clamp-2">
                    {project.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-6">
                  <div className="mb-4 flex flex-wrap gap-2">
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        statusColors[project.status]
                      )}
                    >
                      {project.status.replace("_", " ")}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                        priorityColors[project.priority as "HIGH" | "MEDIUM" | "LOW"] ??
                        priorityColors.MEDIUM
                      )}
                    >
                      {project.priority}
                    </span>
                  </div>

                  <div className="flex items-center justify-between border-t border-surface-100 pt-4 text-xs text-ink-500">
                    <div className="flex items-center gap-1.5">
                      <Users className="h-3.5 w-3.5" />
                      <span>
                        {project.team?.teamName || `Team #${project.team?.teamId}`}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>
                        {project.endDate
                          ? formatDate(project.endDate)
                          : "No deadline"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div >

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingProject ? "Edit Project" : "Create New Project"}
      >
        <form className="space-y-4" onSubmit={handleCreateOrUpdate}>
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
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createProject.isPending || updateProject.isPending}>
              {editingProject ? "Save Changes" : "Create Project"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deletingProject}
        onClose={() => setDeletingProject(null)}
        title="Delete Project"
      >
        <div className="space-y-4">
          <p className="text-ink-600">
            Are you sure you want to delete <span className="font-bold">{deletingProject?.projectName}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setDeletingProject(null)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 shadow-red-500/20"
              onClick={confirmDelete}
              loading={deleteProject.isPending}
            >
              Delete Project
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export default ProjectsPage;
