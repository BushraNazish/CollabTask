import { type ButtonHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  loading?: boolean;
};

const variantClasses: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-brand-600 text-white hover:bg-brand-700 border border-transparent shadow-sm shadow-brand-500/20 active:scale-95",
  secondary:
    "bg-white text-ink-900 border border-surface-200 hover:bg-surface-50 hover:border-surface-300",
  ghost: "bg-transparent text-ink-600 hover:bg-surface-100 hover:text-ink-900 border border-transparent",
};

const sizeClasses: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  loading,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <button
      className={twMerge(
        "inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20",
        variantClasses[variant],
        sizeClasses[size],
        isDisabled && "opacity-70 cursor-not-allowed",
        className,
      )}
      disabled={isDisabled}
      {...props}
    >
      {loading && (
        <span className="mr-2 inline-block h-3 w-3 animate-spin rounded-full border-2 border-white/60 border-b-transparent" />
      )}
      {children}
    </button>
  );
}
