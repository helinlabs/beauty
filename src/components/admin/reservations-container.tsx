"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { ReservationsTable } from "@/components/admin/reservations-table";
import { CalendarView } from "@/components/admin/calendar-view";
import { ReservationSheet } from "@/components/admin/reservation-sheet";
import { NewReservationSheet } from "@/components/admin/new-reservation-sheet";
import { useReservationsNav } from "@/lib/use-reservations-nav";
import { useReservations } from "@/providers/reservations-provider";

interface Props {
  locale: string;
}

export function ReservationsContainer({ locale }: Props) {
  const t = useTranslations("Calendar");
  const tR = useTranslations("Reservations");
  const pageLocale = useLocale();
  const {
    view,
    detailId,
    newOpen,
    initialDate,
    openDetail,
    openNew,
    close,
  } = useReservationsNav();

  const { reservations } = useReservations();
  const totalCount = reservations.length;

  const today = useMemo(() => new Date(), []);
  const [monthAnchor, setMonthAnchor] = useState<{
    year: number;
    month: number;
  }>({ year: today.getFullYear(), month: today.getMonth() });

  const monthCount = useMemo(() => {
    return reservations.filter((r) => {
      const d = new Date(r.date);
      return (
        d.getFullYear() === monthAnchor.year &&
        d.getMonth() === monthAnchor.month
      );
    }).length;
  }, [reservations, monthAnchor]);

  function prevMonth() {
    setMonthAnchor(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 },
    );
  }
  function nextMonth() {
    setMonthAnchor(({ year, month }) =>
      month === 11
        ? { year: year + 1, month: 0 }
        : { year, month: month + 1 },
    );
  }

  const monthFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(pageLocale === "ko" ? "ko-KR" : "en-US", {
        month: "long",
      }),
    [pageLocale],
  );
  const monthYearLabel = t("monthYear", {
    year: monthAnchor.year,
    month:
      pageLocale === "ko"
        ? monthAnchor.month + 1
        : monthFormatter.format(new Date(monthAnchor.year, monthAnchor.month)),
  });

  return (
    <div className="space-y-5">
      {/* 타이틀 — h-14 (56px). 탭은 헤더에 있음 */}
      <div className="flex h-14 items-center gap-3">
        {view === "list" ? (
          <div className="flex items-baseline gap-3">
            <h1 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight leading-none">
              {tR("title")}
            </h1>
            <span className="font-sans text-sm text-muted-foreground tabular-nums">
              {tR("countLabel", { count: totalCount })}
            </span>
          </div>
        ) : (
          <div className="flex items-baseline gap-3">
            <div className="flex items-center gap-1 self-center">
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={prevMonth}
                aria-label={t("previousMonth")}
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                onClick={nextMonth}
                aria-label={t("nextMonth")}
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-semibold tracking-tight tabular-nums leading-none">
              {monthYearLabel}
            </h1>
            <span className="font-sans text-sm text-muted-foreground tabular-nums">
              {tR("countLabel", { count: monthCount })}
            </span>
          </div>
        )}
      </div>

      {/* 뷰 내용 */}
      {view === "list" && <ReservationsTable onOpenDetail={openDetail} />}
      {view === "month" && (
        <CalendarView
          year={monthAnchor.year}
          month={monthAnchor.month}
          onOpenDetail={openDetail}
          onOpenNew={openNew}
        />
      )}

      {/* 슬라이드 오버 */}
      {detailId && (
        <ReservationSheet id={detailId} locale={locale} onClose={close} />
      )}
      {newOpen && (
        <NewReservationSheet
          locale={locale}
          onClose={close}
          initialDate={initialDate}
        />
      )}
    </div>
  );
}
