import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ReservationEditor } from "@/components/admin/reservation-editor";
import { routing } from "@/i18n/admin/routing";
import { absoluteUrl, buildLanguageAlternates } from "@/lib/admin-site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({
    locale,
    namespace: "Metadata.reservationDetail",
  });
  return {
    title: `${t("title")} · ${id}`,
    description: t("description"),
    alternates: {
      canonical: absoluteUrl(`/${locale}/admin/reservations/${id}`),
      languages: buildLanguageAlternates(`/admin/reservations/${id}`),
    },
    robots: { index: false, follow: false },
  };
}

export default async function ReservationDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  setRequestLocale(locale as (typeof routing.locales)[number]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <ReservationEditor id={id} locale={locale} />
    </div>
  );
}
