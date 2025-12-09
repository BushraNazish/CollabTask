import { useUsers } from "@/features/users/useUsers";
import { useAuth } from "@/features/auth/AuthContext";
import { normalizeError } from "@/services/errors";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/types/date";


import { Shield, ShieldAlert, User, Search, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

function UsersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const { data, isLoading, isError, error } = useUsers();
  const [search, setSearch] = useState("");

  if (!isAdmin) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-center">
        <div className="rounded-full bg-red-100 p-3 text-red-600">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h2 className="mt-4 text-xl font-bold text-ink-900">Access Denied</h2>
        <p className="mt-2 max-w-md text-ink-500">
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
        <input
          type="text"
          placeholder="Search users by name or email..."
          className="h-10 w-full rounded-xl border border-surface-200 bg-white pl-10 pr-4 text-sm text-ink-900 transition focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                      <button className="rounded-lg p-2 text-ink-400 hover:bg-white hover:text-ink-600 hover:shadow-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
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
    </div>
  );
}

export default UsersPage;
