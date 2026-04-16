import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { buildMetadata } from '@/lib/seo';
import { influencers } from '@/data/influencers';
import { InfluencerGrid, PageHeading } from './_InfluencersList';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({
    locale: locale,
    title: dict.meta.influencers.title,
    description: dict.meta.influencers.description,
    path: '/influencers',
  });
}

export default async function InfluencersPage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  return (
    <>
      <PageHeading
        title={dict.nav.influencers}
        subtitle={dict.meta.influencers.description}
      />
      <InfluencerGrid
        influencers={influencers}
        locale={locale}
        labels={{
          followers: dict.influencer.followers,
          procedures: dict.influencer.procedureCount,
        }}
      />
    </>
  );
}
