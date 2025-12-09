import { useUsers, useUpdateUser, useDeleteUser } from "@/features/users/useUsers";
import { useAuth } from "@/features/auth/AuthContext";
import { normalizeError } from "@/services/errors";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/types/date";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Shield, ShieldAlert, User, Search, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import type { AppUser } from "@/features/users/types";
import type { UserRole } from "@/features/auth/types";

function UsersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const { data, isLoading, isError, error } = useUsers();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();
  const [search, setSearch] = useState("");

  const [editingUser, setEditingUser] = useState<AppUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AppUser | null>(null);

  // Form state
  // Pre-fill all fields to avoid null constraint issues
  const [formData, setFormData] = useState({ name: "", email: "", role: "MEMBER" as UserRole });

  if (!isAdmin) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <div className="rounded-full bg-red-100 p-3 text-red-600">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-ink-900">Access Denied</h2>
        <p className="mt-2 text-ink-500">
          You do not have permission to view this page. This section is restricted
          to administrators only.
        </p>
      </div>
    );
  }

  const filtered = data?.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleEditClick = (user: AppUser) => {
    setEditingUser(user);
    setFormData({ name: user.name, email: user.email, role: user.role });
  };

  const handleDeleteClick = (user: AppUser) => {
    setDeletingUser(user);
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    try {
      await updateUser.mutateAsync({
        userId: editingUser.userId,
        // Send all fields to ensure no nulls are passed for existing data
        data: { name: formData.name, email: formData.email, role: formData.role },
      });
      setEditingUser(null);
    } catch (e) {
      console.error("Failed to update user", e);
    }
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    try {
      await deleteUser.mutateAsync(deletingUser.userId);
      setDeletingUser(null);
    } catch (e) {
      console.error("Failed to delete user", e);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-ink-900">
            Users
          </h1>
          <p className="mt-1 text-ink-500">
            Manage system access and roles securely.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <Input
          placeholder="Search users by name or email..."
          className="pl-10"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl border border-surface-200 bg-white p-4"
            >
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-red-800">
          <p className="font-medium">Error loading users</p>
          <p className="text-sm opacity-80">{normalizeError(error).message}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-surface-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm text-ink-600">
            <thead className="bg-surface-50 text-xs uppercase text-ink-500">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Role</th>
                <th className="px-6 py-4 font-semibold">Joined Date</th>
                <th className="px-6 py-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100">
              {filtered && filtered.length > 0 ? (
                filtered.map((u) => (
                  <tr key={u.userId} className="group hover:bg-surface-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                          {u.name ? (
                            <span className="font-bold">
                              {u.name.charAt(0).toUpperCase()}
                            </span>
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="font-semibold text-ink-900">{u.name}</p>
                          <p className="text-xs text-ink-500">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
                          u.role === "ADMIN"
                            ? "bg-purple-50 text-purple-700 border border-purple-200"
                            : "bg-surface-100 text-ink-600 border border-surface-200"
                        )}
                      >
                        {u.role === "ADMIN" && <Shield className="h-3 w-3" />}
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {u.createdAt ? formatDate(u.createdAt) : "—"}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditClick(u)}
                          className="text-ink-400 hover:text-brand-600"
                          title="Edit User"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteClick(u)}
                          className="text-ink-400 hover:text-red-600"
                          title="Delete User"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-ink-500">
                    No users found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      <Modal
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Edit User"
      >
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              Full Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              Email
            </label>
            <Input
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700">
              Role
            </label>
            <select
              className="w-full rounded-xl border border-surface-200 bg-surface-50 p-2.5 text-sm outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            >
              <option value="MEMBER">MEMBER</option>
              <option value="MANAGER">MANAGER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setEditingUser(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              loading={updateUser.isPending}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete/Details Modal - Using as Confirm Dialog */}
      <Modal
        open={!!deletingUser}
        onClose={() => setDeletingUser(null)}
        title="Delete User"
      >
        <div className="space-y-4">
          <p className="text-ink-600">
            Are you sure you want to delete <span className="font-bold">{deletingUser?.name}</span>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setDeletingUser(null)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 shadow-red-500/20"
              onClick={handleDelete}
              loading={deleteUser.isPending}
            >
              Delete User
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default UsersPage;
