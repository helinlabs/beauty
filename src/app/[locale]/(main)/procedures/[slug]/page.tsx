import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { buildMetadata } from '@/lib/seo';
import {
  procedures,
  getProcedureBySlug,
} from '@/data/procedures';
import { getInfluencersByProcedure } from '@/data/influencers';
import { ProcedureDetail } from './_ProcedureDetail';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return procedures.flatMap((p) => [
    { locale: 'ko', slug: p.slug },
    { locale: 'en', slug: p.slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const proc = getProcedureBySlug(slug);
  if (!proc) return {};
  const dict = getDictionary(locale);
  return buildMetadata({
    locale: locale,
    title: `${proc.name[locale]} | ${dict.brand}`,
    description: proc.description[locale],
    path: `/procedures/${slug}`,
  });
}

export default async function ProcedurePage({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const proc = getProcedureBySlug(slug);
  if (!proc) notFound();

  const dict = getDictionary(locale);
  const received = getInfluencersByProcedure(proc.slug);

  return (
    <ProcedureDetail
      procedure={proc}
      locale={locale}
      influencers={received}
      dict={{
        back: dict.common.back,
        duration: dict.procedure.duration,
        priceFrom: dict.procedure.priceFrom,
        receivedBy: dict.procedure.receivedBy,
        description: dict.procedure.description,
        bookCTA: dict.procedure.bookCTA,
        category: dict.categories[proc.category],
        minutes: dict.common.minutes,
        followers: dict.influencer.followers,
        procedureCountLabel: dict.influencer.procedureCount,
      }}
    />
  );
}
