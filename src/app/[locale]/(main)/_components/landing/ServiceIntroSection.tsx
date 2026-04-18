'use client';

import { Fragment, useEffect, useRef } from 'react';
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
  padding: 40vh 24px 22vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  overflow: hidden;
  /* rgba(...,0) for the start so the lerp doesn't wander through gray
     on its way to the cream end-stop. */
  background: linear-gradient(
    to bottom,
    rgba(251, 247, 241, 0) 0px,
    rgba(251, 247, 241, 1) 200px
  );

  ${mq.md} {
    padding: 40vh 32px 26vh;
  }
`;

/* Layer that holds the four floating reference photos. Sits BEHIND the
 * Copy (z-index 0) so the text always remains the foreground reading
 * surface. `pointer-events: none` so the images never intercept clicks
 * even when the section grows tall enough that they cover Copy bounds.
 *
 * A top-fading mask is applied to the LAYER (not each image), so that
 * as photos drift upward they fade out based on their POSITION within
 * the section rather than their own local geometry. The Copy (text) is
 * a sibling, so it's not affected. */
const ImagesLayer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 25%,
    rgba(0, 0, 0, 0.15) 37%,
    #000 57%,
    #000 68%,
    rgba(0, 0, 0, 0.15) 88%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to bottom,
    transparent 25%,
    rgba(0, 0, 0, 0.15) 37%,
    #000 57%,
    #000 68%,
    rgba(0, 0, 0, 0.15) 88%,
    transparent 100%
  );
`;

/* Each floating image is absolutely positioned within ImagesLayer with
 * a designed top/left/width per slot. The mask gradient makes the TOP
 * portion of every image transparent so as the parallax scroll pushes
 * the image upward past the viewport edge, the visible content fades
 * into the cream background instead of cutting off at a hard edge. */
type FloatProps = {
  $top: string;
  $left: string;
  $width: string;
  $tabletTop?: string;
  $tabletLeft?: string;
  $tabletWidth?: string;
  $desktopTop?: string;
  $desktopLeft?: string;
  $desktopWidth?: string;
  /** Hide this slot on mobile to reduce on-screen image density. The
   *  element stays in the DOM (refs remain stable) but is not rendered. */
  $hideMobile?: boolean;
};

/* START_OFFSET shifts every slot's designed top position down by a
 * constant pixel amount. It's a single knob controlling where the
 * entrance row sits — tweak here rather than editing each per-breakpoint
 * value in SLOTS. */
const START_OFFSET = '200px';

const FloatImage = styled.img<FloatProps>`
  position: absolute;
  top: calc(${({ $top }) => $top} + ${START_OFFSET});
  left: ${({ $left }) => $left};
  width: ${({ $width }) => $width};
  height: auto;
  border-radius: 18px;
  object-fit: cover;
  will-change: transform;
  ${({ $hideMobile }) => $hideMobile && 'display: none;'}

  ${mq.md} {
    display: block;
    border-radius: 24px;
    ${({ $tabletTop }) => $tabletTop && `top: calc(${$tabletTop} + ${START_OFFSET});`}
    ${({ $tabletLeft }) => $tabletLeft && `left: ${$tabletLeft};`}
    ${({ $tabletWidth }) => $tabletWidth && `width: ${$tabletWidth};`}
  }

  ${mq.lg} {
    ${({ $desktopTop }) => $desktopTop && `top: calc(${$desktopTop} + ${START_OFFSET});`}
    ${({ $desktopLeft }) => $desktopLeft && `left: ${$desktopLeft};`}
    ${({ $desktopWidth }) => $desktopWidth && `width: ${$desktopWidth};`}
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

/* Per-slot configuration: image source, design position at each
 * breakpoint, and a parallax SPEED FACTOR (0 = locked to scroll,
 * 1 = stationary on the page). Different speeds give the visual
 * effect of layered depth as the user scrolls. */
const SLOTS = [
  // Mobile positions are intentionally non-uniform (no strict left/right
  // alternation) so the initial composition reads as a scattered, random
  // arrangement rather than a mirrored grid. Tablet/desktop stay closer
  // to the columnar design.
  {
    src: '/images/intro/01.webp',
    alt: '',
    speed: 0.18,
    phase: 0,
    mobile: { top: '4%', left: '-26%', width: '50%' },
    tablet: { top: '4%', left: '2%', width: '22%' },
    desktop: { top: '6%', left: '2%', width: '18%' },
  },
  {
    src: '/images/intro/02.webp',
    alt: '',
    speed: 0.32,
    phase: 0.3,
    mobile: { top: '20%', left: '66%', width: '40%' },
    tablet: { top: '18%', left: '74%', width: '20%' },
    desktop: { top: '14%', left: '80%', width: '18%' },
  },
  {
    src: '/images/intro/03.webp',
    alt: '',
    speed: 0.36,
    phase: 0.65,
    hideMobile: true,
    mobile: { top: '46%', left: '-14%', width: '46%' },
    tablet: { top: '52%', left: '14%', width: '18%' },
    desktop: { top: '52%', left: '6%', width: '15%' },
  },
  {
    src: '/images/intro/04.webp',
    alt: '',
    speed: 0.26,
    phase: 0.15,
    mobile: { top: '72%', left: '78%', width: '38%' },
    tablet: { top: '64%', left: '62%', width: '22%' },
    desktop: { top: '60%', left: '78%', width: '16%' },
  },
  {
    src: '/images/intro/05.webp',
    alt: '',
    speed: 0.22,
    phase: 0.45,
    hideMobile: true,
    mobile: { top: '58%', left: '58%', width: '44%' },
    tablet: { top: '34%', left: '76%', width: '20%' },
    desktop: { top: '30%', left: '8%', width: '14%' },
  },
  {
    src: '/images/intro/06.webp',
    alt: '',
    speed: 0.14,
    phase: 0.8,
    mobile: { top: '88%', left: '-28%', width: '54%' },
    tablet: { top: '84%', left: '4%', width: '22%' },
    desktop: { top: '82%', left: '82%', width: '16%' },
  },
  {
    src: '/images/intro/07.jpg',
    alt: '',
    speed: 0.28,
    phase: 0.55,
    hideMobile: true,
    mobile: { top: '32%', left: '-22%', width: '42%' },
    tablet: { top: '12%', left: '18%', width: '18%' },
    desktop: { top: '22%', left: '4%', width: '14%' },
  },
];

export function ServiceIntroSection({ dict }: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);

  /* Auto-rise + seamless infinite loop. Each slot is rendered TWICE:
   * copy-0 at its designed top, copy-1 offset downward by one section
   * height so it sits just below the section (clipped by overflow:hidden).
   * As progress grows, both copies translate upward at (progress × speed).
   * The offset is taken modulo the section height, so when copy-0 has
   * risen out the top, copy-1 has risen into its original position, and
   * the modulo snap happens while both are positioned where the other
   * was — invisibly, since the images are identical.
   *
   * The loop pauses while the section is offscreen (IntersectionObserver)
   * and accumulates progress across pauses, so leaving and returning to
   * the section resumes the drift from where it stopped. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Respect users who disable motion — leave images in their designed
    // positions with no drift.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    const SPEED_PX_PER_SEC = 120;
    let raf = 0;
    let inView = false;
    let progress = 0;
    let lastFrame = 0;

    function apply() {
      const cycle = section!.clientHeight || 1;
      SLOTS.forEach((slot, slotIdx) => {
        // Phase (0..1) shifts each slot's position within its cycle at
        // t=0 so the seven images don't all start at their designed
        // rows simultaneously — different phases mean some images enter
        // from below while others are already mid-rise on first paint.
        const raw = progress * slot.speed + slot.phase * cycle;
        const shift = ((raw % cycle) + cycle) % cycle;
        const el0 = imageRefs.current[slotIdx * 2];
        const el1 = imageRefs.current[slotIdx * 2 + 1];
        if (el0) el0.style.transform = `translate3d(0, ${-shift}px, 0)`;
        if (el1) el1.style.transform = `translate3d(0, ${cycle - shift}px, 0)`;
      });
    }

    // Initial placement so copy-1 starts offscreen below before the RAF
    // loop kicks in — prevents a flash where both copies stack on top of
    // each other at the designed position.
    apply();

    function tick(now: number) {
      if (lastFrame) {
        const dt = (now - lastFrame) / 1000;
        progress += dt * SPEED_PX_PER_SEC;
        apply();
      }
      lastFrame = now;
      if (inView) raf = requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!inView) {
            inView = true;
            lastFrame = 0;
            raf = requestAnimationFrame(tick);
          }
        } else if (inView) {
          inView = false;
          if (raf) cancelAnimationFrame(raf);
          raf = 0;
        }
      },
      { threshold: 0 },
    );
    io.observe(section);

    // Re-apply on resize so the cycle distance tracks the section's
    // current height (which changes with viewport).
    const onResize = () => apply();
    window.addEventListener('resize', onResize);

    return () => {
      io.disconnect();
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <Section id="service-intro" ref={sectionRef}>
      <ImagesLayer aria-hidden>
        {SLOTS.map((slot, slotIdx) => (
          <Fragment key={slot.src}>
            {[0, 1].map((copyIdx) => (
              <FloatImage
                key={copyIdx}
                ref={(el) => {
                  imageRefs.current[slotIdx * 2 + copyIdx] = el;
                }}
                src={slot.src}
                alt={slot.alt}
                loading="lazy"
                /* Copy-1 is initially parked far offscreen via inline
                   style; the effect's first apply() replaces this with
                   the correct per-cycle offset before the next paint. */
                style={
                  copyIdx === 1
                    ? { transform: 'translate3d(0, 200vh, 0)' }
                    : undefined
                }
                $top={slot.mobile.top}
                $left={slot.mobile.left}
                $width={slot.mobile.width}
                $tabletTop={slot.tablet.top}
                $tabletLeft={slot.tablet.left}
                $tabletWidth={slot.tablet.width}
                $desktopTop={slot.desktop.top}
                $desktopLeft={slot.desktop.left}
                $desktopWidth={slot.desktop.width}
                $hideMobile={slot.hideMobile}
              />
            ))}
          </Fragment>
        ))}
      </ImagesLayer>

      <Copy>
        <Paragraph>{dict.accent}</Paragraph>
        <Paragraph>{dict.body}</Paragraph>
      </Copy>
    </Section>
  );
}
