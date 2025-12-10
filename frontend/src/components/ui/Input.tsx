import { type InputHTMLAttributes, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={twMerge(
          "w-full rounded-xl border border-surface-200 bg-surface-50/50 px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 transition-all focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-500/10",
          className,
        )}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
