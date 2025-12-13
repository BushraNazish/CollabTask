import { useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import { Collapsible } from "@/components/ui/Collapsible";
import { useProjects } from "@/features/projects/useProjects";
import { useTasks } from "@/features/tasks/useTasks";
import { type Team } from "@/features/teams/types";
import { Briefcase, CheckSquare, AlertCircle } from "lucide-react";

interface TeamDetailsModalProps {
    team: Team | null;
    onClose: () => void;
}

export function TeamDetailsModal({ team, onClose }: TeamDetailsModalProps) {
    const { data: projects } = useProjects();
    const { data: tasks } = useTasks();

    const teamProjects = useMemo(() => {
        if (!team || !projects) return [];
        return projects.filter((p) => p.team?.teamId === team.teamId);
    }, [team, projects]);

    const getProjectTasks = (projectId: number) => {
        if (!tasks) return [];
        return tasks.filter((t) => t.project?.projectId === projectId);
    };

    return (
        <Modal
            open={!!team}
            onClose={onClose}
            title={team ? `Team Details: ${team.teamName}` : "Team Details"}
        >
            <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                {!team ? (
                    <div>Loading...</div>
                ) : teamProjects.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-200 bg-surface-50 p-8 text-center">
                        <Briefcase className="h-10 w-10 text-ink-300 mb-3" />
                        <p className="text-ink-500 font-medium">No projects assigned to this team.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-ink-500 mb-2">
                            Assigned Projects ({teamProjects.length})
                        </h3>
                        {teamProjects.map((project) => {
                            const projectTasks = getProjectTasks(project.projectId);

                            return (
                                <Collapsible
                                    key={project.projectId}
                                    title={
                                        <div className="flex items-center gap-3">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                                                <Briefcase className="h-4 w-4" />
                                            </div>
                                            <span className="text-sm font-semibold">{project.projectName}</span>
                                            <span className="ml-auto mr-2 text-xs font-medium text-ink-400 bg-white px-2 py-0.5 rounded-full border border-surface-200">
                                                {projectTasks.length} tasks
                                            </span>
                                        </div>
                                    }
                                >
                                    {projectTasks.length === 0 ? (
                                        <p className="text-sm text-ink-400 italic pl-2">No tasks in this project.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {projectTasks.map((task) => (
                                                <div
                                                    key={task.taskId}
                                                    className="flex items-start gap-3 rounded-lg border border-surface-100 bg-surface-50 p-3"
                                                >
                                                    <CheckSquare className="mt-0.5 h-4 w-4 text-ink-400 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-ink-800 break-words">{task.title}</p>
                                                        <div className="mt-2 flex items-center gap-2">
                                                            {task.assignedTo ? (
                                                                <div className="flex items-center gap-1.5 rounded-full bg-white border border-surface-200 px-2 py-0.5 shadow-sm">
                                                                    <div className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                                                                        {task.assignedTo.name.charAt(0).toUpperCase()}
                                                                    </div>
                                                                    <span className="text-xs font-medium text-ink-600 truncate max-w-[120px]">
                                                                        {task.assignedTo.name}
                                                                    </span>
                                                                </div>
                                                            ) : (
                                                                <span className="flex items-center gap-1 text-xs text-ink-400 bg-white border border-surface-200 px-2 py-0.5 rounded-full">
                                                                    <AlertCircle className="h-3 w-3" />
                                                                    Unassigned
                                                                </span>
                                                            )}
                                                            <span
                                                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${task.status === "COMPLETED"
                                                                    ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                                                    : task.status === "IN_PROGRESS"
                                                                        ? "bg-blue-50 text-blue-700 border-blue-100"
                                                                        : "bg-slate-50 text-slate-600 border-slate-100"
                                                                    }`}
                                                            >
                                                                {task.status.replace("_", " ")}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </Collapsible>
                            );
                        })}
                    </div>
                )}
            </div>
        </Modal>
    );
}
