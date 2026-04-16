export const locales = ['ko', 'en'] as const;
export const defaultLocale: Locale = 'ko';

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
};

export const localeHtmlLang: Record<Locale, string> = {
  ko: 'ko-KR',
  en: 'en-US',
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
