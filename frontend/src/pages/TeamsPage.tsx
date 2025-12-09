import { useTeams, useCreateTeam } from "@/features/teams/useTeams";
import { normalizeError } from "@/services/errors";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/types/date";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";


import { Users, Plus, Calendar, Settings } from "lucide-react";


function TeamsPage() {
  const { data, isLoading, isError, error } = useTeams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const createTeam = useCreateTeam();
  const form = useForm({
    defaultValues: {
      teamName: "",
      description: "",
    },
  });

  const handleCreate = form.handleSubmit(async (values) => {
    await createTeam.mutateAsync(values);
    setIsModalOpen(false);
    form.reset();
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900">
            Teams
          </h1>
          <p className="mt-1 text-ink-500">
            Collaborate and organize your people into groups.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Team
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 rounded-2xl border border-surface-200 bg-white p-6"
            >
              <Skeleton className="h-5 w-32" />
              <Skeleton className="mt-4 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-2/3" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-800">
          <p className="font-medium">Error loading teams</p>
          <p className="text-sm opacity-80">{normalizeError(error).message}</p>
        </div>
      ) : (
        <>
          {data && data.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {data.map((team) => (
                <div
                  key={team.teamId}
                  className="group relative flex flex-col justify-between rounded-2xl border border-surface-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-md"
                >
                  <div>
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600">
                        <Users className="h-6 w-6" />
                      </div>
                      <button className="rounded-lg p-2 text-ink-400 hover:bg-surface-50 hover:text-ink-600">
                        <Settings className="h-4 w-4" />
                      </button>
                    </div>

                    <h3 className="text-lg font-bold text-ink-900">
                      {team.teamName}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-500 line-clamp-2">
                      {team.description || "No description provided."}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-surface-100 pt-4 text-xs font-medium text-ink-500">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {team.createdAt
                        ? formatDate(team.createdAt)
                        : "Unknown Date"}
                    </span>
                    <span className="rounded-full bg-surface-100 px-2.5 py-1 text-ink-600">
                      ID: {team.teamId}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-surface-300 bg-surface-50 p-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-100 text-ink-400">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-ink-900">
                No teams found
              </h3>
              <p className="mt-1 max-w-sm text-sm text-ink-500">
                Create a team to start grouping your projects and members.
              </p>
            </div>
          )}
        </>
      )}

      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create New Team"
      >
        <form className="space-y-4" onSubmit={handleCreate}>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-ink-800">
              Team Name
            </label>
            <Input
              {...form.register("teamName", { required: true })}
              placeholder="e.g. Engineering"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-ink-800">
              Description
            </label>
            <Input
              {...form.register("description")}
              placeholder="Optional purpose of this team..."
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createTeam.isPending}>
              Create Team
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default TeamsPage;
