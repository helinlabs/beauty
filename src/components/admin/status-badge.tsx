import { Badge } from "@/components/admin/ui/badge";
import { cn } from "@/lib/admin-utils";
import type { ReservationStatus } from "@/lib/reservations";

const STYLES: Record<ReservationStatus, string> = {
  // 상담 신청 — 노란색
  consultation:
    "border-transparent bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-200",
  // 예약 확정 — 초록색
  confirmed:
    "border-transparent bg-emerald-100 text-emerald-900 dark:bg-emerald-900/40 dark:text-emerald-200",
  // 시술 완료 — 회색
  completed:
    "border-transparent bg-muted text-muted-foreground",
  // 취소 — 흐린 빨강(취소선 없음)
  cancelled:
    "border-transparent bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300",
};

export function StatusBadge({
  status,
  label,
  className,
  children,
}: {
  status: ReservationStatus;
  label: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <Badge className={cn("font-medium", STYLES[status], className)}>
      {label}
      {children}
    </Badge>
  );
}
