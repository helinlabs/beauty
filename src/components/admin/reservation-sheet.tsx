"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/admin/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/admin/ui/sheet";
import {
  ReservationEditor,
  RESERVATION_FORM_ID,
} from "@/components/admin/reservation-editor";
import { cn } from "@/lib/admin-utils";

interface Props {
  id: string;
  locale: string;
  onClose: () => void;
  /** 중첩 sheet에서 바깥 sheet이 보이도록 overlay 투명 처리용 */
  overlayClassName?: string;
  /** 중첩 stack 일 때 폭을 좁게 */
  nested?: boolean;
}

export function ReservationSheet({
  id,
  locale,
  onClose,
  overlayClassName,
  nested = false,
}: Props) {
  const t = useTranslations("ReservationDetail");
  const [dirty, setDirty] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function attemptClose() {
    if (dirty) {
      setConfirmOpen(true);
    } else {
      onClose();
    }
  }

  return (
    <>
      <Sheet
        open
        onOpenChange={(open) => {
          if (!open) attemptClose();
        }}
      >
        <SheetContent
          side="right"
          overlayClassName={overlayClassName}
          className={cn(
            "flex !w-full !max-w-none h-dvh max-h-dvh flex-col gap-0 p-0 [&>button[data-slot=sheet-close]]:hidden",
            nested
              ? "sm:!w-[480px] sm:!max-w-[480px] lg:!w-[480px] lg:!max-w-[480px] lg:!min-w-[480px] shadow-2xl"
              : "sm:!w-[560px] sm:!max-w-[560px] lg:!w-1/2 lg:!max-w-[820px] lg:!min-w-[560px]",
          )}
        >
          <SheetTitle className="sr-only">{t("heading")}</SheetTitle>
          <SheetDescription className="sr-only">{t("heading")}</SheetDescription>

          <header className="flex shrink-0 items-center justify-between gap-2 border-b bg-background pl-3 pr-6 py-3">
            <Button
              variant="ghost"
              size="icon"
              className="size-9"
              onClick={attemptClose}
              aria-label={t("close")}
            >
              <X className="size-5" />
            </Button>
            <Button
              type="submit"
              form={RESERVATION_FORM_ID}
              size="lg"
              className="min-w-20"
            >
              {t("save")}
            </Button>
          </header>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="px-6 py-6">
              <ReservationEditor
                id={id}
                locale={locale}
                inSheet
                onDeleted={onClose}
                onDirtyChange={setDirty}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("unsavedDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("unsavedDialog.description")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              {t("unsavedDialog.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmOpen(false);
                onClose();
              }}
            >
              {t("unsavedDialog.discard")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
