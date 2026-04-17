'use client';

import { Suspense } from 'react';
import styled from 'styled-components';
import { BookingForm } from '@/components/BookingForm';
import type { Locale } from '@/i18n/config';
import { mq } from '@/styles/theme';
import { FadeIn } from './FadeIn';
import {
  SectionInner,
  SerifH2,
} from './_shared';

interface Props {
  locale: Locale;
  dict: {
    eyebrow: string;
    title: string;
    tagline: string;
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
  /* Flat cream background matches the rest of the landing sections —
   * no more darker surfaceAlt gradient at the bottom. */
  background: ${({ theme }) => theme.colors.bg};

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

/* "we'll reply on WhatsApp." — sans subline rendered below the serif
 * title. Inter Tight at 24px, muted tone so it reads as a secondary
 * clarifier without competing with the main heading. */
const Tagline = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 24px;
  font-weight: 400;
  line-height: 1.3;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 14px 0 0;
  text-align: center;
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
    font-size: 15px;
    font-weight: 500;
  }
`;

export function FinalCtaSection({ locale, dict, formLabels }: Props) {
  return (
    <Band id="final-cta">
      <Centered>
        <FadeIn>
          <TitleWrap>
            <SerifH2 $large>{dict.title}</SerifH2>
            <Tagline>{dict.tagline}</Tagline>
            <TrustRow>
              {dict.trustRow.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </TrustRow>
          </TitleWrap>
        </FadeIn>

        <FadeIn delay={120}>
          <Suspense fallback={null}>
            <BookingForm locale={locale} labels={formLabels} />
          </Suspense>
        </FadeIn>
      </Centered>
    </Band>
  );
}
