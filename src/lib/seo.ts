import type { Metadata } from 'next';
import { locales, localeHtmlLang, type Locale } from '@/i18n/config';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://example.com';

type BuildMetadataOpts = {
  locale: Locale;
  title: string;
  description: string;
  path?: string;
  images?: string[];
};

export function buildMetadata({
  locale,
  title,
  description,
  path = '',
  images,
}: BuildMetadataOpts): Metadata {
  const canonical = `${SITE_URL}/${locale}${path}`;
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[localeHtmlLang[l]] = `${SITE_URL}/${l}${path}`;
  }
  languages['x-default'] = `${SITE_URL}/${locales[0]}${path}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: 'website',
      url: canonical,
      title,
      description,
      locale: localeHtmlLang[locale].replace('-', '_'),
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => localeHtmlLang[l].replace('-', '_')),
      siteName: 'GlowList',
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
  };
}
