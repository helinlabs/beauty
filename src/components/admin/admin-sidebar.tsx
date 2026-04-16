"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import {
  CalendarCheck,
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  Plus,
  Users,
} from "lucide-react";

import { Button } from "@/components/admin/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/admin/ui/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/admin/ui/sidebar";
import { logoutAction } from "@/lib/admin-auth";

export interface AdminSidebarNavItem {
  href: string;
  label: string;
  key: string;
}

interface Props {
  brand: string;
  email: string;
  sectionLabel: string;
  items: AdminSidebarNavItem[];
  newReservationHref: string;
  newReservationLabel: string;
  logoutLabel: string;
}

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  dashboard: LayoutDashboard,
  reservations: CalendarCheck,
  referrers: Users,
};

export function AdminSidebar({
  brand,
  email,
  sectionLabel,
  items,
  newReservationHref,
  newReservationLabel,
  logoutLabel,
}: Props) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleNavClick() {
    if (isMobile) setOpenMobile(false);
  }

  function onLogout() {
    startTransition(async () => {
      // locale은 URL prefix 기준으로 서버 액션이 리다이렉트 경로를 결정
      const seg = window.location.pathname.split("/")[1] || "ko";
      await logoutAction(seg);
    });
  }

  return (
    <Sidebar collapsible="offcanvas">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
              <PopoverTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-semibold">
                    {brand.slice(0, 1).toUpperCase()}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{brand}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 opacity-60" />
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent
                align="start"
                side="right"
                sideOffset={8}
                className="w-56 p-1"
              >
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium truncate">{brand}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {email}
                  </p>
                </div>
                <div className="my-1 h-px bg-border" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  disabled={pending}
                  className="w-full justify-start text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="mr-1 size-4" />
                  {logoutLabel}
                </Button>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <Button asChild size="lg" className="w-full">
              <Link href={newReservationHref} onClick={handleNavClick}>
                <Plus className="size-4" />
                {newReservationLabel}
              </Link>
            </Button>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{sectionLabel}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const Icon = ICONS[item.key];
                const active =
                  pathname === item.href ||
                  pathname.startsWith(item.href + "/");
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={active}
                      tooltip={item.label}
                      className="py-3 h-auto"
                    >
                      <Link href={item.href} onClick={handleNavClick}>
                        {Icon ? <Icon className="size-4" /> : null}
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
