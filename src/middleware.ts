import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n/config';

const PUBLIC_FILE = /\.(.*)$/;

/**
 * Until Korean UI support is explicitly re-enabled, every request is
 * funneled through the English locale — `/ko/...` URLs are rewritten
 * to the `/en/...` equivalent, and any prefix-less path falls back to
 * the default (`/en`).
 */
const FORCE_DEFAULT_LOCALE = true;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/favicon.ico' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (FORCE_DEFAULT_LOCALE) {
    // Collapse any non-default locale prefix to the default.
    for (const l of locales) {
      if (l === defaultLocale) continue;
      if (pathname === `/${l}` || pathname.startsWith(`/${l}/`)) {
        const url = request.nextUrl.clone();
        url.pathname = pathname.replace(
          `/${l}`,
          `/${defaultLocale}`,
        );
        return NextResponse.redirect(url);
      }
    }
  }

  const hasLocale = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`)
  );
  if (hasLocale) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname === '/' ? '' : pathname}`;
  // Preserve search params — critical for UTM/ref tracking.
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
