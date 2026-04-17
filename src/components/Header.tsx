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

  /* Liquid Glass state:
     - flat low-opacity tint (no vertical split, uniform pane)
     - strong refraction via saturate + contrast + brightness, with a
       small blur so the result isn't milky/foggy
     - crisp 1px inner stroke as the only edge definition (no outer
       drop shadow). */
  ${({ $scrolled }) =>
    $scrolled &&
    css`
      background: rgba(255, 255, 255, 0.10);
      backdrop-filter: blur(8px) saturate(2) contrast(1.08) brightness(1.05);
      -webkit-backdrop-filter: blur(8px) saturate(2) contrast(1.08) brightness(1.05);
      box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.28);
    `}
`;

/* In the shell's pre-scroll (hidden) state the Brand inherits the
 * default text color (used on the hero itself). Once the pill drops
 * down, we tint it pure white so it reads against the frosted pane
 * regardless of what section is scrolled beneath it. */
const Brand = styled(Link)<{ $scrolled: boolean }>`
  position: relative;
  z-index: 1;
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 400;
  font-style: italic;
  font-size: 24px;
  letter-spacing: -0.01em;
  color: ${({ $scrolled, theme }) =>
    $scrolled ? '#ffffff' : theme.colors.text};
  transition: color 260ms ease;
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
        <Brand href={base} $scrolled={scrolled}>{brand}</Brand>
        <RightNav>
          <ReviewsLink href={`${base}/influencers`}>Reviews</ReviewsLink>
          <LoginBtn href={`${base}/admin-login`}>Log in</LoginBtn>
        </RightNav>
      </Pill>
    </HeaderShell>
  );
}
