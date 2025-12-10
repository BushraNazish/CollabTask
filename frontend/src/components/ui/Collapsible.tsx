import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleProps {
    title: React.ReactNode;
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
}

export function Collapsible({ title, children, defaultOpen = false, className }: CollapsibleProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className={cn("border rounded-xl border-surface-200 bg-white overflow-hidden", className)}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between bg-surface-50 px-4 py-3 text-left transition-colors hover:bg-surface-100"
            >
                <div className="font-medium text-ink-900">{title}</div>
                {isOpen ? (
                    <ChevronDown className="h-4 w-4 text-ink-400" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-ink-400" />
                )}
            </button>
            {isOpen && <div className="p-4 border-t border-surface-200 animate-in slide-in-from-top-2 fade-in duration-200">{children}</div>}
        </div>
    );
}
