"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";

import { cn } from "@/lib/admin-utils";
import { useReservations } from "@/providers/reservations-provider";
import { STATUS_EVENT_BG } from "@/lib/status-colors";
import type { Reservation } from "@/lib/reservations";

const MAX_EVENTS_VISIBLE = 3;

function ymd(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

interface Props {
  /** 4자리 연도 */
  year: number;
  /** 0-11 */
  month: number;
  onOpenDetail: (id: string) => void;
  onOpenNew: (date: string) => void;
}

export function CalendarView({
  year,
  month,
  onOpenDetail,
  onOpenNew,
}: Props) {
  const t = useTranslations("Calendar");
  const tR = useTranslations("Reservations");
  const locale = useLocale();
  const { reservations } = useReservations();

  const today = useMemo(() => new Date(), []);

  const firstOfMonth = new Date(year, month, 1);
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(firstOfMonth.getDate() - firstOfMonth.getDay());

  const days = useMemo(() => {
    const arr: Date[] = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, [gridStart]);

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

  const todayKey = ymd(today);

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      <div className="grid grid-cols-7 border-b bg-muted/50 text-xs font-medium text-muted-foreground">
        {weekdays.map((w, i) => (
          <div
            key={w}
            className={cn(
              "px-2 py-2 text-center",
              i === 0 && "text-red-500",
              i === 6 && "text-sky-500",
            )}
          >
            {t(`weekdays.${w}`)}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-[minmax(7rem,1fr)]">
        {days.map((d, idx) => {
          const key = ymd(d);
          const inMonth = d.getMonth() === month;
          const isToday = key === todayKey;
          const events = byDate.get(key) ?? [];
          const visible = events.slice(0, MAX_EVENTS_VISIBLE);
          const extra = events.length - visible.length;
          const dow = d.getDay();

          return (
            <button
              key={idx}
              type="button"
              onClick={() => onOpenNew(key)}
              className={cn(
                "flex min-h-0 flex-col items-stretch gap-1 border-b border-r p-1.5 text-left text-xs transition-colors hover:bg-muted/60 focus:outline-none focus-visible:bg-muted/60 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring",
                idx % 7 === 6 && "border-r-0",
                idx >= 35 && "border-b-0",
                !inMonth && "bg-muted/30 text-muted-foreground/60",
              )}
              aria-label={`${key} — ${t("addOnDate")}`}
            >
              <div
                className={cn(
                  "mb-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium tabular-nums",
                  isToday && "bg-primary text-primary-foreground",
                  !isToday && dow === 0 && inMonth && "text-red-500",
                  !isToday && dow === 6 && inMonth && "text-sky-500",
                )}
              >
                {d.getDate()}
              </div>

              <div className="flex min-h-0 flex-col gap-0.5">
                {visible.map((r) => (
                  <span
                    key={r.id}
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDetail(r.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        e.stopPropagation();
                        onOpenDetail(r.id);
                      }
                    }}
                    title={`${r.name} · ${tR(`status.${r.status}`)}`}
                    className={cn(
                      "group flex items-center gap-1 overflow-hidden rounded px-1.5 py-0.5 text-left text-xs transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      STATUS_EVENT_BG[r.status],
                    )}
                  >
                    <span className="truncate tabular-nums opacity-70">
                      {timeFormatter.format(new Date(r.date))}
                    </span>
                    <span className="truncate font-medium">{r.name}</span>
                  </span>
                ))}
                {extra > 0 && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (events[MAX_EVENTS_VISIBLE]) {
                        onOpenDetail(events[MAX_EVENTS_VISIBLE].id);
                      }
                    }}
                    className="rounded px-1.5 py-0.5 text-left text-xs text-muted-foreground hover:bg-muted"
                  >
                    {t("moreEvents", { count: extra })}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
