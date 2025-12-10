import { useTeams, useCreateTeam, useUpdateTeam, useDeleteTeam } from "@/features/teams/useTeams";
import { normalizeError } from "@/services/errors";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/types/date";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/Input";
import { Users, Plus, Calendar, Settings, Search, Edit2, Trash2, Info } from "lucide-react";
import { type Team } from "@/features/teams/types";
import { TeamDetailsModal } from "@/features/teams/components/TeamDetailsModal";

function TeamsPage() {
  const { data, isLoading, isError, error } = useTeams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");

  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [deletingTeam, setDeletingTeam] = useState<Team | null>(null);
  const [viewingDetailsTeam, setViewingDetailsTeam] = useState<Team | null>(null);

  const createTeam = useCreateTeam();
  const updateTeam = useUpdateTeam();
  const deleteTeam = useDeleteTeam();

  const form = useForm({
    defaultValues: {
      teamName: "",
      description: "",
      status: "ACTIVE",
    },
  });

  const filtered = data?.filter((team) =>
    team.teamName.toLowerCase().includes(search.toLowerCase()) ||
    (team.description && team.description.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreateOrUpdate = form.handleSubmit(async (values) => {
    if (editingTeam) {
      await updateTeam.mutateAsync({
        teamId: editingTeam.teamId,
        data: values,
      });
    } else {
      await createTeam.mutateAsync(values);
    }
    closeModal();
  });

  const handleEditClick = (team: Team) => {
    setEditingTeam(team);
    form.reset({
      teamName: team.teamName,
      description: team.description || "",
      status: "ACTIVE",
    });
    setIsModalOpen(true);
    setActiveMenuId(null);
  };

  const handleDeleteClick = (team: Team) => {
    setDeletingTeam(team);
    setActiveMenuId(null);
  };

  const confirmDelete = async () => {
    if (deletingTeam) {
      await deleteTeam.mutateAsync(deletingTeam.teamId);
      setDeletingTeam(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTeam(null);
    form.reset({
      teamName: "",
      description: "",
      status: "ACTIVE",
    });
  };

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
        <Button
          onClick={() => {
            setEditingTeam(null);
            form.reset({
              teamName: "",
              description: "",
              status: "ACTIVE",
            });
            setIsModalOpen(true);
          }}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          New Team
        </Button>
      </div>

      {/* Overlay to close menus */}
      {activeMenuId !== null && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setActiveMenuId(null)}
        />
      )}

      {/* Search Bar */}
      <div className="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search teams by name or description..."
            className="h-10 w-full rounded-xl border border-surface-200 bg-surface-50 pl-10 pr-4 text-sm text-ink-900 transition-all hover:bg-surface-100 focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
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
          {filtered && filtered.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((team) => (
                <div
                  key={team.teamId}
                  className={cn(
                    "group relative flex flex-col justify-between rounded-2xl border border-surface-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-200 hover:shadow-md",
                    activeMenuId === team.teamId ? "z-30 border-brand-200 shadow-md ring-1 ring-brand-100" : ""
                  )}
                >
                  <div className="relative">
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-brand-100 text-brand-600">
                        <Users className="h-6 w-6" />
                      </div>
                      <div className="relative flex items-center gap-1">
                        <button
                          onClick={() => setViewingDetailsTeam(team)}
                          className="rounded-lg p-2 text-ink-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
                          title="View Team Details"
                        >
                          <Info className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === team.teamId ? null : team.teamId)}
                          className="rounded-lg p-2 text-ink-400 hover:bg-surface-50 hover:text-ink-600"
                        >
                          <Settings className="h-4 w-4" />
                        </button>

                        {/* Dropdown Menu */}
                        {activeMenuId === team.teamId && (
                          <div className="absolute right-0 top-full mt-1 w-32 rounded-lg border border-surface-200 bg-white p-1 shadow-lg z-20">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditClick(team);
                              }}
                              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-ink-700 hover:bg-surface-50"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(team);
                              }}
                              className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
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
                {search ? "Try adjusting your search terms." : "Create a team to start grouping your projects and members."}
              </p>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        title={editingTeam ? "Edit Team" : "Create New Team"}
      >
        <form className="space-y-4" onSubmit={handleCreateOrUpdate}>
          <div className="space-y-1">
            <label className="text-sm font-semibold text-ink-800">
              Team Name <span className="text-red-500">*</span>
            </label>
            <Input
              {...form.register("teamName", { required: "This field cannot be empty" })}
              placeholder="e.g. Engineering"
              className={cn(form.formState.errors.teamName && "border-red-500 focus:border-red-500 focus:ring-red-500/10")}
            />
            {form.formState.errors.teamName && (
              <p className="text-xs text-red-500">{form.formState.errors.teamName.message}</p>
            )}
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
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createTeam.isPending || updateTeam.isPending}>
              {editingTeam ? "Save Changes" : "Create Team"}
            </Button>
          </div>
        </form>
      </Modal>

      <TeamDetailsModal
        team={viewingDetailsTeam}
        onClose={() => setViewingDetailsTeam(null)}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        open={!!deletingTeam}
        onClose={() => setDeletingTeam(null)}
        title="Delete Team"
      >
        <div className="space-y-4">
          <p className="text-ink-600">
            Are you sure you want to delete <span className="font-bold">{deletingTeam?.teamName}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setDeletingTeam(null)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 shadow-red-500/20"
              onClick={confirmDelete}
              loading={deleteTeam.isPending}
            >
              Delete Team
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default TeamsPage;
