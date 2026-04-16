import { cn } from "@/lib/admin-utils";
import type { ReservationStatus } from "@/lib/reservations";

/**
 * 상태별 닷 컬러 — Dashboard·ReservationEditor 등에서 공유.
 * 아이콘 크기는 컴포넌트 사용처에서 className으로 조정.
 */
export const STATUS_DOT_COLOR: Record<ReservationStatus, string> = {
  consultation: "bg-amber-400",
  confirmed: "bg-emerald-500",
  completed: "bg-slate-400",
  cancelled: "bg-red-500",
};

export function StatusDot({
  status,
  className,
}: {
  status: ReservationStatus;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-block size-1.5 shrink-0 rounded-full",
        STATUS_DOT_COLOR[status],
        className,
      )}
    />
  );
}
