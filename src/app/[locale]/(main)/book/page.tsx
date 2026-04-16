import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { buildMetadata } from '@/lib/seo';
import { BookPageShell } from './_BookPageShell';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({
    locale: locale,
    title: dict.meta.book.title,
    description: dict.meta.book.description,
    path: '/book',
  });
}

export default async function BookPage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  return (
    <Suspense fallback={null}>
      <BookPageShell
        locale={locale}
        title={dict.book.title}
        subtitle={dict.book.subtitle}
        formLabels={{
          name: dict.book.nameLabel,
          namePh: dict.book.namePlaceholder,
          phone: dict.book.phoneLabel,
          phonePh: dict.book.phonePlaceholder,
          selectedInfluencer: dict.book.selectedInfluencer,
          selectedProcedure: dict.book.selectedProcedure,
          submit: dict.book.submit,
          errorName: dict.book.errorName,
          errorPhone: dict.book.errorPhone,
          agreement: dict.book.agreement,
          waIntro: dict.book.waIntro,
        }}
      />
    </Suspense>
  );
}
