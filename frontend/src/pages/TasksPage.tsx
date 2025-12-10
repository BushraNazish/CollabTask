import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useTasks, useCreateTask, useUpdateTask, useDeleteTask } from "@/features/tasks/useTasks";
import { useUsers } from "@/features/users/useUsers";
import { type Task } from "@/features/tasks/types";
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
  Info,
  User,
  X,
  ChevronDown,
  Flag,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CreateTaskForm = {
  title: string;
  description: string;
  status: "TO_DO" | "IN_PROGRESS" | "COMPLETED";
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  projectId: string;
  assigneeId: string;
  dueDate: string;
};

const priorityStyles = {
  CRITICAL: "text-red-700 bg-red-50 border-red-200",
  HIGH: "text-orange-700 bg-orange-50 border-orange-200",
  MEDIUM: "text-blue-700 bg-blue-50 border-blue-200",
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
  const { data: users } = useUsers();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const deleteTask = useDeleteTask();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [priorityFilter, setPriorityFilter] = useState<string>("ALL");
  const [projectFilter, setProjectFilter] = useState<string>("ALL");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewingTask, setViewingTask] = useState<Task | null>(null);

  const form = useForm<CreateTaskForm>({
    defaultValues: {
      title: "",
      description: "",
      status: "TO_DO",
      priority: "MEDIUM",
      projectId: "",
      assigneeId: "",
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
      const matchesPriority = priorityFilter === "ALL" || task.priority === priorityFilter;
      const matchesProject = projectFilter === "ALL" || task.project?.projectId?.toString() === projectFilter;
      const matchesAssignee = assigneeFilter === "ALL" ||
        ((task.assignedTo as any)?.userId?.toString() === assigneeFilter) ||
        (task.assignedTo?.id?.toString() === assigneeFilter);
      const matchesDate = !dateFilter || task.dueDate === dateFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesProject && matchesAssignee && matchesDate;
    });
  }, [data, search, statusFilter, priorityFilter, projectFilter, assigneeFilter, dateFilter]);

  const handleCreateOrUpdate = form.handleSubmit(async (values) => {
    const payload = {
      title: values.title,
      description: values.description,
      status: values.status,
      priority: values.priority,
      project: values.projectId
        ? {
          projectId: Number(values.projectId),
        }
        : undefined,
      assignedTo: values.assigneeId
        ? ({
          userId: Number(values.assigneeId),
        } as any)
        : undefined,
      dueDate: values.dueDate || undefined,
    };

    if (editingTask) {
      await updateTask.mutateAsync({
        taskId: editingTask.taskId,
        ...payload,
      });
    } else {
      await createTask.mutateAsync(payload);
    }
    closeModal();
  });

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
    form.reset({
      title: "",
      description: "",
      status: "TO_DO",
      priority: "MEDIUM",
      projectId: "",
      assigneeId: "",
      dueDate: "",
    });
  };

  const handleEdit = (task: Task) => {
    setViewingTask(null);
    setEditingTask(task);
    form.setValue("title", task.title);
    form.setValue("description", task.description || "");
    form.setValue("status", task.status);
    form.setValue("priority", task.priority);
    form.setValue("projectId", task.project?.projectId?.toString() || "");
    form.setValue("assigneeId", (task.assignedTo as any)?.userId?.toString() || task.assignedTo?.id?.toString() || "");
    form.setValue("dueDate", task.dueDate || "");
    setIsModalOpen(true);
  };

  const handleDelete = async (taskId: number) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      await deleteTask.mutateAsync(taskId);
      setViewingTask(null);
    }
  };

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

        {/* Professional Filter Bar */}
        <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-5">
            {/* Top Row: Search & Reset */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input
                  type="text"
                  placeholder="Search tasks by title..."
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
                  setProjectFilter("ALL");
                  setAssigneeFilter("ALL");
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
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
                  <option value="TO_DO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
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

              {/* Project Filter */}
              <div className="relative">
                <Briefcase className={cn("absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors", projectFilter !== "ALL" ? "text-brand-500" : "text-ink-400")} />
                <select
                  className={cn(
                    "h-10 w-full appearance-none rounded-xl border bg-surface-50 pl-10 pr-8 text-sm text-ink-700 transition-all hover:bg-surface-100 hover:border-surface-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10",
                    projectFilter !== "ALL" && "border-brand-500 bg-brand-50/50 font-medium text-brand-700"
                  )}
                  value={projectFilter}
                  onChange={(e) => setProjectFilter(e.target.value)}
                >
                  <option value="ALL">All Projects</option>
                  {projectOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400 pointer-events-none" />
              </div>

              {/* Assignee Filter */}
              <div className="relative">
                <User className={cn("absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors", assigneeFilter !== "ALL" ? "text-brand-500" : "text-ink-400")} />
                <select
                  className={cn(
                    "h-10 w-full appearance-none rounded-xl border bg-surface-50 pl-10 pr-8 text-sm text-ink-700 transition-all hover:bg-surface-100 hover:border-surface-300 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10",
                    assigneeFilter !== "ALL" && "border-brand-500 bg-brand-50/50 font-medium text-brand-700"
                  )}
                  value={assigneeFilter}
                  onChange={(e) => setAssigneeFilter(e.target.value)}
                >
                  <option value="ALL">All Assignees</option>
                  {users?.map((user) => (
                    <option key={user.userId} value={user.userId}>
                      {user.name}
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
                        className="flex items-center gap-1.5 rounded-full bg-surface-100 px-3 py-1 text-xs font-semibold text-ink-700 transition hover:bg-surface-200"
                        title={`Assigned to ${task.assignedTo.name}`}
                      >
                        <User className="h-3 w-3 text-ink-500" />
                        <span className="truncate max-w-[150px]">{task.assignedTo.name}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setViewingTask(task)}
                    className="rounded-lg p-2 text-ink-400 hover:bg-surface-50 hover:text-ink-600"
                  >
                    <Info className="h-4 w-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div >

      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingTask ? "Edit Task" : "Create New Task"}
      >
        <form className="space-y-4" onSubmit={handleCreateOrUpdate}>
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
                <option value="CRITICAL">Critical</option>
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

            <div className="space-y-1 sm:col-span-2">
              <label className="text-sm font-semibold text-ink-800">
                Assignee
              </label>
              <Select {...form.register("assigneeId")}>
                <option value="">Unassigned</option>
                {users?.map((user) => (
                  <option key={user.userId} value={user.userId}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </Select>
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
            <Button type="submit" loading={createTask.isPending || updateTask.isPending}>
              {editingTask ? "Save Changes" : "Create Task"}
            </Button>
          </div>
        </form>
      </Modal>


      {/* Task Details Modal */}
      <Modal
        open={!!viewingTask}
        onClose={() => setViewingTask(null)}
        title="Task Details"
      >
        {viewingTask && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-ink-900">{viewingTask.title}</h3>
              <p className="mt-2 text-ink-600">
                {viewingTask.description || "No description provided."}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs font-semibold uppercase text-ink-500">Status</span>
                <div className="mt-1 flex items-center gap-2">
                  <span className={cn(
                    "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold",
                    statusColors[viewingTask.status] || "text-gray-500"
                  )}>
                    {viewingTask.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              <div>
                <span className="block text-xs font-semibold uppercase text-ink-500">Priority</span>
                <p className={cn(
                  "mt-1 inline-flex rounded-lg border px-2.5 py-1 text-xs font-semibold",
                  priorityStyles[viewingTask.priority]
                )}>
                  {viewingTask.priority}
                </p>
              </div>

              <div>
                <span className="block text-xs font-semibold uppercase text-ink-500">Project</span>
                <p className="mt-1 text-sm font-medium text-ink-900">
                  {viewingTask.project?.projectName || "No Project"}
                </p>
              </div>

              <div>
                <span className="block text-xs font-semibold uppercase text-ink-500">Due Date</span>
                <p className="mt-1 text-sm font-medium text-ink-900">
                  {viewingTask.dueDate ? formatDate(viewingTask.dueDate) : "No due date"}
                </p>
              </div>

              <div className="col-span-2">
                <span className="block text-xs font-semibold uppercase text-ink-500">Assignee</span>
                <p className="mt-1 text-sm font-medium text-ink-900">
                  {viewingTask.assignedTo ? (
                    <span className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
                        {viewingTask.assignedTo.name.charAt(0).toUpperCase()}
                      </span>
                      {viewingTask.assignedTo.name} ({viewingTask.assignedTo.email})
                    </span>
                  ) : "Unassigned"}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-surface-100 pt-6">
              <Button
                variant="secondary"
                className="text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-100"
                onClick={() => viewingTask && handleDelete(viewingTask.taskId)}
              >
                Delete
              </Button>
              <Button onClick={() => viewingTask && handleEdit(viewingTask)}>
                Edit Task
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </>
  );
}

export default TasksPage;
