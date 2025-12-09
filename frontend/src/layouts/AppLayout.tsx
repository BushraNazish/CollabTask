import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/tasks", label: "Tasks" },
  { to: "/teams", label: "Teams" },
  { to: "/users", label: "Users" },
];

function AppLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-surface-50 text-ink-900">
      <header className="border-b border-surface-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500 text-white shadow-lg shadow-brand-500/20">
              <span className="text-lg font-semibold">CT</span>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-ink-500">
                CollabTask
              </p>
              <h1 className="text-base font-semibold text-ink-900">
                Workspace
              </h1>
            </div>
          </NavLink>
          <nav className="flex items-center gap-3 text-sm font-semibold text-ink-700">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "rounded-lg px-3 py-2 transition",
                    isActive
                      ? "bg-surface-200 text-ink-900"
                      : "hover:bg-surface-100 hover:text-ink-900",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="text-right">
            <p className="text-sm font-semibold text-ink-900">
              {user?.name ?? "Signed out"}
            </p>
            <p className="text-xs text-ink-500">{user?.role ?? "Guest"}</p>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
