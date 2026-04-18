'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import styled, { css } from 'styled-components';
import { mq } from '@/styles/theme';

const UNICORN_SRC =
  'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.1.9/dist/unicornStudio.umd.js';

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized?: boolean;
      init: () => void;
    };
  }
}

type Mode = 'face' | 'cover';

const Outer = styled.div<{ $ready: boolean; $externallyGated: boolean }>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: transparent;
  /* When the parent is gating reveal across multiple layers, skip our own
     opacity transition — otherwise this layer would briefly fade in alone
     before the parent's coordinator unhides it. */
  opacity: ${({ $ready, $externallyGated }) => ($externallyGated || $ready ? 1 : 0)};
  transition: opacity 320ms ease-out;

  /* Let the browser skip paint + compositing for the canvas when it's
   * fully scrolled out of view. The JS (UnicornStudio's rAF loop) is
   * still technically running, but the expensive composite and layer
   * work on the WebGL surface is skipped — measurable savings once
   * the user scrolls past the hero. */
  content-visibility: auto;
  contain-intrinsic-size: 800px;
`;

const Container = styled.div<{ $mode: Mode }>`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;

  /* In face mode the canvas blends into whatever sits behind it. Cover mode
     paints the entire hero atmosphere, so no feathering is needed.
     We combine an outer ellipse (silhouette feather) with a hard linear
     gradient that erases the bottom strip where the unicorn watermark
     sits — the two are intersected so both constraints apply. */
  ${({ $mode }) =>
    $mode === 'face' &&
    css`
      /* Show the face down past the chin to the collarbone, but keep a
         hard transparent bottom strip so the unicorn watermark stays
         hidden.
         - Linear: opaque to 70 %, soft blur zone 70-82 %, then hard
           transparent from 86 % onward (bottom ~14 % erased — safely
           larger than the watermark band).
         - Radial: tall ellipse that only feathers side edges; vertical
           masking is fully driven by the linear gradient. */
      -webkit-mask-image:
        linear-gradient(
          to bottom,
          #000 0%,
          #000 62%,
          rgba(0, 0, 0, 0.75) 70%,
          rgba(0, 0, 0, 0.2) 76%,
          transparent 80%
        ),
        radial-gradient(
          ellipse 95% 140% at 50% 50%,
          #000 82%,
          transparent 100%
        );
      -webkit-mask-composite: source-in;
      mask-image:
        linear-gradient(
          to bottom,
          #000 0%,
          #000 62%,
          rgba(0, 0, 0, 0.75) 70%,
          rgba(0, 0, 0, 0.2) 76%,
          transparent 80%
        ),
        radial-gradient(
          ellipse 95% 140% at 50% 50%,
          #000 82%,
          transparent 100%
        );
      mask-composite: intersect;
    `}

  & > div[data-us-project] {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    background: transparent !important;

    /* Some UnicornStudio embeds inject a <canvas> with a default opaque
       background — force transparency so the CSS gradient underneath
       shows through cleanly while the scene renders. */
    canvas {
      background: transparent !important;
    }

    /* Hide the free-tier "Made with unicorn.studio" badge if the embed
       renders it as a DOM node. */
    a[href*="unicorn.studio"],
    img[src*="free_user_logo"],
    img[src*="made_in_us"] {
      display: none !important;
    }
  }
`;

/* Some embeds paint the badge directly into the WebGL canvas, so DOM
   selectors can't reach it. We cover that bottom-center patch with a heavy
   blur whose edges feather out via mask-image. Only needed for face mode. */
const BadgeMask = styled.div`
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 100%;
  height: 140px;
  backdrop-filter: blur(60px) saturate(1.05);
  -webkit-backdrop-filter: blur(60px) saturate(1.05);
  -webkit-mask-image: radial-gradient(ellipse 90% 55% at 50% 70%, #000 60%, transparent 100%);
  mask-image: radial-gradient(ellipse 90% 55% at 50% 70%, #000 60%, transparent 100%);
  pointer-events: none;

  ${mq.md} {
    height: 160px;
  }
`;

type Props = {
  projectId: string;
  /** 'face' (default): canvas is shown crisp inside its parent (used in the
   *  centered Stage). 'cover': canvas fills the parent without feathering —
   *  use this for an atmospheric background scene that has no subject. */
  mode?: Mode;
  /** Fired once the UnicornStudio embed has actually mounted a <canvas>
   *  into the host div. Used by the parent (HeroSection) to coordinate
   *  multiple layers so a slower-loading face never lags behind a faster
   *  cover gradient. */
  onReady?: () => void;
  /** When true, suppresses the per-instance opacity fade on the wrapper —
   *  the parent is already gating visibility with its own ready logic, so
   *  letting this fade independently would briefly reveal the layer alone
   *  before the parent uncovers it. */
  externallyGated?: boolean;
};

/**
 * Wraps a Unicorn Studio scene as an absolutely-positioned canvas that fills
 * its parent. Render two instances with different project IDs to layer a
 * background gradient + a foreground subject.
 */
export function UnicornBg({ projectId, mode = 'face', onReady, externallyGated = false }: Props) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.UnicornStudio?.init) {
      window.UnicornStudio.init();
    }
  }, []);

  /**
   * Only reveal the canvas once the UnicornStudio embed has actually
   * painted a <canvas> into our host div — prevents the brief opaque
   * flash on page refresh where the pre-init box fills the Stage with
   * its placeholder color.
   */
  useEffect(() => {
    if (ready) return;
    const host = hostRef.current;
    if (!host) return;

    const reveal = () => {
      setReady(true);
      onReady?.();
    };

    const check = () => {
      if (host.querySelector('canvas')) {
        /* Canvas existing in the DOM doesn't mean the WebGL scene has
         * drawn its first real frame — the face scene shows a brief
         * "vertical color band" intro state (the scene's empty backdrop)
         * before the portrait paints. For face mode we add a small grace
         * window so that intro doesn't flash on cold loads. Cover mode
         * paints its gradient immediately so it can reveal as soon as
         * the canvas exists. */
        if (mode === 'face') {
          window.setTimeout(reveal, 600);
        } else {
          reveal();
        }
        return true;
      }
      return false;
    };

    if (check()) return;

    const observer = new MutationObserver(() => {
      if (check()) observer.disconnect();
    });
    observer.observe(host, { childList: true, subtree: true });

    // Hard cap: always reveal after 1200ms even if detection fails.
    const fallback = window.setTimeout(() => {
      setReady(true);
      onReady?.();
    }, 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [ready]);

  return (
    <Outer aria-hidden $ready={ready} $externallyGated={externallyGated}>
      <Container $mode={mode}>
        <div ref={hostRef} data-us-project={projectId} />
      </Container>
      {/* Cover mode paints opaque pixels everywhere, so the watermark sits on
          a solid background and we need a blur patch to hide it. The face
          scene is transparent — adding a backdrop blur there would blur the
          cover layer underneath and create a visible patch in the middle of
          the hero. */}
      {mode === 'cover' && <BadgeMask />}

      <Script
        src={UNICORN_SRC}
        strategy="afterInteractive"
        onLoad={() => {
          window.UnicornStudio?.init();
        }}
      />
    </Outer>
  );
}
