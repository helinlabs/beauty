'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { Avatar } from '@/components/Avatar';
import { ProcedureCard } from '@/components/ProcedureCard';
import type { Locale } from '@/i18n/config';
import type { Influencer } from '@/data/influencers';
import type { Procedure, ProcedureCategory } from '@/data/procedures';
import { formatFollowers } from '@/lib/format';
import { mq } from '@/styles/theme';

const Top = styled(Section)`
  padding-top: 28px;
  padding-bottom: 20px;
  ${mq.md} { padding-top: 56px; padding-bottom: 28px; }
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: 20px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`;

const Head = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 18px;
  ${mq.md} { flex-direction: row; align-items: center; gap: 28px; }
`;

const Meta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Name = styled.h1`
  font-size: clamp(28px, 5vw, 42px);
`;

const Handle = styled.a`
  color: ${({ theme }) => theme.colors.accent};
  font-weight: 600;
`;

const Bio = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 60ch;
`;

const Stats = styled.div`
  display: flex;
  gap: 24px;
  margin-top: 4px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  strong {
    display: block;
    color: ${({ theme }) => theme.colors.text};
    font-size: 18px;
    font-weight: 800;
  }
`;

const CTA = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 12px 22px;
  margin-top: 14px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 700;
  transition: background 0.2s;
  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; }
`;

const ListTitle = styled.h2`
  font-size: 22px;
  margin-bottom: 20px;
  ${mq.md} { font-size: 26px; }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  ${mq.md} { grid-template-columns: repeat(3, 1fr); gap: 20px; }
`;

type Props = {
  influencer: Influencer;
  locale: Locale;
  procedures: Procedure[];
  dict: {
    back: string;
    procedureList: string;
    bookCTA: string;
    followers: string;
    procedureCountLabel: string;
    categories: Record<ProcedureCategory, string>;
    minutes: string;
  };
};

export function InfluencerDetail({ influencer, locale, procedures, dict }: Props) {
  return (
    <>
      <Top>
        <Container>
          <BackLink href={`/${locale}/influencers`}>{dict.back}</BackLink>
          <Head>
            <Avatar gradient={influencer.avatar} label={influencer.name[locale]} size={112} />
            <Meta>
              <Name>{influencer.name[locale]}</Name>
              <Handle
                href={`https://instagram.com/${influencer.handle}`}
                target="_blank"
                rel="noreferrer"
              >
                @{influencer.handle}
              </Handle>
              <Bio>{influencer.bio[locale]}</Bio>
              <Stats>
                <div>
                  <strong>{formatFollowers(influencer.followers, locale)}</strong>
                  {dict.followers}
                </div>
                <div>
                  <strong>{procedures.length}</strong>
                  {dict.procedureCountLabel}
                </div>
              </Stats>
              <CTA href={`/${locale}/book?ref=${influencer.slug}`}>{dict.bookCTA}</CTA>
            </Meta>
          </Head>
        </Container>
      </Top>

      <Section>
        <Container>
          <ListTitle>{dict.procedureList}</ListTitle>
          <Grid>
            {procedures.map((p) => (
              <ProcedureCard
                key={p.slug}
                procedure={p}
                locale={locale}
                categoryLabel={dict.categories[p.category]}
                minutesLabel={dict.minutes.replace('{n}', String(p.durationMin))}
              />
            ))}
          </Grid>
        </Container>
      </Section>
    </>
  );
}
