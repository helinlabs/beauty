"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";

export type ReservationView = "list" | "month";

/** localStorage 키 — 마지막으로 본 예약 관리 탭 */
const VIEW_STORAGE_KEY = "admin:reservationsView";

function parseView(v: string | null): ReservationView {
  if (v === "month") return "month";
  return "list";
}

export function useReservationsNav() {
  const router = useRouter();
  const pathname = usePathname();
  const search = useSearchParams();

  const state = useMemo(
    () => ({
      view: parseView(search.get("view")),
      detailId: search.get("detailId"),
      newOpen: search.get("new") === "1",
      initialDate: search.get("date"),
    }),
    [search],
  );

  // 예약 관리 페이지에서의 뷰 상태를 기억/복원
  const restoredRef = useRef(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!/\/admin\/reservations(?:\/|$|\?)/.test(pathname)) return;

    const urlView = search.get("view");

    // URL 에 view 가 명시되면 항상 그 값을 저장 — 이후 진입 시 복원용
    if (urlView) {
      window.localStorage.setItem(VIEW_STORAGE_KEY, parseView(urlView));
      return;
    }

    // view 가 없는 진입일 때, 세션당 한 번만 저장된 값으로 복원 시도
    if (restoredRef.current) return;
    restoredRef.current = true;

    const stored = window.localStorage.getItem(VIEW_STORAGE_KEY);
    if (stored === "month") {
      const sp = new URLSearchParams(search.toString());
      sp.set("view", "month");
      router.replace(`${pathname}?${sp.toString()}`, { scroll: false });
    }
  }, [pathname, search, router]);

  const buildUrl = useCallback(
    (mut: (sp: URLSearchParams) => void) => {
      const sp = new URLSearchParams(search.toString());
      mut(sp);
      const q = sp.toString();
      return q ? `${pathname}?${q}` : pathname;
    },
    [pathname, search],
  );

  const setView = useCallback(
    (v: ReservationView) => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(VIEW_STORAGE_KEY, v);
      }
      router.replace(
        buildUrl((sp) => {
          if (v === "list") sp.delete("view");
          else sp.set("view", v);
          sp.delete("detailId");
          sp.delete("new");
          sp.delete("date");
        }),
        { scroll: false },
      );
    },
    [router, buildUrl],
  );

  const openDetail = useCallback(
    (id: string) => {
      router.push(
        buildUrl((sp) => {
          sp.set("detailId", id);
          sp.delete("new");
          sp.delete("date");
        }),
        { scroll: false },
      );
    },
    [router, buildUrl],
  );

  const openNew = useCallback(
    (initialDate?: string) => {
      router.push(
        buildUrl((sp) => {
          sp.set("new", "1");
          if (initialDate) sp.set("date", initialDate);
          else sp.delete("date");
          sp.delete("detailId");
        }),
        { scroll: false },
      );
    },
    [router, buildUrl],
  );

  const close = useCallback(() => {
    router.replace(
      buildUrl((sp) => {
        sp.delete("detailId");
        sp.delete("new");
        sp.delete("date");
      }),
      { scroll: false },
    );
  }, [router, buildUrl]);

  return { ...state, setView, openDetail, openNew, close };
}
