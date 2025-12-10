import { Link, Outlet } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-surface-50 via-white to-surface-50 text-ink-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col lg:flex-row">
        <div className="flex flex-1 flex-col justify-between bg-white/70 p-8 lg:rounded-xl lg:border lg:border-surface-200 lg:shadow-soft">
          <div>
            <Link to="/" className="flex items-center gap-2 transition-opacity hover:opacity-80">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/20">
                <LayoutDashboard className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-ink-900">
                CollabTask
              </span>
            </Link>
            <h1 className="mt-4 text-base font-semibold text-ink-900">
              Sign in to continue
            </h1>
            <div className="mt-8 rounded-xl border border-surface-200 bg-surface-50 p-5">
              <h2 className="text-sm font-semibold text-ink-800">
                Collaboration-ready
              </h2>
              <p className="mt-2 text-sm text-ink-600">
                Organize teams, projects, and tasks with role-based access.
                Build momentum with comments and real-time updates.
              </p>
            </div>
          </div>
          <div className="hidden lg:block">
            <p className="text-xs text-ink-500">
              Secure by design • JWT auth • Role-based access
            </p>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center p-8">
          <div className="w-full max-w-md rounded-xl border border-surface-200 bg-white p-6 shadow-soft">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
