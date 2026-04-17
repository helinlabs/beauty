'use client';

import Link from 'next/link';
import styled from 'styled-components';
import { mq } from '@/styles/theme';
import type { Locale } from '@/i18n/config';
import { Container } from './Container';

const HeaderBar = styled.header`
  position: relative;
  z-index: 50;
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

/* Ghost-style right-side button — transparent bg, white border/text so
   it reads cleanly over the hero's colorful gradient. */
const LoginBtn = styled(Link)`
  display: inline-flex;
  align-items: center;
  padding: 9px 18px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  color: #fff;
  font-weight: 500;
  font-size: 13px;
  letter-spacing: 0.08em;
  transition: background 0.2s, border-color 0.2s;
  &:hover {
    background: rgba(255, 255, 255, 0.14);
    border-color: rgba(255, 255, 255, 0.85);
  }
`;

type Props = {
  locale: Locale;
  brand: string;
};

export function Header({ locale, brand }: Props) {
  const base = `/${locale}`;

  return (
    <HeaderBar>
      <Container>
        <Row>
          <Brand href={base}>{brand}</Brand>
          <LoginBtn href={`${base}/admin-login`}>Log in</LoginBtn>
        </Row>
      </Container>
    </HeaderBar>
  );
}
