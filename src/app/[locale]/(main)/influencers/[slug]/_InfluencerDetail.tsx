'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Fragment, type ReactNode } from 'react';
import styled from 'styled-components';
import type { Locale } from '@/i18n/config';
import type { Influencer } from '@/data/influencers';
import type { Procedure, ProcedureCategory } from '@/data/procedures';
import { formatFollowers } from '@/lib/format';
import { mq } from '@/styles/theme';

/* Split view: left pane is a sticky 100vh video column; right pane
 * scrolls the document body. Using position: sticky (not fixed) so the
 * left stops sticking once the shell ends, letting the site footer flow
 * naturally below both columns. */
const Shell = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${mq.md} {
    flex-direction: row;
    align-items: flex-start;
  }
`;

/* The pane itself uses the page's cream background so the margin around
 * the rounded video frame blends into the rest of the page. Top padding
 * clears the fixed Header (~74px tall on desktop, ~64px mobile) so the
 * frame never slides under it. */
const LeftPane = styled.div`
  width: 100%;
  height: 72vh;
  padding: 84px 16px 16px;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.bg};

  ${mq.md} {
    width: 50vw;
    height: 100vh;
    padding: 88px 24px 28px 28px;
    position: sticky;
    top: 0;
    flex-shrink: 0;
  }
`;

/* The video/image lives inside this 40px-radius frame; the LeftPane
 * padding controls the visible cream margin around it. */
const VideoFrame = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 40px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceAlt};
`;

const LoopVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

/* Fallback when no video is available — use thumbnail photo. */
const LeftFallback = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
`;

const RightPane = styled.div`
  flex: 1;
  min-width: 0;
  /* Big bottom padding so content never hides behind the floating CTA. */
  padding: 40px 24px 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  ${mq.md} {
    min-height: 100vh;
    padding: 140px 48px 160px;
  }

  ${mq.lg} {
    padding: 160px 72px 180px;
  }
`;

const AvatarPhoto = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};

  ${mq.md} {
    width: 160px;
    height: 160px;
  }

  img {
    object-fit: cover;
  }
`;

const AvatarFallback = styled.div<{ $gradient: string }>`
  width: 100%;
  height: 100%;
  background: ${({ $gradient }) => $gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: var(--font-garamond), Georgia, serif;
  font-size: 48px;
`;

const NameRow = styled.div`
  margin-top: 28px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const Name = styled.h1`
  margin: 0;
  font-family: var(--font-garamond), Georgia, serif;
  font-weight: 400;
  font-style: italic;
  font-size: clamp(28px, 3.2vw, 40px);
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
`;

const VerifiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #1d9bf0;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const Followers = styled.p`
  margin: 8px 0 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Quote = styled.blockquote`
  margin: 36px 0 0;
  padding: 0;
  font-family: var(--font-garamond), Georgia, serif;
  font-weight: 400;
  font-size: clamp(20px, 2.1vw, 28px);
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 36ch;
`;

const Highlighted = styled.strong`
  font-family: inherit;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const Pair = styled.div`
  margin-top: 48px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  width: 100%;
  max-width: 520px;

  ${mq.md} {
    margin-top: 64px;
    gap: 18px;
  }
`;

const PairCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const PairLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Frame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.border};

  img {
    object-fit: cover;
  }
`;

/* The CTA floats at the bottom of the viewport, centered horizontally
 * within the right column on desktop and within the whole viewport on
 * mobile. The large bottom padding on RightPane guarantees content
 * never ends up hidden behind this button. */
const FloatingCTA = styled(Link)`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 36px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.text};
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 600;
  font-size: 15px;
  box-shadow: ${({ theme }) => theme.shadow.md};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateX(-50%) translateY(-1px);
    box-shadow: 0 12px 36px rgba(27, 26, 23, 0.2);
  }

  /* Center inside the right 50% column on desktop. */
  ${mq.md} {
    left: 75%;
    bottom: 44px;
    /* min-width targets ~1.5× the mobile rendered width (~172 → 258). */
    min-width: 258px;
    padding: 18px 36px;
    font-size: 17px;
    &:hover {
      transform: translateX(-50%) translateY(-1px);
    }
  }
`;

function VerifiedCheck() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden>
      <path
        fill="currentColor"
        d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.245.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
      />
    </svg>
  );
}

function renderHighlighted(text: string, phrases: string[]): ReactNode[] {
  if (!phrases.length) return [text];
  type Part = string | { h: string };
  let parts: Part[] = [text];
  for (const phrase of phrases) {
    parts = parts.flatMap((p) => {
      if (typeof p !== 'string') return [p];
      const idx = p.indexOf(phrase);
      if (idx < 0) return [p];
      const out: Part[] = [];
      if (idx > 0) out.push(p.slice(0, idx));
      out.push({ h: phrase });
      const rest = p.slice(idx + phrase.length);
      if (rest) out.push(rest);
      return out;
    });
  }
  return parts.map((p, i) =>
    typeof p === 'string' ? (
      <Fragment key={i}>{p}</Fragment>
    ) : (
      <Highlighted key={i}>{p.h}</Highlighted>
    ),
  );
}

type Props = {
  influencer: Influencer;
  locale: Locale;
  // Still accepted by the route but no longer rendered in the redesign —
  // kept so the page.tsx wiring doesn't have to change in this pass.
  procedures: Procedure[];
  dict: {
    procedureList: string;
    bookCTA: string;
    followers: string;
    procedureCountLabel: string;
    categories: Record<ProcedureCategory, string>;
    minutes: string;
    beforeLabel: string;
    afterLabel: string;
    getTheBeauty: string;
  };
};

export function InfluencerDetail({ influencer, locale, dict }: Props) {
  const lang = locale as 'ko' | 'en';
  const quoteText = influencer.quote?.[lang];
  const highlights = influencer.quoteHighlight?.[lang] ?? [];
  const hasPair = !!(influencer.beforeImage && influencer.afterImage);

  return (
    <Shell>
      <LeftPane>
        <VideoFrame>
          {influencer.video ? (
            <LoopVideo
              src={influencer.video}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              poster={influencer.thumbnail}
            />
          ) : influencer.thumbnail ? (
            <LeftFallback
              style={{ backgroundImage: `url(${influencer.thumbnail})` }}
            />
          ) : null}
        </VideoFrame>
      </LeftPane>

      <RightPane>
        <AvatarPhoto>
          {influencer.thumbnail ? (
            <Image
              src={influencer.thumbnail}
              alt={influencer.name[locale]}
              fill
              sizes="160px"
            />
          ) : (
            <AvatarFallback $gradient={influencer.avatar}>
              {influencer.name[locale].charAt(0)}
            </AvatarFallback>
          )}
        </AvatarPhoto>

        <NameRow>
          <Name>{influencer.name[locale]}</Name>
          {influencer.verified && (
            <VerifiedBadge aria-label="Verified">
              <VerifiedCheck />
            </VerifiedBadge>
          )}
        </NameRow>

        <Followers>
          {formatFollowers(influencer.followers, locale)} {dict.followers}
        </Followers>

        {quoteText && (
          <Quote>“{renderHighlighted(quoteText, highlights)}”</Quote>
        )}

        {hasPair && (
          <Pair>
            <PairCol>
              <PairLabel>{dict.beforeLabel}</PairLabel>
              <Frame>
                <Image
                  src={influencer.beforeImage!}
                  alt={dict.beforeLabel}
                  fill
                  sizes="(min-width: 768px) 22vw, 45vw"
                />
              </Frame>
            </PairCol>
            <PairCol>
              <PairLabel>{dict.afterLabel}</PairLabel>
              <Frame>
                <Image
                  src={influencer.afterImage!}
                  alt={dict.afterLabel}
                  fill
                  sizes="(min-width: 768px) 22vw, 45vw"
                />
              </Frame>
            </PairCol>
          </Pair>
        )}
      </RightPane>

      <FloatingCTA href={`/${locale}/book?ref=${influencer.slug}`}>
        {dict.getTheBeauty}
      </FloatingCTA>
    </Shell>
  );
}
