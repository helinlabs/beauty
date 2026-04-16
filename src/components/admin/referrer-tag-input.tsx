"use client";

import { useMemo, useRef, useState } from "react";
import { X } from "lucide-react";

import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from "@/components/admin/ui/popover";
import { cn } from "@/lib/admin-utils";

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  /** 기존 추천인 이름 목록 (autocomplete suggestions) */
  suggestions?: string[];
  suggestionsHeading?: string;
  placeholder?: string;
  removeLabel?: string;
  id?: string;
}

const MAX_VISIBLE_SUGGESTIONS = 8;

export function ReferrerTagInput({
  value,
  onChange,
  suggestions = [],
  suggestionsHeading,
  placeholder,
  removeLabel = "Remove",
  id,
}: Props) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return [];
    return suggestions
      .filter((s) => !value.includes(s) && s.toLowerCase().includes(q))
      .slice(0, MAX_VISIBLE_SUGGESTIONS);
  }, [suggestions, value, input]);

  function addTag(name: string) {
    const trimmed = name.trim().replace(/,$/g, "").trim();
    if (!trimmed) return;
    if (value.includes(trimmed)) {
      setInput("");
      return;
    }
    onChange([...value, trimmed]);
    setInput("");
    setActiveIdx(0);
    setOpen(false);
  }

  function removeAt(i: number) {
    onChange(value.filter((_, idx) => idx !== i));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown" && filtered.length > 0) {
      e.preventDefault();
      setOpen(true);
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
      return;
    }
    if (e.key === "ArrowUp" && filtered.length > 0) {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (filtered.length > 0 && activeIdx >= 0 && activeIdx < filtered.length) {
        addTag(filtered[activeIdx]);
      } else {
        addTag(input);
      }
      return;
    }
    if (e.key === "Backspace" && input === "" && value.length > 0) {
      e.preventDefault();
      removeAt(value.length - 1);
      return;
    }
    if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const showSuggestions = open && filtered.length > 0;

  return (
    <Popover
      open={showSuggestions}
      onOpenChange={(next) => {
        if (!next) setOpen(false);
      }}
    >
      <PopoverAnchor asChild>
        <div
          className={cn(
            "flex min-h-9 flex-wrap items-center gap-1.5 rounded-lg border bg-transparent px-2 py-1.5 text-sm transition-colors",
            "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
          )}
          onClick={() => inputRef.current?.focus()}
        >
          {value.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary"
            >
              {name}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeAt(i);
                }}
                aria-label={removeLabel}
                className="inline-flex rounded-sm p-0.5 text-primary/70 hover:bg-primary/20 hover:text-primary"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}
          <input
            ref={inputRef}
            id={id}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setActiveIdx(0);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
            onKeyDown={onKeyDown}
            placeholder={value.length === 0 ? placeholder : ""}
            className="flex-1 min-w-[120px] bg-transparent py-0.5 outline-none placeholder:text-muted-foreground"
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => {
          // 인풋에 포커스가 남아있도록
          if (inputRef.current?.contains(e.target as Node)) e.preventDefault();
        }}
        className="w-[var(--radix-popover-trigger-width)] min-w-64 p-1"
      >
        {suggestionsHeading && (
          <p className="px-2 pb-1 pt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {suggestionsHeading}
          </p>
        )}
        <ul role="listbox">
          {filtered.map((s, i) => (
            <li key={s}>
              <button
                type="button"
                role="option"
                aria-selected={i === activeIdx}
                onMouseEnter={() => setActiveIdx(i)}
                onMouseDown={(e) => {
                  // blur를 막아 인풋 포커스 유지
                  e.preventDefault();
                }}
                onClick={() => addTag(s)}
                className={cn(
                  "w-full rounded-md px-2 py-1.5 text-left text-sm",
                  i === activeIdx
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted",
                )}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
