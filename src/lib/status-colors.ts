import type { ReservationStatus } from "@/lib/reservations";

/** 캘린더 이벤트 카드 배경 색 — 상태별 fill 스타일 */
export const STATUS_EVENT_BG: Record<ReservationStatus, string> = {
  consultation:
    "bg-amber-100 text-amber-900 hover:bg-amber-200 dark:bg-amber-900/40 dark:text-amber-100 dark:hover:bg-amber-900/60",
  confirmed:
    "bg-emerald-100 text-emerald-900 hover:bg-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-100 dark:hover:bg-emerald-900/60",
  completed:
    "bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700",
  cancelled:
    "bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/40 dark:text-rose-200",
};
