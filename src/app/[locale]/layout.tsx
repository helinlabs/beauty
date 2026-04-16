import type { ReactNode } from 'react';
import type { Viewport } from 'next';
import { notFound } from 'next/navigation';
import {
  isLocale,
  locales,
} from '@/i18n/config';

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

  // children will be rendered by (main)/layout.tsx or (admin)/layout.tsx
  return children;
}
