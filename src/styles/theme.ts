export const theme = {
  colors: {
    bg: '#0f0d14',
    surface: '#17141d',
    surfaceAlt: '#1f1b29',
    text: '#f5f2fb',
    textMuted: '#a69eb8',
    primary: '#ff4f8b',
    primaryDark: '#d92e6a',
    accent: '#a084f2',
    whatsapp: '#25d366',
    whatsappDark: '#128c7e',
    border: 'rgba(255,255,255,0.08)',
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
    sm: '0 1px 2px rgba(0,0,0,0.3)',
    md: '0 8px 28px rgba(0,0,0,0.35)',
    glow: '0 0 0 1px rgba(255,79,139,0.25), 0 20px 60px rgba(255,79,139,0.25)',
  },
  fonts: {
    body: `-apple-system, BlinkMacSystemFont, 'Pretendard', 'Noto Sans KR', 'Segoe UI', Roboto, sans-serif`,
    heading: `'Pretendard', -apple-system, BlinkMacSystemFont, 'Noto Sans KR', 'Segoe UI', Roboto, sans-serif`,
  },
} as const;

export type AppTheme = typeof theme;

export const mq = {
  sm: `@media (min-width: ${theme.breakpoints.sm})`,
  md: `@media (min-width: ${theme.breakpoints.md})`,
  lg: `@media (min-width: ${theme.breakpoints.lg})`,
  xl: `@media (min-width: ${theme.breakpoints.xl})`,
};
