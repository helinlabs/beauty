export type ProcedureCategory =
  | 'skin'
  | 'laser'
  | 'injectable'
  | 'lifting'
  | 'hair';

/** Landing page groups — top-level 4-card grid on the home. */
export type LandingGroup = 'face' | 'skinLaser' | 'body' | 'nonSurgical';

export type Procedure = {
  slug: string;
  name: { ko: string; en: string };
  category: ProcedureCategory;
  /** Landing top-level bucket (Face / Skin & Laser / Body / Non-surgical). */
  landingGroup: LandingGroup;
  durationMin: number;
  priceFromKRW: number;
  /** Rough USD equivalent, used in landing "From $X" labels. */
  priceFromUSD: number;
  description: { ko: string; en: string };
  /** CSS gradient — still used by the existing procedure detail hero. */
  gradient: string;
  /** Editorial photograph (Unsplash) for the landing Procedures cards. */
  image: string;
};

export const procedures: Procedure[] = [
  {
    slug: 'aqua-peel',
    name: { ko: '아쿠아필', en: 'Aqua Peel' },
    category: 'skin',
    landingGroup: 'skinLaser',
    durationMin: 40,
    priceFromKRW: 120_000,
    priceFromUSD: 90,
    description: {
      ko: '모공 속 노폐물을 물의 힘으로 부드럽게 제거하고 유효 성분을 공급하는 베이직 피부 관리.',
      en: 'A gentle water-based extraction that clears pores and infuses active ingredients.',
    },
    gradient: 'linear-gradient(135deg,#c7e8ff 0%,#8bc6ec 100%)',
    image:
      'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&auto=format&fit=crop&q=70',
  },
  {
    slug: 'shurink-universe',
    name: { ko: '슈링크 유니버스', en: 'Shurink Universe' },
    category: 'lifting',
    landingGroup: 'face',
    durationMin: 50,
    priceFromKRW: 390_000,
    priceFromUSD: 290,
    description: {
      ko: 'HIFU 리프팅의 최신 장비. 피부 속 SMAS 층에 에너지를 전달해 탄력을 올려줍니다.',
      en: 'The latest HIFU lifting device, delivering energy to the SMAS layer for firmness.',
    },
    gradient: 'linear-gradient(135deg,#ffd7e1 0%,#ff8fa3 100%)',
    image:
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1200&auto=format&fit=crop&q=70',
  },
  {
    slug: 'rejuran-healer',
    name: { ko: '리쥬란 힐러', en: 'Rejuran Healer' },
    category: 'injectable',
    landingGroup: 'nonSurgical',
    durationMin: 30,
    priceFromKRW: 280_000,
    priceFromUSD: 210,
    description: {
      ko: '연어 DNA 기반의 피부 재생 주사. 잔주름과 피부결 개선에 탁월합니다.',
      en: 'Salmon-DNA based regenerative injections for fine lines and smoother skin.',
    },
    gradient: 'linear-gradient(135deg,#ffe9c4 0%,#ffb199 100%)',
    image:
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=1200&auto=format&fit=crop&q=70',
  },
  {
    slug: 'picosure',
    name: { ko: '피코슈어 토닝', en: 'PicoSure Toning' },
    category: 'laser',
    landingGroup: 'skinLaser',
    durationMin: 25,
    priceFromKRW: 180_000,
    priceFromUSD: 135,
    description: {
      ko: '기미, 색소침착, 잡티 개선에 효과적인 피코초 단위의 고출력 레이저.',
      en: 'Picosecond high-power laser for melasma, pigmentation, and uneven tone.',
    },
    gradient: 'linear-gradient(135deg,#e2d1ff 0%,#9b8cff 100%)',
    image:
      'https://images.unsplash.com/photo-1526413232644-8a40f03cc03b?w=1200&auto=format&fit=crop&q=70',
  },
  {
    slug: 'botox-masseter',
    name: { ko: '사각턱 보톡스', en: 'Masseter Botox' },
    category: 'injectable',
    landingGroup: 'face',
    durationMin: 10,
    priceFromKRW: 90_000,
    priceFromUSD: 70,
    description: {
      ko: '저작근에 소량의 보톡스를 주입해 갸름한 얼굴 라인을 만듭니다.',
      en: 'Small doses into the masseter muscle for a slimmer jawline.',
    },
    gradient: 'linear-gradient(135deg,#d1f7e0 0%,#52c7a0 100%)',
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1200&auto=format&fit=crop&q=70',
  },
  {
    slug: 'scalp-booster',
    name: { ko: '두피 부스터', en: 'Scalp Booster' },
    category: 'hair',
    landingGroup: 'body',
    durationMin: 45,
    priceFromKRW: 150_000,
    priceFromUSD: 115,
    description: {
      ko: '두피 속 노폐물을 제거하고 영양을 공급해 탈모 예방과 모발 건강을 돕습니다.',
      en: 'Clears buildup and delivers nutrients to the scalp for healthier hair.',
    },
    gradient: 'linear-gradient(135deg,#ffe0b3 0%,#d98f3a 100%)',
    image:
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&auto=format&fit=crop&q=70',
  },
];

export function getProcedureBySlug(slug: string) {
  return procedures.find((p) => p.slug === slug);
}

/** Return the primary procedure to feature for each landing group. */
export function getProceduresByLandingGroup(group: LandingGroup): Procedure[] {
  return procedures.filter((p) => p.landingGroup === group);
}
