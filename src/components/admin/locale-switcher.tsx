"use client";

import { useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, Globe } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/admin/ui/dropdown-menu";
import { Button } from "@/components/admin/ui/button";
import { cn } from "@/lib/admin-utils";

interface Props {
  locales: string[];
  currentLocale: string;
  label: string;
  labels: Record<string, string>;
}

export function LocaleSwitcher({
  locales,
  currentLocale,
  label,
  labels,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchTo(nextLocale: string) {
    if (nextLocale === currentLocale) return;

    // Replace first path segment (the locale) with nextLocale
    const segments = pathname.split("/");
    // segments = ["", "ko", "admin", ...]
    if (locales.includes(segments[1])) {
      segments[1] = nextLocale;
    } else {
      segments.splice(1, 0, nextLocale);
    }
    const nextPath = segments.join("/") || `/${nextLocale}`;

    startTransition(() => {
      router.replace(nextPath);
      router.refresh();
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn("gap-1.5", isPending && "opacity-60")}
          aria-label={label}
        >
          <Globe className="size-4" />
          <span className="uppercase tracking-wide">{currentLocale}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-36">
        <DropdownMenuLabel>{label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => switchTo(loc)}
            className="justify-between"
          >
            <span>{labels[loc] ?? loc.toUpperCase()}</span>
            {loc === currentLocale && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
