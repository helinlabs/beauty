"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/admin/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/admin/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/admin/ui/popover";
import { cn } from "@/lib/admin-utils";

export const ALL_REFERRERS = "__all__";

interface Props {
  value: string;
  onChange: (value: string) => void;
  referrers: string[];
}

export function ReferrerCombobox({ value, onChange, referrers }: Props) {
  const t = useTranslations("Reservations.filter");
  const [open, setOpen] = useState(false);

  const display =
    value === ALL_REFERRERS
      ? t("allReferrers")
      : value;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label={t("referrerLabel")}
          className="w-full justify-between font-normal"
        >
          <span className="truncate">{display}</span>
          <ChevronDown className="ml-2 size-4 shrink-0 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="start">
        <Command>
          <CommandInput placeholder={t("referrerSearchPlaceholder")} />
          <CommandList>
            <CommandEmpty>{t("referrerEmpty")}</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value={t("allReferrers")}
                onSelect={() => {
                  onChange(ALL_REFERRERS);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 size-4",
                    value === ALL_REFERRERS ? "opacity-100" : "opacity-0",
                  )}
                />
                {t("allReferrers")}
              </CommandItem>
              {referrers.map((ref) => (
                <CommandItem
                  key={ref}
                  value={ref}
                  onSelect={() => {
                    onChange(ref);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      value === ref ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {ref}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
