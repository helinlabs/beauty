import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/admin/login-form";
import { LocaleSwitcher } from "@/components/admin/locale-switcher";
import { routing } from "@/i18n/admin/routing";
import { absoluteUrl, buildLanguageAlternates } from "@/lib/admin-site";
import { getSession } from "@/lib/admin-auth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: "Metadata.login" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: absoluteUrl(`/${locale}/admin-login`),
      languages: buildLanguageAlternates("/admin-login"),
    },
    robots: { index: false, follow: false },
  };
}

export default async function AdminLoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as (typeof routing.locales)[number]);

  // 이미 로그인한 경우 예약자 관리가 메인
  const session = await getSession();
  if (session) {
    redirect(`/${locale}/admin/reservations`);
  }

  const t = await getTranslations("Login");
  const tNav = await getTranslations("Nav");

  return (
    <div className="flex min-h-svh flex-col">
      <header className="flex items-center justify-between px-4 py-4 sm:px-6">
        <span className="font-heading text-lg font-semibold tracking-tight">
          {t("brand")}
        </span>
        <LocaleSwitcher
          locales={[...routing.locales]}
          currentLocale={locale}
          label={tNav("language")}
          labels={{ ko: tNav("korean"), en: tNav("english") }}
        />
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm rounded-xl border bg-card p-6 shadow-sm sm:p-8">
          <div className="mb-6 space-y-1.5 text-center">
            <h1 className="font-heading text-2xl font-semibold tracking-tight">
              {t("heading")}
            </h1>
            <p className="text-sm text-muted-foreground">{t("subheading")}</p>
          </div>
          <LoginForm locale={locale} />
        </div>
      </main>
    </div>
  );
}
