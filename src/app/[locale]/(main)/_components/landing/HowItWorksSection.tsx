'use client';

import { useState } from 'react';
import styled from 'styled-components';
import { mq } from '@/styles/theme';
import { ContactModal, type ContactModalLabels } from '@/components/ContactModal';
import type { Locale } from '@/i18n/config';
import { FadeIn } from './FadeIn';
import {
  SectionWrap,
} from './_shared';

interface Step {
  title: string;
  description: string;
}

interface Props {
  locale: Locale;
  dict: {
    title: string;
    steps: Step[];
    cta: string;
  };
  modalLabels: ContactModalLabels;
}

/* HowItWorks renders over the last portion of the pinned clinic
 * photo (via PinnedClinicBackdrop) AND past it — the sticky releases
 * mid-section. The background is transparent so the photo still
 * shows through in the overlap range; every text element is tuned
 * to read on the image (white / high-contrast). */
/* Extra 100px added to the top padding so Trust's stats and How It
 * Works's title are clearly separated when both are still inside the
 * pinned-clinic scroll scope.
 *
 * The 700px bottom padding is the release-timing lever: it extends
 * Contents, which extends the PinnedClinicBackdrop Section's natural
 * height, which delays the sticky release by the same amount. The
 * clinic photo therefore stays pinned until the HowItWorks block has
 * already mostly scrolled up past the top of the viewport — dial up
 * or down this value to tune the exact release moment. */
const Wrap = styled(SectionWrap)`
  background: transparent;
  padding-top: 140px;
  padding-bottom: 700px;

  ${mq.md} {
    padding-top: 156px;
    padding-bottom: 700px;
  }
`;

/* Wider inner than the shared 1200px cap so the 3 step columns each
 * get enough room for their heading not to wrap (e.g. "English
 * coordinator plans it" has to stay on one line). */
const Inner = styled.div`
  max-width: 1300px;
  margin: 0 auto;
`;

/* Title matches the unified section-title treatment — EB Garamond
 * Regular at clamp(40px, 5.2vw, 64px). White, centered, because it
 * renders over the pinned clinic photo. */
const Title = styled.h2`
  font-family: var(--font-garamond), Georgia, serif;
  font-style: normal;
  font-weight: 400;
  letter-spacing: -0.015em;
  line-height: 1.08;
  font-size: clamp(40px, 5.2vw, 64px);
  color: #ffffff;
  text-align: center;
  margin: 0 auto;
  max-width: 22ch;
`;

const Steps = styled.ol`
  list-style: none;
  padding: 0;
  margin: 56px 0 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
  counter-reset: step;
  position: relative;

  ${mq.md} {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;

    &::before {
      content: '';
      position: absolute;
      /* Line sits at the vertical center of the 56px Numeral, which
       * is now the top-most item in each centered card column. */
      top: 28px;
      left: 12%;
      right: 12%;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.35) 15%,
        rgba(255, 255, 255, 0.35) 85%,
        transparent
      );
      pointer-events: none;
    }
  }
`;

const StepCard = styled.li`
  position: relative;
  counter-increment: step;
  padding: 0;
  /* Center the numeral, heading, and body within the column. */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

/* Solid white chip with dark numerals — reads clearly against the
 * pinned clinic photo and mirrors the Log-in button style from the
 * header pill. */
const Numeral = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  background: #ffffff;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(27, 26, 23, 0.08),
    0 2px 8px rgba(27, 26, 23, 0.15);
  font-family: ${({ theme }) => theme.fonts.heading};
  font-style: italic;
  font-weight: 500;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 24px;

  &::before {
    content: counter(step, decimal-leading-zero);
  }
`;

/* Step headings in Inter Tight (body sans) for a cleaner, more neutral
 * feel — sized a notch smaller than the previous 44px serif version. */
const StepHeading = styled.h3`
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 500;
  letter-spacing: -0.015em;
  line-height: 1.15;
  font-size: 32px;
  color: #ffffff;
  margin: 0;
`;

const StepBody = styled.p`
  color: rgba(255, 255, 255, 0.85);
  font-size: 15px;
  line-height: 1.65;
  margin-top: 12px;
  max-width: 32ch;
`;

/* Section CTA — solid white pill that triggers the shared
 * ContactModal (same modal the hero "GET IN TOUCH" button opens).
 * Centered below the 3 step cards. */
const CtaWrap = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 64px;

  ${mq.md} {
    margin-top: 88px;
  }
`;

const CtaButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  border: none;
  border-radius: 999px;
  background: #ffffff;
  color: ${({ theme }) => theme.colors.text};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.005em;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 6px 20px rgba(27, 26, 23, 0.18);

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 28px rgba(27, 26, 23, 0.24);
  }

  .arrow svg {
    display: block;
  }
`;

export function HowItWorksSection({ locale, dict, modalLabels }: Props) {
  const [contactOpen, setContactOpen] = useState(false);

  return (
    <Wrap id="how-it-works">
      <Inner>
        <FadeIn>
          <Title>{dict.title}</Title>
        </FadeIn>

        <Steps>
          {dict.steps.slice(0, 3).map((s, i) => (
            <FadeIn key={i} delay={i * 100}>
              <StepCard>
                <Numeral />
                <StepHeading>{s.title}</StepHeading>
                <StepBody>{s.description}</StepBody>
              </StepCard>
            </FadeIn>
          ))}
        </Steps>

        <FadeIn delay={320}>
          <CtaWrap>
            <CtaButton
              type="button"
              onClick={() => setContactOpen(true)}
              data-testid="how-cta"
            >
              {dict.cta}
              <span className="arrow" aria-hidden>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 5l7 7-7 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </CtaButton>
          </CtaWrap>
        </FadeIn>
      </Inner>

      <ContactModal
        open={contactOpen}
        onClose={() => setContactOpen(false)}
        labels={modalLabels}
        locale={locale}
      />
    </Wrap>
  );
}
