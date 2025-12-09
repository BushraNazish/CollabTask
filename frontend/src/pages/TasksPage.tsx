import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTasks, useCreateTask } from "@/features/tasks/useTasks";
import { normalizeError } from "@/services/errors";
import { formatDate } from "@/types/date";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

type CreateTaskForm = {
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "COMPLETED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  projectId: string;
  assigneeEmail: string;
  dueDate: string;
};

function TasksPage() {
  const { data, isLoading, isError, error } = useTasks();
  const createTask = useCreateTask();

  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [projectFilter, setProjectFilter] = useState<string>("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<CreateTaskForm>({
    defaultValues: {
      title: "",
      description: "",
      status: "TO_DO",
      priority: "MEDIUM",
      projectId: "",
      assigneeEmail: "",
      dueDate: "",
    },
  });

  const projectOptions = useMemo(() => {
    const ids = new Set<number>();
    const list: { id: number; label: string }[] = [];
    (data ?? []).forEach((t) => {
      if (t.project?.projectId && !ids.has(t.project.projectId)) {
        ids.add(t.project.projectId);
        list.push({
          id: t.project.projectId,
          label: t.project.projectName || `Project #${t.project.projectId}`,
        });
      }
    });
    return list;
  }, [data]);

  const assigneeOptions = useMemo(() => {
    const emails = new Set<string>();
    const list: { email: string; label: string }[] = [];
    (data ?? []).forEach((t) => {
      if (t.assignedTo?.email && !emails.has(t.assignedTo.email)) {
        emails.add(t.assignedTo.email);
        list.push({
          email: t.assignedTo.email,
          label: t.assignedTo.name || t.assignedTo.email,
        });
      }
    });
    return list;
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((task) => {
      const statusOk =
        statusFilter === "ALL" || task.status === statusFilter;
      const priorityOk =
        priorityFilter === "ALL" || task.priority === priorityFilter;
      const projectOk =
        projectFilter === "ALL" ||
        `${task.project?.projectId ?? ""}` === `${projectFilter}`;
      const assigneeOk =
        assigneeFilter === "ALL" ||
        task.assignedTo?.email === assigneeFilter;
      return statusOk && priorityOk && projectOk && assigneeOk;
    });
  }, [data, statusFilter, priorityFilter, projectFilter, assigneeFilter]);

  const handleCreate = form.handleSubmit(async (values) => {
    await createTask.mutateAsync({
      title: values.title,
      description: values.description,
      status: values.status,
      priority: values.priority,
      project: values.projectId
        ? {
            projectId: Number(values.projectId),
          }
        : undefined,
      assignedTo: values.assigneeEmail
        ? {
            email: values.assigneeEmail,
            name: values.assigneeEmail,
            role: "MEMBER",
          }
        : undefined,
      dueDate: values.dueDate || undefined,
    });
    setIsModalOpen(false);
    form.reset();
  });

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-ink-500">Tasks</p>
            <h2 className="text-2xl font-semibold text-ink-900">Task board</h2>
            <p className="text-sm text-ink-600">
              View tasks by project, status, priority, and assignee.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)}>New task</Button>
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
              <option value="TO_DO">TO_DO</option>
              <option value="IN_PROGRESS">IN_PROGRESS</option>
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
            <label className="text-xs font-semibold text-ink-500">Project</label>
            <select
              className="mt-1 rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
            >
              <option value="ALL">All</option>
              {projectOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col text-sm text-ink-700">
            <label className="text-xs font-semibold text-ink-500">Assignee</label>
            <select
              className="mt-1 rounded-lg border border-surface-200 bg-white px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
              value={assigneeFilter}
              onChange={(e) => setAssigneeFilter(e.target.value)}
            >
              <option value="ALL">All</option>
              {assigneeOptions.map((a) => (
                <option key={a.email} value={a.email}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading && (
          <div className="grid gap-3 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm"
              >
                <Skeleton className="h-4 w-24" />
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
                {filtered.map((task) => (
                  <div
                    key={task.taskId}
                    className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-ink-500">
                          {task.status}
                        </p>
                        <h3 className="text-lg font-semibold text-ink-900">
                          {task.title}
                        </h3>
                        <p className="text-sm text-ink-600">
                          {task.description || "No description provided."}
                        </p>
                      </div>
                      <span className="rounded-full bg-surface-200 px-3 py-1 text-xs font-semibold text-ink-700">
                        {task.priority}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-600">
                      <span className="rounded-full bg-surface-100 px-2 py-1">
                        {task.project?.projectName
                          ? task.project.projectName
                          : `Project #${task.project?.projectId ?? "—"}`}
                      </span>
                      {task.assignedTo?.name && (
                        <span className="rounded-full bg-surface-100 px-2 py-1">
                          Assignee: {task.assignedTo.name}
                        </span>
                      )}
                      {task.dueDate && (
                        <span className="rounded-full bg-surface-100 px-2 py-1">
                          Due {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-surface-300 bg-white/60 p-6 text-sm text-ink-600">
                No tasks to display yet.
              </div>
            )}
          </>
        )}
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create task"
      >
        <form className="space-y-3" onSubmit={handleCreate}>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-ink-800">
              Title
            </label>
            <Input
              {...form.register("title", { required: true })}
              placeholder="Task title"
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
                <option value="TO_DO">TO_DO</option>
                <option value="IN_PROGRESS">IN_PROGRESS</option>
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
                Project
              </label>
              <Select {...form.register("projectId")}>
                <option value="">Unassigned</option>
                {projectOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-ink-800">
                Assignee email
              </label>
              <Select {...form.register("assigneeEmail")}>
                <option value="">Unassigned</option>
                {assigneeOptions.map((a) => (
                  <option key={a.email} value={a.email}>
                    {a.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-ink-800">
                Due date
              </label>
              <Input type="date" {...form.register("dueDate")} />
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
            <Button type="submit" loading={createTask.isPending}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default TasksPage;
