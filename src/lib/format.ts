import type { Locale } from '@/i18n/config';

export function formatFollowers(n: number, locale: Locale): string {
  if (locale === 'ko') {
    if (n >= 10_000) return `${(n / 10_000).toFixed(1).replace(/\.0$/, '')}만`;
    return n.toLocaleString('ko-KR');
  }
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1).replace(/\.0$/, '')}K`;
  return n.toString();
}

export function formatPriceFromKRW(krw: number, locale: Locale): string {
  if (locale === 'ko') {
    return `₩${krw.toLocaleString('ko-KR')}`;
  }
  // rough USD conversion for display only; real pricing happens in WhatsApp.
  const usd = Math.round(krw / 1350);
  return `$${usd.toLocaleString('en-US')}`;
}

/**
 * Landing cards store an editorial USD figure per procedure
 * (`priceFromUSD`). Format it as a display string, localized lightly.
 */
export function formatPriceFromUSD(usd: number, locale: Locale): string {
  if (locale === 'ko') {
    return `$${usd.toLocaleString('ko-KR')}`;
  }
  return `$${usd.toLocaleString('en-US')}`;
}
