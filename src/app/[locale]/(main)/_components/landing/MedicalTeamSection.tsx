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

/* Left-aligned block per the reference layout — title over subtitle,
 * hugging the content column instead of centered. */
const Header = styled.div`
  text-align: left;
  margin: 0 0 48px;
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
  margin: 20px 0 0;
`;

/* Horizontal swipeable rail matching the reference: 4 cards per row
 * on desktop, 2 on tablet, 1 with a tiny peek on mobile. Native CSS
 * scroll-snap for the swipe feel, wheel/trackpad friendly on
 * desktop. Sizing styles apply to the FadeIn wrapper (> *), which is
 * the actual flex child. */
const ScrollRow = styled.div`
  display: flex;
  gap: 16px;
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
    max-width: 360px;
  }

  ${mq.md} {
    gap: 20px;
    padding: 4px 32px 24px;
    margin: 0 -32px;

    > * {
      width: calc((100% - 20px) / 2);
      max-width: none;
    }
  }

  ${mq.lg} {
    gap: 24px;

    > * {
      width: calc((100% - 24px * 3) / 4);
    }
  }
`;

const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

/* Square portrait per the reference layout, on a light neutral fill
 * so the clinic's cut-out photos sit on their own background. Radius
 * 24px as requested. */
const Portrait = styled.div`
  position: relative;
  border-radius: 24px;
  aspect-ratio: 1 / 1;
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

/* Name in sans (Inter Tight) bold, like the reference, rather than
 * the serif face we used before. */
const Name = styled.h3`
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 700;
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
