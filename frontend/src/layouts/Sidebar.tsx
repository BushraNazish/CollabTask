import { NavLink } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    FolderKanban,
    CheckSquare,
    Users,
    LogOut,
    X,
    UserCircle
} from "lucide-react";
import { Button } from "@/components/ui/Button";

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { user, logout } = useAuth();

    const navigation = [
        { name: "Dashboard", href: "/", icon: LayoutDashboard },
        { name: "Projects", href: "/projects", icon: FolderKanban },
        { name: "My Tasks", href: "/tasks", icon: CheckSquare },
        { name: "Teams", href: "/teams", icon: Users },
    ];

    if (user?.role === "ADMIN") {
        navigation.push({ name: "Users", href: "/users", icon: Users });
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
                    "fixed left-0 top-0 z-50 h-screen w-64 transform border-r border-surface-200 bg-white/80 backdrop-blur-md transition-transform duration-300 ease-in-out lg:translate-x-0",
                    isOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex h-full flex-col">
                    {/* Logo Area */}
                    <div className="flex h-16 items-center justify-between px-6 border-b border-surface-100">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-lg shadow-brand-500/20">
                                <LayoutDashboard className="h-5 w-5" />
                            </div>
                            <span className="font-display text-xl font-bold tracking-tight text-ink-900">
                                CollabTask
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="rounded-lg p-1 text-ink-400 hover:bg-surface-100 lg:hidden"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-1 px-4 py-6">
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                className={({ isActive }) =>
                                    cn(
                                        "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-brand-50 text-brand-700 shadow-sm"
                                            : "text-ink-500 hover:bg-surface-50 hover:text-ink-900 hover:translate-x-1"
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon
                                            className={cn(
                                                "h-5 w-5 transition-colors",
                                                isActive ? "text-brand-600" : "text-ink-400 group-hover:text-ink-600"
                                            )}
                                        />
                                        {item.name}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Profile */}
                    <div className="border-t border-surface-200 p-4">
                        <div className="flex items-center gap-3 rounded-xl bg-surface-50 p-3 transition-colors hover:bg-surface-100">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-100 text-brand-600">
                                <span className="font-bold">
                                    {user?.name?.charAt(0).toUpperCase() || <UserCircle className="h-6 w-6" />}
                                </span>
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <p className="truncate text-sm font-semibold text-ink-900">
                                    {user?.name || "User"}
                                </p>
                                <p className="truncate text-xs text-ink-500">
                                    {user?.email || "email@example.com"}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 rounded-lg p-0 text-ink-400 hover:bg-white hover:text-red-600 hover:shadow-sm"
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
