"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/admin/ui/button";
import { cn } from "@/lib/admin-utils";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB

interface Props {
  value: string[];
  onChange: (next: string[]) => void;
  className?: string;
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function PhotoUploader({ value, onChange, className }: Props) {
  const t = useTranslations("ReservationDetail");
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  async function addFiles(files: FileList | File[]) {
    setError(null);
    const imgs = Array.from(files).filter((f) => f.type.startsWith("image/"));
    const accepted: File[] = [];
    for (const f of imgs) {
      if (f.size > MAX_FILE_BYTES) {
        setError(t("photoTooLarge", { filename: f.name }));
        continue;
      }
      accepted.push(f);
    }
    if (accepted.length === 0) return;
    const urls = await Promise.all(accepted.map(readAsDataURL));
    onChange([...value, ...urls]);
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div className={cn("space-y-2", className)}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files?.length) {
            void addFiles(e.dataTransfer.files);
          }
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center gap-1 rounded-md border border-dashed px-4 py-6 text-center transition-colors",
          dragOver
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50 hover:bg-muted/40",
        )}
      >
        <ImagePlus className="size-5 text-muted-foreground" />
        <span className="text-sm font-medium">{t("addPhotos")}</span>
        <span className="text-xs text-muted-foreground">{t("photoHint")}</span>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        multiple
        className="sr-only"
        onChange={(e) => {
          if (e.target.files?.length) {
            void addFiles(e.target.files);
          }
          // 같은 파일 재선택 허용을 위해 리셋
          e.target.value = "";
        }}
      />

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}

      {value.length > 0 && (
        <ul className="grid grid-cols-3 gap-2 sm:grid-cols-4">
          {value.map((src, i) => (
            <li
              key={i}
              className="group relative aspect-square overflow-hidden rounded-md border bg-muted"
            >
              {/* data URL; next/image 대신 네이티브 img */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
              />
              <Button
                type="button"
                size="icon"
                variant="secondary"
                aria-label={t("removePhoto")}
                onClick={() => remove(i)}
                className="absolute right-1 top-1 size-6 rounded-full opacity-0 shadow transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
              >
                <X className="size-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
