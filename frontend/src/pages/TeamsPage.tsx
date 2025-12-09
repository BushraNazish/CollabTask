import { useTeams, useCreateTeam } from "@/features/teams/useTeams";
import { normalizeError } from "@/services/errors";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/types/date";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";

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
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink-500">Teams</p>
          <h2 className="text-2xl font-semibold text-ink-900">Collaborate by team</h2>
          <p className="text-sm text-ink-600">
            Create and manage teams for your projects.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>New team</Button>
      </div>

      {isLoading && (
        <div className="grid gap-3 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm"
            >
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-3 h-4 w-full" />
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
          {data && data.length > 0 ? (
            <div className="grid gap-3 md:grid-cols-2">
              {data.map((team) => (
                <div
                  key={team.teamId}
                  className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-ink-900">
                    {team.teamName}
                  </h3>
                  <p className="text-sm text-ink-600">
                    {team.description || "No description provided."}
                  </p>
                  <div className="mt-3 flex items-center gap-2 text-xs text-ink-500">
                    {team.createdAt && (
                      <span className="rounded-full bg-surface-100 px-2 py-1">
                        Created {formatDate(team.createdAt)}
                      </span>
                    )}
                    <span className="rounded-full bg-surface-100 px-2 py-1">
                      Team #{team.teamId}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-surface-300 bg-white/60 p-6 text-sm text-ink-600">
              No teams to display yet.
            </div>
          )}
        </>
      )}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create team"
      >
        <form className="space-y-3" onSubmit={handleCreate}>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-ink-800">
              Team name
            </label>
            <Input
              {...form.register("teamName", { required: true })}
              placeholder="Team name"
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
          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createTeam.isPending}>
              Create
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default TeamsPage;
