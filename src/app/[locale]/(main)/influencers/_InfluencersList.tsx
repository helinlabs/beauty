'use client';

import styled from 'styled-components';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { InfluencerCard } from '@/components/InfluencerCard';
import type { Locale } from '@/i18n/config';
import type { Influencer } from '@/data/influencers';
import { mq } from '@/styles/theme';

const Heading = styled(Section)`
  padding-top: 40px;
  padding-bottom: 12px;

  ${mq.md} {
    padding-top: 72px;
  }
`;

const H1 = styled.h1`
  font-size: clamp(28px, 5vw, 44px);
  margin-bottom: 10px;
`;

const Sub = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 60ch;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding-bottom: 40px;

  ${mq.md} {
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
  }
  ${mq.lg} {
    grid-template-columns: repeat(4, 1fr);
  }
`;

export function PageHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <Heading>
      <Container>
        <H1>{title}</H1>
        <Sub>{subtitle}</Sub>
      </Container>
    </Heading>
  );
}

type Props = {
  influencers: Influencer[];
  locale: Locale;
  labels: { followers: string; procedures: string };
};

export function InfluencerGrid({ influencers, locale, labels }: Props) {
  return (
    <Container>
      <Grid>
        {influencers.map((i) => (
          <InfluencerCard key={i.slug} influencer={i} locale={locale} labels={labels} />
        ))}
      </Grid>
    </Container>
  );
}
