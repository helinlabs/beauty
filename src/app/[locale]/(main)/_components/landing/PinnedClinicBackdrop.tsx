'use client';

import type { ReactNode } from 'react';
import styled from 'styled-components';
import { mq } from '@/styles/theme';

/**
 * Full-bleed clinic photo pinned to the top of the viewport for as
 * long as its contents are scrolling through. Wrap ALL sections that
 * should appear over the image (currently Trust + How it works) —
 * pinning releases only once the wrapper's bottom crosses the
 * viewport top, i.e. the user has scrolled past the final child.
 *
 * Pure CSS position: sticky — no JS scroll listener, no rAF cost.
 * The sticky image paints into its own compositor layer so the rest
 * of the page doesn't re-paint while it's pinned.
 */
const Section = styled.section`
  position: relative;
  isolation: isolate;
  background: ${({ theme }) => theme.colors.bg};
`;

const StickyImage = styled.div`
  position: sticky;
  top: 0;
  /* Slightly shorter than the viewport so a sliver of the next
   * section can preview below while the image is pinned. */
  height: 88vh;
  overflow: hidden;
  z-index: 0;
  background-color: ${({ theme }) => theme.colors.bg};
  background-image: url('/images/clinic-interior.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

  ${mq.md} {
    height: 95vh;
  }

  /* Uniform 20% dim across the entire image so every white text
   * overlay has consistent contrast regardless of vertical position.
   * Replaces the earlier top+bottom gradient scrim. */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.2);
    pointer-events: none;
  }
`;

/* Contents stack follows sticky image in DOM but is pulled UP by a
 * full sticky-height negative margin so its top edge starts at the
 * top of the section. As the user scrolls, the contents slide up
 * past the pinned image. The contents have no background so the
 * image remains visible behind them. */
const Contents = styled.div`
  position: relative;
  z-index: 1;
  margin-top: -88vh;

  ${mq.md} {
    margin-top: -95vh;
  }
`;

export function PinnedClinicBackdrop({ children }: { children: ReactNode }) {
  return (
    <Section>
      <StickyImage aria-hidden />
      <Contents>{children}</Contents>
    </Section>
  );
}
