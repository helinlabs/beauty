"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/admin/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/admin/ui/tabs";
import {
  AdminSidebar,
  type AdminSidebarNavItem,
} from "@/components/admin/admin-sidebar";
import { LocaleToggle } from "@/components/admin/locale-toggle";
import { ThemeToggle } from "@/components/admin/theme-toggle";
import {
  useReservationsNav,
  type ReservationView,
} from "@/lib/use-reservations-nav";
import type { Locale } from "@/i18n/admin/routing";

interface Props {
  locale: Locale;
  labels: {
    brand: string;
    sectionMain: string;
    newReservation: string;
    language: string;
    korean: string;
    english: string;
    openMenu: string;
    closeMenu: string;
    logout: string;
    signedInAs: string;
    toggleTheme: string;
  };
  email: string;
  navItems: AdminSidebarNavItem[];
  newReservationHref: string;
  children: React.ReactNode;
}

function ReservationsViewTabs() {
  const tV = useTranslations("Calendar.views");
  const { view, setView } = useReservationsNav();

  return (
    <Tabs
      value={view}
      onValueChange={(v) => setView(v as ReservationView)}
    >
      {/* 외부 rounded-lg + 내부 rounded-md (shadcn 기본), 상하 패딩 p-1 로 선택 박스의 여백 자연스럽게 */}
      <TabsList className="h-10 p-1">
        <TabsTrigger value="list" className="px-6">
          {tV("list")}
        </TabsTrigger>
        <TabsTrigger value="month" className="px-6">
          {tV("month")}
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}

export function AdminShell({
  locale,
  labels,
  email,
  navItems,
  newReservationHref,
  children,
}: Props) {
  const pathname = usePathname();
  const showTabs =
    /\/admin\/reservations(?:\/?$|\/(?!new))/.test(pathname);

  return (
    <SidebarProvider>
      <AdminSidebar
        brand={labels.brand}
        email={email}
        sectionLabel={labels.sectionMain}
        items={navItems}
        newReservationHref={newReservationHref}
        newReservationLabel={labels.newReservation}
        logoutLabel={labels.logout}
      />
      <SidebarInset>
        {/* 페이지 컨테이너와 동일한 좌측 패딩으로 타이틀과 좌측정렬 */}
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 bg-background px-6 sm:px-8 lg:px-10">
          <SidebarTrigger
            aria-label={labels.openMenu}
            className="md:hidden -ml-2"
          />
          {showTabs && <ReservationsViewTabs />}
          <div className="ml-auto flex items-center gap-1">
            <LocaleToggle
              currentLocale={locale}
              label={labels.language}
            />
            <ThemeToggle label={labels.toggleTheme} />
          </div>
        </header>
        <main className="min-w-0 flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
