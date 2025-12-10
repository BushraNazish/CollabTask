import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Menu } from "lucide-react";
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
        {/* Top Header - Mobile Only */}
        <header className="sticky top-0 z-20 flex h-16 items-center border-b border-surface-200 bg-white/80 px-6 backdrop-blur lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-lg p-2 text-ink-500 hover:bg-surface-100"
          >
            <Menu className="h-6 w-6" />
          </button>
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
