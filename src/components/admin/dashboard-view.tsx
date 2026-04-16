"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";

import { Badge } from "@/components/admin/ui/badge";
import { Button } from "@/components/admin/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/admin/ui/card";
import { ReservationSheet } from "@/components/admin/reservation-sheet";
import { TreatmentBadges } from "@/components/admin/treatment-badges";
import { cn } from "@/lib/admin-utils";
import { useReservations } from "@/providers/reservations-provider";
import {
  calcCommissionShare,
  calcTotal,
  statusOptions,
  treatmentOptions,
  type Reservation,
  type ReservationStatus,
  type Treatment,
} from "@/lib/reservations";

interface Props {
  locale: string;
  email: string;
}

const STATUS_DOT: Record<ReservationStatus, string> = {
  consultation: "bg-amber-400",
  confirmed: "bg-emerald-500",
  completed: "bg-slate-400",
  cancelled: "bg-rose-400",
};

export function DashboardView({ locale }: Props) {
  const t = useTranslations("Dashboard");
  const tR = useTranslations("Reservations");
  const pageLocale = useLocale();
  const { reservations, referrers } = useReservations();

  const [sheetId, setSheetId] = useState<string | null>(null);

  const krw = useMemo(
    () =>
      new Intl.NumberFormat(pageLocale === "ko" ? "ko-KR" : "en-US", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
      }),
    [pageLocale],
  );

  const pctFormatter = useMemo(
    () =>
      new Intl.NumberFormat(pageLocale === "ko" ? "ko-KR" : "en-US", {
        style: "percent",
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
        signDisplay: "exceptZero",
      }),
    [pageLocale],
  );

  const pctDisplay = useMemo(
    () =>
      new Intl.NumberFormat(pageLocale === "ko" ? "ko-KR" : "en-US", {
        style: "percent",
        minimumFractionDigits: 0,
        maximumFractionDigits: 1,
      }),
    [pageLocale],
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(pageLocale === "ko" ? "ko-KR" : "en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [pageLocale],
  );

  const now = useMemo(() => new Date(), []);
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  // 월별 집계
  const stats = useMemo(() => {
    let monthRevenue = 0;
    let lastMonthRevenue = 0;
    let thisMonthBookings = 0;
    let lastMonthBookings = 0;
    // 전환율 계산용 — 월별
    let thisMonthTotal = 0;
    let thisMonthConverted = 0;
    let lastMonthTotal = 0;
    let lastMonthConverted = 0;
    const statusCounts: Record<ReservationStatus, number> = {
      consultation: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    };
    const recentConsultations: Reservation[] = [];
    let pendingCommission = 0;

    for (const r of reservations) {
      statusCounts[r.status] += 1;

      const d = new Date(r.date);
      const isConverted =
        r.status === "confirmed" || r.status === "completed";

      if (r.status === "consultation") {
        recentConsultations.push(r);
      }

      if (d.getFullYear() === thisYear && d.getMonth() === thisMonth) {
        thisMonthBookings += 1;
        thisMonthTotal += 1;
        if (isConverted) thisMonthConverted += 1;
        if (isConverted) {
          monthRevenue += calcTotal(r.treatments);
        }
      }
      if (
        d.getFullYear() === lastMonthYear &&
        d.getMonth() === lastMonth
      ) {
        lastMonthBookings += 1;
        lastMonthTotal += 1;
        if (isConverted) lastMonthConverted += 1;
        if (isConverted) {
          lastMonthRevenue += calcTotal(r.treatments);
        }
      }

      if (r.status === "completed" && r.referrers.length > 0) {
        for (const name of r.referrers) {
          const transferStatus = r.transferStatuses?.[name] ?? "pending";
          if (transferStatus === "pending") {
            pendingCommission += calcCommissionShare(
              r.treatments,
              r.referrers.length,
            );
          }
        }
      }
    }

    // 최근 생성 순 — createdAt 내림차순 (fallback: date)
    recentConsultations.sort((a, b) => {
      const aTs = new Date(a.createdAt ?? a.date).getTime();
      const bTs = new Date(b.createdAt ?? b.date).getTime();
      return bTs - aTs;
    });

    const thisConversion =
      thisMonthTotal > 0 ? thisMonthConverted / thisMonthTotal : 0;
    const lastConversion =
      lastMonthTotal > 0 ? lastMonthConverted / lastMonthTotal : 0;

    return {
      total: reservations.length,
      recentConsultations,
      monthRevenue,
      lastMonthRevenue,
      thisMonthBookings,
      lastMonthBookings,
      thisConversion,
      lastConversion,
      pendingCommission,
      statusCounts,
    };
  }, [
    reservations,
    now,
    thisYear,
    thisMonth,
    lastMonthYear,
    lastMonth,
  ]);

  // 탑 추천인 — 완료+정산 완료 기준
  const topReferrers = useMemo(() => {
    return referrers
      .map((ref) => {
        const linked = reservations.filter((r) =>
          r.referrers.includes(ref.name),
        );
        let commission = 0;
        for (const r of linked) {
          if (r.status !== "completed") continue;
          const paid = r.transferStatuses?.[ref.name] === "paid";
          if (paid) {
            commission += calcCommissionShare(r.treatments, r.referrers.length);
          }
        }
        return {
          id: ref.id,
          name: ref.name,
          reservationCount: linked.length,
          commission,
        };
      })
      .sort((a, b) => b.commission - a.commission)
      .slice(0, 5);
  }, [referrers, reservations]);

  // 인기 시술 — 예약 확정 + 시술 완료 기준, 5개 제한 없음
  const topTreatments = useMemo(() => {
    const counts = new Map<Treatment, number>();
    for (const t of treatmentOptions) counts.set(t, 0);
    for (const r of reservations) {
      if (r.status !== "confirmed" && r.status !== "completed") continue;
      for (const t of r.treatments) {
        counts.set(t, (counts.get(t) ?? 0) + 1);
      }
    }
    return Array.from(counts.entries())
      .filter(([, n]) => n > 0)
      .sort((a, b) => b[1] - a[1]);
  }, [reservations]);

  const maxTreatmentCount = topTreatments[0]?.[1] ?? 1;

  // 트렌드 계산 — 전월 대비
  const revenueTrend = computeTrend(
    stats.monthRevenue,
    stats.lastMonthRevenue,
  );
  const bookingTrend = computeTrend(
    stats.thisMonthBookings,
    stats.lastMonthBookings,
  );
  const conversionTrend = computeTrend(
    stats.thisConversion,
    stats.lastConversion,
  );

  return (
    <div className="space-y-6">
      {/* KPI 3장 — gradient 배경 + MoM 트렌드 배지 */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label={t("stats.monthRevenue")}
          value={krw.format(stats.monthRevenue)}
          trend={revenueTrend}
          pctFormatter={pctFormatter}
          secondary={t("stats.monthRevenueHint")}
        />
        <StatCard
          label={t("stats.monthBookings")}
          value={String(stats.thisMonthBookings)}
          valueSuffix={t("stats.monthBookingsUnit")}
          trend={bookingTrend}
          pctFormatter={pctFormatter}
          secondary={t("stats.monthBookingsHint")}
        />
        <StatCard
          label={t("stats.conversionRate")}
          value={pctDisplay.format(stats.thisConversion)}
          trend={conversionTrend}
          pctFormatter={pctFormatter}
          secondary={t("stats.conversionRateHint")}
        />
      </section>

      {/* 중단 — 상태 분포 + 다가오는 예약 */}
      <section className="grid gap-4 lg:grid-cols-3">
        {/* 상태 분포 */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>{t("statusBreakdown.heading")}</CardTitle>
            <CardDescription>
              {t("statusBreakdown.total", { count: stats.total })}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {statusOptions.map((s) => {
              const count = stats.statusCounts[s];
              const pct =
                stats.total > 0 ? Math.round((count / stats.total) * 100) : 0;
              return (
                <div key={s} className="space-y-1.5">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <div className="inline-flex items-center gap-2">
                      <span
                        className={cn(
                          "size-1.5 rounded-full",
                          STATUS_DOT[s],
                        )}
                      />
                      <span className="font-medium">{tR(`status.${s}`)}</span>
                    </div>
                    <div className="tabular-nums text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {count}
                      </span>{" "}
                      <span className="text-xs">({pct}%)</span>
                    </div>
                  </div>
                  <div className="h-1 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-[width] duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* 최근 상담 신청 — 클릭 시 sheet */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <CardTitle>{t("recentConsultations.heading")}</CardTitle>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                <Link href={`/${locale}/admin/reservations`}>
                  {t("recentConsultations.viewAll")}
                  <ArrowRight className="ml-1 size-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {stats.recentConsultations.length === 0 ? (
              <p className="rounded-lg border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                {t("recentConsultations.empty")}
              </p>
            ) : (
              <ul className="divide-y">
                {stats.recentConsultations.slice(0, 5).map((r) => (
                  <li key={r.id}>
                    <button
                      type="button"
                      onClick={() => setSheetId(r.id)}
                      className="group -mx-1 grid w-full grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 rounded-lg px-1 py-3 text-left transition-colors hover:bg-muted/50 focus-visible:bg-muted/50 focus-visible:outline-none"
                    >
                      <p className="truncate font-medium">{r.name}</p>
                      <p className="justify-self-end tabular-nums font-medium">
                        {krw.format(calcTotal(r.treatments))}
                      </p>
                      <p className="truncate text-xs tabular-nums text-muted-foreground">
                        {dateFormatter.format(new Date(r.createdAt ?? r.date))}
                      </p>
                      <div className="justify-self-end">
                        <TreatmentBadges treatments={r.treatments} max={2} />
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      {/* 하단 — 탑 추천인 + 인기 시술 */}
      <section className="grid gap-4 lg:grid-cols-2">
        {/* 탑 추천인 */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle>{t("topReferrers.heading")}</CardTitle>
                <CardDescription>
                  {t("topReferrers.subtitle")}
                </CardDescription>
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
              >
                <Link href={`/${locale}/admin/referrers`}>
                  {t("topReferrers.viewAll")}
                  <ArrowRight className="ml-1 size-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            {topReferrers.length === 0 ? (
              <p className="rounded-lg border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                {t("topReferrers.empty")}
              </p>
            ) : (
              <ol className="space-y-2">
                {topReferrers.map((r, idx) => (
                  <li key={r.id}>
                    <Link
                      href={`/${locale}/admin/referrers/${r.id}`}
                      className="group -mx-1 flex items-center gap-3 rounded-lg px-1 py-2 transition-colors hover:bg-muted/50"
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                        {idx + 1}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate font-medium">{r.name}</p>
                        <p className="text-xs text-muted-foreground tabular-nums">
                          {t("topReferrers.reservationCount", {
                            count: r.reservationCount,
                          })}
                        </p>
                      </div>
                      <p className="shrink-0 font-semibold tabular-nums text-primary">
                        {krw.format(r.commission)}
                      </p>
                    </Link>
                  </li>
                ))}
              </ol>
            )}
          </CardContent>
        </Card>

        {/* 인기 시술 */}
        <Card>
          <CardHeader>
            <CardTitle>{t("treatments.heading")}</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {topTreatments.length === 0 ? (
              <p className="rounded-lg border border-dashed bg-muted/30 p-6 text-center text-sm text-muted-foreground">
                {t("treatments.empty")}
              </p>
            ) : (
              <ul className="space-y-3">
                {topTreatments.map(([treatment, count]) => {
                  const pct = Math.round((count / maxTreatmentCount) * 100);
                  return (
                    <li key={treatment} className="space-y-1">
                      <div className="flex items-center justify-between gap-2 text-sm">
                        <span className="font-medium">
                          {tR(`treatments.${treatment}`)}
                        </span>
                        <span className="tabular-nums text-muted-foreground">
                          <span className="font-semibold text-foreground">
                            {count}
                          </span>{" "}
                          {t("treatments.countUnit")}
                        </span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-[width] duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </CardContent>
        </Card>
      </section>

      {/* 예약 상세 sheet — 대시보드 컨텍스트에서 열림 */}
      {sheetId && (
        <ReservationSheet
          id={sheetId}
          locale={locale}
          onClose={() => setSheetId(null)}
        />
      )}
    </div>
  );
}

interface Trend {
  sign: "up" | "down" | "flat";
  pct: number;
}

function computeTrend(current: number, previous: number): Trend | null {
  if (previous <= 0) return null;
  const delta = (current - previous) / previous;
  if (Math.abs(delta) < 0.001) return { sign: "flat", pct: 0 };
  return { sign: delta > 0 ? "up" : "down", pct: delta };
}

function StatCard({
  label,
  value,
  valueSuffix,
  trend,
  pctFormatter,
  secondary,
}: {
  label: string;
  value: string;
  valueSuffix?: string;
  trend?: Trend | null;
  pctFormatter?: Intl.NumberFormat;
  secondary?: string;
}) {
  const TrendIcon =
    trend?.sign === "up"
      ? TrendingUp
      : trend?.sign === "down"
        ? TrendingDown
        : null;

  return (
    <Card className="gap-6 bg-gradient-to-t from-stone-200/60 to-card dark:from-stone-800/40 dark:to-card">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="font-heading text-2xl font-semibold tracking-tight tabular-nums sm:text-3xl">
          {value}
          {valueSuffix ? (
            <span className="ml-0.5 text-base font-medium text-muted-foreground">
              {valueSuffix}
            </span>
          ) : null}
        </CardTitle>
        {trend && pctFormatter ? (
          <CardAction>
            <Badge variant="outline" className="gap-1 tabular-nums">
              {TrendIcon ? <TrendIcon className="size-3" /> : null}
              {pctFormatter.format(trend.pct)}
            </Badge>
          </CardAction>
        ) : null}
      </CardHeader>
      {secondary ? (
        <CardContent>
          <div className="text-xs text-muted-foreground">{secondary}</div>
        </CardContent>
      ) : null}
    </Card>
  );
}
