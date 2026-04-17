'use client';

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after { box-sizing: border-box; }

  html {
    /* Force the vertical scrollbar to always render, even on pages
       that don't overflow. This is the universally-supported
       counterpart to scrollbar-gutter stable, and keeps centered
       content (+ the fixed header) from shifting when scrollbar
       visibility flips between pages / builds. */
    overflow-y: scroll;
    scrollbar-gutter: stable;

    /* Lock horizontal overflow on the ROOT scroll container. When
       overflow-y is non-visible, the CSS spec treats overflow-x:
       visible as auto — meaning html gains a horizontal scrollbar
       the moment ANY descendant exceeds the viewport width (common
       in prod where fonts measure slightly wider than dev, or where
       a section mis-calculates width). Pinning to clip prevents the
       document itself from ever scrolling sideways. No sticky
       positioning is used anywhere in the tree, so clip is safe. */
    overflow-x: clip;

    /* Hard-constrain the document width so even a momentary layout
       glitch (a section briefly wider than viewport during hydration)
       cannot push the whole page right. */
    max-width: 100%;
  }

  html, body {
    margin: 0; padding: 0;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.body};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    /* Using auto (not smooth) so that browser scroll restoration on
       back/forward navigation jumps instantly to the remembered
       position instead of animating from the top of the page. */
    scroll-behavior: auto;
  }
  body {
    min-height: 100vh;
    line-height: 1.6;
    font-size: 16px;
    overflow-x: clip;
  }

  img, picture, svg { max-width: 100%; display: block; }
  a { color: inherit; text-decoration: none; }
  h1, h2, h3, h4 {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: 500;
    letter-spacing: -0.02em;
    margin: 0;
    line-height: 1.15;
  }
  p { margin: 0; }
  button { font: inherit; cursor: pointer; border: none; background: none; color: inherit; }

  input, select, textarea {
    font: inherit;
    color: inherit;
  }

  ::selection {
    background: rgba(194,65,12,0.18);
    color: inherit;
  }

  :focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
