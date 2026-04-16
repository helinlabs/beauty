"use client";

import { useTranslations } from "next-intl";

import { useReservations } from "@/providers/reservations-provider";

export function ReservationsCount() {
  const t = useTranslations("Reservations");
  const { reservations } = useReservations();
  return <>{t("subtitle", { count: reservations.length })}</>;
}
