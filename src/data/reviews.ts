/**
 * Landing page review cards — mock data mixing short text reviews,
 * before/after card pairs, and a single video highlight. Review authors
 * are bracketed/placeholder US names that can be swapped for real ones
 * without schema changes.
 */
export type ReviewKind = 'text' | 'beforeAfter' | 'video';

export type Review = {
  id: string;
  reviewerName: string;
  reviewerLocation: string;
  procedureSlug: string;
  rating: number;
  kind: ReviewKind;
  quote: { ko: string; en: string };
  beforeImage?: string;
  afterImage?: string;
  videoPoster?: string;
  /** Short outcome label rendered as a green pill at the top of the
   *  landing review card (e.g. "Natural lift"). */
  outcomeLabel?: { ko: string; en: string };
  /** Month numbers shown under the before / after image pair. */
  timeMonths?: { before: number; after: number };
  /** Substrings inside `quote` that get emphasis in the landing card. */
  highlight?: { ko: string[]; en: string[] };
  /** Show the "Verified review" badge with a shield icon. */
  verified?: boolean;
};

export const reviews: Review[] = [
  {
    id: 'rev-jen-l',
    reviewerName: 'Jen L.',
    reviewerLocation: 'Los Angeles, CA',
    procedureSlug: 'rhinoplasty',
    rating: 5,
    kind: 'beforeAfter',
    quote: {
      ko: '코 수술 후 옆모습이 완전히 달라졌어요. 자연스러우면서 얼굴 비율도 딱 맞아요.',
      en: 'After rhinoplasty my profile looks completely different — refined but still natural, and my proportions finally line up.',
    },
    beforeImage:
      'https://images.unsplash.com/photo-1507101105822-7472b28e22ac?w=800&auto=format&fit=crop&q=70',
    afterImage:
      'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&auto=format&fit=crop&q=70',
    outcomeLabel: { ko: '코 성형', en: 'Rhinoplasty' },
    timeMonths: { before: 0, after: 3 },
    highlight: {
      ko: ['옆모습이 완전히 달라졌어요'],
      en: ['profile looks completely different'],
    },
    verified: true,
  },
  {
    id: 'rev-maya-k',
    reviewerName: 'Maya K.',
    reviewerLocation: 'New York, NY',
    procedureSlug: 'eye',
    rating: 5,
    kind: 'beforeAfter',
    quote: {
      ko: '쌍꺼풀 라인이 자연스럽게 잡혔어요. 회복도 빨랐고, 눈이 훨씬 또렷해 보여요.',
      en: 'My double-eyelid line came out completely natural — recovery was fast and my eyes look so much brighter.',
    },
    beforeImage:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=70',
    afterImage:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&auto=format&fit=crop&q=70',
    outcomeLabel: { ko: '눈 성형', en: 'Eye Surgery' },
    timeMonths: { before: 0, after: 2 },
    highlight: {
      ko: ['자연스럽게 잡혔어요'],
      en: ['completely natural'],
    },
    verified: true,
  },
  {
    id: 'rev-amelia-t-ba',
    reviewerName: 'Amelia T.',
    reviewerLocation: 'Chicago, IL',
    procedureSlug: 'facial-contour',
    rating: 5,
    kind: 'beforeAfter',
    quote: {
      ko: '광대랑 턱선이 부드러워지면서 얼굴이 갸름해졌어요. 표정은 그대로인데 옆모습이 달라져요.',
      en: 'Cheekbones and jaw softened — my face reads as slimmer, but every expression still looks like me.',
    },
    beforeImage:
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&auto=format&fit=crop&q=70',
    afterImage:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=70',
    outcomeLabel: { ko: '안면윤곽', en: 'Facial Contouring' },
    timeMonths: { before: 0, after: 3 },
    highlight: {
      ko: ['얼굴이 갸름해졌어요'],
      en: ['face reads as slimmer'],
    },
    verified: true,
  },
  {
    id: 'rev-sophia-r',
    reviewerName: 'Sophia R.',
    reviewerLocation: 'Miami, FL',
    procedureSlug: 'picosure',
    rating: 5,
    kind: 'text',
    quote: {
      ko: '미국 세 군데에서 레이저를 받아봤지만 여기가 압도적이었어요.',
      en: "I'd done laser at three US clinics — this one was in a different league.",
    },
  },
  {
    id: 'rev-amelia-t',
    reviewerName: 'Amelia T.',
    reviewerLocation: 'Chicago, IL',
    procedureSlug: 'botox-masseter',
    rating: 5,
    kind: 'text',
    quote: {
      ko: '턱라인이 자연스럽게 들어가면서도 표정은 그대로예요.',
      en: 'My jawline softened naturally — and I can still make every facial expression.',
    },
  },
  {
    id: 'rev-rachel-p',
    reviewerName: 'Rachel P.',
    reviewerLocation: 'Seattle, WA',
    procedureSlug: 'aqua-peel',
    rating: 5,
    kind: 'text',
    quote: {
      ko: '왓츠앱 하나로 예약부터 귀국 후 케어까지 모두 해결됐어요.',
      en: 'From booking to post-flight aftercare — all handled on WhatsApp.',
    },
  },
  {
    id: 'rev-video-hana',
    reviewerName: 'Hana',
    reviewerLocation: 'Austin, TX',
    procedureSlug: 'scalp-booster',
    rating: 5,
    kind: 'video',
    quote: {
      ko: '출국부터 시술 후 회복까지 전 과정을 브이로그로 기록했어요.',
      en: 'Vlogged every step — flight, clinic, recovery, back home.',
    },
    videoPoster:
      'https://images.unsplash.com/photo-1521146764736-56c929d59c83?w=1200&auto=format&fit=crop&q=70',
  },
];

/**
 * Mock US vs KR price comparison — three representative procedures.
 * Used in the Reviews section. `usPrice`/`krPrice` are in USD.
 */
export type PriceCompareRow = {
  procedureLabelKey: 'rhinoplasty' | 'lifting' | 'laser';
  usPrice: number;
  krPrice: number;
};

export const priceCompareRows: PriceCompareRow[] = [
  { procedureLabelKey: 'rhinoplasty', usPrice: 8000, krPrice: 3200 },
  { procedureLabelKey: 'lifting', usPrice: 4500, krPrice: 1600 },
  { procedureLabelKey: 'laser', usPrice: 1200, krPrice: 420 },
];
