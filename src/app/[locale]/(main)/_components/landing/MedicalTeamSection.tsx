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

const Header = styled.div`
  text-align: center;
  max-width: 860px;
  margin: 0 auto 64px;

  ${mq.md} {
    margin-bottom: 80px;
  }
`;

/* Two-tone editorial title: accent line (primary/terracotta) stacked
 * over the dark main line. Both use the serif heading face. */
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

/* Horizontal swipeable rail — works as a touch-swipe carousel on
 * mobile and as a trackpad/wheel-scroll row on desktop. Native CSS
 * scroll-snap keeps each card aligned to the left edge when the user
 * releases. Side padding on the container leaves room for the first
 * and last cards to breathe against the viewport edges.
 *
 * The sizing + snap styles are applied to ">*" (the FadeIn wrapper
 * around each Card) rather than Card itself, because FadeIn is the
 * actual flex child of ScrollRow. */
const ScrollRow = styled.div`
  display: flex;
  gap: 20px;
  overflow-x: auto;
  overflow-y: visible;
  scroll-snap-type: x mandatory;
  padding: 4px 20px 20px;
  margin: 0 -20px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  > * {
    flex-shrink: 0;
    scroll-snap-align: start;
    width: 78%;
    max-width: 320px;
  }

  ${mq.md} {
    gap: 28px;
    padding: 4px 32px 24px;
    margin: 0 -32px;

    > * {
      width: calc((100% - 28px * 2) / 3);
      max-width: 380px;
    }
  }

  ${mq.lg} {
    > * {
      width: calc((100% - 28px * 3) / 4);
    }
  }
`;

/* Each card sits inside the ScrollRow. Fixed width + flex-shrink: 0
 * so cards keep their size regardless of how many fit, and
 * scroll-snap-align: start pins each card to the left edge when
 * swiping so the transition feels precise.
 *
 * Portrait panel on top + doctor name + bio below on the section's
 * own background (no credential overlay inside the image anymore —
 * the image is now uninterrupted). */
const Card = styled.article`
  flex-shrink: 0;
  scroll-snap-align: start;
  width: 78%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  ${mq.md} {
    width: calc((100% - 28px * 2) / 3);
    max-width: 380px;
  }

  ${mq.lg} {
    width: calc((100% - 28px * 3) / 4);
  }
`;

const Portrait = styled.div`
  position: relative;
  border-radius: 20px;
  aspect-ratio: 4 / 3.2;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceAlt};

  img {
    object-fit: cover;
    object-position: center top;
  }
`;

/* Role caption sits ABOVE the doctor's name — muted sans label that
 * reads like a credential line (e.g. "Board Certified Plastic
 * Surgeon") under the portrait. */
const Role = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 500;
  font-size: 14px;
  line-height: 1.3;
  letter-spacing: -0.005em;
  color: ${({ theme }) => theme.colors.textMuted};
  margin: 0;
`;

const Name = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 500;
  letter-spacing: -0.015em;
  font-size: 22px;
  color: ${({ theme }) => theme.colors.text};
  margin: 12px 0 0;
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
                    sizes="(min-width: 768px) 33vw, 80vw"
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
