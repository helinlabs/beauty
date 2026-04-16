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

const BookBtn = styled(Link)`
  display: inline-flex;
  padding: 9px 16px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 700;
  font-size: 13px;
  transition: background 0.2s;
  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; }
`;

type Props = {
  locale: Locale;
  labels: { influencers: string; procedures: string; book: string };
  brand: string;
};

export function Header({ locale, labels, brand }: Props) {
  const base = `/${locale}`;

  return (
    <HeaderBar>
      <Container>
        <Row>
          <Brand href={base}>{brand}</Brand>
          <BookBtn href={`${base}/book`}>{labels.book}</BookBtn>
        </Row>
      </Container>
    </HeaderBar>
  );
}
