'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { mq } from '@/styles/theme';
import { ContactModal, type ContactModalLabels } from '@/components/ContactModal';
import type { Locale } from '@/i18n/config';
import { UnicornBg } from './UnicornBg';

/* Background-only ambient gradient (no subject). */
const UNICORN_BG_ID = 'gEOLxmzC950bLoYV0flc';
/* Foreground subject (the face) — transparent-background scene that sits
   on top of the cover gradient. */
const UNICORN_FACE_ID = 'yKxO5mjxGCimnL4Ie399';

interface Feature {
  label: string;
  description: string;
}

interface Props {
  locale: Locale;
  dict: {
    eyebrow: string;
    title: string;
    subtitle: string;
    subcopy: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stickyCta: string;
    features: Feature[];
  };
  modalLabels: ContactModalLabels;
}

/* ───── Containers ─────
 * Two separate Unicorn scenes, sized independently:
 *  - <UnicornBg mode="cover" projectId={BG} /> fills the entire hero with
 *    the dedicated atmospheric gradient scene.
 *  - <Stage><UnicornBg mode="face" projectId={FACE} /></Stage> shows the
 *    subject scene, capped at a fixed width so the face never grows on
 *    ultra-wide screens.
 * The CSS gradient under Wrap is kept as a paint-time fallback for the
 * brief moment before the canvases initialize. */
const Wrap = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  background:
    radial-gradient(ellipse 80% 60% at 18% 30%, rgba(229, 200, 230, 0.85), transparent 65%),
    radial-gradient(ellipse 70% 60% at 82% 28%, rgba(195, 195, 240, 0.8), transparent 62%),
    radial-gradient(ellipse 85% 70% at 80% 90%, rgba(245, 215, 200, 0.9), transparent 65%),
    radial-gradient(ellipse 90% 70% at 18% 92%, rgba(250, 230, 210, 0.85), transparent 65%),
    linear-gradient(180deg, #f4ecf4 0%, #f7eee6 100%);

  margin-top: -60px;
  padding: 84px 20px 32px;
  gap: 20px;

  ${mq.md} {
    margin-top: -68px;
    padding: 96px 32px 56px;
    gap: 28px;
  }

  /* Fade the hero's colorful bottom into the next section's cream page bg
     so the boundary reads as a continuous gradient, not a hard edge. */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 140px;
    background: linear-gradient(
      to bottom,
      transparent 0%,
      ${({ theme }) => theme.colors.bg} 100%
    );
    pointer-events: none;
    z-index: 2;

    ${mq.md} {
      height: 200px;
    }
  }
`;

/* Hero-wide ambient background. Holds the cover-mode UnicornBg so the
   gradient stretches edge-to-edge regardless of breakpoint. */
const BgLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
`;

const HeroTitle = styled.h1`
  position: relative;
  z-index: 1;
  margin-top: 100px;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 400;
  font-style: italic;
  letter-spacing: -0.025em;
  line-height: 1.05;
  white-space: pre-line;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: clamp(36px, 5.2vw, 72px);
  max-width: 20ch;

  ${mq.md} {
    margin-top: 60px;
  }

  em {
    font-style: italic;
    font-weight: 400;
  }
`;

/* The centered face scene — native 800×800 square Unicorn embed.
 * Sits directly below the CTA button (no longer overlaps title/CTA)
 * and scales responsively per breakpoint. */
const Stage = styled.div`
  position: relative;
  z-index: 0;
  width: min(100%, 440px);
  aspect-ratio: 1 / 1;

  ${mq.md} {
    width: min(72vw, 720px);
  }

  ${mq.lg} {
    width: min(60vw, 820px);
  }
`;

/* Pill-style primary CTA — body fills with the stone primary and the
   trailing arrow button is inverted (white disc + primary icon). */
const CtaPill = styled.button`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 8px 8px 8px 22px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  transition: background 0.2s, border-color 0.2s, transform 0.2s;

  ${mq.md} {
    width: 220px;
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    border-color: ${({ theme }) => theme.colors.primaryDark};
  }

  & > span.arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: #fff;
    color: ${({ theme }) => theme.colors.primary};
    transition: transform 0.2s;
  }
  &:hover > span.arrow { transform: translateX(2px); }
`;

export function HeroSection({ dict, locale, modalLabels }: Props) {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <Wrap id="hero">
      <BgLayer>
        <UnicornBg projectId={UNICORN_BG_ID} mode="cover" />
      </BgLayer>

      <HeroTitle>{dict.title}</HeroTitle>

      <CtaPill
        type="button"
        onClick={() => setContactOpen(true)}
        data-testid="hero-cta-primary"
      >
        {dict.ctaPrimary}
        <span className="arrow" aria-hidden>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12h14M13 5l7 7-7 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </CtaPill>

      <Stage>
        <UnicornBg projectId={UNICORN_FACE_ID} mode="face" />
      </Stage>

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        labels={modalLabels}
        locale={locale}
      />
    </Wrap>
  );
}
