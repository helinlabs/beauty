'use client';

import styled from 'styled-components';
import { mq } from '@/styles/theme';
import { FadeIn } from './FadeIn';
import {
  SectionInner,
  SectionWrap,
} from './_shared';

interface Step {
  title: string;
  description: string;
}

interface Props {
  dict: {
    title: string;
    steps: Step[];
  };
}

/* HowItWorks renders over the last portion of the pinned clinic
 * photo (via PinnedClinicBackdrop) AND past it — the sticky releases
 * mid-section. The background is transparent so the photo still
 * shows through in the overlap range; every text element is tuned
 * to read on the image (white / high-contrast). */
const Wrap = styled(SectionWrap)`
  background: transparent;
  padding-top: 40px;
  padding-bottom: 96px;

  ${mq.md} {
    padding-top: 56px;
    padding-bottom: 128px;
  }
`;

const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.08;
  font-size: clamp(38px, 5.4vw, 64px);
  color: #ffffff;
  max-width: 22ch;
`;

const Steps = styled.ol`
  list-style: none;
  padding: 0;
  margin: 48px 0 0;
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
      top: 34px;
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
  padding: 24px 0 0;
`;

const Numeral = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 999px;
  /* Translucent glass chip so the counter reads on the image without
   * becoming an opaque disc. */
  background: rgba(255, 255, 255, 0.14);
  border: 1px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(8px) saturate(1.6);
  -webkit-backdrop-filter: blur(8px) saturate(1.6);
  font-family: ${({ theme }) => theme.fonts.heading};
  font-style: italic;
  font-weight: 500;
  font-size: 24px;
  color: #ffffff;
  margin-bottom: 20px;

  &::before {
    content: counter(step, decimal-leading-zero);
  }
`;

const StepHeading = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 500;
  letter-spacing: -0.015em;
  line-height: 1.15;
  font-size: 22px;
  color: #ffffff;
  margin: 0;
`;

const StepBody = styled.p`
  color: rgba(255, 255, 255, 0.85);
  font-size: 15px;
  line-height: 1.65;
  margin-top: 10px;
  max-width: 32ch;
`;

export function HowItWorksSection({ dict }: Props) {
  return (
    <Wrap id="how-it-works">
      <SectionInner>
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
      </SectionInner>
    </Wrap>
  );
}
