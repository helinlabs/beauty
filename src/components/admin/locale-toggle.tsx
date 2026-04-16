"use client";

import { useTransition } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { Globe } from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import { cn } from "@/lib/admin-utils";
import { routing, type Locale } from "@/i18n/admin/routing";

interface Props {
  currentLocale: Locale;
  label: string;
}

export function LocaleToggle({ currentLocale, label }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const locales = routing.locales;

  function toggle() {
    const idx = locales.indexOf(currentLocale);
    const nextLocale = locales[(idx + 1) % locales.length];
    if (!nextLocale || nextLocale === currentLocale) return;

    const segments = pathname.split("/");
    if ((locales as readonly string[]).includes(segments[1])) {
      segments[1] = nextLocale;
    } else {
      segments.splice(1, 0, nextLocale);
    }
    const nextPath = segments.join("/") || `/${nextLocale}`;
    const q = search.toString();
    const nextUrl = q ? `${nextPath}?${q}` : nextPath;

    startTransition(() => {
      router.replace(nextUrl);
      router.refresh();
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggle}
      aria-label={label}
      className={cn("gap-1.5", isPending && "opacity-60")}
    >
      <Globe className="size-4" />
      <span className="uppercase tracking-wide">{currentLocale}</span>
    </Button>
  );
}
