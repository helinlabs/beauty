import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ReferrersContainer } from "@/components/admin/referrers-container";
import { ReferrersTitle } from "@/components/admin/referrers-title";
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
    namespace: "Metadata.referrers",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: absoluteUrl(`/${locale}/admin/referrers`),
      languages: buildLanguageAlternates("/admin/referrers"),
    },
    robots: { index: false, follow: false },
  };
}

export default async function ReferrersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as (typeof routing.locales)[number]);

  return (
    <div className="mx-auto max-w-5xl px-6 py-6 sm:px-8 sm:py-8 lg:px-10">
      <div className="mb-5 flex h-14 items-center">
        <ReferrersTitle />
      </div>
      <ReferrersContainer locale={locale} />
    </div>
  );
}
