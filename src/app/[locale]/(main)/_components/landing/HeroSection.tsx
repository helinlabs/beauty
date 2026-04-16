'use client';

import Image from 'next/image';
import styled, { keyframes } from 'styled-components';
import { mq } from '@/styles/theme';

interface Feature {
  label: string;
  description: string;
}

interface Props {
  locale: string;
  dict: {
    eyebrow: string;
    title: string;
    subtitle: string;
    subcopy: string;
    ctaPrimary: string;
    ctaSecondary: string;
    stickyCta: string;
    features: Feature[];
  };
  whatsappHref: string;
}

/* ───── Background blob keyframes — GPU-only (transform + opacity) ───── */
const driftA = keyframes`
  0%,100% { transform: translate3d(-8%, -6%, 0) scale(1); }
  33%     { transform: translate3d(6%, 4%, 0) scale(1.15); }
  66%     { transform: translate3d(-4%, 8%, 0) scale(0.95); }
`;
const driftB = keyframes`
  0%,100% { transform: translate3d(6%, -4%, 0) scale(1.05); }
  40%     { transform: translate3d(-8%, 6%, 0) scale(0.92); }
  75%     { transform: translate3d(4%, -2%, 0) scale(1.18); }
`;
const driftC = keyframes`
  0%,100% { transform: translate3d(-4%, 10%, 0) scale(0.95); }
  50%     { transform: translate3d(10%, -8%, 0) scale(1.12); }
`;
const driftD = keyframes`
  0%,100% { transform: translate3d(8%, 8%, 0) scale(1.08); }
  45%     { transform: translate3d(-6%, -4%, 0) scale(0.98); }
`;
const driftE = keyframes`
  0%,100% { transform: translate3d(-10%, 4%, 0) scale(1); }
  50%     { transform: translate3d(8%, -8%, 0) scale(1.18); }
`;

/* Prismatic sweep on the face — subtle multi-hue sheen */
const lightPass = keyframes`
  0%   { transform: translate3d(-65%, 0, 0) rotate(0deg); opacity: 0; }
  12%  { opacity: 0.85; }
  55%  { transform: translate3d(65%, 0, 0) rotate(0deg); opacity: 0.85; }
  62%  { opacity: 0; }
  100% { transform: translate3d(65%, 0, 0) rotate(0deg); opacity: 0; }
`;

/* ───── Containers ───── */
const Wrap = styled.section`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: 72px 20px 56px;

  ${mq.md} {
    padding: 96px 32px 96px;
  }
`;

const GradientBg = styled.div`
  position: absolute;
  inset: 0;
  z-index: -2;
  background: #F3EEE5;
`;

const Blob = styled.div<{ $color: string; $size: string; $top: string; $left: string; $anim: ReturnType<typeof keyframes>; $duration: string }>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  width: ${({ $size }) => $size};
  height: ${({ $size }) => $size};
  border-radius: 50%;
  background: ${({ $color }) => $color};
  filter: blur(90px);
  opacity: 0.7;
  mix-blend-mode: normal;
  animation: ${({ $anim }) => $anim} ${({ $duration }) => $duration} ease-in-out infinite;
  will-change: transform;
  pointer-events: none;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Eyebrow = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  margin-bottom: 20px;
  text-align: center;
`;

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 400;
  letter-spacing: -0.025em;
  line-height: 1.05;
  white-space: pre-line;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  font-size: clamp(34px, 6.2vw, 84px);
  max-width: 18ch;

  em {
    font-style: italic;
    font-weight: 400;
  }
`;

const Subtitle = styled.p`
  margin-top: 18px;
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  line-height: 1.6;
  max-width: 46ch;
`;

/* Subscribe-pill style primary CTA (stone via theme.primary). */
const CtaPill = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  margin-top: 28px;
  padding: 8px 8px 8px 22px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  font-size: 14px;
  letter-spacing: 0.01em;
  backdrop-filter: blur(6px);
  transition: background 0.2s, border-color 0.2s;

  &:hover { background: rgba(255, 255, 255, 0.92); border-color: ${({ theme }) => theme.colors.text}; }

  & > span.arrow {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
    transition: background 0.2s, transform 0.2s;
  }
  &:hover > span.arrow { background: ${({ theme }) => theme.colors.primaryDark}; transform: translateX(2px); }
`;

/* ───── Face + elliptical frame ───── */
const Stage = styled.div`
  position: relative;
  margin-top: 40px;
  width: 100%;
  max-width: 560px;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  ${mq.md} {
    margin-top: 56px;
    max-width: 620px;
  }
`;

const FaceFrame = styled.div`
  position: relative;
  width: 58%;
  aspect-ratio: 3 / 4;
  isolation: isolate;
  z-index: 2;

  img {
    object-fit: cover;
    object-position: center 15%;
    -webkit-mask-image: radial-gradient(ellipse 62% 85% at 50% 35%, #000 60%, transparent 100%);
    mask-image: radial-gradient(ellipse 62% 85% at 50% 35%, #000 60%, transparent 100%);
  }

  &::after {
    content: '';
    position: absolute;
    inset: -30%;
    pointer-events: none;
    background: linear-gradient(
      115deg,
      transparent 36%,
      rgba(255, 220, 180, 0.55) 45%,
      rgba(220, 210, 255, 0.9) 50%,
      rgba(200, 240, 255, 0.55) 55%,
      transparent 64%
    );
    transform: translate3d(-65%, 0, 0);
    mix-blend-mode: screen;
    opacity: 0.9;
    animation: ${lightPass} 5.5s cubic-bezier(0.4, 0, 0.2, 1) 1.4s infinite;
    will-change: transform, opacity;
    z-index: 3;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after { animation: none; opacity: 0; }
  }
`;

const Ellipse = styled.svg`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 58%;
  pointer-events: none;
  z-index: 1;
  overflow: visible;

  ellipse {
    fill: none;
    stroke: rgba(27, 26, 23, 0.25);
    stroke-width: 1;
    vector-effect: non-scaling-stroke;
  }
`;

/* ───── Features row ───── */
const Features = styled.ul`
  list-style: none;
  padding: 0;
  margin: 32px 0 0;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px 20px;

  ${mq.md} {
    margin-top: 24px;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
`;

const Feature = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  text-align: center;
  padding: 0 8px;
`;

const FeatureIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  color: ${({ theme }) => theme.colors.text};
`;

const FeatureLabel = styled.p`
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text};
`;

const FeatureDesc = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};
  line-height: 1.5;
  max-width: 22ch;
`;

/* 4 small decorative glyphs — abstract, monochrome. */
const glyphs = [
  (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden key="g1">
      <circle cx="8" cy="8" r="3" />
      <circle cx="16" cy="8" r="3" />
      <circle cx="8" cy="16" r="3" />
      <circle cx="16" cy="16" r="3" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden key="g2">
      <circle cx="7" cy="9" r="2.3" />
      <circle cx="12" cy="14" r="2.3" />
      <circle cx="17" cy="9" r="2.3" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden key="g3">
      <path d="M12 3l3.2 5.5 6.3 1-4.6 4.4 1.1 6.3L12 17.3 5.9 20.2 7 13.9 2.4 9.5l6.3-1L12 3z" />
    </svg>
  ),
  (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden key="g4">
      <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="3.5" />
    </svg>
  ),
];

export function HeroSection({ dict, whatsappHref }: Props) {
  return (
    <Wrap id="hero">
      <GradientBg aria-hidden>
        <Blob $color="#FFCFA8" $size="55vw" $top="-12%" $left="-10%" $anim={driftA} $duration="22s" />
        <Blob $color="#A9C7F7" $size="48vw" $top="-18%" $left="35%" $anim={driftB} $duration="26s" />
        <Blob $color="#C9B3F0" $size="60vw" $top="8%" $left="55%" $anim={driftC} $duration="28s" />
        <Blob $color="#FBB6C4" $size="45vw" $top="35%" $left="-8%" $anim={driftD} $duration="24s" />
        <Blob $color="#B2E8D5" $size="38vw" $top="55%" $left="68%" $anim={driftE} $duration="30s" />
      </GradientBg>

      <Inner>
        <Eyebrow>{dict.eyebrow}</Eyebrow>
        <HeroTitle>{dict.title}</HeroTitle>
        <Subtitle>{dict.subcopy}</Subtitle>

        <CtaPill
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          data-testid="hero-cta-primary"
        >
          {dict.ctaPrimary}
          <span className="arrow" aria-hidden>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M5 12h14M13 5l7 7-7 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </CtaPill>

        <Stage>
          <Ellipse viewBox="0 0 100 58" preserveAspectRatio="none" aria-hidden>
            <ellipse cx="50" cy="29" rx="49.5" ry="28.5" />
          </Ellipse>

          <FaceFrame>
            <Image
              src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=900&auto=format&fit=crop&q=80"
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 360px, 58vw"
            />
          </FaceFrame>
        </Stage>

        <Features>
          {dict.features.slice(0, 4).map((f, i) => (
            <Feature key={i}>
              <FeatureIcon>{glyphs[i % glyphs.length]}</FeatureIcon>
              <FeatureLabel>{f.label}</FeatureLabel>
              <FeatureDesc>{f.description}</FeatureDesc>
            </Feature>
          ))}
        </Features>
      </Inner>
    </Wrap>
  );
}
