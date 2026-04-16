"use client";

import { useTranslations } from "next-intl";

import { useReservations } from "@/providers/reservations-provider";

export function ReferrersTitle() {
  const t = useTranslations("Referrers");
  const { referrers } = useReservations();

  return (
    <div className="flex items-baseline gap-3">
      <h1 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight leading-none">
        {t("title")}
      </h1>
      <span className="font-sans text-sm text-muted-foreground tabular-nums">
        {t("countLabel", { count: referrers.length })}
      </span>
    </div>
  );
}
