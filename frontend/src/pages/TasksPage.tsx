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
import {
  CheckSquare,
  Plus,
  Search,
  Calendar,
  Filter,
  Circle,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CreateTaskForm = {
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "COMPLETED";
  priority: "HIGH" | "MEDIUM" | "LOW";
  projectId: string;
  assigneeEmail: string;
  dueDate: string;
};

const priorityStyles = {
  HIGH: "text-red-600 bg-red-50 border-red-200",
  MEDIUM: "text-amber-600 bg-amber-50 border-amber-200",
  LOW: "text-slate-600 bg-slate-50 border-slate-200",
};

const statusIcons = {
  TO_DO: Circle,
  IN_PROGRESS: Clock,
  COMPLETED: CheckCircle2,
};

const statusColors = {
  TO_DO: "text-slate-500",
  IN_PROGRESS: "text-blue-500",
  COMPLETED: "text-emerald-500",
};

function TasksPage() {
  const { data, isLoading, isError, error } = useTasks();
  const createTask = useCreateTask();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
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

  const filtered = useMemo(() => {
    if (!data) return [];
    return data.filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" || task.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [data, search, statusFilter]);

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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="font-display text-3xl font-bold text-ink-900">
              Tasks
            </h1>
            <p className="mt-1 text-ink-500">
              Track your daily to-dos and project items.
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            New Task
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="text"
              placeholder="Search tasks..."
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
              <option value="TO_DO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-xl border border-surface-200 bg-white p-4"
              >
                <Skeleton className="h-5 w-5 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-800">
            <p className="font-medium">Error loading tasks</p>
            <p className="text-sm opacity-80">{normalizeError(error).message}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-300 bg-surface-50 p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 text-ink-400">
              <CheckSquare className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink-900">
              No tasks found
            </h3>
            <p className="mt-1 max-w-sm text-sm text-ink-500">
              Create a new task to start tracking your work.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((task) => {
              const StatusIcon = statusIcons[task.status];
              return (
                <div
                  key={task.taskId}
                  className="group flex flex-col gap-4 rounded-xl border border-surface-200 bg-white p-4 shadow-sm transition-all hover:border-brand-200 hover:shadow-md sm:flex-row sm:items-center sm:gap-6"
                >
                  <div className="mt-1 sm:mt-0">
                    <StatusIcon
                      className={cn(
                        "h-5 w-5",
                        statusColors[task.status]
                      )}
                    />
                  </div>

                  <div className="flex-1">
                    <h3 className={cn(
                      "font-semibold text-ink-900",
                      task.status === "COMPLETED" && "text-ink-400 line-through"
                    )}>
                      {task.title}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-ink-500">
                      {task.project?.projectName && (
                        <span>{task.project.projectName}</span>
                      )}
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {formatDate(task.dueDate)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "rounded-lg border px-2.5 py-1 text-xs font-semibold",
                        priorityStyles[task.priority]
                      )}
                    >
                      {task.priority}
                    </span>
                    {task.assignedTo?.name && (
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700"
                        title={`Assigned to ${task.assignedTo.name}`}
                      >
                        {task.assignedTo.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Task"
      >
        <form className="space-y-4" onSubmit={handleCreate}>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-ink-800">
              Title
            </label>
            <Input
              {...form.register("title", { required: true })}
              placeholder="e.g. Update documentation"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-ink-800">
              Description
            </label>
            <Input
              {...form.register("description")}
              placeholder="Optional details..."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-ink-800">
                Project
              </label>
              <Select {...form.register("projectId")}>
                <option value="">No Project</option>
                {projectOptions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
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
            <div className="space-y-1">
              <label className="text-sm font-semibold text-ink-800">
                Due Date
              </label>
              <Input type="date" {...form.register("dueDate")} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-ink-800">
                Status
              </label>
              <Select {...form.register("status")}>
                <option value="TO_DO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
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
            <Button type="submit" loading={createTask.isPending}>
              Create Task
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default TasksPage;
