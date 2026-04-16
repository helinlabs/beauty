export type ReservationStatus =
  | "consultation"
  | "confirmed"
  | "completed"
  | "cancelled";

export type ReservationLanguage = "en" | "es" | "ja";

export type Treatment =
  | "breast"
  | "facialContour"
  | "doubleJaw"
  | "eye"
  | "rhinoplasty"
  | "liposuction"
  | "antiAging"
  | "maleSurgery"
  | "dermatology"
  | "hairTransplant"
  | "stemCell";

export type Hospital = "view" | "deo";

/** 추천인 커미션 송금 상태 */
export type TransferStatus = "pending" | "paid";

export const hospitalOptions: Hospital[] = ["view", "deo"];

export const treatmentOptions: Treatment[] = [
  "breast",
  "facialContour",
  "doubleJaw",
  "eye",
  "rhinoplasty",
  "liposuction",
  "antiAging",
  "maleSurgery",
  "dermatology",
  "hairTransplant",
  "stemCell",
];

export const treatmentPrices: Record<Treatment, number> = {
  breast: 8_000_000,
  facialContour: 12_000_000,
  doubleJaw: 25_000_000,
  eye: 3_500_000,
  rhinoplasty: 6_500_000,
  liposuction: 5_500_000,
  antiAging: 1_500_000,
  maleSurgery: 4_000_000,
  dermatology: 800_000,
  hairTransplant: 7_500_000,
  stemCell: 3_000_000,
};

/** 계약금 비율 — 총 견적의 10% */
export const DEPOSIT_RATE = 0.1;
/** 추천인 커미션 비율 — 견적의 5%. 추천인이 여러명이면 균등 분배 */
export const COMMISSION_RATE = 0.05;

export interface Reservation {
  id: string;
  name: string;
  phone: string;
  /** 시술 예약일 (datetime-local 형식) */
  date: string;
  /** 해당 예약 row 생성일 (ISO-8601) */
  createdAt?: string;
  status: ReservationStatus;
  language: ReservationLanguage;
  treatments: Treatment[];
  hospital: Hospital;
  /** 추천인 이름 목록 */
  referrers: string[];
  /** 추천인별 송금 상태 (key: 추천인 이름) */
  transferStatuses?: Record<string, TransferStatus>;
  photos?: string[];
  depositPaid?: boolean;
  notes?: string;
}

export interface ReferrerBankInfo {
  /** 예금주 이름 (first name) */
  holderFirstName?: string;
  /** 예금주 성 (last name) */
  holderLastName?: string;
  /** 은행 이름 */
  bankName?: string;
  /** 계좌번호 */
  accountNumber?: string;
  /** 은행 주소 */
  bankAddress?: string;
  /** SWIFT 코드 */
  swiftCode?: string;
  /** Routing Number (ABA 번호) */
  routingNumber?: string;
}

export interface Referrer {
  id: string;
  name: string;
  phone?: string;
  /** 고객과 공유할 URL slug. 없으면 이름에서 자동 생성 */
  slug?: string;
  /** 송금용 은행 계좌 정보 */
  bank?: ReferrerBankInfo;
}

const rawReservations: Reservation[] = [
  // ───── 2026-03 (지난 달) — KPI 트렌드 비교용 시드 ─────
  {
    id: "R-2026-H001",
    name: "Grace Park",
    phone: "+1 (213) 555-0201",
    date: "2026-03-05T10:00",
    status: "completed",
    language: "en",
    treatments: ["dermatology"],
    hospital: "view",
    depositPaid: true,
    referrers: ["Jenna Park"],
    transferStatuses: { "Jenna Park": "paid" },
    notes: "레이저 토닝 세션 — 만족도 높음",
  },
  {
    id: "R-2026-H002",
    name: "Daniel Kim",
    phone: "+1 (646) 555-0202",
    date: "2026-03-08T14:30",
    status: "cancelled",
    language: "en",
    treatments: ["antiAging"],
    hospital: "view",
    referrers: ["Kayla Williams"],
    notes: "개인 사정으로 시술 당일 취소",
  },
  {
    id: "R-2026-H003",
    name: "Hana Sato",
    phone: "+81 90-2345-6789",
    date: "2026-03-11T09:15",
    status: "completed",
    language: "ja",
    treatments: ["eye"],
    hospital: "deo",
    depositPaid: true,
    referrers: ["Akari Nakamura"],
    transferStatuses: { "Akari Nakamura": "pending" },
    notes: "術後フォロー予定 — 日本語対応",
  },
  {
    id: "R-2026-H004",
    name: "Oscar Lopez",
    phone: "+1 (305) 555-0204",
    date: "2026-03-14T16:00",
    status: "cancelled",
    language: "es",
    treatments: ["rhinoplasty"],
    hospital: "view",
    referrers: ["Sofia Rodriguez"],
    notes: "Paciente canceló por motivos de salud",
  },
  {
    id: "R-2026-H005",
    name: "Ruby Chen",
    phone: "+1 (415) 555-0205",
    date: "2026-03-18T11:00",
    status: "consultation",
    language: "en",
    treatments: ["facialContour"],
    hospital: "view",
    referrers: ["Dr. Mike Chen"],
    notes: "지인 추천으로 상담 요청",
  },
  {
    id: "R-2026-H006",
    name: "Tom Bailey",
    phone: "+1 (702) 555-0206",
    date: "2026-03-22T13:30",
    status: "cancelled",
    language: "en",
    treatments: ["hairTransplant"],
    hospital: "view",
    referrers: ["Kayla Williams"],
  },
  {
    id: "R-2026-H007",
    name: "Lily Wong",
    phone: "+1 (212) 555-0207",
    date: "2026-03-25T15:45",
    status: "completed",
    language: "en",
    treatments: ["dermatology", "antiAging"],
    hospital: "view",
    depositPaid: true,
    referrers: ["Jenna Park"],
    transferStatuses: { "Jenna Park": "paid" },
    notes: "이중 시술 패키지 — 피부과 + 안티에이징",
  },
  {
    id: "R-2026-H008",
    name: "Marco Rossi",
    phone: "+1 (617) 555-0208",
    date: "2026-03-28T10:30",
    status: "confirmed",
    language: "en",
    treatments: ["maleSurgery"],
    hospital: "view",
    depositPaid: true,
    referrers: ["Sofia Rodriguez"],
    notes: "Paid deposit via wire transfer",
  },
  {
    id: "R-2026-H009",
    name: "Priya Patel",
    phone: "+1 (408) 555-0209",
    date: "2026-03-30T11:15",
    status: "cancelled",
    language: "en",
    treatments: ["breast"],
    hospital: "view",
    referrers: ["Dr. Mike Chen"],
    notes: "Client rescheduled then cancelled",
  },
  {
    id: "R-2026-H010",
    name: "Chloe Adams",
    phone: "+1 (718) 555-0210",
    date: "2026-03-31T14:00",
    status: "consultation",
    language: "en",
    treatments: ["liposuction"],
    hospital: "view",
    referrers: ["Kayla Williams"],
    notes: "지방흡입 부위 및 회복 기간 문의",
  },
  // ───── 2026-04+ (이번 달 이후) ─────
  {
    id: "R-2026-0001",
    name: "Emma Johnson",
    phone: "+1 (415) 555-0142",
    date: "2026-04-18T10:30",
    status: "consultation",
    language: "en",
    treatments: ["rhinoplasty"],
    hospital: "view",
    referrers: ["Kayla Williams"],
    notes: "Interested in rhinoplasty consultation",
  },
  {
    id: "R-2026-0002",
    name: "Olivia Martinez",
    phone: "+1 (310) 555-0187",
    date: "2026-04-18T14:00",
    status: "confirmed",
    language: "es",
    treatments: ["antiAging", "dermatology"],
    hospital: "view",
    depositPaid: true,
    referrers: ["Sofia Rodriguez"],
    transferStatuses: { "Sofia Rodriguez": "paid" },
    notes: "Prefiere consulta en español",
  },
  {
    id: "R-2026-0003",
    name: "Liam Anderson",
    phone: "+1 (212) 555-0109",
    date: "2026-04-16T11:00",
    status: "completed",
    language: "en",
    treatments: ["rhinoplasty", "facialContour"],
    hospital: "view",
    depositPaid: true,
    referrers: ["Dr. Mike Chen"],
    transferStatuses: { "Dr. Mike Chen": "paid" },
    notes: "Follow-up scheduled for May 2",
  },
  {
    id: "R-2026-0004",
    name: "Ava Thompson",
    phone: "+1 (646) 555-0123",
    date: "2026-04-22T09:00",
    status: "confirmed",
    language: "en",
    treatments: ["antiAging"],
    hospital: "view",
    depositPaid: true,
    referrers: ["Kayla Williams", "Jenna Park"],
    notes: "Returning client — Botox touch-up",
  },
  {
    id: "R-2026-0005",
    name: "Noah Williams",
    phone: "+1 (213) 555-0168",
    date: "2026-04-20T16:30",
    status: "cancelled",
    language: "en",
    treatments: ["hairTransplant"],
    hospital: "view",
    referrers: ["Jenna Park"],
    notes: "Consultation cancelled by client",
  },
  {
    id: "R-2026-0006",
    name: "Sophia Brown",
    phone: "+1 (305) 555-0194",
    date: "2026-04-14T13:00",
    status: "cancelled",
    language: "en",
    treatments: ["liposuction"],
    hospital: "view",
    referrers: ["Dr. Mike Chen"],
    notes: "Cancelled — will reschedule next month",
  },
  {
    id: "R-2026-0007",
    name: "Yui Tanaka",
    phone: "+1 (808) 555-0175",
    date: "2026-04-25T10:00",
    status: "consultation",
    language: "ja",
    treatments: ["eye", "rhinoplasty"],
    hospital: "deo",
    referrers: ["Akari Nakamura"],
    notes: "日本語での対応希望",
  },
  {
    id: "R-2026-0008",
    name: "Mason Davis",
    phone: "+1 (702) 555-0136",
    date: "2026-04-19T15:15",
    status: "confirmed",
    language: "en",
    treatments: ["dermatology", "antiAging"],
    hospital: "view",
    depositPaid: true,
    referrers: ["Jenna Park"],
    transferStatuses: { "Jenna Park": "paid" },
    notes: "Second session — laser treatment",
  },
  {
    id: "R-2026-0009",
    name: "Isabella Garcia",
    phone: "+1 (512) 555-0159",
    date: "2026-04-21T11:45",
    status: "consultation",
    language: "en",
    treatments: ["breast"],
    hospital: "view",
    referrers: ["Kayla Williams"],
    notes: "First-time client",
  },
  {
    id: "R-2026-0010",
    name: "Lucas Wilson",
    phone: "+1 (617) 555-0111",
    date: "2026-04-23T13:30",
    status: "confirmed",
    language: "en",
    treatments: ["maleSurgery"],
    hospital: "view",
    depositPaid: true,
    referrers: ["Sofia Rodriguez"],
  },
  {
    id: "R-2026-0011",
    name: "Mia Robinson",
    phone: "+1 (404) 555-0148",
    date: "2026-04-24T09:45",
    status: "consultation",
    language: "en",
    treatments: ["facialContour", "doubleJaw"],
    hospital: "view",
    referrers: ["Dr. Mike Chen"],
    notes: "Referred by friend who had a great experience",
  },
  {
    id: "R-2026-0012",
    name: "Ethan Clark",
    phone: "+1 (503) 555-0172",
    date: "2026-04-26T14:15",
    status: "cancelled",
    language: "en",
    treatments: ["hairTransplant"],
    hospital: "view",
    referrers: ["Kayla Williams"],
    notes: "일정 충돌로 취소 — 추후 재예약 예정",
  },
  {
    id: "R-2026-0013",
    name: "Charlotte Lewis",
    phone: "+1 (720) 555-0165",
    date: "2026-04-17T10:00",
    status: "confirmed",
    language: "en",
    treatments: ["eye"],
    hospital: "view",
    depositPaid: true,
    referrers: ["Jenna Park"],
    notes: "쌍커풀 수술 예약 확정",
  },
  {
    id: "R-2026-0014",
    name: "James Walker",
    phone: "+1 (480) 555-0183",
    date: "2026-04-27T16:00",
    status: "consultation",
    language: "en",
    treatments: ["stemCell", "antiAging"],
    hospital: "view",
    referrers: ["Akari Nakamura"],
  },
  {
    id: "R-2026-0015",
    name: "Amelia Hall",
    phone: "+1 (312) 555-0191",
    date: "2026-04-29T11:30",
    status: "confirmed",
    language: "en",
    treatments: ["liposuction", "antiAging"],
    hospital: "view",
    depositPaid: true,
    referrers: ["Sofia Rodriguez"],
    notes: "Needs morning appointment",
  },
  {
    id: "R-2026-0016",
    name: "Benjamin Young",
    phone: "+1 (602) 555-0128",
    date: "2026-04-30T09:15",
    status: "cancelled",
    language: "en",
    treatments: ["rhinoplasty"],
    hospital: "view",
    referrers: ["Kayla Williams"],
    notes: "Client preferred another clinic",
  },
  {
    id: "R-2026-0017",
    name: "Harper King",
    phone: "+1 (214) 555-0167",
    date: "2026-05-02T13:00",
    status: "confirmed",
    language: "en",
    treatments: ["breast", "liposuction"],
    hospital: "deo",
    depositPaid: true,
    referrers: ["Dr. Mike Chen"],
    notes: "VIP client — priority scheduling",
  },
  {
    id: "R-2026-0018",
    name: "Elijah Scott",
    phone: "+1 (415) 555-0156",
    date: "2026-05-04T15:45",
    status: "confirmed",
    language: "en",
    treatments: ["dermatology"],
    hospital: "view",
    depositPaid: true,
    referrers: ["Jenna Park"],
  },
  // ───── 2026-03 추가 시드 ─────
  {
    id: "R-2026-H011",
    name: "Noa Cohen",
    phone: "+1 (917) 555-0211",
    date: "2026-03-06T09:30",
    status: "completed",
    language: "en",
    treatments: ["dermatology"],
    hospital: "view",
    depositPaid: true,
    referrers: ["Jenna Park"],
    transferStatuses: { "Jenna Park": "paid" },
    notes: "Skin tone 개선 만족",
  },
  {
    id: "R-2026-H012",
    name: "Kenji Watanabe",
    phone: "+81 90-3456-7890",
    date: "2026-03-12T13:00",
    status: "completed",
    language: "ja",
    treatments: ["hairTransplant"],
    hospital: "view",
    depositPaid: true,
    referrers: ["Akari Nakamura"],
    transferStatuses: { "Akari Nakamura": "paid" },
    notes: "2000 그래프트 완료",
  },
  {
    id: "R-2026-H013",
    name: "Sara Johansson",
    phone: "+1 (917) 555-0213",
    date: "2026-03-19T10:45",
    status: "confirmed",
    language: "en",
    treatments: ["eye", "antiAging"],
    hospital: "view",
    depositPaid: true,
    referrers: ["Kayla Williams"],
    notes: "Booster 추가 상담 예정",
  },
  {
    id: "R-2026-H014",
    name: "Alejandro Ruiz",
    phone: "+1 (305) 555-0214",
    date: "2026-03-24T15:00",
    status: "completed",
    language: "es",
    treatments: ["rhinoplasty"],
    hospital: "deo",
    depositPaid: true,
    referrers: ["Sofia Rodriguez"],
    transferStatuses: { "Sofia Rodriguez": "pending" },
    notes: "Resultados satisfactorios",
  },
  {
    id: "R-2026-H015",
    name: "Mina Oh",
    phone: "+1 (213) 555-0215",
    date: "2026-03-29T11:30",
    status: "consultation",
    language: "en",
    treatments: ["facialContour", "doubleJaw"],
    hospital: "view",
    referrers: ["Dr. Mike Chen"],
    notes: "양악 + 윤곽 패키지 문의",
  },
  // ───── 2026-05 추가 시드 ─────
  {
    id: "R-2026-0019",
    name: "Zoe Patel",
    phone: "+1 (718) 555-0301",
    date: "2026-05-06T10:30",
    status: "confirmed",
    language: "en",
    treatments: ["antiAging"],
    hospital: "view",
    depositPaid: true,
    referrers: ["Kayla Williams"],
    notes: "Botox touch-up session",
  },
  {
    id: "R-2026-0020",
    name: "Jacob Reed",
    phone: "+1 (303) 555-0302",
    date: "2026-05-09T14:00",
    status: "consultation",
    language: "en",
    treatments: ["maleSurgery"],
    hospital: "view",
    referrers: ["Sofia Rodriguez"],
  },
  {
    id: "R-2026-0021",
    name: "Aoi Yamamoto",
    phone: "+81 90-4567-8901",
    date: "2026-05-12T11:15",
    status: "confirmed",
    language: "ja",
    treatments: ["eye"],
    hospital: "deo",
    depositPaid: true,
    referrers: ["Akari Nakamura"],
    notes: "二重埋没法で予約",
  },
  {
    id: "R-2026-0022",
    name: "Olivia Hughes",
    phone: "+1 (646) 555-0304",
    date: "2026-05-15T09:00",
    status: "consultation",
    language: "en",
    treatments: ["breast"],
    hospital: "view",
    referrers: ["Dr. Mike Chen"],
    notes: "가슴 축소술 문의",
  },
  {
    id: "R-2026-0023",
    name: "Carlos Mendoza",
    phone: "+1 (305) 555-0305",
    date: "2026-05-20T16:45",
    status: "confirmed",
    language: "es",
    treatments: ["liposuction", "antiAging"],
    hospital: "view",
    depositPaid: true,
    referrers: ["Sofia Rodriguez"],
    notes: "Depósito confirmado por wire",
  },
];

/**
 * 시드 엔트리에 createdAt 이 없으면 자동 채운다.
 * - 시술 예약일 기준 7일 전으로 기본 계산
 * - 단, 오늘(2026-04-16) 이후 날짜는 id 기반 해시로 1~14일 전으로 분산 클램프
 *   → 모든 createdAt 이 2026-04-16 이전으로 유지됨
 */
const SEED_TODAY = new Date("2026-04-16T12:00:00");

function withDefaultCreatedAt(r: Reservation): Reservation {
  if (r.createdAt) return r;
  const candidate = new Date(r.date);
  candidate.setDate(candidate.getDate() - 7);

  if (candidate <= SEED_TODAY) {
    return { ...r, createdAt: candidate.toISOString() };
  }

  // id 끝 숫자 기반 분산 offset (1~14일)
  const digits = r.id.replace(/\D/g, "");
  const seq = digits ? parseInt(digits, 10) : 0;
  const dayOffset = (seq % 14) + 1;
  const hourOffset = (seq * 3) % 24;

  const clamped = new Date(SEED_TODAY);
  clamped.setDate(clamped.getDate() - dayOffset);
  clamped.setHours(clamped.getHours() - hourOffset);
  return { ...r, createdAt: clamped.toISOString() };
}

export const reservations: Reservation[] = rawReservations.map(
  withDefaultCreatedAt,
);

/** 기본 추천인 시드 (연락처 포함) */
export const referrers: Referrer[] = [
  { id: "ref_kayla", name: "Kayla Williams", phone: "+1 (646) 555-0301" },
  { id: "ref_sofia", name: "Sofia Rodriguez", phone: "+1 (305) 555-0302" },
  { id: "ref_mike", name: "Dr. Mike Chen", phone: "+1 (415) 555-0303" },
  { id: "ref_jenna", name: "Jenna Park", phone: "+1 (213) 555-0304" },
  { id: "ref_akari", name: "Akari Nakamura", phone: "+81 90-1234-5678" },
];

export const statusOptions: ReservationStatus[] = [
  "consultation",
  "confirmed",
  "completed",
  "cancelled",
];

export const languageOptions: ReservationLanguage[] = ["en", "es", "ja"];

export function uniqueReferrers(list: Reservation[]): string[] {
  const set = new Set<string>();
  for (const r of list) {
    for (const ref of r.referrers) set.add(ref);
  }
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export function toWhatsAppDigits(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function calcTotal(treatments: Treatment[]): number {
  return treatments.reduce((sum, t) => sum + treatmentPrices[t], 0);
}

export function calcDeposit(total: number): number {
  return Math.round(total * DEPOSIT_RATE);
}

/** 예약 하나에서 추천인 한명에게 돌아가는 커미션 */
export function calcCommissionShare(
  treatments: Treatment[],
  referrerCount: number,
): number {
  if (referrerCount <= 0) return 0;
  return (calcTotal(treatments) * COMMISSION_RATE) / referrerCount;
}

export interface ReferrerStats {
  name: string;
  reservationCount: number;
  totalQuote: number;
  commission: number;
}

export function aggregateReferrers(list: Reservation[]): ReferrerStats[] {
  const map = new Map<string, ReferrerStats>();

  for (const r of list) {
    if (r.referrers.length === 0) continue;
    const total = calcTotal(r.treatments);
    const commissionPerReferrer =
      (total * COMMISSION_RATE) / r.referrers.length;

    for (const name of r.referrers) {
      const cur = map.get(name) ?? {
        name,
        reservationCount: 0,
        totalQuote: 0,
        commission: 0,
      };
      cur.reservationCount += 1;
      cur.totalQuote += total;
      cur.commission += commissionPerReferrer;
      map.set(name, cur);
    }
  }

  return Array.from(map.values()).sort((a, b) => b.commission - a.commission);
}

/** 추천인 이름 → URL-safe slug */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
