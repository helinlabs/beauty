import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { buildMetadata, SITE_URL } from '@/lib/seo';
import { influencers } from '@/data/influencers';
import { procedures } from '@/data/procedures';
import { LandingHero, HowItWorks, FeaturedRow } from './_components/LandingSections';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({
    locale: locale,
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    path: '',
  });
}

export default async function HomePage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  const ld = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: dict.brand,
    url: `${SITE_URL}/${locale}`,
    inLanguage: locale,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
      />
      <LandingHero
        locale={locale}
        eyebrow={dict.landing.eyebrow}
        title={dict.landing.title}
        subtitle={dict.landing.subtitle}
        ctaBook={dict.landing.ctaBook}
        ctaExplore={dict.landing.ctaExplore}
      />
      <HowItWorks
        title={dict.landing.how.title}
        steps={dict.landing.how.steps}
      />
      <FeaturedRow
        title={dict.landing.featuredInfluencers}
        seeAllLabel={dict.landing.seeAll}
        seeAllHref={`/${locale}/influencers`}
        kind="influencer"
        locale={locale}
        items={influencers.slice(0, 4).map((i) => ({ influencer: i }))}
        labels={{
          followers: dict.influencer.followers,
          procedures: dict.influencer.procedureCount,
        }}
      />
      <FeaturedRow
        title={dict.landing.featuredProcedures}
        seeAllLabel={dict.landing.seeAll}
        seeAllHref={`/${locale}/procedures`}
        kind="procedure"
        locale={locale}
        items={procedures.slice(0, 4).map((p) => ({
          procedure: p,
          categoryLabel: dict.categories[p.category],
          minutesLabel: dict.common.minutes.replace('{n}', String(p.durationMin)),
        }))}
      />
    </>
  );
}
