"use client";

import { Suspense } from "react";
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
  /**
   * Called when the sheet should close. Parent typically clears the
   * URL's `detailId` search param.
   */
  onClose: () => void;
}

function ReferrerSheetInner({ id, locale, onClose }: Props) {
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
    onClose();
  }

  function openNestedReservation(reservationId: string) {
    // 예약 상세는 detailId 쿼리로 관리되는데 referrer도 같은 키를 쓰면 충돌한다.
    // 구현상 referrer 시트는 refId 로, 예약(중첩)은 detailId 로 분리해두었으므로
    // 여기서 detailId 를 추가하면 ReservationSheet 가 덮어 렌더된다.
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
                onDeleted={onClose}
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

/**
 * useSearchParams needs a Suspense boundary under Next.js 15 static
 * rendering. Wrap the inner component so parents can mount this sheet
 * anywhere (dashboard, list page) without worrying about it.
 */
export function ReferrerSheet(props: Props) {
  return (
    <Suspense fallback={null}>
      <ReferrerSheetInner {...props} />
    </Suspense>
  );
}
