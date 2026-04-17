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

  /* Liquid Glass state — cheap version that still reads as glass:
     1) Flat rgba(255,255,255,0.15) tint
     2) Two-direction specular rim (top-left bright + bottom-right
        softer) via inset box-shadow
     3) backdrop-filter limited to blur + saturate — the SVG
        feDisplacementMap refraction was visually great but expensive
        (feTurbulence recomputes noise every paint, and a fixed pill
        over dynamic content forces the whole chain to re-run on every
        scroll tick). Dropping it restores 60fps scroll without giving
        up the frosted look.
     4) GPU hoist via will-change transform + backdrop-filter, so the
        pill paints to its own compositing layer and the browser
        doesn't re-sample backdrop pixels from scratch each frame. */
  ${({ $scrolled }) =>
    $scrolled &&
    css`
      background: rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(12px) saturate(1.8);
      -webkit-backdrop-filter: blur(12px) saturate(1.8);
      box-shadow:
        inset 1px 1px 1px 0 rgba(255, 255, 255, 0.4),
        inset -1px -1px 1px 0 rgba(255, 255, 255, 0.2);
      transform: translate3d(0, 0, 0);
      will-change: transform, backdrop-filter;
    `}
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
