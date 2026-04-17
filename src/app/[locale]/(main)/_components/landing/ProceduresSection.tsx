'use client';

import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import { mq } from '@/styles/theme';
import type { Locale } from '@/i18n/config';
import type { LandingGroup, Procedure } from '@/data/procedures';
import { FadeIn } from './FadeIn';
import {
  SectionInner,
  SectionWrap,
  SerifH2,
  SerifH3,
} from './_shared';

interface Props {
  locale: Locale;
  dict: {
    title: string;
    subtitle: string;
    seeAllLabel: string;
    popularBadge: string;
    fromPrice: string;
    categories: {
      face: string;
      skinLaser: string;
      body: string;
      nonSurgical: string;
    };
  };
  /** One representative procedure per landing group, already resolved by the page. */
  featured: Array<{
    group: LandingGroup;
    procedure: Procedure;
    /** Localized category label pulled from dict.landing.procedures.categories. */
    categoryLabel: string;
    /** Pre-formatted "From $XXX" string. */
    priceLabel: string;
    /** Popularity flag — use dict.popularBadge if true. */
    popular?: boolean;
  }>;
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 24px;
  flex-wrap: wrap;
`;

const SeeAll = styled(Link)`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  font-weight: 500;
  transition: color 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 48px;

  ${mq.md} {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
`;

const CardLink = styled(Link)`
  position: relative;
  display: block;
  aspect-ratio: 4 / 5;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  img {
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: ${({ theme }) => theme.shadow.md};
    img { transform: scale(1.04); }
  }
`;

const Scrim = styled.div`
  position: absolute;
  inset: auto 0 0 0;
  padding: 20px 16px 14px;
  background: linear-gradient(
    180deg,
    rgba(27, 26, 23, 0) 0%,
    rgba(27, 26, 23, 0.55) 50%,
    rgba(27, 26, 23, 0.85) 100%
  );
  color: #fff;
`;

const CategoryLabel = styled.p`
  font-size: 15px;
  text-transform: uppercase;
  opacity: 0.82;
  margin-bottom: 6px;
`;

const ProcName = styled(SerifH3)`
  color: #fff;
  font-size: 18px;
  letter-spacing: -0.01em;
`;

const PriceLine = styled.p`
  margin-top: 8px;
  font-size: 15px;
  opacity: 0.92;
`;

const PopularChip = styled.span`
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: rgba(255, 255, 255, 0.92);
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  font-weight: 600;
`;

export function ProceduresSection({ locale, dict, featured }: Props) {
  return (
    <SectionWrap id="procedures">
      <SectionInner>
        <FadeIn>
        <Header>
          <div>
            <SerifH2 $large>{dict.title}</SerifH2>
          </div>
          <SeeAll href={`/${locale}/procedures`}>{dict.seeAllLabel}</SeeAll>
        </Header>
        </FadeIn>

        <Grid>
          {featured.map((f, idx) => (
            <FadeIn key={f.group} delay={idx * 90}>
            <CardLink
              href={`/${locale}/procedures/${f.procedure.slug}`}
              data-testid={`procedure-card-${f.group}`}
            >
              <Image
                src={f.procedure.image}
                alt={f.procedure.name[locale as 'ko' | 'en']}
                fill
                sizes="(min-width: 768px) 25vw, 50vw"
                priority={idx === 0}
              />
              {f.popular && <PopularChip>{dict.popularBadge}</PopularChip>}
              <Scrim>
                <CategoryLabel>{f.categoryLabel}</CategoryLabel>
                <ProcName as="h3">
                  {f.procedure.name[locale as 'ko' | 'en']}
                </ProcName>
                <PriceLine>{f.priceLabel}</PriceLine>
              </Scrim>
            </CardLink>
            </FadeIn>
          ))}
        </Grid>
      </SectionInner>
    </SectionWrap>
  );
}
