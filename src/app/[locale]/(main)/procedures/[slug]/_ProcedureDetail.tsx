'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { InfluencerCard } from '@/components/InfluencerCard';
import type { Locale } from '@/i18n/config';
import type { Procedure } from '@/data/procedures';
import type { Influencer } from '@/data/influencers';
import { formatPriceFromKRW } from '@/lib/format';
import { mq } from '@/styles/theme';

const Hero = styled.section<{ $bg: string }>`
  position: relative;
  padding: 32px 0 28px;
  background: ${({ $bg }) => $bg};
  overflow: hidden;

  ${mq.md} {
    padding: 80px 0 56px;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, rgba(15,13,20,0.25) 0%, ${({ theme }) => theme.colors.bg} 100%);
    pointer-events: none;
  }
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 16px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  font-weight: 600;
  &:hover { color: #fff; }
`;

const Chip = styled.span`
  display: inline-block;
  padding: 5px 12px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-bottom: 12px;
`;

const Title = styled.h1`
  font-size: clamp(30px, 6vw, 56px);
  color: #fff;
  margin-bottom: 16px;
  text-shadow: 0 2px 20px rgba(0, 0, 0, 0.25);
`;

const MetaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  strong {
    display: block;
    font-size: 18px;
    font-weight: 800;
  }
`;

const CTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 14px 24px;
  margin-top: 20px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: #fff;
  color: #111;
  font-weight: 800;
  transition: transform 0.2s;
  &:hover { transform: translateY(-1px); }
`;

const DescSection = styled(Section)`
  padding-top: 40px;
  padding-bottom: 12px;
`;

const H2 = styled.h2`
  font-size: 22px;
  margin-bottom: 12px;
`;

const Body = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 70ch;
  line-height: 1.8;
  font-size: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  ${mq.md} { grid-template-columns: repeat(3, 1fr); gap: 20px; }
`;

type Props = {
  procedure: Procedure;
  locale: Locale;
  influencers: Influencer[];
  dict: {
    back: string;
    duration: string;
    priceFrom: string;
    receivedBy: string;
    description: string;
    bookCTA: string;
    category: string;
    minutes: string;
    followers: string;
    procedureCountLabel: string;
  };
};

export function ProcedureDetail({ procedure, locale, influencers, dict }: Props) {
  return (
    <>
      <Hero $bg={procedure.gradient}>
        <Container>
          <HeroInner>
            <BackLink href={`/${locale}/procedures`}>{dict.back}</BackLink>
            <Chip>{dict.category}</Chip>
            <Title>{procedure.name[locale]}</Title>
            <MetaRow>
              <div>
                <strong>{dict.minutes.replace('{n}', String(procedure.durationMin))}</strong>
                {dict.duration}
              </div>
              <div>
                <strong>{formatPriceFromKRW(procedure.priceFromKRW, locale)}</strong>
                {dict.priceFrom}
              </div>
            </MetaRow>
            <CTA href={`/${locale}/book?p=${procedure.slug}`}>{dict.bookCTA}</CTA>
          </HeroInner>
        </Container>
      </Hero>

      <DescSection>
        <Container>
          <H2>{dict.description}</H2>
          <Body>{procedure.description[locale]}</Body>
        </Container>
      </DescSection>

      <Section>
        <Container>
          <H2>{dict.receivedBy}</H2>
          <Grid>
            {influencers.map((i) => (
              <InfluencerCard
                key={i.slug}
                influencer={i}
                locale={locale}
                labels={{ followers: dict.followers, procedures: dict.procedureCountLabel }}
              />
            ))}
          </Grid>
        </Container>
      </Section>
    </>
  );
}
