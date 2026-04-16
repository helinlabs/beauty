"use client";

import { useTransition } from "react";
import { LogOut } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { logoutAction } from "@/lib/admin-auth";

export function LogoutButton({
  locale,
  label,
}: {
  locale: string;
  label: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() =>
        startTransition(async () => {
          await logoutAction(locale);
        })
      }
      disabled={pending}
      aria-label={label}
      className="gap-1.5"
    >
      <LogOut className="size-4" />
      <span className="hidden sm:inline">{label}</span>
    </Button>
  );
}
