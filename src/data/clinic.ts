/**
 * Partner clinic spotlight content.
 * Mock data for the landing page — swap out with real values when clinic
 * agreement is finalized.
 */
export const CLINIC = {
  slug: 'view-plastic-surgery',
  name: 'View Plastic Surgery',
  doctor: {
    name: 'Dr. Minjae Park',
    title: {
      ko: '대표 원장 · 성형외과 전문의',
      en: 'Lead surgeon · Board-certified plastic surgeon',
    },
  },
  address: {
    ko: '서울특별시 강남구 논현로 842, 4층',
    en: '842 Nonhyeon-ro, Gangnam-gu, Seoul · 4F',
  },
  support: {
    ko: '영어 · 일본어 코디네이터 상주',
    en: 'English & Japanese coordinators on-site',
  },
  doctorImage:
    'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1000&auto=format&fit=crop&q=75',
  interiorImages: [
    'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800&auto=format&fit=crop&q=70',
    'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&auto=format&fit=crop&q=70',
    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&auto=format&fit=crop&q=70',
  ],
  /**
   * Dictionary keys under `landing.clinic.credentials` — filled in both
   * ko.json and en.json so we can display localized credential labels.
   */
  credentialKeys: ['boardCertified', 'gangnam', 'english'] as const,
};
