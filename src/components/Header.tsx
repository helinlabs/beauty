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
  outline: none;
  &:focus,
  &:focus-visible,
  &:hover {
    outline: none;
    box-shadow: none;
  }
`;

const RightNav = styled.div`
  display: flex;
  align-items: center;
  gap: 36px;
`;

/** Reviews — plain text link, always in theme text color so it stays
 *  legible over the hero gradient AND the scrolled pale header. */
const ReviewsLink = styled(Link)`
  font-weight: 500;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  transition: opacity 0.2s ease;
  &:hover { opacity: 0.8; }
`;

/** Log in — ghost pill with dark outline + dark text in all header
 *  states. */
const LoginBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 9px 18px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: transparent;
  border: 1px solid rgba(27, 26, 23, 0.3);
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 15px;
  transition: background 0.2s ease, border-color 0.2s ease;
  &:hover {
    background: rgba(27, 26, 23, 0.05);
    border-color: ${({ theme }) => theme.colors.text};
  }
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
            <ReviewsLink href={`${base}/influencers`}>Reviews</ReviewsLink>
            <LoginBtn href={`${base}/admin-login`}>Log in</LoginBtn>
          </RightNav>
        </Row>
      </Container>
    </HeaderBar>
  );
}
