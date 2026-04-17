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
 * Lives inside a fixed positioning context with padding so the glass
 * pill floats with margins rather than clamping edge-to-edge. When the
 * page is at rest we slide the pill up out of view (hidden until the
 * user scrolls). When the user scrolls past a threshold, it drops back
 * down with a spring-feeling transition, revealing a frosted pill with
 * a subtle specular highlight along the top edge — Apple's Liquid
 * Glass look (iOS 26 / macOS Tahoe).
 */
const HeaderShell = styled.header<{ $scrolled: boolean }>`
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

  /* Pre-scroll: pull pill above the viewport and dim it, so it feels
     like the glass is "deposited" at the top on first scroll rather
     than being present from the start. */
  ${({ $scrolled }) =>
    !$scrolled &&
    css`
      transform: translate3d(0, -140%, 0);
      opacity: 0;
    `}

  transition:
    transform 520ms cubic-bezier(0.22, 1, 0.36, 1),
    opacity 320ms cubic-bezier(0.22, 1, 0.36, 1);

  @media (prefers-reduced-motion: reduce) {
    transition: opacity 160ms linear;
    transform: none;
  }
`;

const Pill = styled.div`
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

  /* Frosted glass body — the backdrop-filter does the work; the
     background is a soft warm tint so the pill still reads on pure-
     white sections. */
  background:
    linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.55) 0%,
      rgba(255, 255, 255, 0.28) 100%
    );
  backdrop-filter: blur(22px) saturate(1.8);
  -webkit-backdrop-filter: blur(22px) saturate(1.8);

  /* Depth + specular highlight along the top to sell "liquid glass".
     Outer: soft drop shadow. Inner: bright 1px rim at the top, darker
     rim at the bottom, and a very faint outer stroke for crispness. */
  box-shadow:
    0 10px 30px rgba(27, 26, 23, 0.12),
    0 2px 6px rgba(27, 26, 23, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(27, 26, 23, 0.06),
    inset 0 0 0 1px rgba(255, 255, 255, 0.35);

  ${mq.md} {
    height: 60px;
    padding: 0 10px 0 24px;
  }

  /* Additional glossy sheen across the top half of the pill — a thin
     diagonal gradient that reads as a light source reflecting off the
     glass. Kept subtle so it doesn't compete with content. */
  &::before {
    content: '';
    position: absolute;
    inset: 1px 1px auto 1px;
    height: 50%;
    border-radius: 999px 999px 40% 40% / 999px 999px 100% 100%;
    background: linear-gradient(
      115deg,
      rgba(255, 255, 255, 0.55) 0%,
      rgba(255, 255, 255, 0.05) 55%,
      rgba(255, 255, 255, 0.0) 100%
    );
    pointer-events: none;
    z-index: 0;
  }
`;

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
    <HeaderShell $scrolled={scrolled}>
      <Pill>
        <Brand href={base}>{brand}</Brand>
        <RightNav>
          <ReviewsLink href={`${base}/influencers`}>Reviews</ReviewsLink>
          <LoginBtn href={`${base}/admin-login`}>Log in</LoginBtn>
        </RightNav>
      </Pill>
    </HeaderShell>
  );
}
