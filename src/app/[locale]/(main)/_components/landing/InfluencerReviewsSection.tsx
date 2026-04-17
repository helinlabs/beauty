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
  SectionInner,
  SectionWrap,
  SerifH2,
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
  aspect-ratio: 9 / 16;
  overflow: hidden;

  img,
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const ThumbVideo = styled.video`
  pointer-events: none;
  width: 100%;
  height: 100%;
  object-fit: cover;
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
`;

const Body = styled.div`
  padding: 14px 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Name = styled.p`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 500;
  font-size: 17px;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
`;

const Handle = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Followers = styled.p`
  font-size: 12px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const ProcList = styled.p`
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  line-height: 1.45;
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
        <SerifH2 $large>{dict.title}</SerifH2>

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
                  {i.video ? (
                    <ThumbVideo
                      src={i.video}
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      aria-hidden
                    />
                  ) : i.thumbnail ? (
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
                  <Name>{i.name[locale as 'ko' | 'en']}</Name>
                  <Handle>@{i.handle}</Handle>
                  <Followers>
                    {formatFollowers(i.followers, locale)} {dict.followersLabel}
                  </Followers>
                  <ProcList>{procsLabel}</ProcList>
                </Body>
              </CardLink>
            );
          })}
        </Grid>
      </SectionInner>
    </SectionWrap>
  );
}
