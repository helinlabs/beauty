'use client';

import styled from 'styled-components';
import { mq } from '@/styles/theme';

interface Props {
  dict: {
    accent: string;
    body: string;
  };
}

/* The section's BACKGROUND fades in from transparent at its top edge to
 * solid cream further down — so the boundary between the pinned hero
 * (behind) and the intro panel reads as a soft gradient instead of a
 * hard line. After the fade height the background stays solid cream
 * (the linear-gradient's last color extends for the rest of the box). */
const Section = styled.section`
  position: relative;
  z-index: 1;
  min-height: 110vh;
  padding: 60vh 24px 22vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  /* rgba(...,0) for the start so the lerp doesn't wander through gray
     on its way to the cream end-stop. */
  background: linear-gradient(
    to bottom,
    rgba(251, 247, 241, 0) 0px,
    rgba(251, 247, 241, 1) 420px
  );

  ${mq.md} {
    padding: 40vh 32px 26vh;
    background: linear-gradient(
      to bottom,
      rgba(251, 247, 241, 0) 0px,
      rgba(251, 247, 241, 1) 560px
    );
  }
`;

const Copy = styled.div`
  position: relative;
  z-index: 1;
  width: 100%;
  font-family: var(--font-garamond), Georgia, serif;
  font-weight: 400;
  font-style: normal;
  letter-spacing: -0.015em;
  /* Match the hero title's display scale so service intro reads as the
     same editorial tier. The vw-based middle stop is dropped a touch
     versus the hero so the longest line ("…leading medical tourism
     agency,") fits on one line at 1440 viewport without forcing a
     wrap inside it. */
  font-size: clamp(28px, 3.6vw, 56px);
  line-height: 1.22;
  color: ${({ theme }) => theme.colors.text};

  /* Newlines from the dictionary become hard line breaks on desktop so
     the layout matches the design comp; on mobile they collapse so the
     text wraps naturally to the narrower viewport. */
  white-space: normal;

  ${mq.md} {
    white-space: pre-line;
    max-width: min(94vw, 1280px);
  }
`;

const Paragraph = styled.p`
  margin: 0 0 0.6em;

  &:last-child {
    margin-bottom: 0;
  }
`;

export function ServiceIntroSection({ dict }: Props) {
  return (
    <Section id="service-intro">
      <Copy>
        <Paragraph>{dict.accent}</Paragraph>
        <Paragraph>{dict.body}</Paragraph>
      </Copy>
    </Section>
  );
}
