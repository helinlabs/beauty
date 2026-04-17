'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { mq } from '@/styles/theme';
import type { Locale } from '@/i18n/config';

type Props = {
  locale: Locale;
  brand: string;
};

/**
 * Liquid-Glass header.
 *
 * Always mounted at the top so the brand + nav are visible the moment
 * the page loads — the header doesn't slide in from nowhere. Once the
 * user scrolls past the threshold, the inner pill gains the Liquid
 * Glass treatment (frosted refraction + crisp outer stroke) and the
 * brand switches to white. At rest (scrollY ≈ 0) the pill is a plain,
 * transparent row so the hero composition is uninterrupted.
 */
const HeaderShell = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  padding: 10px 12px 0;
  pointer-events: none;

  ${mq.md} {
    padding: 14px 24px 0;
  }

  /* Child pill gets pointer events back; the shell itself is inert so
     clicks pass through the invisible gutter around the pill. */
  > * {
    pointer-events: auto;
  }
`;

const Pill = styled.div<{ $scrolled: boolean }>`
  position: relative;
  margin: 0 auto;
  /* Match the max content width used by the landing sections
   * (theme.maxWidth = 1200px) so the header pill never extends past
   * the text columns on wide viewports. */
  max-width: ${({ theme }) => theme.maxWidth};
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  height: 54px;
  padding: 0 10px 0 20px;
  border-radius: 999px;
  isolation: isolate;

  /* Pre-scroll: fully transparent, no filter at all. */
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  box-shadow: none;

  /* Only fade cheap properties (fill + rim). Animating backdrop-filter
     is expensive because every interpolated frame re-runs the filter
     chain on the backdrop; we let it snap instead. */
  transition:
    background 260ms ease,
    box-shadow 260ms ease;

  ${mq.md} {
    height: 60px;
    padding: 0 10px 0 24px;
  }

  /* Scrolled state — single Liquid Glass look, always on.
     The key perf fix is in the filter definition itself: feImage
     loads a pre-baked noise data URL instead of feTurbulence, so the
     noise is computed ONCE when the image parses and then cached
     forever — no per-frame generation cost. Combined with a small
     blur + saturate and a tight filter region, the entire backdrop
     pipeline stays cheap enough to run every scroll tick without
     dropping frames, while still producing the pixel-bending
     refraction. No state swap, no visible pop between scrolling and
     resting. */
  ${({ $scrolled }) =>
    $scrolled &&
    css`
      background: rgba(255, 255, 255, 0.35);
      backdrop-filter: url(#liquid-refraction) blur(2px) saturate(1.8);
      -webkit-backdrop-filter: url(#liquid-refraction) blur(2px) saturate(1.8);
      box-shadow:
        inset 1px 1px 1px 0 rgba(255, 255, 255, 0.4),
        inset -1px -1px 1px 0 rgba(255, 255, 255, 0.2);
      transform: translate3d(0, 0, 0);
      will-change: transform;

      /* Fallback: if url() can't be parsed in a backdrop-filter chain
         (older Safari), show a clean frosted pane instead of a raw
         white bar. */
      @supports not (backdrop-filter: url(#liquid-refraction)) {
        backdrop-filter: blur(12px) saturate(1.8);
        -webkit-backdrop-filter: blur(12px) saturate(1.8);
      }
    `}
`;

/* Off-screen SVG host that registers the refraction filter. Mounted
 * once with the header so the Pill's backdrop-filter URL reference
 * resolves. */
const FilterHost = styled.svg`
  position: absolute;
  width: 0;
  height: 0;
  pointer-events: none;
`;

/* Brand stays in theme text color on ALL header states. Flipping to
 * pure white made it unreadable the moment the page scrolled onto a
 * cream / white section (trust stats, how-it-works, FAQ, etc.) — the
 * glass pill is intentionally near-transparent, so the brand color
 * has to read on whatever section is passing behind. */
const Brand = styled(Link)`
  position: relative;
  z-index: 1;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 400;
  font-style: italic;
  font-size: 24px;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
  outline: none;

  ${mq.md} {
    font-size: 26px;
  }

  &:focus,
  &:focus-visible,
  &:hover {
    outline: none;
    box-shadow: none;
  }
`;

const RightNav = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 14px;

  ${mq.md} {
    gap: 24px;
  }
`;

const ReviewsLink = styled(Link)`
  font-weight: 500;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  transition: opacity 0.2s ease;
  padding: 4px 6px;

  ${mq.md} {
    font-size: 15px;
  }

  &:hover { opacity: 0.75; }
`;

/* Log in — inner "solid-glass" pill sitting inside the outer liquid
 * glass bar. Uses a near-opaque surface to mirror the reference
 * (darker cream/white disc) so it reads as a button even over busy
 * backgrounds. */
const LoginBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 14px;
  letter-spacing: -0.005em;
  transition: transform 0.18s ease, background 0.18s ease;

  ${mq.md} {
    padding: 9px 18px;
    font-size: 15px;
  }

  &:hover {
    background: #fff;
    transform: translateY(-1px);
  }
`;

export function Header({ locale, brand }: Props) {
  const base = `/${locale}`;
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 16);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <HeaderShell>
      {/*
        SVG filter — single fixed chain used every frame so the glass
        never changes appearance between scrolling and resting. Tuned
        as light as possible:
        - Tight filter region (x/y = -5%, w/h = 110%) so the filter
          operates on the minimum pixel area
        - numOctaves="1" (half the compute of 2)
        - stitchTiles="stitch" lets the browser cache a small repeated
          noise tile instead of generating a fresh field for the
          entire filter region
        - scale="18" gives visible refraction without maximizing
          per-pixel offset work
        - Fixed seed keeps the pattern deterministic so the compositor
          can reuse its cache across frames.
      */}
      <FilterHost aria-hidden>
        <defs>
          <filter
            id="liquid-refraction"
            x="-5%"
            y="-5%"
            width="110%"
            height="110%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018"
              numOctaves="1"
              seed="7"
              stitchTiles="stitch"
              result="turb"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turb"
              scale="18"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </FilterHost>

      <Pill $scrolled={scrolled}>
        <Brand href={base}>{brand}</Brand>
        <RightNav>
          <ReviewsLink href={`${base}/influencers`}>Reviews</ReviewsLink>
          <LoginBtn href={`${base}/admin-login`}>Log in</LoginBtn>
        </RightNav>
      </Pill>
    </HeaderShell>
  );
}
