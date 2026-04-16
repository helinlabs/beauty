'use client';

import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import { mq } from '@/styles/theme';
import type { Locale } from '@/i18n/config';
import type { Influencer } from '@/data/influencers';
import type { Procedure } from '@/data/procedures';
import { formatFollowers } from '@/lib/format';
import {
  Eyebrow,
  SectionInner,
  SectionWrap,
  SerifH2,
  SubtitleP,
} from './_shared';

interface Props {
  locale: Locale;
  dict: {
    title: string;
    subtitle: string;
    viewProfile: string;
    newBadge: string;
    followersLabel: string;
  };
  items: Influencer[];
  /** Procedure slug -> localized name, resolved once by the page. */
  procedureLookup: Record<string, string>;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-top: 48px;

  ${mq.md} {
    grid-template-columns: repeat(4, 1fr);
    gap: 18px;
  }
`;

const CardLink = styled(Link)`
  position: relative;
  display: flex;
  flex-direction: column;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.25s ease, border-color 0.2s, box-shadow 0.25s;

  &:hover {
    transform: translateY(-3px);
    border-color: rgba(194, 65, 12, 0.25);
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
`;

const Thumb = styled.div`
  position: relative;
  aspect-ratio: 4 / 5;

  img { object-fit: cover; }
`;

const NewBadge = styled.span`
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 0.08em;
`;

const Body = styled.div`
  padding: 14px 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Handle = styled.p`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
`;

const ProcList = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.45;
`;

const Meta = styled.p`
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
`;

const ViewLink = styled.span`
  margin-top: 4px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accent};
`;

const GradientFallback = styled.div<{ $bg: string }>`
  position: absolute;
  inset: 0;
  background: ${({ $bg }) => $bg};
`;

export function InfluencerReviewsSection({
  locale,
  dict,
  items,
  procedureLookup,
}: Props) {
  return (
    <SectionWrap id="influencer-reviews">
      <SectionInner>
        <Eyebrow>Influencer reviews</Eyebrow>
        <SerifH2 $large>{dict.title}</SerifH2>
        <SubtitleP>{dict.subtitle}</SubtitleP>

        <Grid>
          {items.map((i, idx) => {
            const procsLabel = i.procedures
              .map((slug) => procedureLookup[slug])
              .filter(Boolean)
              .slice(0, 2)
              .join(' · ');
            return (
              <CardLink
                key={i.slug}
                href={`/${locale}/influencers/${i.slug}`}
                data-testid={`influencer-card-${i.slug}`}
              >
                <Thumb>
                  {i.thumbnail ? (
                    <Image
                      src={i.thumbnail}
                      alt={i.name[locale as 'ko' | 'en']}
                      fill
                      sizes="(min-width: 768px) 25vw, 50vw"
                    />
                  ) : (
                    <GradientFallback $bg={i.avatar} />
                  )}
                  {idx === 0 && <NewBadge>{dict.newBadge}</NewBadge>}
                </Thumb>
                <Body>
                  <Handle>@{i.handle}</Handle>
                  <ProcList>{procsLabel}</ProcList>
                  <Meta>
                    {formatFollowers(i.followers, locale)} {dict.followersLabel}
                  </Meta>
                  <ViewLink>{dict.viewProfile}</ViewLink>
                </Body>
              </CardLink>
            );
          })}
        </Grid>
      </SectionInner>
    </SectionWrap>
  );
}
