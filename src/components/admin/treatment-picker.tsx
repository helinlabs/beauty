"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/admin/ui/popover";
import { cn } from "@/lib/admin-utils";
import { treatmentOptions, type Treatment } from "@/lib/reservations";

interface Props {
  value: Treatment[];
  onChange: (next: Treatment[]) => void;
  className?: string;
}

export function TreatmentPicker({ value, onChange, className }: Props) {
  const t = useTranslations("Reservations");
  const tDetail = useTranslations("ReservationDetail");
  const [open, setOpen] = useState(false);

  const selected = new Set(value);
  const available = treatmentOptions.filter((o) => !selected.has(o));

  function add(tr: Treatment) {
    // 새로 추가된 시술이 우측에 오도록 끝에 append
    onChange([...value, tr]);
    if (available.length === 1) setOpen(false);
  }

  function remove(tr: Treatment) {
    onChange(value.filter((v) => v !== tr));
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      {value.map((tr) => (
        <span
          key={tr}
          className="inline-flex items-center gap-1.5 rounded-full border border-input bg-transparent px-3 py-1 text-sm font-medium text-foreground hover:bg-muted/50 transition-colors"
        >
          {t(`treatments.${tr}`)}
          <button
            type="button"
            onClick={() => remove(tr)}
            aria-label={t("treatments." + tr)}
            className="inline-flex rounded-full p-0.5 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="size-3" />
          </button>
        </span>
      ))}

      {available.length > 0 && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className={cn(
                "inline-flex items-center gap-1 rounded-full border border-dashed px-3 py-1 text-sm text-muted-foreground transition-colors",
                "hover:border-primary/50 hover:bg-primary/5 hover:text-foreground",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              )}
            >
              {tDetail("addTreatment")}
              <Plus className="size-3.5" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-56 p-1">
            <ul role="listbox" className="max-h-72 overflow-y-auto">
              {available.map((tr) => (
                <li key={tr}>
                  <button
                    type="button"
                    onClick={() => add(tr)}
                    className="w-full rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                  >
                    {t(`treatments.${tr}`)}
                  </button>
                </li>
              ))}
            </ul>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
