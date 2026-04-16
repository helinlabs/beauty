"use client";

import { cn } from "@/lib/admin-utils";

export const ALL_CHIP = "__all__";

export interface ChipOption {
  value: string;
  label: string;
}

interface Props {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ChipOption[];
  allLabel: string;
  className?: string;
}

export function FilterChips({
  label,
  value,
  onChange,
  options,
  allLabel,
  className,
}: Props) {
  return (
    <div
      className={cn("flex items-center gap-2 min-w-0", className)}
      role="radiogroup"
      aria-label={label}
    >
      <span className="shrink-0 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex min-w-0 flex-wrap items-center gap-1.5 overflow-x-auto">
        <Chip
          active={value === ALL_CHIP}
          onClick={() => onChange(ALL_CHIP)}
        >
          {allLabel}
        </Chip>
        {options.map((o) => (
          <Chip
            key={o.value}
            active={value === o.value}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </Chip>
        ))}
      </div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "inline-flex shrink-0 items-center rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
