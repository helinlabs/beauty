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
  /** Editorial portrait used on the landing/influencer cards (Unsplash). */
  thumbnail?: string;
  /**
   * Optional short vertical video used as the card's "thumbnail" in the
   * Influencer Reviews grid — plays muted + looped (shorts preview).
   * When set, it takes precedence over `thumbnail`.
   */
  video?: string;
  /** Short pull quote used on the landing review cards. */
  quote?: { ko: string; en: string };
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
    thumbnail:
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop&q=70',
    video: 'https://d1aj4dyeuyg3z4.cloudfront.net/common/home_insta_3.mp4',
    procedures: ['aqua-peel', 'rejuran-healer', 'shurink-universe'],
    quote: {
      ko: '자연스러운 결과가 좋아서 서울까지 날아왔어요.',
      en: 'Flew to Seoul because the results look so natural.',
    },
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
    thumbnail:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=70',
    procedures: ['shurink-universe', 'botox-masseter'],
    quote: {
      ko: '무턱대고 크게 하지 않아서 오히려 더 어려 보인다는 말을 들어요.',
      en: "Everyone says I look younger because it's subtle — not overdone.",
    },
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
    thumbnail:
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&auto=format&fit=crop&q=70',
    procedures: ['picosure', 'aqua-peel', 'rejuran-healer'],
    quote: {
      ko: '영어 코디네이터 덕분에 수술 전 과정이 편안했어요.',
      en: 'The English coordinator made every step feel easy.',
    },
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
    thumbnail:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=70',
    procedures: ['scalp-booster', 'botox-masseter'],
    quote: {
      ko: '귀국 후에도 왓츠앱으로 애프터케어 상담이 가능해서 든든해요.',
      en: 'Back home now and still getting aftercare on WhatsApp — peace of mind.',
    },
  },
  {
    slug: 'yeji',
    name: { ko: '예지', en: 'Yeji' },
    handle: 'yeji.edit',
    followers: 412_000,
    bio: {
      ko: 'LA에서 활동하는 K-뷰티 에디터. 시술 전후 비교에 진심.',
      en: 'K-beauty editor based in LA — obsessed with before/after.',
    },
    avatar: 'linear-gradient(135deg,#f6d4b7 0%,#dc7a5c 100%)',
    thumbnail:
      'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?w=800&auto=format&fit=crop&q=70',
    procedures: ['rejuran-healer', 'shurink-universe'],
    quote: {
      ko: '후기 영상을 올리자 DM이 하루 만에 폭주했어요.',
      en: 'Posted one reel — my DMs exploded within 24 hours.',
    },
  },
  {
    slug: 'rina',
    name: { ko: '리나', en: 'Rina' },
    handle: 'rinaseoul',
    followers: 198_000,
    bio: {
      ko: '뉴욕·서울을 오가며 성형 저널을 공유해요.',
      en: 'NYC ↔ Seoul. Sharing a full plastic-surgery journal.',
    },
    avatar: 'linear-gradient(135deg,#c4b5f0 0%,#7463cd 100%)',
    thumbnail:
      'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=800&auto=format&fit=crop&q=70',
    procedures: ['picosure', 'aqua-peel'],
    quote: {
      ko: '미국이랑 비교하면 가격은 절반, 퀄리티는 오히려 위였어요.',
      en: 'Half the US price — and honestly, even better quality.',
    },
  },
  {
    slug: 'chaeyoung',
    name: { ko: '채영', en: 'Chaeyoung' },
    handle: 'chae.makeup',
    followers: 305_000,
    bio: {
      ko: '메이크업 아티스트 + 시술 리뷰어.',
      en: 'Makeup artist moonlighting as a clinic reviewer.',
    },
    avatar: 'linear-gradient(135deg,#fddcc0 0%,#d88c56 100%)',
    thumbnail:
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&auto=format&fit=crop&q=70',
    procedures: ['aqua-peel', 'botox-masseter'],
    quote: {
      ko: '메이크업 없이도 자신 있게 카메라 앞에 서요.',
      en: "I'm confident on camera even without a full face of makeup now.",
    },
  },
  {
    slug: 'haeun',
    name: { ko: '하은', en: 'Haeun' },
    handle: 'haeunlife',
    followers: 176_000,
    bio: {
      ko: '브이로그 인플루언서. 회복기부터 일상까지 공유.',
      en: 'Vlog influencer — recovery diaries to daily life.',
    },
    avatar: 'linear-gradient(135deg,#e4d0b6 0%,#a67c52 100%)',
    thumbnail:
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&auto=format&fit=crop&q=70',
    procedures: ['scalp-booster', 'shurink-universe'],
    quote: {
      ko: '병원에서 영어가 완벽해서 혼자 가도 하나도 안 무서웠어요.',
      en: 'The staff spoke flawless English — I wasn\'t scared going alone.',
    },
  },
];

export function getInfluencerBySlug(slug: string) {
  return influencers.find((i) => i.slug === slug);
}

export function getInfluencersByProcedure(procedureSlug: string) {
  return influencers.filter((i) => i.procedures.includes(procedureSlug));
}
