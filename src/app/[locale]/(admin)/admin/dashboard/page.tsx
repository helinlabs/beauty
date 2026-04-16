import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { DashboardView } from "@/components/admin/dashboard-view";
import { routing } from "@/i18n/admin/routing";
import { getSession } from "@/lib/admin-auth";
import { absoluteUrl, buildLanguageAlternates } from "@/lib/admin-site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({
    locale,
    namespace: "Metadata.dashboard",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: absoluteUrl(`/${locale}/admin/dashboard`),
      languages: buildLanguageAlternates("/admin/dashboard"),
    },
    robots: { index: false, follow: false },
  };
}

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as (typeof routing.locales)[number]);
  const session = await getSession();

  return (
    <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8 sm:py-8 lg:px-10">
      <DashboardView locale={locale} email={session?.email ?? ""} />
    </div>
  );
}
