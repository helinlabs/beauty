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

/* Card is now just the video/thumbnail frame — the handle + procedure
 * list sit INSIDE that frame as an overlay along the bottom edge, so
 * there's no separate white body block below the media. */
const CardLink = styled(Link)`
  position: relative;
  display: block;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  transition: transform 0.25s ease, box-shadow 0.25s;

  &:hover {
    transform: translateY(-3px);
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

/* Bottom caption area overlaid on the video. A tall gradient fades
 * from transparent at the top to near-black at the bottom so the
 * white handle / follower / procedure lines always read, regardless
 * of what's in the frame at the bottom of the clip. */
const Caption = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 48px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.75) 0%,
    rgba(0, 0, 0, 0.5) 35%,
    rgba(0, 0, 0, 0) 100%
  );
  pointer-events: none;
`;

/* Handle line renders the @name alongside a blue Instagram-style
 * verified badge. Flex row so the badge sits just to the right of
 * the name baseline. */
const HandleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Handle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
`;

/* Instagram-style 12-sided verified badge. Blue scalloped shape with
 * a white tick inside — rendered inline via SVG so it inherits font
 * sizing and needs no extra asset. */
const VerifiedBadge = styled.svg`
  flex-shrink: 0;
  width: 14px;
  height: 14px;
  margin-left: 2px;
`;

/* Follower count — smaller white-dimmed line just below the handle
 * row. */
const Followers = styled.p`
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  line-height: 1.35;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  margin: 0;
`;

const ProcList = styled.p`
  color: rgba(255, 255, 255, 0.8);
  font-size: 13px;
  line-height: 1.45;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  margin: 4px 0 0;
`;

/* 248_000 → "248k", 1_200_000 → "1.2m", 800 → "800". */
function formatFollowers(n: number): string {
  if (n >= 1_000_000) {
    const m = n / 1_000_000;
    return `${m % 1 === 0 ? m.toFixed(0) : m.toFixed(1)}m`;
  }
  if (n >= 1_000) {
    return `${Math.round(n / 1_000)}k`;
  }
  return String(n);
}

const GradientFallback = styled.div<{ $bg: string }>`
  position: absolute;
  inset: 0;
  background: ${({ $bg }) => $bg};
`;

/* Centered "They've already made the trip" title — overrides the
 * SerifH2 default max-width + left-align so the heading sits in
 * the middle of the section. */
const CenteredTitle = styled(SerifH2)`
  text-align: center;
  margin-left: auto;
  margin-right: auto;
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
          <CenteredTitle $large>{dict.title}</CenteredTitle>
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
                  <Caption>
                    <HandleRow>
                      <Handle>@{i.handle}</Handle>
                      <VerifiedBadge
                        viewBox="0 0 24 24"
                        aria-label="Verified"
                      >
                        <path
                          d="M23 12l-2.44-2.79.34-3.69-3.61-.82-1.89-3.2L12 2.96 8.6 1.5 6.71 4.69 3.1 5.5l.34 3.7L1 12l2.44 2.79-.34 3.7 3.61.82L8.6 22.5l3.4-1.47 3.4 1.46 1.89-3.19 3.61-.82-.34-3.69L23 12Z"
                          fill="#3B82F6"
                        />
                        <path
                          d="M9.95 15.55 6.4 12l1.41-1.41 2.14 2.13 5.24-5.24 1.41 1.42-6.65 6.65Z"
                          fill="#ffffff"
                        />
                      </VerifiedBadge>
                    </HandleRow>
                    <Followers>
                      {formatFollowers(i.followers)} {dict.followersLabel}
                    </Followers>
                    {procsLabel && <ProcList>{procsLabel}</ProcList>}
                  </Caption>
                </Thumb>
              </CardLink>
              </FadeIn>
            );
          })}
        </Grid>
      </SectionInner>
    </SectionWrap>
  );
}
