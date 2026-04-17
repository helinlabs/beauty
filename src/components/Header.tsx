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
  max-width: 1100px;
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

  /* Liquid Glass state.
     The earlier mix (10% white fill + brightness(1.05)) turned opaque
     over cream/white sections and hid the content behind it. We now:
     - drop the white fill to 4% so the pane truly passes light
     - remove brightness; keep saturate + contrast for the refraction
       pop without washing light pixels to full white
     - switch the hairline edge to a dark rgba so it's visible against
       BOTH light and dark sections (the previous white rim vanished
       on cream). */
  ${({ $scrolled }) =>
    $scrolled &&
    css`
      background: rgba(255, 255, 255, 0.04);
      backdrop-filter: blur(6px) saturate(1.9) contrast(1) brightness(1);
      -webkit-backdrop-filter: blur(6px) saturate(1.9) contrast(1) brightness(1);
      box-shadow: inset 0 0 0 1px rgba(27, 26, 23, 0.08);
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
  font-weight: 600;
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
