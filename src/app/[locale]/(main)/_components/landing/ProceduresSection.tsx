'use client';

import Image from 'next/image';
import styled from 'styled-components';
import { mq } from '@/styles/theme';
import { FadeIn } from './FadeIn';
import {
  SectionInner,
  SectionWrap,
  SerifH2,
} from './_shared';

interface Props {
  dict: {
    title: string;
  };
}

/* Partner-site category pages — category keys map directly to slugs on
 * viewplasticsurgery.com. `big` promotes a tile to the hero row (two
 * full-height cards with imagery); the rest render as the 4-up small
 * tile grid below. */
const CATEGORIES_BASE = 'https://www.viewplasticsurgery.com';

type Category = {
  key: string;
  label: string;
  blurb?: string;
  href: string;
  image?: string;
  big?: boolean;
};

const CATEGORIES: Category[] = [
  {
    key: 'breast',
    label: 'Breast',
    blurb: 'Natural shape, confident silhouette',
    href: `${CATEGORIES_BASE}/breast/`,
    image: '/images/treatments/breast.jpg',
    big: true,
  },
  {
    key: 'contouring',
    label: 'Facial Contouring',
    blurb: 'Refined jaw, balanced profile',
    href: `${CATEGORIES_BASE}/facial-contour/`,
    image: '/images/intro/01.webp',
    big: true,
  },
  { key: 'doubleJaw', label: 'Double Jaw', href: `${CATEGORIES_BASE}/jaw/` },
  { key: 'eye', label: 'Eye', href: `${CATEGORIES_BASE}/eye/` },
  { key: 'rhinoplasty', label: 'Rhinoplasty', href: `${CATEGORIES_BASE}/nose/` },
  { key: 'liposuction', label: 'Liposuction', href: `${CATEGORIES_BASE}/lipo/` },
  { key: 'antiAging', label: 'Anti-aging', href: `${CATEGORIES_BASE}/lifting/` },
  { key: 'male', label: 'Male', href: `${CATEGORIES_BASE}/view-male/` },
  { key: 'dermatology', label: 'Dermatology', href: `${CATEGORIES_BASE}/skin/` },
  {
    key: 'beforeAfter',
    label: 'Before & After',
    href: `${CATEGORIES_BASE}/review/before-after/`,
  },
];

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: end;
  gap: 24px;
  flex-wrap: wrap;
  text-align: center;
`;

const CenteredTitle = styled(SerifH2)`
  text-align: center;
  margin-left: auto;
  margin-right: auto;
`;

const BigGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 14px;
  margin-top: 48px;

  ${mq.md} {
    grid-template-columns: 1fr 1fr;
    gap: 18px;
  }
`;

const SmallGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 14px;

  ${mq.md} {
    grid-template-columns: repeat(4, 1fr);
    gap: 14px;
    margin-top: 18px;
  }
`;

const BigCard = styled.a`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 220px;
  padding: 26px 22px 22px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  overflow: hidden;
  text-decoration: none;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow.md};
  }

  ${mq.md} {
    min-height: 260px;
    padding: 30px 26px 26px;
  }
`;

/* Image sits on the RIGHT half of the card, fading left into the card
 * background so the title text on the left stays legible even on narrow
 * phones where the image edge approaches the text. */
const BigImage = styled.div`
  position: absolute;
  inset: 0 0 0 25%;
  z-index: 0;
  transform: translateX(40px);

  img {
    object-fit: cover;
    object-position: right center;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to right,
      ${({ theme }) => theme.colors.surfaceAlt} 0%,
      rgba(243, 236, 225, 0.4) 40%,
      rgba(243, 236, 225, 0) 100%
    );
    pointer-events: none;
  }
`;

const BigTitle = styled.h3`
  position: relative;
  z-index: 1;
  margin: 0;
  font-family: var(--font-garamond), Georgia, serif;
  font-weight: 400;
  font-size: clamp(26px, 3vw, 38px);
  line-height: 1.08;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
  max-width: 60%;
`;

const BigBlurb = styled.p`
  position: relative;
  z-index: 1;
  margin: 10px 0 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 55%;
`;

const Arrow = styled.span`
  position: relative;
  z-index: 1;
  align-self: flex-end;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  transition: background 0.2s ease;

  svg {
    width: 16px;
    height: 16px;
  }

  ${BigCard}:hover & {
    background: ${({ theme }) => theme.colors.primary};
    color: #fff;
  }
`;

const SmallCard = styled.a`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 20px 18px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  min-height: 78px;
  text-decoration: none;
  transition: transform 0.2s ease, background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow.sm};
  }

  ${mq.md} {
    padding: 22px 20px;
    min-height: 88px;
  }
`;

const SmallTitle = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 15px;
  font-weight: 500;
  line-height: 1.25;
  color: ${({ theme }) => theme.colors.text};

  ${mq.md} {
    font-size: 16px;
  }
`;

const SmallArrow = styled.span`
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: color 0.2s ease;

  svg {
    width: 18px;
    height: 18px;
  }

  ${SmallCard}:hover & {
    color: ${({ theme }) => theme.colors.text};
  }
`;

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProceduresSection({ dict }: Props) {
  const big = CATEGORIES.filter((c) => c.big);
  const small = CATEGORIES.filter((c) => !c.big);

  return (
    <SectionWrap id="procedures">
      <SectionInner>
        <FadeIn>
          <Header>
            <CenteredTitle $large>{dict.title}</CenteredTitle>
          </Header>
        </FadeIn>

        <BigGrid>
          {big.map((c, idx) => (
            <FadeIn key={c.key} delay={idx * 80}>
              <BigCard
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`treatment-big-${c.key}`}
              >
                {c.image && (
                  <BigImage>
                    <Image
                      src={c.image}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 30vw, 55vw"
                      aria-hidden
                    />
                  </BigImage>
                )}
                <div>
                  <BigTitle>{c.label}</BigTitle>
                  {c.blurb && <BigBlurb>{c.blurb}</BigBlurb>}
                </div>
                <Arrow>
                  <ChevronIcon />
                </Arrow>
              </BigCard>
            </FadeIn>
          ))}
        </BigGrid>

        <SmallGrid>
          {small.map((c, idx) => (
            <FadeIn key={c.key} delay={(big.length + idx) * 60}>
              <SmallCard
                href={c.href}
                target="_blank"
                rel="noopener noreferrer"
                data-testid={`treatment-small-${c.key}`}
              >
                <SmallTitle>{c.label}</SmallTitle>
                <SmallArrow>
                  <ChevronIcon />
                </SmallArrow>
              </SmallCard>
            </FadeIn>
          ))}
        </SmallGrid>
      </SectionInner>
    </SectionWrap>
  );
}
