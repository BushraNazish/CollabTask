import { NavLink, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    LogOut,
    X,
    UserCircle,
    Settings,
    ChevronRight,
    UserCog
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navigation = [
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
        { name: "Projects", href: "/projects", icon: FolderKanban },
        { name: "My Tasks", href: "/tasks", icon: CheckSquare },
        { name: "Teams", href: "/teams", icon: Users },
    ];

    if (user?.role === "ADMIN") {
        navigation.push({ name: "Users", href: "/users", icon: UserCog });
    }

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-ink-900/50 backdrop-blur-sm transition-opacity lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={cn(
                    "fixed left-0 top-0 z-50 h-screen w-64 transform border-r border-surface-200 bg-white shadow-[4px_0_24px_-12px_rgba(0,0,0,0.1)] transition-transform duration-300 ease-in-out lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo Area */}
                    <div className="flex h-20 items-center justify-between px-6">
                        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
                            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 text-white shadow-lg shadow-brand-500/25 ring-1 ring-white/20">
                                <LayoutDashboard className="h-6 w-6" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-display text-lg font-bold tracking-tight text-ink-900 leading-none">
                                    CollabTask
                                </span>
                                <span className="text-[10px] uppercase tracking-wider font-semibold text-ink-400">
                                    Workspace
                                </span>
                            </div>
                        </Link>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-2 text-ink-400 hover:bg-surface-100 lg:hidden"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-4 py-8">
                        <div className="mb-4 px-4 text-xs font-semibold text-ink-400 uppercase tracking-wider">
                            Menu
                        </div>
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) =>
                                    cn(
                                        "group relative flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-brand-50/80 text-brand-700 shadow-sm"
                                            : "text-ink-600 hover:bg-surface-50 hover:text-ink-900"
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-brand-600" />
                                        )}
                                        <item.icon
                                            className={cn(
                                                "h-5 w-5 transition-colors",
                                                isActive ? "text-brand-600" : "text-ink-400 group-hover:text-ink-600"
                                            )}
                                        />
                                        <span className="flex-1">{item.name}</span>
                                        {isActive && (
                                            <ChevronRight className="h-4 w-4 text-brand-400" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile */}
                    <div className="border-t border-surface-100 p-6">
                        <div className="flex items-center gap-3 rounded-2xl border border-surface-200 bg-surface-50 p-4 transition-all hover:border-brand-200 hover:bg-white hover:shadow-md">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 text-indigo-600 ring-2 ring-white">
                                <span className="font-bold">
                                    {user?.name?.charAt(0).toUpperCase() || <UserCircle className="h-6 w-6" />}
                                </span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="truncate text-sm font-semibold text-ink-900">
                                    {user?.name || "User"}
                                </p>
                                <p className="truncate text-xs text-ink-500 font-medium">
                                    {user?.role || "MEMBER"}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 rounded-lg p-0 text-ink-400 hover:bg-red-50 hover:text-red-600"
                                onClick={() => logout()}
                                title="Log out"
                            >
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
