'use client';

import Image from 'next/image';
import styled from 'styled-components';
import { mq } from '@/styles/theme';
import { FadeIn } from './FadeIn';
import { SectionInner, SectionWrap } from './_shared';

interface Doctor {
  name: string;
  role: string;
  image: string;
}

interface Props {
  dict: {
    titleAccent: string;
    titleMain: string;
    subtitle: string;
    doctors: Doctor[];
  };
}

const Wrap = styled(SectionWrap)`
  background: ${({ theme }) => theme.colors.bg};
  padding-top: 96px;
  padding-bottom: 128px;

  ${mq.md} {
    padding-top: 128px;
    padding-bottom: 160px;
  }
`;

/* Centered block per the latest design pass — title stacks over the
 * subtitle, both centered in the content column. */
const Header = styled.div`
  text-align: center;
  margin: 0 auto 48px;
  max-width: 860px;

  ${mq.md} {
    margin-bottom: 64px;
  }
`;

/* Two-tone title stays in the same content shape (accent + main spans
 * from the dict), left-aligned. Kept the existing serif italic accent
 * + dark serif main styling — content doesn't change. */
const Title = styled.h2`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 400;
  letter-spacing: -0.02em;
  line-height: 1.08;
  font-size: clamp(38px, 5.2vw, 64px);
  margin: 0;

  span {
    display: block;
  }
  .accent {
    color: ${({ theme }) => theme.colors.primary};
    font-style: italic;
  }
  .main {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: clamp(16px, 1.4vw, 18px);
  line-height: 1.6;
  max-width: 58ch;
  margin: 20px auto 0;
`;

/* Horizontal swipeable rail — stays WITHIN SectionInner's bounds so
 * the left edge of the first card aligns with the left edge of the
 * header above (same gutter as the rest of the page content). No
 * negative margin, no extra scroll-padding — snapping a card to
 * "start" lands its left edge flush with the container, so it never
 * looks partially clipped. */
const ScrollRow = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  overflow-y: visible;
  scroll-snap-type: x mandatory;
  padding-bottom: 20px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  > * {
    flex-shrink: 0;
    scroll-snap-align: start;
    width: 70%;
    max-width: 360px;
  }

  ${mq.md} {
    gap: 20px;

    > * {
      width: 46%;
      max-width: 420px;
    }
  }

  ${mq.lg} {
    gap: 24px;

    > * {
      width: calc((100% - 24px * 3) / 4);
      max-width: 420px;
    }
  }
`;

const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/* 4:5 portrait (slightly taller than wide) on a light neutral fill,
 * so the clinic's cut-out photos sit on their own background. Radius
 * 24px. */
const Portrait = styled.div`
  position: relative;
  border-radius: 24px;
  aspect-ratio: 4 / 5;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceAlt};

  img {
    object-fit: cover;
    object-position: center top;
  }
`;

/* Small muted caption above the doctor's name — matches the
 * "Board Certified Plastic Surgeon" treatment in the reference. */
const Role = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 500;
  font-size: 14px;
  line-height: 1.3;
  letter-spacing: -0.005em;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;

/* Name in Inter Tight Regular (body sans, weight 400). Kept on body
 * sans to match the role caption above, but at a larger size. */
const Name = styled.h3`
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 400;
  letter-spacing: -0.015em;
  font-size: 22px;
  line-height: 1.15;
  color: ${({ theme }) => theme.colors.text};
  margin: 14px 0 0;
`;

export function MedicalTeamSection({ dict }: Props) {
  return (
    <Wrap id="medical-team">
      <SectionInner>
        <FadeIn>
          <Header>
            <Title>
              <span className="accent">{dict.titleAccent}</span>
              <span className="main">{dict.titleMain}</span>
            </Title>
            <Subtitle>{dict.subtitle}</Subtitle>
          </Header>
        </FadeIn>

        <ScrollRow>
          {dict.doctors.map((d, i) => (
            <FadeIn key={i} delay={i * 80}>
              <Card>
                <Portrait>
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 78vw"
                  />
                </Portrait>
                <div>
                  <Role>{d.role}</Role>
                  <Name>{d.name}</Name>
                </div>
              </Card>
            </FadeIn>
          ))}
        </ScrollRow>
      </SectionInner>
    </Wrap>
  );
}
