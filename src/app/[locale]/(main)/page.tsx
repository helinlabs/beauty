import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n/dictionaries';
import { buildMetadata, SITE_URL } from '@/lib/seo';
import { influencers } from '@/data/influencers';
import {
  procedures,
  type LandingGroup,
  type Procedure,
} from '@/data/procedures';
import { formatPriceFromUSD } from '@/lib/format';
import {
  FAQSection,
  FinalCtaSection,
  HeroSection,
  HowItWorksSection,
  InfluencerReviewsSection,
  MedicalTeamSection,
  PinnedClinicBackdrop,
  ProceduresSection,
  ReviewsSection,
  TrustBarSection,
} from './_components/landing';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    title: dict.meta.home.title,
    description: dict.meta.home.description,
    path: '',
  });
}

const LANDING_GROUPS: LandingGroup[] = [
  'face',
  'skinLaser',
  'body',
  'nonSurgical',
];

function pickFeaturedProcedure(
  group: LandingGroup,
  fallback: Procedure,
): Procedure {
  return procedures.find((p) => p.landingGroup === group) ?? fallback;
}

export default async function HomePage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!isLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const dict = getDictionary(locale);

  const contactModalLabels = {
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
    waIntro: dict.landing.hero.waIntro,
  };

  const procedureLookup = procedures.reduce<Record<string, string>>(
    (acc, p) => {
      acc[p.slug] = p.name[locale];
      return acc;
    },
    {},
  );

  const featuredProcedures = LANDING_GROUPS.map((group, idx) => {
    const proc = pickFeaturedProcedure(group, procedures[idx % procedures.length]);
    const categoryLabel =
      dict.landing.procedures.categories[
        group as keyof typeof dict.landing.procedures.categories
      ];
    return {
      group,
      procedure: proc,
      categoryLabel,
      priceLabel: dict.landing.procedures.fromPrice.replace(
        '{price}',
        formatPriceFromUSD(proc.priceFromUSD, locale),
      ),
      popular: idx === 0,
    };
  });

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

      <HeroSection
        locale={locale}
        dict={dict.landing.hero}
        modalLabels={contactModalLabels}
      />

      <InfluencerReviewsSection
        locale={locale}
        dict={dict.landing.influencerReviews}
        items={influencers}
        procedureLookup={procedureLookup}
      />

      {/*
        Pinned-clinic scroll scope: the clinic interior photo stays
        sticky at the top of the viewport while Trust and How It Works
        scroll over it. Pinning releases once BOTH sections have been
        scrolled past, so the image travels along with the How It
        Works content at the tail end.
      */}
      <PinnedClinicBackdrop>
        <TrustBarSection dict={dict.landing.trustBar} />
        <HowItWorksSection dict={dict.landing.how} />
      </PinnedClinicBackdrop>

      <ProceduresSection
        locale={locale}
        dict={dict.landing.procedures}
        featured={featuredProcedures}
      />

      <MedicalTeamSection dict={dict.landing.medicalTeam} />

      <ReviewsSection locale={locale} dict={dict.landing.reviews} />

      <FAQSection dict={dict.landing.faq} />

      <FinalCtaSection
        locale={locale}
        dict={dict.landing.finalCta}
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
    </>
  );
}
