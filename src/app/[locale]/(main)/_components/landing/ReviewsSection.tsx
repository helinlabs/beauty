'use client';

import { Fragment, type ReactNode } from 'react';
import Image from 'next/image';
import styled from 'styled-components';
import { mq } from '@/styles/theme';
import type { Locale } from '@/i18n/config';
import { reviews, type Review } from '@/data/reviews';
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
    beforeLabel: string;
    afterLabel: string;
    readStory: string;
    /** "Month {n}" template; {n} is substituted with the month number. */
    monthLabel?: string;
    /** "Verified review" badge text. */
    verifiedLabel?: string;
  };
}

/* Only review kinds with before/after imagery feed this redesign — the
 * landing section now shows three photo-driven progression cards, same
 * shape as the reference comp (outcome pill, before/after pair with
 * analysis mesh, quote with highlights, name, verified row). */
function isBeforeAfterLanding(
  r: Review,
): r is Review & { beforeImage: string; afterImage: string } {
  return r.kind === 'beforeAfter' && !!r.beforeImage && !!r.afterImage;
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 48px;

  ${mq.md} {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  /* Stretch FadeIn wrapper to the tallest row cell so Cards can share height. */
  & > * {
    height: 100%;
  }
`;

/* The card: soft rounded panel using the site's alt surface tone so
 * it reads as a quiet block against the cream page background. */
const Card = styled.article`
  position: relative;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 28px 22px 26px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 18px;
  height: 100%;
`;

const OutcomePill = styled.span`
  align-self: center;
  padding: 6px 14px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.01em;
  line-height: 1.2;
`;

const Pair = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
`;

/* Wrapper for each before/after image. Rounded corners, fixed 4/5
 * ratio so both frames line up regardless of source image aspect. */
const Frame = styled.div`
  position: relative;
  aspect-ratio: 4 / 5;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.border};

  img {
    object-fit: cover;
  }
`;

const TimeLabel = styled.p`
  margin: 6px 0 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
`;

/* Quote (everything inside the "…" including the highlighted span)
 * uses EB Garamond — the same face the hero/how-it-works titles use —
 * so the customer voice reads as editorial prose rather than UI copy. */
const Quote = styled.blockquote`
  margin: 4px 0 0;
  padding: 0;
  font-family: var(--font-garamond), Georgia, serif;
  font-size: 17px;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};

  ${mq.md} {
    font-size: 18px;
  }
`;

const Highlighted = styled.strong`
  font-family: var(--font-garamond), Georgia, serif;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
`;

const Reviewer = styled.p`
  margin: 14px 0 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  font-weight: 500;
`;

const VerifiedRow = styled.p`
  /* Negative margin offsets Card's 18px flex gap so name→verified reads as 4px. */
  margin: -14px 0 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  align-self: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
`;

const CenteredTitle = styled(SerifH2)`
  text-align: center;
  margin-left: auto;
  margin-right: auto;
`;

/* Split a quote string into plain + highlighted segments.
 * Matches each phrase in `highlights` literally; if none match, the
 * whole quote renders plain. Ordering follows the source string. */
function renderQuote(text: string, highlights: string[]): ReactNode[] {
  if (!highlights.length) return [text];
  type Part = string | { h: string };
  let parts: Part[] = [text];
  for (const phrase of highlights) {
    parts = parts.flatMap((p) => {
      if (typeof p !== 'string') return [p];
      const idx = p.indexOf(phrase);
      if (idx < 0) return [p];
      const result: Part[] = [];
      if (idx > 0) result.push(p.slice(0, idx));
      result.push({ h: phrase });
      const rest = p.slice(idx + phrase.length);
      if (rest) result.push(rest);
      return result;
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

function ShieldIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m9 12 2 2 4-4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ReviewsSection({ locale, dict }: Props) {
  const items = reviews.filter(isBeforeAfterLanding).slice(0, 3);
  const verifiedText = dict.verifiedLabel ?? 'Verified review';
  const lang = locale as 'ko' | 'en';

  return (
    <SectionWrap id="reviews">
      <SectionInner>
        <FadeIn>
          <CenteredTitle $large>{dict.title}</CenteredTitle>
        </FadeIn>

        <Grid>
          {items.map((r, idx) => {
            const outcome = r.outcomeLabel?.[lang];
            const highlights = r.highlight?.[lang] ?? [];
            return (
              <FadeIn key={r.id} delay={idx * 90}>
                <Card>
                  {outcome && <OutcomePill>{outcome}</OutcomePill>}

                  <Pair>
                    <div>
                      <Frame>
                        <Image
                          src={r.beforeImage}
                          alt={dict.beforeLabel}
                          fill
                          sizes="(min-width: 768px) 16vw, 44vw"
                        />
                      </Frame>
                      <TimeLabel>{dict.beforeLabel}</TimeLabel>
                    </div>
                    <div>
                      <Frame>
                        <Image
                          src={r.afterImage}
                          alt={dict.afterLabel}
                          fill
                          sizes="(min-width: 768px) 16vw, 44vw"
                        />
                      </Frame>
                      <TimeLabel>{dict.afterLabel}</TimeLabel>
                    </div>
                  </Pair>

                  <Quote>“{renderQuote(r.quote[lang], highlights)}”</Quote>

                  <Reviewer>{r.reviewerName}</Reviewer>
                  {r.verified && (
                    <VerifiedRow>
                      <ShieldIcon />
                      {verifiedText}
                    </VerifiedRow>
                  )}
                </Card>
              </FadeIn>
            );
          })}
        </Grid>
      </SectionInner>
    </SectionWrap>
  );
}
