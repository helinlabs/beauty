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
 * Simple frosted-blur header.
 *
 * The previous Liquid Glass pass (SVG feTurbulence + feDisplacementMap
 * referenced from backdrop-filter) was visually great but extremely
 * expensive — every scroll frame re-ran a per-pixel displacement pass
 * on the captured backdrop, and on a page with other always-painting
 * content (the hero's UnicornStudio WebGL, scroll-driven parallax,
 * FadeIn observers) it routinely halved the frame rate.
 *
 * This version is a plain blur + saturate frost. GPU-accelerated,
 * negligible cost even on slower machines, and the visual difference
 * to the pixel-bending refraction is minor enough that the perf win
 * is clearly worth it.
 *
 * At scrollY ≈ 0 the pill stays fully transparent so the hero
 * composition isn't interrupted; the frost only kicks in once the
 * user starts scrolling past the threshold.
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
     on the backdrop; we let it snap instead. */
  transition:
    background 260ms ease,
    box-shadow 260ms ease;

  ${mq.md} {
    height: 60px;
    padding: 0 10px 0 24px;
  }

  /* Scrolled state — cheap frost. Plain blur + saturate, no SVG
     filter, no inset rim. Translate3d + will-change: transform hoist
     the pill onto its own compositor layer so the backdrop capture is
     cached instead of re-sampled every frame. */
  ${({ $scrolled }) =>
    $scrolled &&
    css`
      background: rgba(255, 255, 255, 0.55);
      backdrop-filter: blur(14px) saturate(1.6);
      -webkit-backdrop-filter: blur(14px) saturate(1.6);
      transform: translate3d(0, 0, 0);
      will-change: transform;
    `}
`;

/* Brand stays in theme text color on ALL header states. EB Garamond
 * Medium (weight 500) — classic serif wordmark. */
const Brand = styled(Link)`
  position: relative;
  z-index: 1;
  font-family: var(--font-garamond), Georgia, serif;
  font-weight: 500;
  font-style: normal;
  font-size: 22px;
  letter-spacing: -0.01em;
  line-height: 1;
  color: ${({ theme }) => theme.colors.text};
  outline: none;

  ${mq.md} {
    font-size: 24px;
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

/* Log in pill — near-opaque white surface, flat. */
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
