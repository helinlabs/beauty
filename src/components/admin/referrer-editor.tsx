"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Check, ChevronDown, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/admin/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/admin/ui/collapsible";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import { Separator } from "@/components/admin/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/admin/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import { StatusBadge } from "@/components/admin/status-badge";
import { CopyUrlButton } from "@/components/admin/copy-url-button";
import { WhatsAppButton } from "@/components/admin/whatsapp-button";
import { cn } from "@/lib/admin-utils";
import { useReservations } from "@/providers/reservations-provider";
import {
  calcCommissionShare,
  calcTotal,
  slugify,
  statusOptions,
  type Referrer,
  type ReferrerBankInfo,
  type ReservationStatus,
  type TransferStatus,
} from "@/lib/reservations";

export const REFERRER_FORM_ID = "referrer-edit-form";

interface Props {
  id: string;
  locale: string;
  inSheet?: boolean;
  onSaved?: () => void;
  onDeleted?: () => void;
  /** 예약 행 클릭 시 호출 — sheet wrapper 에서 중첩 sheet 열 때 사용 */
  onOpenReservation?: (reservationId: string) => void;
}

export function ReferrerEditor({
  id,
  locale,
  inSheet = false,
  onSaved,
  onDeleted,
  onOpenReservation,
}: Props) {
  const t = useTranslations("ReferrerDetail");
  const tBank = useTranslations("ReferrerDetail.bank");
  const tR = useTranslations("Reservations");
  const router = useRouter();
  const pageLocale = useLocale();
  const {
    getReferrerById,
    updateReferrer,
    removeReferrer,
    reservations,
    update: updateReservation,
  } = useReservations();

  const referrer = getReferrerById(id);

  const [form, setForm] = useState<Referrer | null>(referrer ?? null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  // 공유 URL 편집용 로컬 입력 상태 — 전체 URL (사용자가 자유롭게 편집)
  const URL_BASE = "http://seoulglow";
  const [urlInput, setUrlInput] = useState<string>(() => {
    if (!referrer) return "";
    const slug = referrer.slug?.trim() || slugify(referrer.name);
    return `${URL_BASE}/${slug}`;
  });

  useEffect(() => {
    if (referrer && (!form || form.id !== referrer.id)) {
      setForm(referrer);
      const slug = referrer.slug?.trim() || slugify(referrer.name);
      setUrlInput(`${URL_BASE}/${slug}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [referrer, form]);

  const krw = useMemo(
    () =>
      new Intl.NumberFormat(pageLocale === "ko" ? "ko-KR" : "en-US", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
      }),
    [pageLocale],
  );

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(pageLocale === "ko" ? "ko-KR" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    [pageLocale],
  );

  const dismissPath = `/${locale}/admin/referrers`;

  const linkedReservations = useMemo(() => {
    if (!referrer) return [];
    return reservations
      .filter((r) => r.referrers.includes(referrer.name))
      .map((r) => {
        const total = calcTotal(r.treatments);
        const share = calcCommissionShare(r.treatments, r.referrers.length);
        const transfer =
          (r.transferStatuses?.[referrer.name] as TransferStatus) ??
          "pending";
        return { reservation: r, total, share, transfer };
      });
  }, [reservations, referrer]);

  // 누적 정산 — 정산 완료된 것만 합산
  const totalCommission = useMemo(
    () =>
      linkedReservations.reduce(
        (sum, x) => (x.transfer === "paid" ? sum + x.share : sum),
        0,
      ),
    [linkedReservations],
  );

  if (!referrer || !form) {
    return (
      <div className="py-10 text-center space-y-3">
        <h2 className="text-lg font-semibold">{t("notFound.title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("notFound.description")}
        </p>
        <Button asChild variant="outline">
          <Link href={dismissPath}>
            <ArrowLeft className="mr-1 size-4" />
            {t("notFound.back")}
          </Link>
        </Button>
      </div>
    );
  }

  // 현재 urlInput 에서 slug 추출 — 마지막 '/' 뒤 경로
  const match = urlInput.match(/\/([^/?#]*)$/);
  const extractedSlug = match ? match[1] : "";

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    const nextSlug = extractedSlug.trim();
    const { id: _id, ...patch } = form;
    const cleanedBank = cleanBank(patch.bank);
    updateReferrer(id, {
      ...patch,
      slug: nextSlug || undefined,
      bank: cleanedBank,
    });
    toast.success(t("saved"));
    onSaved?.();
  }

  function setBankField(key: keyof ReferrerBankInfo, value: string) {
    if (!form) return;
    setForm({
      ...form,
      bank: { ...(form.bank ?? {}), [key]: value },
    });
  }

  function handleDelete() {
    removeReferrer(id);
    setDeleteOpen(false);
    toast.success(t("deleted"));
    onDeleted?.();
  }

  function setTransfer(
    reservationId: string,
    referrerName: string,
    next: TransferStatus,
  ) {
    const target = reservations.find((r) => r.id === reservationId);
    if (!target) return;
    const nextTransfers = { ...(target.transferStatuses ?? {}) };
    nextTransfers[referrerName] = next;
    updateReservation(reservationId, { transferStatuses: nextTransfers });
  }

  function openReservation(reservationId: string) {
    if (onOpenReservation) {
      onOpenReservation(reservationId);
    } else {
      router.push(
        `/${locale}/admin/reservations?detailId=${encodeURIComponent(
          reservationId,
        )}`,
      );
    }
  }

  const reservationCount = linkedReservations.length;

  return (
    <div className="space-y-6">
      {!inSheet && (
        <div className="flex items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href={dismissPath}>
              <ArrowLeft className="mr-1 size-4" />
              {t("notFound.back")}
            </Link>
          </Button>
        </div>
      )}

      {/* 이름 + WhatsApp */}
      <div>
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight truncate">
            {form.name}
          </h2>
          {form.phone && (
            <div className="shrink-0 max-w-[200px] w-full sm:w-auto">
              <WhatsAppButton
                phone={form.phone}
                label={t("whatsapp")}
                size="lg"
                fill
              />
            </div>
          )}
        </div>
      </div>

      {/* 누적 정산 */}
      <section className="rounded-lg border bg-muted/30 p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {t("totalCommission")}
        </p>
        <p className="mt-1 font-heading text-2xl sm:text-3xl font-semibold tabular-nums text-primary">
          {krw.format(totalCommission)}
        </p>
      </section>

      <form id={REFERRER_FORM_ID} onSubmit={handleSave} className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="ref-name">{t("nameLabel")}</Label>
            <Input
              id="ref-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ref-phone">{t("phoneLabel")}</Label>
            <Input
              id="ref-phone"
              type="tel"
              value={form.phone ?? ""}
              onChange={(e) =>
                setForm({ ...form, phone: e.target.value || undefined })
              }
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="ref-url">{t("urlLabel")}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="ref-url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 font-mono text-xs"
                placeholder="http://"
              />
              <CopyUrlButton
                url={urlInput}
                copyLabel={t("copyUrl")}
                copiedLabel={t("copied")}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* 은행 계좌 정보 — Collapsible */}
        <Collapsible className="group/collapsible space-y-3">
          <CollapsibleTrigger className="flex w-full items-center justify-between gap-2 rounded-md text-left outline-none focus-visible:ring-2 focus-visible:ring-ring">
            <h3 className="text-sm font-medium">{tBank("heading")}</h3>
            <ChevronDown className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:slide-in-from-top-1">
            <div className="grid gap-4 pt-2 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bank-first-name">
                  {tBank("holderFirstName")}
                </Label>
                <Input
                  id="bank-first-name"
                  value={form.bank?.holderFirstName ?? ""}
                  onChange={(e) =>
                    setBankField("holderFirstName", e.target.value)
                  }
                  placeholder={tBank("holderFirstNamePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-last-name">
                  {tBank("holderLastName")}
                </Label>
                <Input
                  id="bank-last-name"
                  value={form.bank?.holderLastName ?? ""}
                  onChange={(e) =>
                    setBankField("holderLastName", e.target.value)
                  }
                  placeholder={tBank("holderLastNamePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-name">{tBank("bankName")}</Label>
                <Input
                  id="bank-name"
                  value={form.bank?.bankName ?? ""}
                  onChange={(e) => setBankField("bankName", e.target.value)}
                  placeholder={tBank("bankNamePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-account">{tBank("accountNumber")}</Label>
                <Input
                  id="bank-account"
                  value={form.bank?.accountNumber ?? ""}
                  onChange={(e) =>
                    setBankField("accountNumber", e.target.value)
                  }
                  placeholder={tBank("accountNumberPlaceholder")}
                  inputMode="numeric"
                  className="font-mono"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="bank-address">{tBank("bankAddress")}</Label>
                <Input
                  id="bank-address"
                  value={form.bank?.bankAddress ?? ""}
                  onChange={(e) =>
                    setBankField("bankAddress", e.target.value)
                  }
                  placeholder={tBank("bankAddressPlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-swift">{tBank("swiftCode")}</Label>
                <Input
                  id="bank-swift"
                  value={form.bank?.swiftCode ?? ""}
                  onChange={(e) => setBankField("swiftCode", e.target.value)}
                  placeholder={tBank("swiftCodePlaceholder")}
                  className="font-mono uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bank-routing">{tBank("routingNumber")}</Label>
                <Input
                  id="bank-routing"
                  value={form.bank?.routingNumber ?? ""}
                  onChange={(e) =>
                    setBankField("routingNumber", e.target.value)
                  }
                  placeholder={tBank("routingNumberPlaceholder")}
                  inputMode="numeric"
                  className="font-mono"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        <Separator />

        {/* 예약 내역 */}
        <section aria-label={t("reservationsHeading")} className="space-y-3">
          <h3 className="text-sm font-medium">
            {t("reservationsCount", { count: reservationCount })}
          </h3>

          {reservationCount === 0 ? (
            <p className="rounded-lg border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
              {t("noReservations")}
            </p>
          ) : (
            <>
              <div className="hidden md:block rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("reservationColumns.status")}</TableHead>
                      <TableHead>{t("reservationColumns.name")}</TableHead>
                      <TableHead>{t("reservationColumns.date")}</TableHead>
                      <TableHead className="text-right">
                        {t("reservationColumns.total")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("reservationColumns.commission")}
                      </TableHead>
                      <TableHead>
                        {t("reservationColumns.transfer")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {linkedReservations.map(
                      ({ reservation, total, share, transfer }) => {
                        const isCompleted =
                          reservation.status === "completed";
                        const isCancelled =
                          reservation.status === "cancelled";
                        return (
                          <TableRow
                            key={reservation.id}
                            onClick={() => openReservation(reservation.id)}
                            tabIndex={0}
                            role="link"
                            className="cursor-pointer focus:outline-none focus:bg-muted/60"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                openReservation(reservation.id);
                              }
                            }}
                          >
                            <TableCell
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => e.stopPropagation()}
                              className="w-[130px]"
                            >
                              <Select
                                value={reservation.status}
                                onValueChange={(v) =>
                                  updateReservation(reservation.id, {
                                    status: v as ReservationStatus,
                                  })
                                }
                              >
                                <SelectTrigger
                                  size="sm"
                                  aria-label={tR("columns.status")}
                                  className="h-8 w-auto gap-0 border-none bg-transparent p-0 shadow-none hover:bg-muted focus-visible:ring-0 [&>svg]:hidden"
                                >
                                  <SelectValue>
                                    <StatusBadge
                                      status={reservation.status}
                                      label={tR(`status.${reservation.status}`)}
                                    />
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {statusOptions.map((s) => (
                                    <SelectItem key={s} value={s}>
                                      {tR(`status.${s}`)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="font-medium">
                              {reservation.name}
                            </TableCell>
                            <TableCell className="whitespace-nowrap tabular-nums text-muted-foreground">
                              {dateFormatter.format(new Date(reservation.date))}
                            </TableCell>
                            <TableCell className="text-right tabular-nums text-muted-foreground">
                              {krw.format(total)}
                            </TableCell>
                            <TableCell
                              className={cn(
                                "text-right tabular-nums",
                                isCancelled
                                  ? "text-muted-foreground/60 line-through"
                                  : "font-semibold text-primary",
                              )}
                            >
                              {krw.format(share)}
                            </TableCell>
                            <TableCell
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => e.stopPropagation()}
                            >
                              {isCompleted ? (
                                <TransferToggle
                                  value={transfer}
                                  onChange={(v) =>
                                    setTransfer(reservation.id, form.name, v)
                                  }
                                />
                              ) : (
                                <span className="text-sm text-muted-foreground">
                                  -
                                </span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      },
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="md:hidden space-y-2">
                {linkedReservations.map(
                  ({ reservation, total, share, transfer }) => {
                    const isCompleted = reservation.status === "completed";
                    const isCancelled = reservation.status === "cancelled";
                    return (
                      <article
                        key={reservation.id}
                        onClick={() => openReservation(reservation.id)}
                        tabIndex={0}
                        role="link"
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            openReservation(reservation.id);
                          }
                        }}
                        className="cursor-pointer rounded-lg border bg-card p-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div
                              className="mb-1"
                              onClick={(e) => e.stopPropagation()}
                              onKeyDown={(e) => e.stopPropagation()}
                            >
                              <Select
                                value={reservation.status}
                                onValueChange={(v) =>
                                  updateReservation(reservation.id, {
                                    status: v as ReservationStatus,
                                  })
                                }
                              >
                                <SelectTrigger
                                  size="sm"
                                  aria-label={tR("columns.status")}
                                  className="h-7 gap-0 border-none bg-transparent p-0 shadow-none hover:bg-muted focus-visible:ring-0 [&>svg]:hidden"
                                >
                                  <SelectValue>
                                    <StatusBadge
                                      status={reservation.status}
                                      label={tR(`status.${reservation.status}`)}
                                    />
                                  </SelectValue>
                                </SelectTrigger>
                                <SelectContent>
                                  {statusOptions.map((s) => (
                                    <SelectItem key={s} value={s}>
                                      {tR(`status.${s}`)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <h4 className="font-medium truncate">
                              {reservation.name}
                            </h4>
                            <p className="text-xs text-muted-foreground tabular-nums">
                              {dateFormatter.format(new Date(reservation.date))}
                            </p>
                          </div>
                          <div className="text-right tabular-nums">
                            <div className="text-xs text-muted-foreground">
                              {krw.format(total)}
                            </div>
                            <div
                              className={cn(
                                isCancelled
                                  ? "text-muted-foreground/60 line-through"
                                  : "font-semibold text-primary",
                              )}
                            >
                              {krw.format(share)}
                            </div>
                          </div>
                        </div>
                        {isCompleted && (
                          <div
                            className="mt-2"
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                          >
                            <TransferToggle
                              value={transfer}
                              onChange={(v) =>
                                setTransfer(reservation.id, form.name, v)
                              }
                            />
                          </div>
                        )}
                      </article>
                    );
                  },
                )}
              </div>
            </>
          )}
        </section>

        <Separator />

        {inSheet ? (
          <div className="flex">
            <Button
              type="button"
              variant="outline"
              className="w-fit text-destructive hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="mr-1 size-4" />
              {t("delete")}
            </Button>
          </div>
        ) : (
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              className="w-fit text-destructive hover:text-destructive"
              onClick={() => setDeleteOpen(true)}
            >
              <Trash2 className="mr-1 size-4" />
              {t("delete")}
            </Button>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push(dismissPath)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit">{t("save")}</Button>
            </div>
          </div>
        )}
      </form>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("deleteDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("deleteDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteOpen(false)}>
              {t("deleteDialog.cancel")}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              {t("deleteDialog.confirm")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/** 빈 값만 있는 bank 객체는 undefined 로 정리 */
function cleanBank(
  bank: ReferrerBankInfo | undefined,
): ReferrerBankInfo | undefined {
  if (!bank) return undefined;
  const entries = (
    Object.entries(bank) as [keyof ReferrerBankInfo, string | undefined][]
  )
    .map(
      ([k, v]) =>
        [k, typeof v === "string" ? v.trim() : v] as [
          keyof ReferrerBankInfo,
          string | undefined,
        ],
    )
    .filter(([, v]) => v);
  if (entries.length === 0) return undefined;
  return Object.fromEntries(entries) as ReferrerBankInfo;
}

/** Outline 버튼 스타일 on/off 토글 — 정산 상태 */
function TransferToggle({
  value,
  onChange,
}: {
  value: TransferStatus;
  onChange: (v: TransferStatus) => void;
}) {
  const t = useTranslations("ReferrerDetail.transfer");
  const paid = value === "paid";

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => onChange(paid ? "pending" : "paid")}
      aria-pressed={paid}
      className={cn(
        "gap-1.5 h-8 px-3",
        paid &&
          "border-emerald-500 bg-emerald-50 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200 dark:hover:bg-emerald-950/60",
      )}
    >
      {paid && <Check className="size-3.5" />}
      {paid ? t("paid") : t("pending")}
    </Button>
  );
}
