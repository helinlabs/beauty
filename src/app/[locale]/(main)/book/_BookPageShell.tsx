'use client';

import styled from 'styled-components';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { BookingForm } from '@/components/BookingForm';
import type { Locale } from '@/i18n/config';
import { mq } from '@/styles/theme';

const Wrap = styled(Section)`
  padding-top: 40px;
  ${mq.md} { padding-top: 72px; }
`;

const Inner = styled.div`
  max-width: 560px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-family: var(--font-garamond), Georgia, serif;
  font-style: normal;
  font-weight: 400;
  font-size: clamp(28px, 5vw, 40px);
  margin-bottom: 10px;
  text-align: center;
`;

const Sub = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  margin-bottom: 28px;
`;

type Labels = {
  name: string;
  namePh: string;
  phone: string;
  phonePh: string;
  selectedInfluencer: string;
  selectedProcedure: string;
  submit: string;
  errorName: string;
  errorPhone: string;
  agreement: string;
  waIntro: string;
};

export function BookPageShell({
  locale,
  title,
  subtitle,
  formLabels,
}: {
  locale: Locale;
  title: string;
  subtitle: string;
  formLabels: Labels;
}) {
  return (
    <Wrap>
      <Container>
        <Inner>
          <Title>{title}</Title>
          <Sub>{subtitle}</Sub>
          <BookingForm locale={locale} labels={formLabels} />
        </Inner>
      </Container>
    </Wrap>
  );
}
