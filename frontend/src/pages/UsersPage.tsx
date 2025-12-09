import { useUsers } from "@/features/users/useUsers";
import { useAuth } from "@/features/auth/AuthContext";
import { normalizeError } from "@/services/errors";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate } from "@/types/date";

function UsersPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "ADMIN";
  const { data, isLoading, isError, error } = useUsers();

  if (!isAdmin) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
        You do not have permission to view users. (Admin only)
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold text-ink-500">Users</p>
          <h2 className="text-2xl font-semibold text-ink-900">Admin-only view</h2>
          <p className="text-sm text-ink-600">Manage users and roles.</p>
        </div>
      </div>

      {isLoading && (
        <div className="grid gap-3 md:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm"
            >
              <Skeleton className="h-5 w-40" />
              <Skeleton className="mt-3 h-4 w-32" />
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
              {data.map((u) => (
                <div
                  key={u.userId}
                  className="rounded-xl border border-surface-200 bg-white p-4 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-ink-900">{u.name}</h3>
                  <p className="text-sm text-ink-600">{u.email}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-500">
                    <span className="rounded-full bg-surface-100 px-2 py-1">
                      {u.role}
                    </span>
                    {u.createdAt && (
                      <span className="rounded-full bg-surface-100 px-2 py-1">
                        Joined {formatDate(u.createdAt)}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-surface-300 bg-white/60 p-6 text-sm text-ink-600">
              No users to display.
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default UsersPage;
