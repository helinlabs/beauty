"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";

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
import { TreatmentPicker } from "@/components/admin/treatment-picker";
import { PhotoUploader } from "@/components/admin/photo-uploader";
import { ReferrerTagInput } from "@/components/admin/referrer-tag-input";
import { useReservations } from "@/providers/reservations-provider";
import {
  calcDeposit,
  calcTotal,
  hospitalOptions,
  languageOptions,
  statusOptions,
  type Hospital,
  type Reservation,
  type ReservationLanguage,
  type ReservationStatus,
  type Treatment,
} from "@/lib/reservations";

export const NEW_RESERVATION_FORM_ID = "new-reservation-form";

interface Props {
  locale: string;
  onCreated?: (id: string) => void;
  /** yyyy-mm-dd 포맷 또는 ISO datetime */
  initialDate?: string;
}

function localNowDateTime() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function makeDefaultDate(initial?: string) {
  if (!initial) return localNowDateTime();
  // yyyy-mm-dd 이면 기본 시간 10:00 부여
  if (/^\d{4}-\d{2}-\d{2}$/.test(initial)) return `${initial}T10:00`;
  if (initial.length >= 16) return initial.slice(0, 16);
  return localNowDateTime();
}

export function NewReservationForm({
  locale,
  onCreated,
  initialDate,
}: Props) {
  const t = useTranslations("ReservationDetail");
  const tR = useTranslations("Reservations");
  const pageLocale = useLocale();
  const { createReservation, referrerNames } = useReservations();

  const [form, setForm] = useState<Omit<Reservation, "id">>({
    name: "",
    phone: "",
    date: makeDefaultDate(initialDate),
    status: "consultation",
    language: "en",
    treatments: [],
    hospital: "view",
    referrers: [],
  });

  const krw = useMemo(
    () =>
      new Intl.NumberFormat(pageLocale === "ko" ? "ko-KR" : "en-US", {
        style: "currency",
        currency: "KRW",
        maximumFractionDigits: 0,
      }),
    [pageLocale],
  );

  const total = calcTotal(form.treatments);
  const deposit = calcDeposit(total);
  const remaining = total - deposit;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const created = createReservation(form);
    toast.success(t("saved"));
    onCreated?.(created.id);
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl sm:text-2xl font-semibold tracking-tight">
          {t("newTitle")}
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("newDescription")}
        </p>
      </div>

      {/* 견적 요약 */}
      <section
        aria-label={t("quoteTitle")}
        className="rounded-lg border bg-muted/30 p-4"
      >
        <h3 className="mb-3 text-sm font-medium">{t("quoteTitle")}</h3>
        {form.treatments.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t("emptyTreatments")}
          </p>
        ) : (
          <dl className="space-y-1.5 text-sm">
            <div className="flex items-baseline justify-between">
              <dt className="text-muted-foreground">{t("totalLabel")}</dt>
              <dd className="font-semibold tabular-nums">
                {krw.format(total)}
              </dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-muted-foreground">{t("depositLabel")}</dt>
              <dd className="tabular-nums">{krw.format(deposit)}</dd>
            </div>
            <div className="flex items-baseline justify-between">
              <dt className="text-muted-foreground">{t("remainingLabel")}</dt>
              <dd className="tabular-nums">{krw.format(remaining)}</dd>
            </div>
          </dl>
        )}
      </section>

      <div className="space-y-2">
        <Label>{tR("columns.treatments")}</Label>
        <TreatmentPicker
          value={form.treatments}
          onChange={(next: Treatment[]) =>
            setForm({ ...form, treatments: next })
          }
        />
      </div>

      <form
        id={NEW_RESERVATION_FORM_ID}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="new-name">{tR("columns.name")}</Label>
            <Input
              id="new-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-phone">{tR("columns.phone")}</Label>
            <Input
              id="new-phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-date">{tR("columns.date")}</Label>
            <Input
              id="new-date"
              type="datetime-local"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-language">{tR("columns.language")}</Label>
            <Select
              value={form.language}
              onValueChange={(v) =>
                setForm({ ...form, language: v as ReservationLanguage })
              }
            >
              <SelectTrigger id="new-language" className="w-full">
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
            <Label htmlFor="new-hospital">{tR("columns.hospital")}</Label>
            <Select
              value={form.hospital}
              onValueChange={(v) =>
                setForm({ ...form, hospital: v as Hospital })
              }
            >
              <SelectTrigger id="new-hospital" className="w-full">
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
            <Label htmlFor="new-status">{tR("columns.status")}</Label>
            <Select
              value={form.status}
              onValueChange={(v) =>
                setForm({ ...form, status: v as ReservationStatus })
              }
            >
              <SelectTrigger id="new-status" className="w-full">
                <SelectValue />
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
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="new-referrers">{tR("columns.referrer")}</Label>
            <ReferrerTagInput
              id="new-referrers"
              value={form.referrers}
              onChange={(next) => setForm({ ...form, referrers: next })}
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
              setForm({
                ...form,
                photos: next.length > 0 ? next : undefined,
              })
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-notes">{tR("columns.notes")}</Label>
          <Textarea
            id="new-notes"
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
      </form>
    </div>
  );
}
