'use client';

import Link from 'next/link';
import { useState } from 'react';
import styled from 'styled-components';
import { mq } from '@/styles/theme';
import type { Locale } from '@/i18n/config';
import { LanguageSwitcher } from './LanguageSwitcher';
import { Container } from './Container';

const HeaderBar = styled.header`
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(15, 13, 20, 0.72);
  backdrop-filter: saturate(1.3) blur(12px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
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
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 900;
  font-size: 19px;
  letter-spacing: -0.02em;
  background: linear-gradient(90deg, #ff4f8b, #a084f2);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
`;

const Nav = styled.nav<{ $open: boolean }>`
  display: ${({ $open }) => ($open ? 'flex' : 'none')};
  position: absolute;
  top: 60px;
  left: 0;
  right: 0;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
  background: ${({ theme }) => theme.colors.surface};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  ${mq.md} {
    position: static;
    display: flex;
    flex-direction: row;
    gap: 24px;
    padding: 0;
    background: transparent;
    border: none;
  }
`;

const NavLink = styled(Link)`
  padding: 10px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-weight: 600;
  font-size: 15px;
  color: ${({ theme }) => theme.colors.text};
  transition: color 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.primary}; }
  ${mq.md} { padding: 0; }
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const BookBtn = styled(Link)`
  display: none;
  padding: 9px 16px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  transition: background 0.2s;
  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; }
  ${mq.md} { display: inline-flex; }
`;

const Burger = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px; height: 40px;
  border-radius: ${({ theme }) => theme.radius.sm};
  color: ${({ theme }) => theme.colors.text};
  ${mq.md} { display: none; }
`;

type Props = {
  locale: Locale;
  labels: { influencers: string; procedures: string; book: string };
  brand: string;
};

export function Header({ locale, labels, brand }: Props) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);
  const base = `/${locale}`;

  return (
    <HeaderBar>
      <Container>
        <Row>
          <Brand href={base} onClick={close}>{brand}</Brand>

          <Nav $open={open} aria-label="Primary">
            <NavLink href={`${base}/influencers`} onClick={close}>{labels.influencers}</NavLink>
            <NavLink href={`${base}/procedures`} onClick={close}>{labels.procedures}</NavLink>
            <NavLink href={`${base}/book`} onClick={close}>{labels.book}</NavLink>
          </Nav>

          <Right>
            <LanguageSwitcher current={locale} />
            <BookBtn href={`${base}/book`}>{labels.book}</BookBtn>
            <Burger
              type="button"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((o) => !o)}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d={open ? 'M6 6l12 12M6 18L18 6' : 'M3 6h18M3 12h18M3 18h18'}
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                />
              </svg>
            </Burger>
          </Right>
        </Row>
      </Container>
    </HeaderBar>
  );
}
