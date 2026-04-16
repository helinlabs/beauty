import type { MetadataRoute } from 'next';
import { locales, localeHtmlLang } from '@/i18n/config';
import { SITE_URL } from '@/lib/seo';
import { influencers } from '@/data/influencers';
import { procedures } from '@/data/procedures';

function emit(path: string, priority: number, now: Date): MetadataRoute.Sitemap {
  return locales.map((locale) => {
    const languages: Record<string, string> = {};
    for (const alt of locales) {
      languages[localeHtmlLang[alt]] = `${SITE_URL}/${alt}${path}`;
    }
    return {
      url: `${SITE_URL}/${locale}${path}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority,
      alternates: { languages },
    };
  });
}

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...emit('', 1, now),
    ...emit('/influencers', 0.8, now),
    ...emit('/procedures', 0.8, now),
    ...emit('/book', 0.6, now),
    ...influencers.flatMap((i) => emit(`/influencers/${i.slug}`, 0.7, now)),
    ...procedures.flatMap((p) => emit(`/procedures/${p.slug}`, 0.7, now)),
  ];
}
