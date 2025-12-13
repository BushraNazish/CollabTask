import { Link, Outlet } from "react-router-dom";
import { LayoutDashboard } from "lucide-react";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Side - Brand & Visuals */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-ink-900 flex-col justify-between p-12 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 z-0 opacity-10">
          <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor" />
          </svg>
        </div>

        {/* Abstract Gradient Blob */}
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-brand-500/30 blur-3xl filter" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[400px] w-[400px] rounded-full bg-blue-600/20 blur-3xl filter" />

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 shadow-lg shadow-brand-500/20">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight">
              CollabTask
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <blockquote className="space-y-4">
            <p className="font-display text-3xl font-medium leading-tight text-white">
              Productivity through connected minds.<br />Collaborate effortlessly.
            </p>
            <footer className="text-brand-100/80 font-medium">
              — Secure & Efficient Collaboration
            </footer>
          </blockquote>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-xs font-medium text-ink-400">
          <span>© 2024 CollabTask Inc.</span>
          <span className="h-1 w-1 rounded-full bg-ink-700" />
          <span>Privacy & Terms</span>
        </div>
      </div>

      {/* Right Side - Form Container */}
      <div className="flex w-full flex-col items-center justify-center bg-white p-8 lg:w-1/2">
        <div className="w-full max-w-[400px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
