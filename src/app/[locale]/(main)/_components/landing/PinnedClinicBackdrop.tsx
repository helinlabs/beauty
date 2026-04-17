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
/* Natural section height — its own children's flow bounds define
 * where position: sticky releases. That happens to land right around
 * the moment the HowItWorks title reaches the top of the viewport
 * (near the floating header), which is exactly when the clinic photo
 * should let go and scroll up with the rest of the page. */
const Section = styled.section`
  position: relative;
  isolation: isolate;
  background: ${({ theme }) => theme.colors.bg};
`;

const StickyImage = styled.div`
  position: sticky;
  top: 0;
  /* Full viewport so there is never a cream strip visible below the
   * image while it's pinned — the previous 88/95vh left a narrow
   * band at the bottom of the viewport where the section's bg
   * showed through the transparent HowItWorks padding. */
  height: 100vh;
  overflow: hidden;
  z-index: 0;
  background-color: ${({ theme }) => theme.colors.bg};
  background-image: url('/images/clinic-interior.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;

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
  /* Matches StickyImage's 100vh so Contents' top lines up with the
   * top of the section. */
  margin-top: -100vh;
`;

export function PinnedClinicBackdrop({ children }: { children: ReactNode }) {
  return (
    <Section>
      <StickyImage aria-hidden />
      <Contents>{children}</Contents>
    </Section>
  );
}
