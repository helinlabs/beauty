'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { mq } from '@/styles/theme';
import type { Locale } from '@/i18n/config';
import { Container } from './Container';

const HeaderBar = styled.header<{ $scrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  transition: background 0.2s ease, backdrop-filter 0.2s ease;
  background: transparent;

  ${({ $scrolled }) =>
    $scrolled &&
    css`
      background: rgba(255, 255, 255, 0.7);
      backdrop-filter: saturate(1.4) blur(14px);
      -webkit-backdrop-filter: saturate(1.4) blur(14px);
    `}
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  gap: 12px;
  ${mq.md} { height: 68px; }
`;

const Brand = styled(Link)`
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 400;
  font-style: italic;
  font-size: 26px;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
`;

const RightNav = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

/** Reviews — text link, color flips from white (transparent header) to
 *  theme text (scrolled header with pale bg). */
const ReviewsLink = styled(Link)<{ $scrolled: boolean }>`
  font-weight: 500;
  font-size: 14px;
  color: ${({ $scrolled, theme }) =>
    $scrolled ? theme.colors.text : '#fff'};
  transition: color 0.2s ease, opacity 0.2s ease;
  &:hover { opacity: 0.8; }
`;

/** Log in — ghost pill. Swaps border + text between white (hero bg)
 *  and theme text (scrolled pale header). */
const LoginBtn = styled(Link)<{ $scrolled: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 9px 18px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: transparent;
  font-weight: 500;
  font-size: 13px;
  transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;

  ${({ $scrolled, theme }) =>
    $scrolled
      ? css`
          border: 1px solid rgba(27, 26, 23, 0.25);
          color: ${theme.colors.text};
          &:hover {
            background: rgba(27, 26, 23, 0.05);
            border-color: ${theme.colors.text};
          }
        `
      : css`
          border: 1px solid rgba(255, 255, 255, 0.5);
          color: #fff;
          &:hover {
            background: rgba(255, 255, 255, 0.14);
            border-color: rgba(255, 255, 255, 0.85);
          }
        `}
`;

type Props = {
  locale: Locale;
  brand: string;
};

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
    <HeaderBar $scrolled={scrolled}>
      <Container>
        <Row>
          <Brand href={base}>{brand}</Brand>
          <RightNav>
            <ReviewsLink href={`${base}/influencers`} $scrolled={scrolled}>
              Reviews
            </ReviewsLink>
            <LoginBtn href={`${base}/admin-login`} $scrolled={scrolled}>
              Log in
            </LoginBtn>
          </RightNav>
        </Row>
      </Container>
    </HeaderBar>
  );
}
