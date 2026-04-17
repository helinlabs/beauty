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

const Outer = styled.div<{ $ready: boolean }>`
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: transparent;
  opacity: ${({ $ready }) => ($ready ? 1 : 0)};
  transition: opacity 320ms ease-out;
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
      -webkit-mask-image:
        linear-gradient(to bottom, #000 0, #000 82%, transparent 90%),
        radial-gradient(ellipse 85% 85% at 50% 48%, #000 60%, transparent 100%);
      -webkit-mask-composite: source-in;
      mask-image:
        linear-gradient(to bottom, #000 0, #000 82%, transparent 90%),
        radial-gradient(ellipse 85% 85% at 50% 48%, #000 60%, transparent 100%);
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
};

/**
 * Wraps a Unicorn Studio scene as an absolutely-positioned canvas that fills
 * its parent. Render two instances with different project IDs to layer a
 * background gradient + a foreground subject.
 */
export function UnicornBg({ projectId, mode = 'face' }: Props) {
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

    const check = () => {
      if (host.querySelector('canvas')) {
        setReady(true);
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
    const fallback = window.setTimeout(() => setReady(true), 1200);

    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, [ready]);

  return (
    <Outer aria-hidden $ready={ready}>
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
