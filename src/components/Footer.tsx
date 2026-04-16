'use client';

import styled from 'styled-components';
import { Container } from './Container';

const FooterBar = styled.footer`
  margin-top: 80px;
  padding: 32px 0 48px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 13px;
`;

const Row = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
  justify-content: space-between;
  text-align: center;

  @media (min-width: 768px) {
    flex-direction: row;
    text-align: left;
  }
`;

export function Footer({
  copyright,
  tagline,
}: {
  copyright: string;
  tagline: string;
}) {
  return (
    <FooterBar>
      <Container>
        <Row>
          <span>{copyright}</span>
          <span>{tagline}</span>
        </Row>
      </Container>
    </FooterBar>
  );
}
