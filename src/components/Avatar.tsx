'use client';

import styled from 'styled-components';

const A = styled.div<{ $gradient: string; $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: ${({ $gradient }) => $gradient};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.95);
  font-weight: 800;
  font-size: ${({ $size }) => Math.round($size / 2.6)}px;
  letter-spacing: -0.01em;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.15);
  flex-shrink: 0;
`;

export function Avatar({
  gradient,
  label,
  size = 48,
}: {
  gradient: string;
  label: string;
  size?: number;
}) {
  const initials = label
    .trim()
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <A $gradient={gradient} $size={size} aria-hidden>
      {initials || '🌸'}
    </A>
  );
}
