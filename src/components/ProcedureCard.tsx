'use client';

import Link from 'next/link';
import styled from 'styled-components';
import type { Locale } from '@/i18n/config';
import type { Procedure } from '@/data/procedures';
import { formatPriceFromKRW } from '@/lib/format';

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
  &:hover {
    transform: translateY(-2px);
    border-color: rgba(194, 65, 12, 0.25);
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
`;

const Cover = styled.div<{ $bg: string }>`
  height: 140px;
  background: ${({ $bg }) => $bg};
  position: relative;
`;

const CategoryChip = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: rgba(27, 26, 23, 0.6);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  backdrop-filter: blur(6px);
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px 18px 18px;
`;

const Name = styled.h3`
  font-size: 16px;
  margin: 0;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
`;

const Price = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 700;
`;

type Props = {
  procedure: Procedure;
  locale: Locale;
  categoryLabel: string;
  minutesLabel: string;
};

export function ProcedureCard({ procedure, locale, categoryLabel, minutesLabel }: Props) {
  return (
    <Card href={`/${locale}/procedures/${procedure.slug}`}>
      <Cover $bg={procedure.gradient}>
        <CategoryChip>{categoryLabel}</CategoryChip>
      </Cover>
      <Body>
        <Name>{procedure.name[locale]}</Name>
        <Meta>
          <span>{minutesLabel}</span>
          <Price>{formatPriceFromKRW(procedure.priceFromKRW, locale)}</Price>
        </Meta>
      </Body>
    </Card>
  );
}
