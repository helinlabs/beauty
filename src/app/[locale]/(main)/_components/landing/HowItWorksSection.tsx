'use client';

import styled from 'styled-components';
import { mq } from '@/styles/theme';
import {
  SectionInner,
  SectionWrap,
  SerifH2,
  SerifH3,
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
        ${({ theme }) => theme.colors.border} 15%,
        ${({ theme }) => theme.colors.border} 85%,
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
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-style: italic;
  font-weight: 500;
  font-size: 24px;
  color: ${({ theme }) => theme.colors.accent};
  margin-bottom: 20px;

  &::before {
    content: counter(step, decimal-leading-zero);
  }
`;

const StepBody = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  line-height: 1.65;
  margin-top: 10px;
  max-width: 32ch;
`;

export function HowItWorksSection({ dict }: Props) {
  return (
    <SectionWrap id="how-it-works">
      <SectionInner>
        <SerifH2 $large>{dict.title}</SerifH2>

        <Steps>
          {dict.steps.slice(0, 3).map((s, i) => (
            <StepCard key={i}>
              <Numeral />
              <SerifH3>{s.title}</SerifH3>
              <StepBody>{s.description}</StepBody>
            </StepCard>
          ))}
        </Steps>
      </SectionInner>
    </SectionWrap>
  );
}
