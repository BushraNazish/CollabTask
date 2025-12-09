import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useProjects, useCreateProject } from "@/features/projects/useProjects";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

type CreateProjectForm = {
  projectName: string;
  description: string;
  status: "PLANNING" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  teamId: string;
};

const statusColors = {
  PLANNING: "bg-slate-100 text-slate-700 border-slate-200",
  IN_PROGRESS: "bg-blue-50 text-blue-700 border-blue-200",
  ON_HOLD: "bg-amber-50 text-amber-700 border-amber-200",
  COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

const priorityColors = {
  HIGH: "text-red-600 bg-red-50 border-red-100",
  MEDIUM: "text-amber-600 bg-amber-50 border-amber-100",
  LOW: "text-slate-600 bg-slate-50 border-slate-100",
};

function ProjectsPage() {
  const { data, isLoading, isError, error } = useProjects();
  const createProject = useCreateProject();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<CreateProjectForm>({
    defaultValues: {
      projectName: "",
      description: "",
      status: "PLANNING",
      priority: "MEDIUM",
      teamId: "",
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
      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

  const teamOptions = useMemo(() => {
    const ids = new Set<number>();
    const list: { id: number; label: string }[] = [];
    (data ?? []).forEach((p) => {
      if (p.team?.teamId && !ids.has(p.team.teamId)) {
        ids.add(p.team.teamId);
        list.push({
          id: p.team.teamId,
          label: p.team.teamName || `Team #${p.team.teamId}`,
        });
      }
    });
    return list;
  }, [data]);

  const handleCreate = form.handleSubmit(async (values) => {
    await createProject.mutateAsync({
      projectName: values.projectName,
      description: values.description,
      status: values.status,
      priority: values.priority,
      team: values.teamId ? { teamId: Number(values.teamId) } : undefined,
    });
    setIsModalOpen(false);
    form.reset();
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
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search projects..."
              className="h-10 w-full rounded-xl border border-surface-200 bg-white pl-10 pr-4 text-sm text-ink-900 transition focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-ink-400" />
            <select
              className="h-10 rounded-xl border border-surface-200 bg-white px-3 py-2 text-sm text-ink-700 outline-none focus:border-brand-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Status</option>
              <option value="PLANNING">Planning</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="ON_HOLD">On Hold</option>
              <option value="COMPLETED">Completed</option>
            </select>
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
                className="group relative flex flex-col justify-between rounded-2xl border border-surface-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-md"
              >
                <div>
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <Folder className="h-5 w-5" />
                    </div>
                    <button className="rounded-lg p-2 text-ink-400 hover:bg-surface-50 hover:text-ink-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
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
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Project"
      >
        <form className="space-y-4" onSubmit={handleCreate}>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-ink-800">
              Project Name
            </label>
            <Input
              {...form.register("projectName", { required: true })}
              placeholder="e.g. Website Redesign"
            />
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
                Status
              </label>
              <Select {...form.register("status")}>
                <option value="PLANNING">Planning</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="ON_HOLD">On Hold</option>
                <option value="COMPLETED">Completed</option>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-ink-800">
                Priority
              </label>
              <Select {...form.register("priority")}>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </Select>
            </div>
            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-semibold text-ink-800">
                Assign Team
              </label>
              <Select {...form.register("teamId")}>
                <option value="">No Team Assigned</option>
                {teamOptions.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createProject.isPending}>
              Create Project
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default ProjectsPage;
