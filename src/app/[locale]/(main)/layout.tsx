import type { ReactNode } from 'react';
import type { Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import Script from 'next/script';
import StyledComponentsRegistry from '@/styles/StyledComponentsRegistry';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AttributionListener } from '@/components/AttributionListener';
import {
  isLocale,
  locales,
  localeHtmlLang,
  type Locale,
} from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';

export const viewport: Viewport = {
  themeColor: '#0f0d14',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type Props = { children: ReactNode; params: Promise<{ locale: string }> };

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const dict = getDictionary(locale as Locale);
  const copyright = dict.footer.copyright.replace(
    '{year}',
    String(new Date().getFullYear())
  );

  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;
  const META_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  return (
    <html lang={localeHtmlLang[locale as Locale]}>
      <body>
        {/* GA4 via gtag — only loads if NEXT_PUBLIC_GA_ID is set. */}
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}
        {/* Meta Pixel — only loads if NEXT_PUBLIC_META_PIXEL_ID is set. */}
        {META_ID && (
          <Script id="meta-pixel" strategy="afterInteractive">
            {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_ID}');fbq('track','PageView');`}
          </Script>
        )}

        <StyledComponentsRegistry>
          <Suspense fallback={null}>
            <AttributionListener />
          </Suspense>
          <Header locale={locale as Locale} labels={dict.nav} brand={dict.brand} />
          <main>{children}</main>
          <Footer copyright={copyright} tagline={dict.footer.tagline} />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
