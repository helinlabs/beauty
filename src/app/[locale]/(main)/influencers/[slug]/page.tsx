import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { buildMetadata } from '@/lib/seo';
import { influencers, getInfluencerBySlug } from '@/data/influencers';
import { procedures } from '@/data/procedures';
import { InfluencerDetail } from './_InfluencerDetail';

type Props = { params: Promise<{ locale: string; slug: string }> };

export function generateStaticParams() {
  return influencers.flatMap((i) => [
    { locale: 'ko', slug: i.slug },
    { locale: 'en', slug: i.slug },
  ]);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const inf = getInfluencerBySlug(slug);
  if (!inf) return {};
  const dict = getDictionary(locale);
  return buildMetadata({
    locale: locale,
    title: `${inf.name[locale]} (@${inf.handle}) | ${dict.brand}`,
    description: inf.bio[locale],
    path: `/influencers/${slug}`,
  });
}

export default async function InfluencerPage({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const inf = getInfluencerBySlug(slug);
  if (!inf) notFound();

  const dict = getDictionary(locale);
  const received = inf.procedures
    .map((slug) => procedures.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  return (
    <InfluencerDetail
      influencer={inf}
      locale={locale}
      procedures={received}
      dict={{
        procedureList: dict.influencer.procedureList,
        bookCTA: dict.influencer.bookCTA,
        followers: dict.influencer.followers,
        procedureCountLabel: dict.influencer.procedureCount,
        categories: dict.categories,
        minutes: dict.common.minutes,
        beforeLabel: dict.influencer.beforeLabel,
        afterLabel: dict.influencer.afterLabel,
        getTheBeauty: dict.influencer.getTheBeauty,
        ctaSub: dict.influencer.ctaSub,
        serviceTagline: dict.influencer.serviceTagline,
        trust: dict.influencer.trust,
        howTitle: dict.influencer.howTitle,
        howSteps: dict.influencer.howSteps,
        howCta: dict.influencer.howCta,
        faq: {
          title: dict.landing.faq.title,
          items: dict.landing.faq.items,
        },
      }}
      modalLabels={{
        title: dict.book.title,
        subtitle: dict.book.subtitle,
        nameLabel: dict.book.nameLabel,
        namePlaceholder: dict.book.namePlaceholder,
        phoneLabel: dict.book.phoneLabel,
        phonePlaceholder: dict.book.phonePlaceholder,
        submit: dict.book.submit,
        errorName: dict.book.errorName,
        errorPhone: dict.book.errorPhone,
        agreement: dict.book.agreement,
        waIntro: dict.book.waIntro,
        referredByLabel: dict.book.selectedInfluencer,
      }}
    />
  );
}
