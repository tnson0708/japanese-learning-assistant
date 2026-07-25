"use client";

import { cn } from "@/lib/utils";

export function OptionGroup<T extends string | number>({
  options,
  value,
  onChange,
  className,
  buttonClassName,
  size = "md",
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
  buttonClassName?: string;
  size?: "sm" | "md";
}) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {options.map((opt) => (
        <button
          key={String(opt.value)}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-full border shrink-0 font-medium transition-colors",
            size === "sm" ? "px-3 py-1 text-xs" : "px-4 py-2 text-sm",
            value === opt.value
              ? "border-primary bg-primary text-primary-foreground"
              : "hover:bg-accent text-muted-foreground hover:text-foreground",
            buttonClassName
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}


