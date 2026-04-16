"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Referrer, Reservation } from "@/lib/reservations";

// v10: createdAt clamped to <= 2026-04-16
const STORAGE_KEY = "beauty-admin:data:v10";

interface Stored {
  reservations: Reservation[];
  referrers: Referrer[];
}

interface Ctx {
  reservations: Reservation[];
  update: (id: string, patch: Partial<Omit<Reservation, "id">>) => void;
  remove: (id: string) => void;
  getById: (id: string) => Reservation | undefined;
  /** 신규 예약 추가 — 새 id 반환 */
  createReservation: (patch: Omit<Reservation, "id">) => Reservation;
  resetToSeed: () => void;

  referrers: Referrer[];
  referrerNames: string[];
  getReferrerById: (id: string) => Referrer | undefined;
  getReferrerByName: (name: string) => Referrer | undefined;
  /** 이름만 입력된 신규 추천인을 즉시 등록 (태그로 추가되었을 때) */
  ensureReferrer: (name: string) => Referrer;
  updateReferrer: (id: string, patch: Partial<Omit<Referrer, "id">>) => void;
  removeReferrer: (id: string) => void;
}

const DataContext = createContext<Ctx | null>(null);

interface ProviderProps {
  initialReservations: Reservation[];
  initialReferrers: Referrer[];
  children: React.ReactNode;
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function ReservationsProvider({
  initialReservations,
  initialReferrers,
  children,
}: ProviderProps) {
  const [reservations, setReservations] =
    useState<Reservation[]>(initialReservations);
  const [referrers, setReferrers] = useState<Referrer[]>(initialReferrers);
  const [hydrated, setHydrated] = useState(false);

  // localStorage → state
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Stored;
        if (
          parsed &&
          Array.isArray(parsed.reservations) &&
          Array.isArray(parsed.referrers)
        ) {
          setReservations(parsed.reservations);
          setReferrers(parsed.referrers);
        }
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  // state → localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload: Stored = { reservations, referrers };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // ignore
    }
  }, [reservations, referrers, hydrated]);

  const update = useCallback<Ctx["update"]>((id, patch) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );

    // 신규 추천인 자동 등록
    if (patch.referrers) {
      const names = patch.referrers;
      setReferrers((prev) => {
        const byName = new Set(prev.map((r) => r.name));
        const missing = names.filter((n) => n && !byName.has(n));
        if (missing.length === 0) return prev;
        const added = missing.map<Referrer>((name) => ({
          id: randomId("ref"),
          name,
        }));
        return [...prev, ...added];
      });
    }
  }, []);

  const remove = useCallback<Ctx["remove"]>((id) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const createReservation = useCallback<Ctx["createReservation"]>(
    (patch) => {
      const year = new Date().getFullYear();
      // 기존 최대 번호 + 1
      let maxSeq = 0;
      for (const r of reservations) {
        const m = r.id.match(/^R-\d{4}-(\d{4})$/);
        if (m) maxSeq = Math.max(maxSeq, Number(m[1]));
      }
      const seq = String(maxSeq + 1).padStart(4, "0");
      const newId = `R-${year}-${seq}`;
      const created: Reservation = {
        id: newId,
        ...patch,
        createdAt: patch.createdAt ?? new Date().toISOString(),
      };
      setReservations((prev) => [...prev, created]);

      // 새 추천인 자동 등록
      if (patch.referrers?.length) {
        setReferrers((prev) => {
          const byName = new Set(prev.map((r) => r.name));
          const missing = patch.referrers.filter((n) => n && !byName.has(n));
          if (missing.length === 0) return prev;
          const added = missing.map<Referrer>((name) => ({
            id: randomId("ref"),
            name,
          }));
          return [...prev, ...added];
        });
      }

      return created;
    },
    [reservations],
  );

  const getById = useCallback<Ctx["getById"]>(
    (id) => reservations.find((r) => r.id === id),
    [reservations],
  );

  const resetToSeed = useCallback(() => {
    setReservations(initialReservations);
    setReferrers(initialReferrers);
  }, [initialReservations, initialReferrers]);

  const referrerNames = useMemo(
    () =>
      [...new Set(referrers.map((r) => r.name))].sort((a, b) =>
        a.localeCompare(b),
      ),
    [referrers],
  );

  const getReferrerById = useCallback<Ctx["getReferrerById"]>(
    (id) => referrers.find((r) => r.id === id),
    [referrers],
  );

  const getReferrerByName = useCallback<Ctx["getReferrerByName"]>(
    (name) => referrers.find((r) => r.name === name),
    [referrers],
  );

  const ensureReferrer = useCallback<Ctx["ensureReferrer"]>(
    (name) => {
      const trimmed = name.trim();
      const existing = referrers.find((r) => r.name === trimmed);
      if (existing) return existing;
      const created: Referrer = { id: randomId("ref"), name: trimmed };
      setReferrers((prev) => [...prev, created]);
      return created;
    },
    [referrers],
  );

  const updateReferrer = useCallback<Ctx["updateReferrer"]>(
    (id, patch) => {
      setReferrers((prev) => {
        const target = prev.find((r) => r.id === id);
        if (!target) return prev;
        const nextName = patch.name ?? target.name;

        // 이름이 변경되면 연결된 예약의 referrers[] 및 transferStatuses key도 갱신
        if (patch.name && patch.name !== target.name) {
          setReservations((reservPrev) =>
            reservPrev.map((r) => {
              const includes = r.referrers.includes(target.name);
              if (!includes && !r.transferStatuses?.[target.name]) return r;

              const nextReferrers = r.referrers.map((n) =>
                n === target.name ? nextName : n,
              );

              let nextTransfers = r.transferStatuses;
              if (r.transferStatuses && target.name in r.transferStatuses) {
                nextTransfers = { ...r.transferStatuses };
                nextTransfers[nextName] = nextTransfers[target.name];
                delete nextTransfers[target.name];
              }

              return {
                ...r,
                referrers: nextReferrers,
                transferStatuses: nextTransfers,
              };
            }),
          );
        }

        return prev.map((r) => (r.id === id ? { ...r, ...patch } : r));
      });
    },
    [],
  );

  const removeReferrer = useCallback<Ctx["removeReferrer"]>((id) => {
    setReferrers((prev) => {
      const target = prev.find((r) => r.id === id);
      if (!target) return prev;

      // 연결된 예약에서도 제거
      setReservations((reservPrev) =>
        reservPrev.map((r) => {
          if (!r.referrers.includes(target.name)) return r;
          const nextReferrers = r.referrers.filter(
            (n) => n !== target.name,
          );
          let nextTransfers = r.transferStatuses;
          if (r.transferStatuses && target.name in r.transferStatuses) {
            nextTransfers = { ...r.transferStatuses };
            delete nextTransfers[target.name];
          }
          return {
            ...r,
            referrers: nextReferrers,
            transferStatuses: nextTransfers,
          };
        }),
      );

      return prev.filter((r) => r.id !== id);
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      reservations,
      update,
      remove,
      getById,
      createReservation,
      resetToSeed,
      referrers,
      referrerNames,
      getReferrerById,
      getReferrerByName,
      ensureReferrer,
      updateReferrer,
      removeReferrer,
    }),
    [
      reservations,
      update,
      remove,
      getById,
      createReservation,
      resetToSeed,
      referrers,
      referrerNames,
      getReferrerById,
      getReferrerByName,
      ensureReferrer,
      updateReferrer,
      removeReferrer,
    ],
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useReservations() {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error(
      "useReservations must be used within a ReservationsProvider",
    );
  }
  return ctx;
}
