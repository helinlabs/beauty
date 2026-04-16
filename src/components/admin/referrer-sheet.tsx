"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
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
  ReferrerEditor,
  REFERRER_FORM_ID,
} from "@/components/admin/referrer-editor";
import { ReservationSheet } from "@/components/admin/reservation-sheet";

interface Props {
  id: string;
  locale: string;
}

export function ReferrerSheet({ id, locale }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const t = useTranslations("ReferrerDetail");

  const nestedReservationId = search.get("detailId");

  function close() {
    // 중첩된 예약 시트가 열려있다면 그것부터 닫기
    if (nestedReservationId) {
      closeNested();
      return;
    }
    router.back();
  }

  function openNestedReservation(reservationId: string) {
    // history 엔트리가 쌓이지 않도록 replace 사용 — 닫기 한 번으로 돌아오게
    const sp = new URLSearchParams(search.toString());
    sp.set("detailId", reservationId);
    router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
  }

  function closeNested() {
    const sp = new URLSearchParams(search.toString());
    sp.delete("detailId");
    const q = sp.toString();
    router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
  }

  return (
    <>
      <Sheet
        open
        onOpenChange={(open) => {
          if (!open) close();
        }}
      >
        <SheetContent
          side="right"
          className="flex !w-full !max-w-none h-dvh max-h-dvh flex-col gap-0 p-0 sm:!w-[560px] sm:!max-w-[560px] lg:!w-1/2 lg:!max-w-[820px] lg:!min-w-[560px] [&>button[data-slot=sheet-close]]:hidden"
        >
          <SheetTitle className="sr-only">{t("heading")}</SheetTitle>
          <SheetDescription className="sr-only">
            {t("heading")}
          </SheetDescription>

          <header className="flex shrink-0 items-center justify-between gap-2 border-b bg-background pl-3 pr-6 py-3">
            <Button
              variant="ghost"
              size="icon"
              className="size-9"
              onClick={close}
              aria-label={t("close")}
            >
              <X className="size-5" />
            </Button>
            <Button
              type="submit"
              form={REFERRER_FORM_ID}
              size="lg"
              className="min-w-20"
            >
              {t("save")}
            </Button>
          </header>

          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="px-6 py-6">
              <ReferrerEditor
                id={id}
                locale={locale}
                inSheet
                onDeleted={() => router.back()}
                onOpenReservation={openNestedReservation}
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* 중첩된 예약 상세 sheet — 추천인 sheet 위에 좁게 스택, 배경은 투명 */}
      {nestedReservationId && (
        <ReservationSheet
          id={nestedReservationId}
          locale={locale}
          onClose={closeNested}
          overlayClassName="bg-black/20"
          nested
        />
      )}
    </>
  );
}
