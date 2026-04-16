"use client";

import { useTranslations } from "next-intl";

import { Badge } from "@/components/admin/ui/badge";
import { cn } from "@/lib/admin-utils";
import type { Treatment } from "@/lib/reservations";

interface Props {
  treatments: Treatment[];
  max?: number;
  className?: string;
}

export function TreatmentBadges({ treatments, max = 2, className }: Props) {
  const t = useTranslations("Reservations");

  if (!treatments || treatments.length === 0) {
    return <span className="text-muted-foreground">{t("noTreatments")}</span>;
  }

  const visible = treatments.slice(0, max);
  const extra = treatments.length - visible.length;

  return (
    <div className={cn("flex flex-wrap items-center gap-1", className)}>
      {visible.map((tr) => (
        <Badge
          key={tr}
          variant="secondary"
          className="font-normal whitespace-nowrap"
        >
          {t(`treatments.${tr}`)}
        </Badge>
      ))}
      {extra > 0 && (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {t("moreTreatments", { count: extra })}
        </span>
      )}
    </div>
  );
}
