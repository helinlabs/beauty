'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styled from 'styled-components';

interface Props {
  children: ReactNode;
  /** Delay the reveal by N ms after the element first intersects. */
  delay?: number;
  /** Pixel distance the content travels during the reveal. Default 16. */
  offset?: number;
  /** Root margin passed to IntersectionObserver — negative values delay
   *  the trigger until the element is further into the viewport. */
  rootMargin?: string;
  /** Optional class pass-through so callers can tweak display (flex/grid). */
  className?: string;
}

const Box = styled.div<{ $offset: number; $visible: boolean; $delay: number }>`
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible, $offset }) =>
    $visible ? 'translate3d(0, 0, 0)' : `translate3d(0, ${$offset}px, 0)`};
  transition: opacity 680ms cubic-bezier(0.2, 0.65, 0.25, 1)
      ${({ $delay }) => $delay}ms,
    transform 680ms cubic-bezier(0.2, 0.65, 0.25, 1)
      ${({ $delay }) => $delay}ms;
  will-change: transform, opacity;

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    transform: none;
    transition: none;
  }
`;

/**
 * Apple-style on-scroll reveal: child starts at opacity 0 + translateY,
 * fades/slides to normal when intersecting the viewport. Stays shown
 * afterwards (no re-hide on scroll up).
 */
export function FadeIn({
  children,
  delay = 0,
  offset = 16,
  rootMargin = '0px 0px -12% 0px',
  className,
}: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect users who disable motion.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }

    // If the page is restored via back/forward navigation the element
    // could already be in view on first paint — check synchronously.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.01 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <Box
      ref={ref}
      className={className}
      $visible={visible}
      $offset={offset}
      $delay={delay}
    >
      {children}
    </Box>
  );
}
