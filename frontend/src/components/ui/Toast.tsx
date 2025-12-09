import { useEffect } from "react";
import { twMerge } from "tailwind-merge";

export type ToastVariant = "success" | "error" | "info";

export type ToastMessage = {
  id: string;
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastProps = ToastMessage & {
  onClose: (id: string) => void;
};

const variantStyles: Record<ToastVariant, string> = {
  success:
    "border-green-200 bg-green-50 text-green-900 shadow-green-500/10 shadow-sm",
  error: "border-red-200 bg-red-50 text-red-900 shadow-red-500/10 shadow-sm",
  info: "border-blue-200 bg-blue-50 text-blue-900 shadow-blue-500/10 shadow-sm",
};

export function Toast({ id, title, description, variant = "info", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), 4000);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div
      className={twMerge(
        "w-full max-w-sm rounded-xl border px-4 py-3 text-sm backdrop-blur",
        variantStyles[variant],
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-current/60" />
        <div className="flex-1">
          <p className="font-semibold">{title}</p>
          {description && <p className="mt-1 text-xs opacity-80">{description}</p>}
        </div>
        <button
          type="button"
          onClick={() => onClose(id)}
          className="text-xs font-semibold uppercase tracking-wide opacity-70 hover:opacity-100"
        >
          Close
        </button>
      </div>
    </div>
  );
}
