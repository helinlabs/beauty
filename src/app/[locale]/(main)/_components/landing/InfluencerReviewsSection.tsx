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
 * white handle + procedure list always read, regardless of what's
 * in the frame at the bottom of the clip. */
const Caption = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 40px 14px 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: linear-gradient(
    to top,
    rgba(0, 0, 0, 0.7) 0%,
    rgba(0, 0, 0, 0.45) 40%,
    rgba(0, 0, 0, 0) 100%
  );
  pointer-events: none;
`;

const Handle = styled.p`
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  margin: 0;
`;

const ProcList = styled.p`
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
  line-height: 1.45;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  margin: 0;
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
                  <Caption>
                    <Handle>@{i.handle}</Handle>
                    <ProcList>{procsLabel}</ProcList>
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
