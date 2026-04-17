'use client';

import { useEffect, useRef } from 'react';
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

/* Clinic interior background: renders the full image (1048×544, ratio
 * 1.926) full-bleed at the TOP of the section, with content flowing
 * below it. The section top padding mirrors the image's displayed
 * height (viewport width ÷ aspect ratio) so the photo is never cropped
 * or stretched — the entire frame is always visible. */
const Band = styled.section`
  position: relative;
  isolation: isolate;
  background: transparent;
`;

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  /* Slightly taller than the natural aspect ratio so the parallax
   * translate has room to move without exposing the cream underneath
   * at either end. The image itself still renders at the correct
   * ratio because ::before uses background-size: cover. */
  aspect-ratio: 1048 / 544;
  height: calc(100vw * 544 / 1048 + 120px);
  z-index: 0;
  overflow: hidden;
  /* Hint the compositor to promote this to its own layer so the
   * parallax transform is GPU-accelerated and doesn't cause the
   * entire section to repaint every scroll tick. */
  will-change: transform;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('/images/clinic-interior.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  /* Soft fade-out at the bottom of the photo → cream so the transition
   * into the stats row feels continuous rather than a hard edge. */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(251, 247, 241, 0) 70%,
      rgba(251, 247, 241, 0.85) 92%,
      ${({ theme }) => theme.colors.bg} 100%
    );
  }
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  /* padding-top = image's natural height at current viewport width
   * (100vw × 544/1048 = ~51.9vw) + breathing room. */
  padding: calc(100vw * 544 / 1048 + 40px) 20px 64px;

  ${mq.md} {
    padding: calc(100vw * 544 / 1048 + 56px) 32px 96px;
  }

  ${mq.lg} {
    padding: calc(100vw * 544 / 1048 + 72px) 32px 112px;
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

  const bandRef = useRef<HTMLElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);

  /**
   * Parallax: translate the clinic photo vertically based on the
   * section's scroll progress through the viewport. We gate on an
   * IntersectionObserver so the scroll handler is only installed
   * while the section is near the viewport — it unsubscribes once
   * the user scrolls away, so idle pages pay no cost. rAF throttles
   * writes to the transform, and we honor prefers-reduced-motion by
   * skipping the hook entirely.
   */
  useEffect(() => {
    const band = bandRef.current;
    const backdrop = backdropRef.current;
    if (!band || !backdrop) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const MAX_SHIFT = 120; // px of parallax travel (image moves up this much)
    let ticking = false;
    let onScroll: (() => void) | null = null;

    function update() {
      ticking = false;
      if (!band || !backdrop) return;
      const rect = band.getBoundingClientRect();
      const vh = window.innerHeight;
      // progress 0 when section top hits viewport bottom,
      // 1 when section bottom hits viewport top
      const progress = 1 - (rect.bottom) / (vh + rect.height);
      const clamped = Math.max(0, Math.min(1, progress));
      backdrop.style.transform = `translate3d(0, ${-clamped * MAX_SHIFT}px, 0)`;
    }

    function schedule() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onScroll = schedule;
          window.addEventListener('scroll', onScroll, { passive: true });
          update(); // initial sync so it's positioned correctly on entry
        } else if (onScroll) {
          window.removeEventListener('scroll', onScroll);
          onScroll = null;
        }
      },
      { rootMargin: '100px 0px 100px 0px', threshold: 0 },
    );
    observer.observe(band);

    return () => {
      observer.disconnect();
      if (onScroll) window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <Band id="trust" ref={bandRef}>
      <Backdrop ref={backdropRef} aria-hidden />
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
