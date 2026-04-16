import { Suspense } from "react";
import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ReservationsContainer } from "@/components/admin/reservations-container";
import { routing } from "@/i18n/admin/routing";
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
    namespace: "Metadata.reservations",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: absoluteUrl(`/${locale}/admin/reservations`),
      languages: buildLanguageAlternates("/admin/reservations"),
    },
    robots: { index: false, follow: false },
  };
}

export default async function ReservationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as (typeof routing.locales)[number]);

  return (
    <div className="mx-auto max-w-7xl px-6 py-6 sm:px-8 sm:py-8 lg:px-10">
      <Suspense>
        <ReservationsContainer locale={locale} />
      </Suspense>
    </div>
  );
}
