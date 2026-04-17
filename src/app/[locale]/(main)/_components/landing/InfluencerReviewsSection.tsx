'use client';

import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import { mq } from '@/styles/theme';
import type { Locale } from '@/i18n/config';
import type { Influencer } from '@/data/influencers';
import type { Procedure } from '@/data/procedures';
import { FadeIn } from './FadeIn';
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

const Body = styled.div`
  padding: 14px 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

/* Handle now takes over the slot that used to show the serif name
   and follower count — same visual treatment as the old Followers
   line (primary color, bold, 15px). */
const Handle = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const ProcList = styled.p`
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
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
        <FadeIn>
          <SerifH2 $large>{dict.title}</SerifH2>
        </FadeIn>

        <Grid>
          {items.slice(0, 4).map((i, idx) => {
            const procsLabel = i.procedures
              .map((slug) => procedureLookup[slug])
              .filter(Boolean)
              .slice(0, 2)
              .join(' · ');
            return (
              <FadeIn key={i.slug} delay={idx * 90}>
              <CardLink
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
                </Thumb>
                <Body>
                  <Handle>@{i.handle}</Handle>
                  <ProcList>{procsLabel}</ProcList>
                </Body>
              </CardLink>
              </FadeIn>
            );
          })}
        </Grid>
      </SectionInner>
    </SectionWrap>
  );
}
