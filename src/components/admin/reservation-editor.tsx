"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Check, ChevronDown, Trash2 } from "lucide-react"; // Check 는 saved flash 등에서 재사용
import { toast } from "sonner";

import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";
import { Textarea } from "@/components/admin/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/admin/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import { Separator } from "@/components/admin/ui/separator";
import { StatusBadge } from "@/components/admin/status-badge";
import { TreatmentPicker } from "@/components/admin/treatment-picker";
import { PhotoUploader } from "@/components/admin/photo-uploader";
import { ReferrerTagInput } from "@/components/admin/referrer-tag-input";
import { WhatsAppButton } from "@/components/admin/whatsapp-button";
import { useReservations } from "@/providers/reservations-provider";
import {
  calcDeposit,
  calcTotal,
  hospitalOptions,
  languageOptions,
  statusOptions,
  toWhatsAppDigits,
  type Hospital,
  type Reservation,
  type ReservationLanguage,
  type ReservationStatus,
} from "@/lib/reservations";
import { cn } from "@/lib/admin-utils";

export const RESERVATION_FORM_ID = "reservation-edit-form";

interface Props {
  id: string;
  locale: string;
  inSheet?: boolean;
  onSaved?: () => void;
  onDeleted?: () => void;
}

function toDateTimeLocal(value: string) {
  return value.length >= 16 ? value.slice(0, 16) : value;
}

function useKrw(locale: string) {
  return useMemo(
    () =>
      new Intl.NumberFormat(locale === "ko" ? "ko-KR" : "en-US", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
      }),
    [locale],
  );
}

export function ReservationEditor({
  id,
  locale,
  inSheet = false,
  onSaved,
  onDeleted,
}: Props) {
  const t = useTranslations("ReservationDetail");
  const tR = useTranslations("Reservations");
  const router = useRouter();
  const pageLocale = useLocale();
  const { getById, update, remove, referrerNames } = useReservations();

  const reservation = getById(id);

  const [form, setForm] = useState<Reservation | null>(reservation ?? null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const krw = useKrw(pageLocale);

  const createdAtFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(pageLocale === "ko" ? "ko-KR" : "en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    [pageLocale],
  );

  useEffect(() => {
    if (reservation && (!form || form.id !== reservation.id)) {
      setForm(reservation);
    }
  }, [reservation, form]);

  const dismissPath = `/${locale}/admin/reservations`;

  if (!reservation || !form) {
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

  const total = calcTotal(form.treatments);
  const deposit = calcDeposit(total);
  const remaining = total - deposit;

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form) return;
    const { id: _id, ...patch } = form;
    update(id, patch);
    toast.success(t("saved"));
    onSaved?.();
  }

  function handleDelete() {
    remove(id);
    setDeleteOpen(false);
    toast.success(t("deleted"));
    onDeleted?.();
  }

  // 상태·시술·예약일·언어·추천인·사진은 수정 즉시 저장 (스낵바 없음)
  function autoSave(patch: Partial<Omit<Reservation, "id">>) {
    setForm((prev) => (prev ? { ...prev, ...patch } : prev));
    update(id, patch);
  }

  return (
    <div className="space-y-6">
      {!inSheet && (
        <div className="flex items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm" className="-ml-2">
            <Link href={dismissPath}>
              <ArrowLeft className="mr-1 size-4" />
              {t("backToList")}
            </Link>
          </Button>
        </div>
      )}

      {/* 상단: 상태 뱃지(클릭시 변경) */}
      <div>
        <Select
          value={form.status}
          onValueChange={(v) => autoSave({ status: v as ReservationStatus })}
        >
          <SelectTrigger
            aria-label={tR("columns.status")}
            className="h-auto w-auto gap-0 border-none bg-transparent p-0 shadow-none hover:bg-transparent focus-visible:ring-0 [&>svg]:hidden"
          >
            <SelectValue>
              <StatusBadge
                status={form.status}
                label={tR(`status.${form.status}`)}
                className="h-8 gap-1 px-3 py-0 text-sm"
              >
                <ChevronDown className="size-4 opacity-60" />
              </StatusBadge>
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

        {/* 이름 + WhatsApp (수평 정렬, WhatsApp max-w 200px) */}
        <div className="mt-2 flex items-center justify-between gap-3">
          <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight truncate">
            {reservation.name || t("heading")}
          </h2>
          {toWhatsAppDigits(reservation.phone) ? (
            <div className="shrink-0 max-w-[200px] w-full sm:w-auto">
              <WhatsAppButton
                phone={reservation.phone}
                label={t("whatsapp")}
                size="lg"
                fill
              />
            </div>
          ) : null}
        </div>

        {reservation.createdAt ? (
          <p className="mt-1 text-xs text-muted-foreground tabular-nums">
            {tR("columns.createdAt")}{" "}
            {createdAtFormatter.format(new Date(reservation.createdAt))}
          </p>
        ) : null}
      </div>

      {/* 견적 요약 (헤딩/버튼 없음) */}
      <section
        aria-label={t("quoteTitle")}
        className="rounded-lg border bg-muted/30 p-4"
      >
        {form.treatments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("emptyTreatments")}
          </p>
        ) : (
          <dl className="space-y-2">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-muted-foreground">
                {t("totalLabel")}
              </dt>
              <dd className="font-heading text-2xl sm:text-3xl font-semibold tabular-nums leading-none">
                {krw.format(total)}
              </dd>
            </div>
            <div className="flex items-center justify-between text-sm">
              <dt className="text-muted-foreground">{t("depositLabel")}</dt>
              <dd className="tabular-nums">{krw.format(deposit)}</dd>
            </div>
            <div className="flex items-center justify-between text-sm">
              <dt className="text-muted-foreground">{t("remainingLabel")}</dt>
              <dd className="tabular-nums">{krw.format(remaining)}</dd>
            </div>
          </dl>
        )}
      </section>

      {/* 시술 — 태그 picker */}
      <div className="space-y-2">
        <Label>{tR("columns.treatments")}</Label>
        <TreatmentPicker
          value={form.treatments}
          onChange={(next) => autoSave({ treatments: next })}
        />
      </div>

      <form
        id={RESERVATION_FORM_ID}
        onSubmit={handleSave}
        className="space-y-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">{tR("columns.name")}</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">{tR("columns.phone")}</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">{tR("columns.date")}</Label>
            <Input
              id="date"
              type="datetime-local"
              value={toDateTimeLocal(form.date)}
              onChange={(e) => autoSave({ date: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="language">{tR("columns.language")}</Label>
            <Select
              value={form.language}
              onValueChange={(v) =>
                autoSave({ language: v as ReservationLanguage })
              }
            >
              <SelectTrigger id="language" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {languageOptions.map((l) => (
                  <SelectItem key={l} value={l}>
                    {tR(`language.${l}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hospital">{tR("columns.hospital")}</Label>
            <Select
              value={form.hospital}
              onValueChange={(v) =>
                setForm({ ...form, hospital: v as Hospital })
              }
            >
              <SelectTrigger id="hospital" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {hospitalOptions.map((h) => (
                  <SelectItem key={h} value={h}>
                    {tR(`hospitals.${h}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="referrers">{tR("columns.referrer")}</Label>
            <ReferrerTagInput
              id="referrers"
              value={form.referrers}
              onChange={(next) => autoSave({ referrers: next })}
              suggestions={referrerNames}
              suggestionsHeading={t("referrerSuggestHint")}
              placeholder={t("referrerTagPlaceholder")}
              removeLabel={t("referrerRemove")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>{t("photosLabel")}</Label>
          <PhotoUploader
            value={form.photos ?? []}
            onChange={(next) =>
              autoSave({ photos: next.length > 0 ? next : undefined })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">{tR("columns.notes")}</Label>
          <Textarea
            id="notes"
            value={form.notes ?? ""}
            onChange={(e) =>
              setForm({
                ...form,
                notes: e.target.value || undefined,
              })
            }
            rows={4}
          />
        </div>

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
