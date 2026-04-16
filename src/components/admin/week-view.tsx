"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { cn } from "@/lib/admin-utils";
import { useReservations } from "@/providers/reservations-provider";
import { STATUS_EVENT_BG } from "@/lib/status-colors";
import type { Reservation } from "@/lib/reservations";

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function startOfWeek(d: Date) {
  const copy = new Date(d);
  copy.setDate(copy.getDate() - copy.getDay()); // Sunday-start
  copy.setHours(0, 0, 0, 0);
  return copy;
}

export function WeekView() {
  const t = useTranslations("Calendar");
  const tR = useTranslations("Reservations");
  const router = useRouter();
  const locale = useLocale();
  const { reservations } = useReservations();

  const today = useMemo(() => new Date(), []);
  const [anchor, setAnchor] = useState(() => startOfWeek(today));

  const days = useMemo(() => {
    const arr: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(anchor);
      d.setDate(anchor.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [anchor]);

  const byDate = useMemo(() => {
    const map = new Map<string, Reservation[]>();
    for (const r of reservations) {
      const key = r.date.slice(0, 10);
      const list = map.get(key) ?? [];
      list.push(r);
      map.set(key, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => a.date.localeCompare(b.date));
    }
    return map;
  }, [reservations]);

  const weekdays: Array<"sun" | "mon" | "tue" | "wed" | "thu" | "fri" | "sat"> =
    ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [locale],
  );

  const rangeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
        month: "short",
        day: "numeric",
      }),
    [locale],
  );

  function prev() {
    const d = new Date(anchor);
    d.setDate(d.getDate() - 7);
    setAnchor(d);
  }
  function next() {
    const d = new Date(anchor);
    d.setDate(d.getDate() + 7);
    setAnchor(d);
  }
  function goToday() {
    setAnchor(startOfWeek(today));
  }

  function openDetail(id: string) {
    router.push(`/${locale}/admin/reservations/${id}`);
  }

  const todayKey = ymd(today);
  const rangeLabel = `${rangeFormatter.format(days[0])} – ${rangeFormatter.format(days[6])}`;

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={prev}
            aria-label={t("previousWeek")}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={next}
            aria-label={t("nextWeek")}
          >
            <ChevronRight className="size-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={goToday}>
            {t("today")}
          </Button>
        </div>
        <h2 className="font-heading text-lg sm:text-xl font-semibold tracking-tight tabular-nums">
          {rangeLabel}
        </h2>
        <div className="hidden sm:block w-[164px]" aria-hidden="true" />
      </header>

      <div className="overflow-hidden rounded-lg border bg-card">
        <div className="grid grid-cols-7 border-b bg-muted/50 text-xs font-medium text-muted-foreground">
          {days.map((d, i) => {
            const isToday = ymd(d) === todayKey;
            return (
              <div
                key={i}
                className={cn(
                  "flex flex-col items-center gap-0.5 border-r px-2 py-2 last:border-r-0",
                  i === 0 && "text-red-500",
                  i === 6 && "text-sky-500",
                )}
              >
                <span>{t(`weekdays.${weekdays[i]}`)}</span>
                <span
                  className={cn(
                    "inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium tabular-nums",
                    isToday && "bg-primary text-primary-foreground",
                    !isToday && i === 0 && "text-red-500",
                    !isToday && i === 6 && "text-sky-500",
                    !isToday && i !== 0 && i !== 6 && "text-foreground",
                  )}
                >
                  {d.getDate()}
                </span>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-7 min-h-[24rem]">
          {days.map((d, i) => {
            const key = ymd(d);
            const events = byDate.get(key) ?? [];
            return (
              <div
                key={i}
                className={cn(
                  "flex min-h-0 flex-col gap-1 border-r p-2 last:border-r-0",
                )}
              >
                {events.length === 0 ? (
                  <p className="mt-2 text-center text-[11px] text-muted-foreground/60">
                    &nbsp;
                  </p>
                ) : (
                  events.map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => openDetail(r.id)}
                      title={`${r.name} · ${tR(`status.${r.status}`)}`}
                      className={cn(
                        "flex flex-col items-start overflow-hidden rounded-md px-2 py-1.5 text-left text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        STATUS_EVENT_BG[r.status],
                      )}
                    >
                      <span className="tabular-nums opacity-70">
                        {timeFormatter.format(new Date(r.date))}
                      </span>
                      <span className="truncate font-medium w-full">
                        {r.name}
                      </span>
                    </button>
                  ))
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
