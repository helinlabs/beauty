import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { NewReservationForm } from "@/components/admin/new-reservation-form";
import { routing } from "@/i18n/admin/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({
    locale,
    namespace: "ReservationDetail",
  });
  return {
    title: t("newTitle"),
    description: t("newDescription"),
    robots: { index: false, follow: false },
  };
}

export default async function NewReservationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale as (typeof routing.locales)[number]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <NewReservationForm locale={locale} />
    </div>
  );
}
