/**
 * Writes a fresh "consultation" Reservation into the admin's
 * localStorage-backed store whenever someone submits the ContactModal.
 *
 * The admin app (ReservationsProvider) hydrates from `STORAGE_KEY` on
 * mount and writes back on state changes; by mutating the same key
 * before the WhatsApp redirect we effectively "push" a new consultation
 * request into the admin list without needing a backend. The next time
 * an admin opens the dashboard it re-reads the store and sees the row.
 *
 * This mirrors the pattern already in use across the admin routes and
 * keeps the main site stateless — no React context crossing between
 * (main) and (admin) route groups.
 */
import type {
  Reservation,
  ReservationLanguage,
  Referrer,
} from '@/lib/reservations';

const STORAGE_KEY = 'beauty-admin:data:v10';

interface Stored {
  reservations: Reservation[];
  referrers: Referrer[];
}

export interface LeadPayload {
  name: string;
  phone: string;
  language?: ReservationLanguage;
  /** Influencer display name that referred the visitor, if any. Gets
   *  appended to `reservation.referrers` and auto-added to the
   *  `referrers` list so the admin can track attribution. */
  referrerName?: string;
}

function randomId(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function nextReservationId(existing: Reservation[]) {
  const year = new Date().getFullYear();
  let maxSeq = 0;
  for (const r of existing) {
    const m = r.id.match(/^R-\d{4}-(\d{4})$/);
    if (m) maxSeq = Math.max(maxSeq, Number(m[1]));
  }
  const seq = String(maxSeq + 1).padStart(4, '0');
  return `R-${year}-${seq}`;
}

function readStore(): Stored {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { reservations: [], referrers: [] };
    const parsed = JSON.parse(raw) as Stored;
    return {
      reservations: Array.isArray(parsed?.reservations)
        ? parsed.reservations
        : [],
      referrers: Array.isArray(parsed?.referrers) ? parsed.referrers : [],
    };
  } catch {
    return { reservations: [], referrers: [] };
  }
}

function writeStore(store: Stored) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // quota / private mode — nothing to do, the WhatsApp redirect still
    // runs so the clinic gets the lead even if admin sync fails.
  }
}

export function submitLeadToAdmin(lead: LeadPayload): Reservation | null {
  if (typeof window === 'undefined') return null;

  const store = readStore();

  const referrers = lead.referrerName ? [lead.referrerName] : [];
  const now = new Date();
  // Several admin views call `new Date(r.date)` / `.slice(0, 10)` on the
  // date string, so an empty placeholder would crash the table. Use the
  // creation time (in `datetime-local` shape) as a sensible default —
  // admins edit it when they actually schedule the procedure.
  const datetimeLocal = now.toISOString().slice(0, 16);

  const reservation: Reservation = {
    id: nextReservationId(store.reservations),
    name: lead.name.trim(),
    phone: lead.phone.trim(),
    date: datetimeLocal,
    createdAt: now.toISOString(),
    status: 'consultation',
    language: lead.language ?? 'en',
    treatments: [],
    hospital: 'view',
    referrers,
  };

  const nextReferrers: Referrer[] = [...store.referrers];
  if (lead.referrerName) {
    const exists = nextReferrers.some((r) => r.name === lead.referrerName);
    if (!exists) {
      nextReferrers.push({ id: randomId('ref'), name: lead.referrerName });
    }
  }

  writeStore({
    reservations: [...store.reservations, reservation],
    referrers: nextReferrers,
  });

  return reservation;
}
