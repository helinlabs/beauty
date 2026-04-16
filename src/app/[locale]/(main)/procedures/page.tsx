import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { buildMetadata } from '@/lib/seo';
import { procedures } from '@/data/procedures';
import { ProcedureGrid, ProceduresHeading } from './_ProceduresList';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({
    locale: locale,
    title: dict.meta.procedures.title,
    description: dict.meta.procedures.description,
    path: '/procedures',
  });
}

export default async function ProceduresPage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <ProceduresHeading
        title={dict.nav.procedures}
        subtitle={dict.meta.procedures.description}
      />
      <ProcedureGrid
        procedures={procedures}
        locale={locale}
        categories={dict.categories}
        minutesTemplate={dict.common.minutes}
      />
    </>
  );
}
