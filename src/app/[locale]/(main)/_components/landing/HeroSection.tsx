'use client';

import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import { mq } from '@/styles/theme';
import {
  Eyebrow,
  SerifH2,
  WhatsAppGlyph,
  lightPass,
  primaryCtaCss,
  ghostCtaCss,
} from './_shared';

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
  };
  whatsappHref: string;
}

const HeroWrap = styled.section`
  position: relative;
  overflow: hidden;
  padding: 80px 20px 64px;

  background:
    radial-gradient(ellipse at 15% 20%, #FDEBD6 0%, transparent 58%),
    radial-gradient(ellipse at 88% 80%, #F0E3CF 0%, transparent 62%),
    ${({ theme }) => theme.colors.bg};

  ${mq.md} {
    padding: 120px 32px 96px;
  }
`;

const HeroInner = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  align-items: center;

  ${mq.md} {
    grid-template-columns: 1.1fr 1fr;
    gap: 64px;
  }
`;

const HeroTitle = styled.h1`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 400;
  letter-spacing: -0.025em;
  line-height: 1.02;
  white-space: pre-line;
  font-size: clamp(44px, 8vw, 92px);
  color: ${({ theme }) => theme.colors.text};
  margin-top: 14px;

  em {
    font-style: italic;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 17px;
  line-height: 1.6;
  margin-top: 20px;
  max-width: 46ch;
`;

const Subcopy = styled.p`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.accent};
  letter-spacing: 0.02em;
  margin-top: 16px;
`;

const CtaRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
`;

const PrimaryA = styled.a`
  ${primaryCtaCss}
`;

const GhostLink = styled(Link)`
  ${ghostCtaCss}
`;

const FaceFrame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: 24px;
  overflow: hidden;
  isolation: isolate;
  box-shadow: ${({ theme }) => theme.shadow.md};

  img {
    object-fit: cover;
  }

  &::after {
    content: '';
    position: absolute;
    inset: -30%;
    pointer-events: none;
    background: linear-gradient(
      115deg,
      transparent 30%,
      rgba(255, 255, 255, 0.55) 45%,
      rgba(255, 255, 255, 0.85) 50%,
      rgba(255, 255, 255, 0.55) 55%,
      transparent 70%
    );
    transform: translate3d(-60%, 0, 0);
    mix-blend-mode: screen;
    opacity: 0.75;
    animation: ${lightPass} 4.5s cubic-bezier(0.4, 0, 0.2, 1) 1.2s infinite;
    will-change: transform, opacity;
  }

  @media (prefers-reduced-motion: reduce) {
    &::after {
      animation: none;
      opacity: 0;
    }
  }
`;

const Sticky = styled.a`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 60;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 20px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.whatsapp};
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  box-shadow: 0 12px 32px rgba(37, 211, 102, 0.35);
  transition: background 0.2s, transform 0.2s;
  &:hover {
    background: ${({ theme }) => theme.colors.whatsappDark};
    transform: translateY(-2px);
  }
`;

export function HeroSection({ locale, dict, whatsappHref }: Props) {
  return (
    <>
      <HeroWrap id="hero">
        <HeroInner>
          <div>
            <Eyebrow>{dict.eyebrow}</Eyebrow>
            <HeroTitle>{dict.title}</HeroTitle>
            <Subtitle>{dict.subtitle}</Subtitle>
            <Subcopy>{dict.subcopy}</Subcopy>
            <CtaRow>
              <PrimaryA
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="hero-cta-primary"
              >
                <WhatsAppGlyph size={18} />
                {dict.ctaPrimary}
              </PrimaryA>
              <GhostLink href={`/${locale}/procedures`}>
                {dict.ctaSecondary}
              </GhostLink>
            </CtaRow>
          </div>

          <FaceFrame>
            <Image
              src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1200&auto=format&fit=crop&q=75"
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 50vw, 100vw"
            />
          </FaceFrame>
        </HeroInner>
      </HeroWrap>

      <Sticky
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        data-testid="sticky-whatsapp"
        aria-label={dict.stickyCta}
      >
        <WhatsAppGlyph size={18} />
        {dict.stickyCta}
      </Sticky>
    </>
  );
}
