"use client";

import { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Checkbox } from "@/components/admin/ui/checkbox";

import { Button } from "@/components/admin/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/admin/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/admin/ui/command";
import { cn } from "@/lib/admin-utils";

export const ALL_FILTER = "__all__";

export interface FilterOption {
  value: string;
  label: string;
}

interface BaseProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: FilterOption[];
  /** "전체" 등 라벨 */
  allLabel: string;
  className?: string;
}

/** 상태 · 병원용 간단 필터 */
export function FilterPopover({
  label,
  value,
  onChange,
  options,
  allLabel,
  className,
}: BaseProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const isSelected = value !== ALL_FILTER && !!selected;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FilterTriggerButton
          label={label}
          selectedLabel={isSelected ? selected!.label : null}
          onClear={() => onChange(ALL_FILTER)}
          className={className}
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-1">
        <ul role="listbox" className="max-h-72 overflow-y-auto">
          <ListRow
            active={value === ALL_FILTER}
            onClick={() => {
              onChange(ALL_FILTER);
              setOpen(false);
            }}
          >
            {allLabel}
          </ListRow>
          {options.map((o) => (
            <ListRow
              key={o.value}
              active={value === o.value}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
            >
              {o.label}
            </ListRow>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}

interface SearchProps extends BaseProps {
  searchPlaceholder: string;
  emptyLabel: string;
}

/** 추천인용 — 검색 기능 포함 */
export function FilterPopoverSearch({
  label,
  value,
  onChange,
  options,
  allLabel,
  searchPlaceholder,
  emptyLabel,
  className,
}: SearchProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value);
  const isSelected = value !== ALL_FILTER && !!selected;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FilterTriggerButton
          label={label}
          selectedLabel={isSelected ? selected!.label : null}
          onClear={() => onChange(ALL_FILTER)}
          className={className}
        />
      </PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-0">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyLabel}</CommandEmpty>
            <CommandGroup>
              <CommandItem
                value={allLabel}
                onSelect={() => {
                  onChange(ALL_FILTER);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 size-4",
                    value === ALL_FILTER ? "opacity-100" : "opacity-0",
                  )}
                />
                {allLabel}
              </CommandItem>
              {options.map((o) => (
                <CommandItem
                  key={o.value}
                  value={o.value}
                  onSelect={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 size-4",
                      value === o.value ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {o.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function ListRow({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <li>
      <button
        type="button"
        role="option"
        aria-selected={active}
        onClick={onClick}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
          active
            ? "bg-accent text-accent-foreground font-medium"
            : "hover:bg-muted",
        )}
      >
        <Check
          className={cn(
            "size-4",
            active ? "opacity-100" : "opacity-0",
          )}
        />
        <span>{children}</span>
      </button>
    </li>
  );
}

const FilterTriggerButton = function FilterTriggerButton({
  ref,
  label,
  selectedLabel,
  onClear: _onClear,
  className,
  ...props
}: {
  ref?: React.Ref<HTMLButtonElement>;
  label: string;
  selectedLabel: string | null;
  onClear: () => void;
  className?: string;
} & React.ComponentProps<typeof Button>) {
  const active = selectedLabel !== null;

  return (
    <Button
      ref={ref}
      variant="outline"
      size="sm"
      className={cn(
        "h-9 gap-1.5 font-normal",
        active &&
          "border-primary bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary",
        className,
      )}
      {...props}
    >
      {active ? (
        <span className="font-medium text-foreground">{selectedLabel}</span>
      ) : (
        <span className="text-muted-foreground">{label}</span>
      )}
      <ChevronDown className="size-3.5 opacity-50" />
    </Button>
  );
};

interface MultiProps {
  label: string;
  values: string[];
  onChange: (next: string[]) => void;
  options: FilterOption[];
  className?: string;
}

/** 복수 선택 필터 — 상태/시술용 */
export function FilterPopoverMulti({
  label,
  values,
  onChange,
  options,
  className,
}: MultiProps) {
  const t = useTranslations("Reservations.filter");
  const [open, setOpen] = useState(false);
  const selected = new Set(values);
  const active = values.length > 0;

  function toggle(v: string) {
    const next = new Set(selected);
    if (next.has(v)) next.delete(v);
    else next.add(v);
    onChange(options.filter((o) => next.has(o.value)).map((o) => o.value));
  }

  const triggerText = active
    ? values.length === 1
      ? options.find((o) => o.value === values[0])?.label ?? label
      : t("selectedCount", { count: values.length })
    : label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "h-9 gap-1.5 font-normal",
            active &&
              "border-primary bg-primary/5 text-primary hover:bg-primary/10 hover:text-primary",
            className,
          )}
        >
          <span
            className={cn(
              active ? "font-medium text-foreground" : "text-muted-foreground",
            )}
          >
            {triggerText}
          </span>
          <ChevronDown className="size-3.5 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-56 p-1">
        <ul role="listbox" aria-multiselectable="true" className="max-h-72 overflow-y-auto">
          {options.map((o) => {
            const checked = selected.has(o.value);
            return (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={checked}
                  onClick={() => toggle(o.value)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                    checked
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted",
                  )}
                >
                  <Checkbox checked={checked} className="pointer-events-none" />
                  <span>{o.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
