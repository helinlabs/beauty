'use client';

import styled from 'styled-components';
import { mq } from '@/styles/theme';

export const Container = styled.div`
  width: 100%;
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 0 16px;
  ${mq.md} { padding: 0 32px; }
`;
