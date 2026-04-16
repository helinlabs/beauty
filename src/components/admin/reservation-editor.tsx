"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Trash2 } from "lucide-react";
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
import { StatusDot } from "@/components/admin/status-dot";
import { TreatmentPicker } from "@/components/admin/treatment-picker";
import { PhotoUploader } from "@/components/admin/photo-uploader";
import { ReferrerTagInput } from "@/components/admin/referrer-tag-input";
import { WhatsAppButton } from "@/components/admin/whatsapp-button";
import { useReservations } from "@/providers/reservations-provider";
import {
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

export const RESERVATION_FORM_ID = "reservation-edit-form";

interface Props {
  id: string;
  locale: string;
  inSheet?: boolean;
  onSaved?: () => void;
  onDeleted?: () => void;
  /**
   * 수동 저장 대상(이름·전화번호·총 견적·메모) 중 하나라도 원본과
   * 달라지면 true. 부모 sheet 가 닫기 전 확인 모달을 띄울 때 사용.
   */
  onDirtyChange?: (dirty: boolean) => void;
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
  onDirtyChange,
}: Props) {
  const t = useTranslations("ReservationDetail");
  const tR = useTranslations("Reservations");
  const router = useRouter();
  const pageLocale = useLocale();
  const { getById, update, remove, referrerNames } = useReservations();

  const reservation = getById(id);

  // 총 견적은 마운트 시 한 번 확정. 시술 추가/삭제가 견적에 영향을 주지 않도록.
  const [form, setForm] = useState<Reservation | null>(() =>
    reservation
      ? {
          ...reservation,
          total: reservation.total ?? calcTotal(reservation.treatments),
        }
      : null,
  );
  const [deleteOpen, setDeleteOpen] = useState(false);

  // 총 견적 input 커서 위치 보존용 — 포맷 재적용 시 커서가 맨 뒤로 밀리지 않도록.
  const totalInputRef = useRef<HTMLInputElement>(null);
  const pendingTotalCaret = useRef<number | null>(null);

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
      setForm({
        ...reservation,
        total: reservation.total ?? calcTotal(reservation.treatments),
      });
    }
  }, [reservation, form]);

  // 텍스트 형식의 입력(이름·전화번호·총 견적·메모)의 변경 여부.
  // auto-save 필드(상태·시술·예약일·언어·추천인·사진)는 이미 스토어에
  // 반영되므로 포함하지 않는다.
  const isDirty = useMemo(() => {
    if (!form || !reservation) return false;
    const originalTotal =
      reservation.total ?? calcTotal(reservation.treatments);
    return (
      form.name !== reservation.name ||
      form.phone !== reservation.phone ||
      (form.total ?? 0) !== originalTotal ||
      (form.notes ?? "") !== (reservation.notes ?? "")
    );
  }, [form, reservation]);

  useEffect(() => {
    onDirtyChange?.(isDirty);
  }, [isDirty, onDirtyChange]);

  // 총 견적 input 이 포맷된 새 value 로 리렌더된 직후, 입력 시 기억해 둔
  // "숫자 자릿수" 위치에 맞춰 커서를 재배치.
  useLayoutEffect(() => {
    const input = totalInputRef.current;
    const target = pendingTotalCaret.current;
    if (!input || target == null) return;

    const value = input.value;
    // value 앞에서부터 숫자를 세면서 target 개에 도달한 직후 위치를 찾음.
    let digitCount = 0;
    let pos = value.length;
    for (let i = 0; i < value.length; i++) {
      if (/\d/.test(value[i])) {
        digitCount += 1;
        if (digitCount === target) {
          pos = i + 1;
          break;
        }
      }
    }
    if (target === 0) pos = value.search(/\d/);
    if (pos < 0) pos = 0;
    input.setSelectionRange(pos, pos);
    pendingTotalCaret.current = null;
  });

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

  /**
   * 총 견적 입력 변경. 포맷 재적용으로 `value` 가 바뀌면 브라우저가 커서를
   * 맨 뒤로 보내기 때문에 "커서 이전의 숫자 개수"를 기준으로 위치를 복원한다.
   */
  function handleTotalChange(e: React.ChangeEvent<HTMLInputElement>) {
    const raw = e.target.value;
    const caret = e.target.selectionStart ?? raw.length;
    // 커서 앞쪽 숫자 자릿수
    const digitsBeforeCaret = raw.slice(0, caret).replace(/\D/g, "").length;
    pendingTotalCaret.current = digitsBeforeCaret;

    const digits = raw.replace(/\D/g, "");
    const n = digits === "" ? 0 : Number(digits);
    setForm((prev) => (prev ? { ...prev, total: n } : prev));
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

      {/* 헤더: 이름 + WhatsApp + 생성일 */}
      <div>
        <div className="flex items-center justify-between gap-3">
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

      <form
        id={RESERVATION_FORM_ID}
        onSubmit={handleSave}
        className="space-y-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Row 1: 이름, 상태 */}
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
            <Label htmlFor="status">{tR("columns.status")}</Label>
            <Select
              value={form.status}
              onValueChange={(v) =>
                autoSave({ status: v as ReservationStatus })
              }
            >
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    <span className="flex items-center gap-2">
                      <StatusDot status={s} />
                      {tR(`status.${s}`)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Row 2: 시술 (full) */}
          <div className="space-y-2 sm:col-span-2">
            <Label>{tR("columns.treatments")}</Label>
            <TreatmentPicker
              value={form.treatments}
              onChange={(next) => autoSave({ treatments: next })}
            />
          </div>

          {/* Row 3: 총 견적, 시술 예약일 */}
          <div className="space-y-2">
            <Label htmlFor="total">{tR("columns.total")}</Label>
            <Input
              id="total"
              ref={totalInputRef}
              type="text"
              inputMode="numeric"
              value={krw.format(form.total ?? 0)}
              onChange={handleTotalChange}
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

          {/* Row 4: 병원, 추천인 */}
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

          {/* Row 5: 언어, 전화번호 */}
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
            <Label htmlFor="phone">{tR("columns.phone")}</Label>
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>

          {/* Row 6: 사진 첨부 (full) */}
          <div className="space-y-2 sm:col-span-2">
            <Label>{t("photosLabel")}</Label>
            <PhotoUploader
              value={form.photos ?? []}
              onChange={(next) =>
                autoSave({ photos: next.length > 0 ? next : undefined })
              }
            />
          </div>

          {/* Row 7: 메모 (full) */}
          <div className="space-y-2 sm:col-span-2">
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
