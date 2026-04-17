'use client';

import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  *,
  *::before,
  *::after { box-sizing: border-box; }

  html, body {
    margin: 0; padding: 0;
    background: ${({ theme }) => theme.colors.bg};
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.body};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    scroll-behavior: smooth;
    overflow-x: hidden;
  }
  body { min-height: 100vh; line-height: 1.6; font-size: 16px; }

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
