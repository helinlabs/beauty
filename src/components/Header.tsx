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

  /* Transparent at the top of the page — no glass, no backdrop, no
     stroke — so the hero composition shows through untouched. Glass
     activates only after the user starts scrolling. */
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  box-shadow: none;

  transition:
    background 260ms ease,
    backdrop-filter 260ms ease,
    -webkit-backdrop-filter 260ms ease,
    box-shadow 260ms ease;

  ${mq.md} {
    height: 60px;
    padding: 0 10px 0 24px;
  }

  /* Liquid Glass state — modeled after the reference:
     1) base tint — rgba(255,255,255,0.15) flat fill
     2) two-direction specular rim — bright top-left highlight plus a
        softer bottom-right one, creating a light-from-above look
     3) backdrop-filter uses an SVG feTurbulence → feDisplacementMap
        chain for REAL pixel refraction (what iOS 26 / macOS Tahoe
        calls Liquid Glass). Blur alone is just fog; the displacement
        map physically offsets the backdrop pixels along an organic
        noise field, so straight lines behind the pill bend and
        ripple like real curved glass.
     4) a thin blur + saturate polish the edges and push color
        saturation without changing lightness (brightness/contrast
        pinned to 1 per design note). */
  ${({ $scrolled }) =>
    $scrolled &&
    css`
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: url(#liquid-refraction) blur(1px) saturate(1.8)
        contrast(1) brightness(1);
      -webkit-backdrop-filter: url(#liquid-refraction) blur(1px)
        saturate(1.8) contrast(1) brightness(1);
      box-shadow:
        inset 1px 1px 1px 0 rgba(255, 255, 255, 0.4),
        inset -1px -1px 1px 0 rgba(255, 255, 255, 0.2);

      /* Safari ≤ 17 and any browser that can't parse the url()
         reference in a backdrop-filter chain gets a plain frosted
         fallback so the pill is never left as a raw white bar. */
      @supports not (backdrop-filter: url(#liquid-refraction)) {
        backdrop-filter: blur(12px) saturate(1.8);
        -webkit-backdrop-filter: blur(12px) saturate(1.8);
      }
    `}
`;

/* Invisible SVG filter mounted once with the header so its ID can be
 * referenced by the Pill's backdrop-filter URL. */
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
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 -1px 0 rgba(27, 26, 23, 0.08),
    0 1px 2px rgba(27, 26, 23, 0.06);
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
        SVG filter graph used by the Pill's backdrop-filter URL
        reference. feTurbulence produces a soft organic noise field
        (fractalNoise at low frequency → slow, flowing waves rather
        than TV static). feDisplacementMap reads the noise's R/G
        channels as X/Y offsets and pushes the pill's backdrop pixels
        around accordingly — that is the actual refraction you see
        behind curved glass. `scale` is the max pixel displacement;
        28 gives a very visible bend without fully breaking legibility
        of text behind the pill. The filter region is padded past the
        element's box so the displacement near the edges isn't
        clipped. Seed is fixed so the pattern is deterministic.
      */}
      <FilterHost aria-hidden>
        <defs>
          <filter
            id="liquid-refraction"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            colorInterpolationFilters="sRGB"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.008 0.012"
              numOctaves="2"
              seed="7"
              result="turb"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turb"
              scale="28"
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
