'use client';

import type { ReactNode } from 'react';
import styled from 'styled-components';

/**
 * Same scroll-pin trick as PinnedClinicBackdrop, but for the hero.
 *
 * `hero` is rendered inside a 100vh sticky box pinned to the top of the
 * viewport. Anything passed via `children` follows in the DOM and is
 * pulled upward by a full sticky-height negative margin so its top edge
 * starts at the top of the section. As the user scrolls, the children
 * (e.g. ServiceIntroSection) slide up over the pinned hero. Pinning
 * releases automatically once this wrapper's bottom crosses the viewport
 * top — i.e. once the user has scrolled past the last child.
 *
 * Pure CSS position: sticky — no scroll listener.
 */
const Section = styled.section`
  position: relative;
  isolation: isolate;
`;

const StickyHero = styled.div`
  position: sticky;
  top: 0;
  height: 100vh;
  overflow: hidden;
  z-index: 0;
`;

const Contents = styled.div`
  position: relative;
  z-index: 1;
  /* Sits in normal flow AFTER the 100vh StickyHero. Initial scroll
     position therefore shows hero only; as the user scrolls down,
     Contents slides up into view from the bottom of the viewport
     while StickyHero stays pinned at the top. Once Contents has
     scrolled past, Section's bottom meets the viewport top and
     StickyHero unsticks naturally. */
`;

type Props = {
  hero: ReactNode;
  children: ReactNode;
};

export function PinnedHeroBackdrop({ hero, children }: Props) {
  return (
    <Section>
      <StickyHero>{hero}</StickyHero>
      <Contents>{children}</Contents>
    </Section>
  );
}
