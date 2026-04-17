'use client';

import styled from 'styled-components';
import { mq } from '@/styles/theme';
import { FadeIn } from './FadeIn';
import { SerifWordmark } from './_shared';

interface Stat {
  value: string;
  label: string;
}

interface Props {
  dict: {
    stats: {
      patients: Stat;
      reviews: Stat;
      english: Stat;
      certified: Stat;
    };
    partnerLabel: string;
    partnerName: string;
    certs: string[];
  };
}

/**
 * Scroll layout:
 * - Band is a plain flow container (no absolute positioning)
 * - StickyBackdrop pins to top:0 while Band is in view, holding the
 *   clinic photo full-bleed across the viewport. Pure CSS sticky;
 *   browser handles the pin + release automatically.
 * - Inner sits AFTER the sticky block in source order and uses a
 *   negative margin-top so the partner + stats slide UP over the
 *   pinned photo. Inner has an opaque cream background so as it
 *   rises, it progressively covers the image from bottom to top.
 * - Once the user has scrolled past the whole Band (Band's bottom
 *   reaches the viewport top), sticky releases and the backdrop
 *   scrolls away with everything else — which is exactly the "content
 *   scrolls up, then image also goes up" behavior the design calls
 *   for.
 */
const Band = styled.section`
  position: relative;
  isolation: isolate;
  background: ${({ theme }) => theme.colors.bg};
`;

const StickyBackdrop = styled.div`
  position: sticky;
  top: 0;
  /* Height of the pinned image panel. Less than 100vh so the header
   * and a sliver of the next content is visible even at full pin,
   * which makes the release feel less jarring. */
  height: 80vh;
  overflow: hidden;
  z-index: 0;
  background-color: ${({ theme }) => theme.colors.bg};
  background-image: url('/images/clinic-interior.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  ${mq.md} {
    height: 90vh;
  }

  /* Soft fade at the very bottom so the join with the rising Inner
   * block reads as a continuous gradient instead of a hard edge for
   * the ~20vh overlap range. */
  &::after {
    content: '';
    position: absolute;
    inset: auto 0 0 0;
    height: 25%;
    background: linear-gradient(
      to bottom,
      rgba(251, 247, 241, 0) 0%,
      rgba(251, 247, 241, 0.6) 70%,
      ${({ theme }) => theme.colors.bg} 100%
    );
    pointer-events: none;
  }
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
  /* Pull the content up so its top edge starts inside the bottom of
   * the sticky panel. As the user scrolls, the Inner block slides up
   * across the pinned image. */
  margin-top: -20vh;
  padding: 0 20px 64px;
  max-width: ${({ theme }) => theme.maxWidth};
  margin-left: auto;
  margin-right: auto;
  /* Opaque cream fill so the content progressively masks the pinned
   * image as it scrolls up into the viewport. */
  background: ${({ theme }) => theme.colors.bg};
  /* Rounded top edge for a soft "pane lifting over image" feel. */
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding-top: 48px;

  ${mq.md} {
    margin-top: -20vh;
    padding: 56px 32px 96px;
    border-top-left-radius: 32px;
    border-top-right-radius: 32px;
  }

  ${mq.lg} {
    padding: 72px 32px 112px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px 16px;
  margin-top: 40px;
  padding-top: 28px;
  border-top: 1px dashed ${({ theme }) => theme.colors.border};

  ${mq.md} {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
    margin-top: 56px;
    padding-top: 36px;
  }
`;

const StatBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
`;

const StatValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 400;
  font-size: clamp(28px, 3.2vw, 42px);
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
`;

const StatLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
`;

const PartnerRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
`;

/* Stacked label + wordmark — "Official partner clinic" sits above the
 * "View Plastic Surgery" serif wordmark on all breakpoints. The
 * wordmark itself is scaled up to match the stat numbers below so
 * the partner name reads as the anchor of this section, not a
 * secondary label. */
const PartnerLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  small {
    font-size: 13px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.textMuted};
  }

  /* Override the default SerifWordmark (20px) so "View Plastic
   * Surgery" renders at the same scale as StatValue numbers below. */
  ${SerifWordmark} {
    font-size: clamp(28px, 3.2vw, 42px);
    letter-spacing: -0.01em;
    line-height: 1.1;
  }
`;

/* Cert pills: vertical stack on mobile (one per line), horizontal row
 * from md+ where there's enough width to fit them side-by-side. */
const CertRow = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 0;

  ${mq.md} {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const CertPill = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  font-weight: 500;
`;

function ShieldIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.5l8 3v6.3c0 4.4-3 8-8 9.7-5-1.7-8-5.3-8-9.7V5.5l8-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12l2.6 2.6L15.7 10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrustBarSection({ dict }: Props) {
  const entries = [
    dict.stats.patients,
    dict.stats.reviews,
    dict.stats.english,
    dict.stats.certified,
  ];

  return (
    <Band id="trust">
      <StickyBackdrop aria-hidden />
      <Inner>
        <FadeIn>
          <PartnerRow>
            <PartnerLeft>
              <small>{dict.partnerLabel}</small>
              <SerifWordmark>{dict.partnerName}</SerifWordmark>
            </PartnerLeft>
            <CertRow>
              {dict.certs.map((c, i) => (
                <CertPill key={i}>
                  <ShieldIcon />
                  {c}
                </CertPill>
              ))}
            </CertRow>
          </PartnerRow>
        </FadeIn>

        <StatsGrid>
          {entries.map((s, i) => (
            <FadeIn key={i} delay={i * 80}>
              <StatBlock>
                <StatValue>{s.value}</StatValue>
                <StatLabel>{s.label}</StatLabel>
              </StatBlock>
            </FadeIn>
          ))}
        </StatsGrid>
      </Inner>
    </Band>
  );
}
