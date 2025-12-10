import { type ReactNode } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";

type ModalProps = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
};

const sizeMap: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({
  open,
  title,
  onClose,
  children,
  size = "md",
}: ModalProps) {
  if (!open) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden
      />
      <div
        className={twMerge(
          "relative w-full rounded-xl bg-white p-6 shadow-2xl",
          sizeMap[size],
        )}
      >
        <div className="mb-4 flex items-start justify-between">
          {title ? (
            <h3 className="text-lg font-semibold text-ink-900">{title}</h3>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-sm font-semibold text-ink-500 hover:text-ink-800"
          >
            Close
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  );
}
