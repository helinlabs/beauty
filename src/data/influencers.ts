export type Influencer = {
  slug: string;
  name: { ko: string; en: string };
  handle: string; // instagram handle without "@"
  followers: number; // total followers
  bio: { ko: string; en: string };
  /** CSS gradient used for avatar placeholder. */
  avatar: string;
  /** Procedure slugs this influencer received. */
  procedures: string[];
};

export const influencers: Influencer[] = [
  {
    slug: 'jiyeon',
    name: { ko: '지연', en: 'Jiyeon' },
    handle: 'jiyeon.glow',
    followers: 248_000,
    bio: {
      ko: '서울 기반 뷰티 크리에이터. 피부과 다이어리 공유 중.',
      en: 'Seoul-based beauty creator, sharing her clinic diary.',
    },
    avatar: 'linear-gradient(135deg,#ffb199 0%,#ff5a8a 100%)',
    procedures: ['aqua-peel', 'rejuran-healer', 'shurink-universe'],
  },
  {
    slug: 'minha',
    name: { ko: '민하', en: 'Minha' },
    handle: 'minha_daily',
    followers: 132_000,
    bio: {
      ko: '자연스러운 리프팅과 관리를 좋아하는 30대 인플루언서.',
      en: 'Thirty-something influencer who loves subtle lifting.',
    },
    avatar: 'linear-gradient(135deg,#ffd7e1 0%,#a084f2 100%)',
    procedures: ['shurink-universe', 'botox-masseter'],
  },
  {
    slug: 'sora',
    name: { ko: '소라', en: 'Sora' },
    handle: 'sora.skin',
    followers: 520_000,
    bio: {
      ko: '피부 고민 전문 인플루언서. 실제 리뷰만 올립니다.',
      en: 'Skin-focused creator posting only honest reviews.',
    },
    avatar: 'linear-gradient(135deg,#c7e8ff 0%,#6a5af9 100%)',
    procedures: ['picosure', 'aqua-peel', 'rejuran-healer'],
  },
  {
    slug: 'hana',
    name: { ko: '하나', en: 'Hana' },
    handle: 'hana.beaute',
    followers: 89_000,
    bio: {
      ko: '헤어·두피 콘텐츠 크리에이터. 탈모 예방 관심 많음.',
      en: 'Hair and scalp content, big on prevention.',
    },
    avatar: 'linear-gradient(135deg,#ffe0b3 0%,#e86a92 100%)',
    procedures: ['scalp-booster', 'botox-masseter'],
  },
];

export function getInfluencerBySlug(slug: string) {
  return influencers.find((i) => i.slug === slug);
}

export function getInfluencersByProcedure(procedureSlug: string) {
  return influencers.filter((i) => i.procedures.includes(procedureSlug));
}
