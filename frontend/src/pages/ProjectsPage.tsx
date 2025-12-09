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

type CreateProjectForm = {
  projectName: string;
  description: string;
  status: "PLANNING" | "IN_PROGRESS" | "ON_HOLD" | "COMPLETED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  teamId: string;
};

function ProjectsPage() {
  const { data, isLoading, isError, error } = useProjects();
  const createProject = useCreateProject();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [teamFilter, setTeamFilter] = useState<string>("ALL");
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
      const statusOk =
        statusFilter === "ALL" || project.status === statusFilter;
      const priorityOk =
        priorityFilter === "ALL" || project.priority === priorityFilter;
      const teamOk =
        teamFilter === "ALL" ||
        `${project.team?.teamId ?? ""}` === `${teamFilter}`;
      return statusOk && priorityOk && teamOk;
    });
  }, [data, statusFilter, priorityFilter, teamFilter]);

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
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-500">Projects</p>
            <h2 className="text-2xl font-semibold text-ink-900">
              Manage your projects
            </h2>
            <p className="text-sm text-ink-600">
              Filter by team, priority, or status.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>New project</Button>
        </div>

        <div className="flex flex-wrap gap-3 rounded-xl border border-surface-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col text-sm text-ink-700">
            <label className="text-xs font-semibold text-ink-500">Status</label>
            <select
              className="mt-1 rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="PLANNING">PLANNING</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
              <option value="ON_HOLD">ON_HOLD</option>
              <option value="COMPLETED">COMPLETED</option>
            </select>
          </div>
          <div className="flex flex-col text-sm text-ink-700">
            <label className="text-xs font-semibold text-ink-500">Priority</label>
            <select
              className="mt-1 rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="ALL">All</option>
              <option value="HIGH">HIGH</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="LOW">LOW</option>
            </select>
          </div>
          <div className="flex flex-col text-sm text-ink-700">
            <label className="text-xs font-semibold text-ink-500">Team</label>
            <select
              className="mt-1 rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
            >
              <option value="ALL">All</option>
              {teamOptions.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="grid gap-3 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm"
              >
                <Skeleton className="h-4 w-20" />
                <Skeleton className="mt-3 h-5 w-48" />
                <Skeleton className="mt-2 h-4 w-full" />
              </div>
            ))}
          </div>
        )}

        {isError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
            {normalizeError(error).message}
          </div>
        )}

        {!isLoading && !isError && (
          <>
            {filtered && filtered.length > 0 ? (
              <div className="grid gap-3 md:grid-cols-2">
                {filtered.map((project) => (
                  <div
                    key={project.projectId}
                    className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-ink-500">
                          {project.status}
                        </p>
                        <h3 className="text-lg font-semibold text-ink-900">
                          {project.projectName}
                        </h3>
                        <p className="text-sm text-ink-600">
                          {project.description || "No description provided."}
                        </p>
                      </div>
                      <span className="rounded-full bg-surface-200 px-3 py-1 text-xs font-semibold text-ink-700">
                        {project.priority}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-xs text-ink-500">
                      <span className="rounded-full bg-surface-100 px-2 py-1">
                        {project.team?.teamName
                          ? project.team.teamName
                          : `Team #${project.team?.teamId ?? "—"}`}
                      </span>
                      {project.startDate && (
                        <span className="rounded-full bg-surface-100 px-2 py-1">
                          Starts {formatDate(project.startDate)}
                        </span>
                      )}
                      {project.endDate && (
                        <span className="rounded-full bg-surface-100 px-2 py-1">
                          Due {formatDate(project.endDate)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-surface-300 bg-white/60 p-6 text-sm text-ink-600">
                No projects to display yet.
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create project"
      >
        <form className="space-y-3" onSubmit={handleCreate}>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-ink-800">Name</label>
            <Input
              {...form.register("projectName", { required: true })}
              placeholder="Project name"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-ink-800">
              Description
            </label>
            <Input
              {...form.register("description")}
              placeholder="Optional description"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-ink-800">
                Status
              </label>
              <Select {...form.register("status")}>
                <option value="PLANNING">PLANNING</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="ON_HOLD">ON_HOLD</option>
                <option value="COMPLETED">COMPLETED</option>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-ink-800">
                Priority
              </label>
              <Select {...form.register("priority")}>
                <option value="HIGH">HIGH</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="LOW">LOW</option>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-ink-800">
                Team
              </label>
              <Select {...form.register("teamId")}>
                <option value="">Unassigned</option>
                {teamOptions.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createProject.isPending}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default ProjectsPage;
