'use client';

import styled from 'styled-components';
import { mq } from '@/styles/theme';

export const Section = styled.section`
  padding: 48px 0;
  ${mq.md} { padding: 72px 0; }
`;

export const SectionHeader = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  ${mq.md} { margin-bottom: 32px; }
`;

export const SectionTitle = styled.h2`
  font-size: 24px;
  ${mq.md} { font-size: 32px; }
`;

export const SeeAll = styled.a`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  font-size: 14px;
  white-space: nowrap;
  &:hover { color: ${({ theme }) => theme.colors.primaryDark}; }
`;
