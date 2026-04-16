"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowDownNarrowWide,
  ArrowUpDown,
  ArrowUpNarrowWide,
  Clock,
  Search,
  Users,
} from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import { CopyUrlButton } from "@/components/admin/copy-url-button";
import { calcCommissionShare, slugify } from "@/lib/reservations";
import { useReservations } from "@/providers/reservations-provider";
import { cn } from "@/lib/admin-utils";

type SortKey = "count" | "commission" | "pending";
type SortDir = "asc" | "desc";

interface RowData {
  id: string;
  name: string;
  slug: string;
  reservationCount: number;
  pendingCount: number;
  commission: number;
}

export function ReferrersList() {
  const t = useTranslations("Referrers");
  const locale = useLocale();
  const router = useRouter();
  const { reservations, referrers } = useReservations();

  const [query, setQuery] = useState("");
  const [pendingOnly, setPendingOnly] = useState(false);
  // 기본 정렬 없음 — 최근 생성된 추천인을 위로 (provider 의 referrers 배열 끝이 최신)
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const stats: RowData[] = useMemo(() => {
    // 최근 생성된 추천인을 위로 — provider 배열 역순
    return [...referrers].reverse().map((r) => {
      const linked = reservations.filter((res) =>
        res.referrers.includes(r.name),
      );
      // 누적 정산 — 시술완료 + 정산 완료된 것만 합산
      let commission = 0;
      let pendingCount = 0;
      for (const res of linked) {
        if (res.status !== "completed") continue;
        const share = calcCommissionShare(
          res.treatments,
          res.referrers.length,
        );
        const transfer =
          res.transferStatuses?.[r.name] === "paid" ? "paid" : "pending";
        if (transfer === "paid") commission += share;
        else pendingCount += 1;
      }
      return {
        id: r.id,
        name: r.name,
        slug: r.slug?.trim() || slugify(r.name),
        reservationCount: linked.length,
        pendingCount,
        commission,
      };
    });
  }, [reservations, referrers]);

  const filteredSorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = stats.filter((s) => {
      if (pendingOnly && s.pendingCount === 0) return false;
      return q ? s.name.toLowerCase().includes(q) : true;
    });
    // 사용자가 컬럼을 클릭해서 정렬 키를 지정한 경우만 정렬
    if (!sortKey) return filtered;
    const sorted = [...filtered].sort((a, b) => {
      const aV =
        sortKey === "count"
          ? a.reservationCount
          : sortKey === "pending"
            ? a.pendingCount
            : a.commission;
      const bV =
        sortKey === "count"
          ? b.reservationCount
          : sortKey === "pending"
            ? b.pendingCount
            : b.commission;
      return sortDir === "asc" ? aV - bV : bV - aV;
    });
    return sorted;
  }, [stats, query, pendingOnly, sortKey, sortDir]);

  const krw = useMemo(
    () =>
      new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-US", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
      }),
    [locale],
  );

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
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

  function buildShareUrl(slug: string) {
    const origin =
      typeof window !== "undefined"
        ? window.location.origin
        : "https://clinic.example.com";
    return `${origin}/r/${slug}`;
  }

  function openDetail(id: string) {
    router.push(`/${locale}/admin/referrers/${id}`);
  }

  function onRowKey(e: React.KeyboardEvent, id: string) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openDetail(id);
    }
  }

  return (
    <div className="space-y-4">
      {/* 검색 + 정산 대기 필터 */}
      <div className="flex items-center gap-2">
        <div className="relative max-w-md flex-1">
          <Label htmlFor="referrer-search" className="sr-only">
            {t("search.placeholder")}
          </Label>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="referrer-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            className="h-9 pl-9"
          />
        </div>
        <Button
          type="button"
          variant={pendingOnly ? "default" : "outline"}
          size="sm"
          onClick={() => setPendingOnly((v) => !v)}
          aria-pressed={pendingOnly}
          className="h-9 gap-1.5"
        >
          <Clock className="size-4" />
          {t("pendingFilter")}
        </Button>
      </div>

      {filteredSorted.length === 0 ? (
        <div className="rounded-lg border bg-card p-10 text-center text-sm text-muted-foreground">
          <Users className="mx-auto mb-2 size-6 opacity-50" />
          {t("empty")}
        </div>
      ) : (
        <>
          {/* 데스크톱 테이블 */}
          <div className="hidden md:block rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("columns.name")}</TableHead>
                  <TableHead className="text-right">
                    <SortButton
                      label={t("columns.count")}
                      active={sortKey === "count"}
                      icon={sortIcon("count")}
                      onClick={() => toggleSort("count")}
                    />
                  </TableHead>
                  <TableHead className="text-right">
                    <SortButton
                      label={t("columns.pending")}
                      active={sortKey === "pending"}
                      icon={sortIcon("pending")}
                      onClick={() => toggleSort("pending")}
                    />
                  </TableHead>
                  <TableHead className="pr-10 text-right">
                    <SortButton
                      label={t("columns.commission")}
                      active={sortKey === "commission"}
                      icon={sortIcon("commission")}
                      onClick={() => toggleSort("commission")}
                    />
                  </TableHead>
                  <TableHead className="pl-6">{t("columns.url")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSorted.map((s) => {
                  const url = buildShareUrl(s.slug);
                  return (
                    <TableRow
                      key={s.id}
                      onClick={() => openDetail(s.id)}
                      onKeyDown={(e) => onRowKey(e, s.id)}
                      tabIndex={0}
                      role="link"
                      className="cursor-pointer focus:outline-none focus:bg-muted/60"
                    >
                      <TableCell className="font-medium">
                        {s.name}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {t("countFormat", { count: s.reservationCount })}
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {s.pendingCount > 0 ? (
                          t("pendingFormat", { count: s.pendingCount })
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell className="pr-10 text-right tabular-nums font-semibold text-primary">
                        {krw.format(s.commission)}
                      </TableCell>
                      <TableCell
                        onClick={(e) => e.stopPropagation()}
                        onKeyDown={(e) => e.stopPropagation()}
                        className="pl-6"
                      >
                        <CopyUrlButton
                          url={url}
                          copyLabel={t("copyUrl")}
                          copiedLabel={t("copied")}
                          iconOnly
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          {/* 모바일 카드 */}
          <div className="md:hidden space-y-3">
            {filteredSorted.map((s) => {
              const url = buildShareUrl(s.slug);
              return (
                <article
                  key={s.id}
                  onClick={() => openDetail(s.id)}
                  onKeyDown={(e) => onRowKey(e, s.id)}
                  tabIndex={0}
                  role="link"
                  className="cursor-pointer rounded-lg border bg-card p-4 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <header className="flex items-baseline justify-between gap-3">
                    <h3 className="font-medium truncate">{s.name}</h3>
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {t("countFormat", { count: s.reservationCount })}
                    </span>
                  </header>
                  <div className="mt-1 flex items-baseline justify-between gap-3">
                    <p className="text-sm font-semibold tabular-nums text-primary">
                      {krw.format(s.commission)}
                    </p>
                    {s.pendingCount > 0 && (
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {t("columns.pending")} {t("pendingFormat", { count: s.pendingCount })}
                      </span>
                    )}
                  </div>
                  <div
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    className="mt-3 flex justify-end"
                  >
                    <CopyUrlButton
                      url={url}
                      copyLabel={t("copyUrl")}
                      copiedLabel={t("copied")}
                    />
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function SortButton({
  label,
  active,
  icon,
  onClick,
}: {
  label: string;
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "ml-auto inline-flex items-center gap-1 text-sm font-medium hover:text-foreground",
        active ? "text-foreground" : "text-muted-foreground",
      )}
    >
      {label}
      {icon}
    </button>
  );
}
