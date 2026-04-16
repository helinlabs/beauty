"use client";

import { useFormStatus } from "react-dom";
import { useTranslations } from "next-intl";

import { loginAction } from "@/lib/admin-auth";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Label } from "@/components/admin/ui/label";

function SubmitButton() {
  const t = useTranslations("Login");
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? t("submitting") : t("submit")}
    </Button>
  );
}

export function LoginForm({ locale }: { locale: string }) {
  const t = useTranslations("Login");

  return (
    <form action={loginAction} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />

      <div className="space-y-2">
        <Label htmlFor="email">{t("emailLabel")}</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder={t("emailPlaceholder")}
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("passwordLabel")}</Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder={t("passwordPlaceholder")}
          autoComplete="current-password"
          required
        />
      </div>

      <SubmitButton />

      <p className="text-xs text-muted-foreground text-center">
        {t("demoHint")}
      </p>
    </form>
  );
}
