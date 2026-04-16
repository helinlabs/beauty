'use client';

import styled, { css, keyframes } from 'styled-components';
import { mq } from '@/styles/theme';

/** Max content width (1200px) + responsive horizontal padding. */
export const SectionWrap = styled.section<{ $tight?: boolean; $bg?: string }>`
  position: relative;
  padding: 56px 20px;
  background: ${({ $bg }) => $bg ?? 'transparent'};

  ${mq.md} {
    padding: ${({ $tight }) => ($tight ? '72px 32px' : '96px 32px')};
  }
`;

export const SectionInner = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
`;

/** Small all-caps eyebrow label above a section heading. */
export const Eyebrow = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 14px;
`;

/** Editorial serif heading for section titles. */
export const SerifH2 = styled.h2<{ $large?: boolean }>`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.08;
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ $large }) => ($large ? 'clamp(34px, 5vw, 56px)' : 'clamp(28px, 4vw, 44px)')};
  max-width: 22ch;

  em {
    font-style: italic;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const SerifH3 = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 500;
  letter-spacing: -0.015em;
  line-height: 1.15;
  font-size: 22px;
`;

export const SubtitleP = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 16px;
  max-width: 60ch;
  margin-top: 16px;
  line-height: 1.65;
`;

export const Pill = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.02em;
`;

/** "View Plastic Surgery" styled wordmark — serif, italic, tracked. */
export const SerifWordmark = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-style: italic;
  font-weight: 500;
  font-size: 20px;
  letter-spacing: 0.02em;
  color: ${({ theme }) => theme.colors.text};
`;

/** Primary CTA — terracotta fill. */
export const primaryCtaCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  letter-spacing: 0.01em;
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-1px);
  }
`;

export const ghostCtaCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: ${({ theme }) => theme.radius.pill};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 15px;
  transition: border-color 0.2s, background 0.2s;
  &:hover {
    border-color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.surface};
  }
`;

/** Hero shimmer — translated diagonal sheen. GPU-only (transform + opacity). */
export const lightPass = keyframes`
  0%   { transform: translate3d(-60%, 0, 0); opacity: 0; }
  10%  { opacity: 0.9; }
  55%  { transform: translate3d(60%, 0, 0); opacity: 0.9; }
  60%  { opacity: 0; }
  100% { transform: translate3d(60%, 0, 0); opacity: 0; }
`;

/** Small WhatsApp glyph used in hero/final CTAs. */
export function WhatsAppGlyph({
  size = 18,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M20.52 3.48A11.8 11.8 0 0 0 12 0a12 12 0 0 0-10.4 18L0 24l6.2-1.6A12 12 0 1 0 20.52 3.48Zm-8.5 18.4a9.9 9.9 0 0 1-5-1.37l-.36-.22-3.67.96.98-3.58-.23-.37A9.94 9.94 0 1 1 22 12a9.94 9.94 0 0 1-9.98 9.88Zm5.47-7.43c-.3-.15-1.78-.88-2.05-.98s-.47-.15-.67.15-.77.97-.94 1.17-.35.22-.65.07a8.2 8.2 0 0 1-2.42-1.49 9.18 9.18 0 0 1-1.68-2.1c-.17-.3 0-.46.13-.6s.3-.35.45-.52.2-.3.3-.5.05-.37 0-.52-.67-1.6-.92-2.2c-.24-.58-.48-.5-.66-.51h-.57a1.1 1.1 0 0 0-.8.37 3.34 3.34 0 0 0-1.04 2.48 5.78 5.78 0 0 0 1.22 3.08 13.28 13.28 0 0 0 5.1 4.51c.72.3 1.28.49 1.72.63a4.15 4.15 0 0 0 1.9.12 3.1 3.1 0 0 0 2.04-1.44 2.54 2.54 0 0 0 .17-1.44c-.07-.13-.27-.2-.57-.35Z" />
    </svg>
  );
}
