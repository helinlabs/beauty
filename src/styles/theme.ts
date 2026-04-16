export const theme = {
  colors: {
    bg: '#FBF7F1',
    surface: '#FFFFFF',
    surfaceAlt: '#F3ECE1',
    text: '#1B1A17',
    textMuted: '#6B6558',
    // Primary buttons / links — shadcn stone-900 / stone-950 (deep neutral).
    primary: '#1C1917',
    primaryDark: '#0C0A09',
    accent: '#57534E',
    whatsapp: '#25D366',
    whatsappDark: '#128C7E',
    border: 'rgba(27,26,23,0.10)',
  },
  breakpoints: {
    sm: '480px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
  radius: {
    sm: '8px',
    md: '14px',
    lg: '22px',
    pill: '999px',
  },
  spacing: (n: number) => `${n * 4}px`,
  maxWidth: '1200px',
  shadow: {
    sm: '0 1px 2px rgba(27,26,23,0.06)',
    md: '0 8px 28px rgba(27,26,23,0.10)',
    glow: '0 0 0 1px rgba(194,65,12,0.20), 0 20px 60px rgba(194,65,12,0.12)',
  },
  fonts: {
    body: `var(--font-sans), -apple-system, BlinkMacSystemFont, 'Pretendard', 'Noto Sans KR', 'Segoe UI', Roboto, sans-serif`,
    heading: `var(--font-serif), 'Pretendard', 'Noto Serif KR', Georgia, serif`,
    display: `var(--font-display), 'Pretendard', 'Noto Serif KR', Georgia, serif`,
  },
} as const;

export type AppTheme = typeof theme;

export const mq = {
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
  xl: `@media (min-width: ${theme.breakpoints.xl})`,
};
