'use client';

import { Suspense } from 'react';
import styled from 'styled-components';
import { BookingForm } from '@/components/BookingForm';
import type { Locale } from '@/i18n/config';
import { mq } from '@/styles/theme';
import {
  Eyebrow,
  SectionInner,
  SerifH2,
  SubtitleP,
} from './_shared';

interface Props {
  locale: Locale;
  dict: {
    eyebrow: string;
    title: string;
    subtitle: string;
    trustRow: string[];
  };
  formLabels: {
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
}

const Band = styled.section`
  position: relative;
  overflow: hidden;
  padding: 96px 20px 120px;
  background:
    radial-gradient(ellipse at 50% 0%, rgba(194, 65, 12, 0.08) 0%, transparent 60%),
    linear-gradient(180deg, ${({ theme }) => theme.colors.bg} 0%, ${({ theme }) => theme.colors.surfaceAlt} 100%);

  ${mq.md} {
    padding: 128px 32px 160px;
  }
`;

const Centered = styled(SectionInner)`
  max-width: 580px;
  text-align: center;

  ${SerifH2} {
    margin-left: auto;
    margin-right: auto;
    white-space: pre-line;
  }
`;

const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TrustRow = styled.ul`
  list-style: none;
  padding: 0;
  margin: 28px 0 44px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;

  li {
    padding: 6px 12px;
    border-radius: ${({ theme }) => theme.radius.pill};
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid ${({ theme }) => theme.colors.border};
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 0.02em;
  }
`;

export function FinalCtaSection({ locale, dict, formLabels }: Props) {
  return (
    <Band id="final-cta">
      <Centered>
        <TitleWrap>
          <Eyebrow>{dict.eyebrow}</Eyebrow>
          <SerifH2 $large>{dict.title}</SerifH2>
          <SubtitleP style={{ textAlign: 'center' }}>{dict.subtitle}</SubtitleP>
          <TrustRow>
            {dict.trustRow.map((t, i) => (
              <li key={i}>{t}</li>
            ))}
          </TrustRow>
        </TitleWrap>

        <Suspense fallback={null}>
          <BookingForm locale={locale} labels={formLabels} />
        </Suspense>
      </Centered>
    </Band>
  );
}
