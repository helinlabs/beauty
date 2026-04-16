"use client";

import { Copy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/admin/ui/button";
import { cn } from "@/lib/admin-utils";

interface Props {
  url: string;
  copyLabel: string;
  copiedLabel: string;
  className?: string;
  size?: React.ComponentProps<typeof Button>["size"];
  variant?: React.ComponentProps<typeof Button>["variant"];
  /** 아이콘만 노출 (리스트에서 좁은 영역용) */
  iconOnly?: boolean;
}

export function CopyUrlButton({
  url,
  copyLabel,
  copiedLabel,
  className,
  size = "sm",
  variant = "outline",
  iconOnly = false,
}: Props) {
  async function onClick(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(url);
      toast.success(copiedLabel);
    } catch {
      // ignore clipboard errors
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={iconOnly ? "icon" : size}
      onClick={onClick}
      aria-label={copyLabel}
      title={copyLabel}
      className={cn(iconOnly ? "size-8" : "gap-1.5", className)}
    >
      <Copy className="size-3.5" />
      {!iconOnly && <span className="text-xs">{copyLabel}</span>}
    </Button>
  );
}
