import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Menu, Search, Bell } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

function AppLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Mobile Sidebar Overlay */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-ink-900/20 backdrop-blur-sm lg:hidden",
          isSidebarOpen ? "block" : "hidden",
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      {/* Sidebar - mapped to mobile state, always visible on desktop */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 transition-transform lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <Sidebar />
      </div>

      <div className="lg:pl-64">
        {/* Top Header */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-surface-200 bg-white/80 px-6 backdrop-blur">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="rounded-lg p-2 text-ink-500 hover:bg-surface-100 lg:hidden"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                placeholder="Search..."
                className="h-10 w-64 rounded-full border border-surface-200 bg-surface-50 pl-10 pr-4 text-sm text-ink-900 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-full p-2 text-ink-400 hover:bg-surface-100 hover:text-ink-600">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="mx-auto max-w-7xl p-6 lg:p-8">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
