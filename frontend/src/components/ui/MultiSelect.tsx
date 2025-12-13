import { useState, useRef, useEffect } from "react";
import { Check, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type Option = {
    id: string | number;
    label: string;
};

interface MultiSelectProps {
    options: Option[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    label: string;
    icon?: React.ReactNode;

    className?: string;
}

export function MultiSelect({
    options,
    selectedValues,
    onChange,
    label,
    icon,

    className,
}: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (id: string) => {
        if (selectedValues.includes(id)) {
            onChange(selectedValues.filter((v) => v !== id));
        } else {
            onChange([...selectedValues, id]);
        }
    };

    const handleClear = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange([]);
        setIsOpen(false);
    };

    return (
        <div className={cn("relative", className)} ref={containerRef}>
            {/* Icon positioning similar to existing select */}
            {icon && (
                <div className={cn("absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors", selectedValues.length > 0 ? "text-brand-500" : "text-ink-400")}>
                    {icon}
                </div>
            )}

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "flex h-10 w-full items-center justify-between rounded-xl border bg-surface-50 pl-10 pr-3 text-sm transition-all hover:bg-surface-100 hover:border-surface-300 focus:outline-none focus:ring-4 focus:ring-brand-500/10",
                    selectedValues.length > 0
                        ? "border-brand-500 bg-brand-50/50 font-medium text-brand-700"
                        : "text-ink-700 border-surface-200"
                )}
            >
                <span className="truncate">
                    {selectedValues.length === 0
                        ? label
                        : selectedValues.length === 1
                            ? options.find((o) => o.id.toString() === selectedValues[0])?.label || label
                            : `${selectedValues.length} selected`}
                </span>
                <div className="flex items-center gap-1">
                    {selectedValues.length > 0 && (
                        <div
                            role="button"
                            onClick={handleClear}
                            className="rounded-full p-0.5 hover:bg-black/10 transition-colors"
                        >
                            <X className="h-3.5 w-3.5 opacity-60" />
                        </div>
                    )}
                    <ChevronDown className={cn("h-4 w-4 text-ink-400 opacity-50",
                        selectedValues.length > 0 && "text-brand-700 opacity-100"
                    )} />
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full z-50 mt-1 max-h-60 w-full min-w-[200px] overflow-auto rounded-xl border border-surface-200 bg-white p-1 shadow-lg animate-in fade-in zoom-in-95 duration-100">
                    {options.length === 0 ? (
                        <div className="px-2 py-2 text-sm text-ink-500 text-center">No options found.</div>
                    ) : (
                        options.map((option) => {
                            const isSelected = selectedValues.includes(option.id.toString());
                            return (
                                <div
                                    key={option.id}
                                    onClick={() => handleSelect(option.id.toString())}
                                    className={cn(
                                        "flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors hover:bg-surface-50",
                                        isSelected ? "text-brand-700 bg-brand-50/30" : "text-ink-700"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "flex h-4 w-4 items-center justify-center rounded border transition-colors",
                                            isSelected
                                                ? "border-brand-500 bg-brand-500 text-white"
                                                : "border-surface-300 bg-white"
                                        )}
                                    >
                                        {isSelected && <Check className="h-3 w-3" />}
                                    </div>
                                    <span>{option.label}</span>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
}
