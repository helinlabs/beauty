"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/admin/ui/sheet";
import {
  NewReservationForm,
  NEW_RESERVATION_FORM_ID,
} from "@/components/admin/new-reservation-form";

interface Props {
  locale: string;
  onClose: () => void;
  initialDate?: string | null;
}

export function NewReservationSheet({ locale, onClose, initialDate }: Props) {
  const t = useTranslations("ReservationDetail");

  return (
    <Sheet
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <SheetContent
        side="right"
        className="flex !w-full !max-w-none h-dvh max-h-dvh flex-col gap-0 p-0 sm:!w-[560px] sm:!max-w-[560px] lg:!w-1/2 lg:!max-w-[820px] lg:!min-w-[560px] [&>button[data-slot=sheet-close]]:hidden"
      >
        <SheetTitle className="sr-only">{t("newTitle")}</SheetTitle>
        <SheetDescription className="sr-only">
          {t("newDescription")}
        </SheetDescription>

        <header className="flex shrink-0 items-center justify-between gap-2 border-b bg-background pl-3 pr-6 py-3">
          <Button
            variant="ghost"
            size="icon"
            className="size-9"
            onClick={onClose}
            aria-label={t("close")}
          >
            <X className="size-5" />
          </Button>
          <Button
            type="submit"
            form={NEW_RESERVATION_FORM_ID}
            size="lg"
            className="min-w-20"
          >
            {t("save")}
          </Button>
        </header>

        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="px-6 py-6">
            <NewReservationForm
              locale={locale}
              initialDate={initialDate ?? undefined}
              onCreated={onClose}
            />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
