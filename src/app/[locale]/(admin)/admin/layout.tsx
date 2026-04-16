import { redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { hasLocale } from "next-intl";

import { routing } from "@/i18n/admin/routing";
import { getSession } from "@/lib/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";
import { ReservationsProvider } from "@/providers/reservations-provider";
import {
  reservations as seedReservations,
  referrers as seedReferrers,
} from "@/lib/reservations";

export default async function AdminLayout({
  children,
  modal,
  params,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    redirect(`/${routing.defaultLocale}`);
  }
  setRequestLocale(locale as (typeof routing.locales)[number]);

  const session = await getSession();
  if (!session) {
    redirect(`/${locale}/admin-login`);
  }

  const tSidebar = await getTranslations("Sidebar");
  const tNav = await getTranslations("Nav");
  const tAccount = await getTranslations("Account");

  const navItems = [
    {
      key: "dashboard",
      href: `/${locale}/admin/dashboard`,
      label: tSidebar("dashboard"),
    },
    {
      key: "reservations",
      href: `/${locale}/admin/reservations`,
      label: tSidebar("reservations"),
    },
    {
      key: "referrers",
      href: `/${locale}/admin/referrers`,
      label: tSidebar("referrers"),
    },
  ];

  return (
    <ReservationsProvider
      initialReservations={seedReservations}
      initialReferrers={seedReferrers}
    >
      <AdminShell
        locale={locale}
        email={session.email}
        navItems={navItems}
        labels={{
          brand: tSidebar("brand"),
          sectionMain: tSidebar("sectionMain"),
          newReservation: tSidebar("newReservation"),
          language: tNav("language"),
          korean: tNav("korean"),
          english: tNav("english"),
          openMenu: tNav("openMenu"),
          closeMenu: tNav("closeMenu"),
          logout: tAccount("logout"),
          signedInAs: tAccount("signedInAs", { email: session.email }),
          toggleTheme: tNav("toggleTheme"),
        }}
        newReservationHref={`/${locale}/admin/reservations?new=1`}
      >
        {children}
        {modal}
      </AdminShell>
    </ReservationsProvider>
  );
}
