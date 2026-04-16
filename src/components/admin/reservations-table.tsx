"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowDownNarrowWide,
  ArrowUpDown,
  ArrowUpNarrowWide,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";

import { Input } from "@/components/admin/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import { cn } from "@/lib/admin-utils";
import { Label } from "@/components/admin/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import { Button } from "@/components/admin/ui/button";
import { StatusBadge } from "@/components/admin/status-badge";
import { TreatmentBadges } from "@/components/admin/treatment-badges";
import {
  ALL_FILTER,
  FilterPopoverMulti,
  FilterPopoverSearch,
} from "@/components/admin/filter-popover";
import {
  calcTotal,
  statusOptions,
  treatmentOptions,
  uniqueReferrers,
  type ReservationStatus,
  type Treatment,
} from "@/lib/reservations";
import { useReservations } from "@/providers/reservations-provider";

const PAGE_SIZES = [50, 100];

type SortKey = "date" | "total";
type SortDir = "asc" | "desc";

interface Props {
  onOpenDetail: (id: string) => void;
}

export function ReservationsTable({ onOpenDetail }: Props) {
  const t = useTranslations("Reservations");
  const locale = useLocale();
  const { reservations, update } = useReservations();

  const [query, setQuery] = useState("");
  const [statuses, setStatuses] = useState<string[]>([]);
  const [treatments, setTreatments] = useState<string[]>([]);
  const [referrer, setReferrer] = useState<string>(ALL_FILTER);
  const [pageSize, setPageSize] = useState<number>(PAGE_SIZES[0]);
  const [page, setPage] = useState(1);
  // 사용자가 컬럼 헤더 클릭해서 지정한 정렬 — null 이면 기본 정렬(id desc = 최근 생성 순)
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const referrers = useMemo(
    () => uniqueReferrers(reservations),
    [reservations],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = reservations.filter((r) => {
      if (statuses.length > 0 && !statuses.includes(r.status)) return false;
      if (
        treatments.length > 0 &&
        !r.treatments.some((t) => treatments.includes(t))
      )
        return false;
      if (referrer !== ALL_FILTER && !r.referrers.includes(referrer))
        return false;
      if (!q) return true;
      return r.name.toLowerCase().includes(q);
    });
    const sorted = [...list];
    if (sortKey === "date") {
      sorted.sort((a, b) => {
        const aTs = new Date(a.date).getTime();
        const bTs = new Date(b.date).getTime();
        return sortDir === "asc" ? aTs - bTs : bTs - aTs;
      });
    } else if (sortKey === "total") {
      sorted.sort((a, b) => {
        const aV = calcTotal(a.treatments);
        const bV = calcTotal(b.treatments);
        return sortDir === "asc" ? aV - bV : bV - aV;
      });
    } else {
      // 기본 — 최근 생성 순 (createdAt 내림차순, fallback date)
      sorted.sort((a, b) => {
        const aTs = new Date(a.createdAt ?? a.date).getTime();
        const bTs = new Date(b.createdAt ?? b.date).getTime();
        return bTs - aTs;
      });
    }
    return sorted;
  }, [reservations, query, statuses, treatments, referrer, sortKey, sortDir]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = total === 0 ? 0 : (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const pageRows = filtered.slice(start, end);

  function resetToFirstPage() {
    setPage(1);
  }

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
    resetToFirstPage();
  }

  function sortIcon(key: SortKey) {
    if (sortKey !== key) {
      return <ArrowUpDown className="size-3.5 opacity-50" />;
    }
    return sortDir === "asc" ? (
      <ArrowUpNarrowWide className="size-3.5" />
    ) : (
      <ArrowDownNarrowWide className="size-3.5" />
    );
  }

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "ko" ? "ko-KR" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [locale],
  );

  function go(id: string) {
    onOpenDetail(id);
  }

  function onRowKey(e: React.KeyboardEvent, id: string) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      go(id);
    }
  }

  const statusOpts = statusOptions.map((s) => ({
    value: s,
    label: t(`status.${s}`),
  }));
  const treatmentOpts = treatmentOptions.map((tr) => ({
    value: tr,
    label: t(`treatments.${tr}`),
  }));
  const referrerOpts = referrers.map((r) => ({ value: r, label: r }));

  return (
    <div className="space-y-4">
      {/* 검색창 + 인라인 필터 버튼 (한 줄) */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative min-w-0 flex-1 max-w-md">
          <Label htmlFor="reservation-search" className="sr-only">
            {t("search.placeholder")}
          </Label>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="reservation-search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetToFirstPage();
            }}
            placeholder={t("search.placeholder")}
            className="h-9 pl-9"
          />
        </div>

        <FilterPopoverMulti
          label={t("filter.status")}
          values={statuses}
          onChange={(v) => {
            setStatuses(v);
            resetToFirstPage();
          }}
          options={statusOpts}
        />
        <FilterPopoverMulti
          label={t("filter.treatment")}
          values={treatments}
          onChange={(v) => {
            setTreatments(v);
            resetToFirstPage();
          }}
          options={treatmentOpts}
        />
        <FilterPopoverSearch
          label={t("filter.referrer")}
          value={referrer}
          onChange={(v) => {
            setReferrer(v);
            resetToFirstPage();
          }}
          options={referrerOpts}
          allLabel={t("filter.all")}
          searchPlaceholder={t("filter.searchReferrer")}
          emptyLabel={t("filter.referrerEmpty")}
        />
      </div>

      {/* 데스크톱 테이블 — 총 견적 컬럼 제거 */}
      <div className="hidden md:block rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("columns.status")}</TableHead>
              <TableHead>{t("columns.name")}</TableHead>
              <TableHead>
                <SortButton
                  label={t("columns.date")}
                  active={sortKey === "date"}
                  icon={sortIcon("date")}
                  onClick={() => toggleSort("date")}
                />
              </TableHead>
              <TableHead>{t("columns.treatments")}</TableHead>
              <TableHead className="text-right">
                <SortButton
                  label={t("columns.total")}
                  active={sortKey === "total"}
                  icon={sortIcon("total")}
                  onClick={() => toggleSort("total")}
                  alignEnd
                />
              </TableHead>
              <TableHead>{t("columns.notes")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pageRows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  {t("empty")}
                </TableCell>
              </TableRow>
            ) : (
              pageRows.map((r) => (
                <TableRow
                  key={r.id}
                  onClick={() => go(r.id)}
                  onKeyDown={(e) => onRowKey(e, r.id)}
                  tabIndex={0}
                  role="link"
                  aria-label={`${r.name} — ${t("view")}`}
                  className="cursor-pointer focus:outline-none focus:bg-muted/60"
                >
                  <TableCell
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="w-[130px]"
                  >
                    <Select
                      value={r.status}
                      onValueChange={(v) =>
                        update(r.id, { status: v as ReservationStatus })
                      }
                    >
                      <SelectTrigger
                        size="sm"
                        aria-label={t("columns.status")}
                        className="h-8 w-auto gap-0 border-none bg-transparent p-0 shadow-none hover:bg-muted focus-visible:ring-0 [&>svg]:hidden"
                      >
                        <SelectValue>
                          <StatusBadge
                            status={r.status}
                            label={t(`status.${r.status}`)}
                          />
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {t(`status.${s}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="font-medium whitespace-nowrap">
                    {r.name}
                  </TableCell>
                  <TableCell className="whitespace-nowrap tabular-nums">
                    {dateFormatter.format(new Date(r.date))}
                  </TableCell>
                  <TableCell>
                    <TreatmentBadges treatments={r.treatments} max={2} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap text-right tabular-nums font-medium">
                    {new Intl.NumberFormat(
                      locale === "ko" ? "ko-KR" : "en-US",
                      {
                        style: "currency",
                        currency: "KRW",
                        maximumFractionDigits: 0,
                      },
                    ).format(calcTotal(r.treatments))}
                  </TableCell>
                  <TableCell className="max-w-[28ch] truncate text-muted-foreground">
                    {r.notes ?? t("noNotes")}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 모바일 카드 리스트 */}
      <div className="md:hidden space-y-3">
        {pageRows.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center text-muted-foreground">
            {t("empty")}
          </div>
        ) : (
          pageRows.map((r) => (
            <article
              key={r.id}
              onClick={() => go(r.id)}
              onKeyDown={(e) => onRowKey(e, r.id)}
              tabIndex={0}
              role="link"
              aria-label={`${r.name} — ${t("view")}`}
              className="cursor-pointer rounded-lg border bg-card p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <div className="flex items-start justify-between gap-3">
                <div
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  className="shrink-0"
                >
                  <Select
                    value={r.status}
                    onValueChange={(v) =>
                      update(r.id, { status: v as ReservationStatus })
                    }
                  >
                    <SelectTrigger
                      size="sm"
                      aria-label={t("columns.status")}
                      className="h-7 gap-0 border-none bg-transparent p-0 shadow-none hover:bg-muted focus-visible:ring-0 [&>svg]:hidden"
                    >
                      <SelectValue>
                        <StatusBadge
                          status={r.status}
                          label={t(`status.${r.status}`)}
                        />
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((s) => (
                        <SelectItem key={s} value={s}>
                          {t(`status.${s}`)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="min-w-0 text-right">
                  <h3 className="font-medium truncate">{r.name}</h3>
                  <p className="text-sm font-medium tabular-nums">
                    {new Intl.NumberFormat(
                      locale === "ko" ? "ko-KR" : "en-US",
                      {
                        style: "currency",
                        currency: "KRW",
                        maximumFractionDigits: 0,
                      },
                    ).format(calcTotal(r.treatments))}
                  </p>
                </div>
              </div>
              <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
                <dt className="text-muted-foreground">{t("columns.date")}</dt>
                <dd className="tabular-nums">
                  {dateFormatter.format(new Date(r.date))}
                </dd>

                <dt className="text-muted-foreground">
                  {t("columns.treatments")}
                </dt>
                <dd>
                  <TreatmentBadges treatments={r.treatments} max={3} />
                </dd>

                <dt className="text-muted-foreground">{t("columns.notes")}</dt>
                <dd className="truncate">{r.notes ?? t("noNotes")}</dd>
              </dl>
            </article>
          ))
        )}
      </div>

      {/* 페이지네이션 */}
      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>
            {t("pagination.showing", {
              start: total === 0 ? 0 : start + 1,
              end,
              total,
            })}
          </span>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline">
              {t("pagination.rowsPerPage")}
            </span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v));
                resetToFirstPage();
              }}
            >
              <SelectTrigger
                size="sm"
                className="h-8 w-[70px]"
                aria-label={t("pagination.rowsPerPage")}
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZES.map((n) => (
                  <SelectItem key={n} value={String(n)}>
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2">
          <span className="text-sm text-muted-foreground tabular-nums">
            {t("pagination.page", {
              page: currentPage,
              total: totalPages,
            })}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage <= 1}
            aria-label={t("pagination.previous")}
          >
            <ChevronLeft className="size-4" />
            <span className="hidden sm:inline ml-1">
              {t("pagination.previous")}
            </span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage >= totalPages}
            aria-label={t("pagination.next")}
          >
            <span className="hidden sm:inline mr-1">
              {t("pagination.next")}
            </span>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function SortButton({
  label,
  active,
  icon,
  onClick,
  alignEnd,
}: {
  label: string;
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
  alignEnd?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 text-sm font-medium hover:text-foreground",
        alignEnd ? "ml-auto" : undefined,
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {label}
      {icon}
    </button>
  );
}
