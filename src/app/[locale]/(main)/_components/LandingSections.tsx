'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { Container } from '@/components/Container';
import { Section, SectionHeader, SectionTitle, SeeAll } from '@/components/Section';
import { InfluencerCard } from '@/components/InfluencerCard';
import { ProcedureCard } from '@/components/ProcedureCard';
import type { Locale } from '@/i18n/config';
import type { Influencer } from '@/data/influencers';
import type { Procedure } from '@/data/procedures';
import { mq } from '@/styles/theme';

/* ---------- Hero ---------- */

const Hero = styled(Section)`
  padding-top: 56px;
  padding-bottom: 48px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: -20% -10% auto auto;
    width: 420px; height: 420px;
    background: radial-gradient(closest-side, rgba(255,79,139,0.35), transparent 70%);
    filter: blur(20px);
    pointer-events: none;
  }
  &::after {
    content: '';
    position: absolute;
    bottom: -10%; left: -10%;
    width: 360px; height: 360px;
    background: radial-gradient(closest-side, rgba(160,132,242,0.28), transparent 70%);
    filter: blur(20px);
    pointer-events: none;
  }

  ${mq.md} {
    padding-top: 112px;
    padding-bottom: 80px;
  }
`;

const HeroInner = styled.div`
  position: relative;
  z-index: 1;
  max-width: 720px;
`;

const Eyebrow = styled.span`
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 18px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: rgba(255, 79, 139, 0.12);
  color: ${({ theme }) => theme.colors.primary};
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
`;

const H1 = styled.h1`
  font-size: clamp(32px, 7vw, 64px);
  margin-bottom: 18px;
  white-space: pre-line;
`;

const Sub = styled.p`
  font-size: clamp(15px, 2.4vw, 20px);
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 48ch;
  margin-bottom: 28px;
`;

const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

const CtaPrimary = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 800;
  transition: background 0.2s, transform 0.2s;
  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; transform: translateY(-1px); }
`;

const CtaGhost = styled(Link)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 14px 24px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-weight: 700;
  transition: border-color 0.2s, background 0.2s;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; background: rgba(255,79,139,0.06); }
`;

type HeroProps = {
  locale: Locale;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaBook: string;
  ctaExplore: string;
};

export function LandingHero({ locale, eyebrow, title, subtitle, ctaBook, ctaExplore }: HeroProps) {
  return (
    <Hero>
      <Container>
        <HeroInner>
          <Eyebrow>{eyebrow}</Eyebrow>
          <H1>{title}</H1>
          <Sub>{subtitle}</Sub>
          <CtaRow>
            <CtaPrimary href={`/${locale}/book`}>{ctaBook}</CtaPrimary>
            <CtaGhost href={`/${locale}/influencers`}>{ctaExplore}</CtaGhost>
          </CtaRow>
        </HeroInner>
      </Container>
    </Hero>
  );
}

/* ---------- How it works ---------- */

const Steps = styled.ol`
  list-style: none;
  counter-reset: step;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;

  ${mq.md} {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
`;

const Step = styled.li`
  counter-increment: step;
  padding: 26px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;

  &::before {
    content: '0' counter(step);
    position: absolute;
    top: 18px; right: 20px;
    font-size: 42px;
    font-weight: 900;
    color: rgba(255, 79, 139, 0.15);
    letter-spacing: -0.04em;
  }
`;

const StepTitle = styled.h3`
  font-size: 17px;
  margin-bottom: 6px;
`;

const StepBody = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
`;

export function HowItWorks({
  title,
  steps,
}: {
  title: string;
  steps: { title: string; description: string }[];
}) {
  return (
    <Section>
      <Container>
        <SectionHeader>
          <SectionTitle>{title}</SectionTitle>
        </SectionHeader>
        <Steps>
          {steps.map((s, i) => (
            <Step key={i}>
              <StepTitle>{s.title}</StepTitle>
              <StepBody>{s.description}</StepBody>
            </Step>
          ))}
        </Steps>
      </Container>
    </Section>
  );
}

/* ---------- Featured row ---------- */

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;

  ${mq.md} {
    grid-template-columns: repeat(4, 1fr);
    gap: 20px;
  }
`;

type InfluencerItem = { influencer: Influencer };
type ProcedureItem = {
  procedure: Procedure;
  categoryLabel: string;
  minutesLabel: string;
};

type FeaturedRowProps =
  | {
      kind: 'influencer';
      title: string;
      seeAllLabel: string;
      seeAllHref: string;
      locale: Locale;
      items: InfluencerItem[];
      labels: { followers: string; procedures: string };
    }
  | {
      kind: 'procedure';
      title: string;
      seeAllLabel: string;
      seeAllHref: string;
      locale: Locale;
      items: ProcedureItem[];
    };

export function FeaturedRow(props: FeaturedRowProps) {
  return (
    <Section>
      <Container>
        <SectionHeader>
          <SectionTitle>{props.title}</SectionTitle>
          <SeeAll as={Link as unknown as 'a'} href={props.seeAllHref}>
            {props.seeAllLabel}
          </SeeAll>
        </SectionHeader>
        <Grid>
          {props.kind === 'influencer'
            ? props.items.map(({ influencer }) => (
                <InfluencerCard
                  key={influencer.slug}
                  influencer={influencer}
                  locale={props.locale}
                  labels={props.labels}
                />
              ))
            : props.items.map(({ procedure, categoryLabel, minutesLabel }) => (
                <ProcedureCard
                  key={procedure.slug}
                  procedure={procedure}
                  locale={props.locale}
                  categoryLabel={categoryLabel}
                  minutesLabel={minutesLabel}
                />
              ))}
        </Grid>
      </Container>
    </Section>
  );
}
