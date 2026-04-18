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

  /* Gutter used by the full-bleed ScrollRow. Fixed 20 on mobile and
   * 32 on tablet+ / desktop — per design the rail starts at a 32px
   * inset on desktop regardless of viewport width, rather than
   * auto-centering with the rest of the 1200px content column. */
  --rail-gutter: 20px;

  ${mq.md} {
    padding-top: 128px;
    padding-bottom: 160px;
    --rail-gutter: 32px;
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

/* Title matches the unified section-title style — EB Garamond
 * Regular at clamp(40px, 5.2vw, 64px). Two-tone preserved: accent
 * line in primary colour, main line in body text colour. */
const Title = styled.h2`
  font-family: var(--font-garamond), Georgia, serif;
  font-weight: 400;
  letter-spacing: -0.015em;
  line-height: 1.08;
  font-size: clamp(40px, 5.2vw, 64px);
  margin: 0;

  span {
    display: block;
  }
  .accent {
    color: ${({ theme }) => theme.colors.primary};
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

/* Horizontal swipeable rail.
 *
 * Root problem the earlier versions had: the rail lived inside
 * SectionInner, so any card that scrolled past SectionInner's left
 * or right edge got visually clipped by the section gutter BEFORE
 * it reached the viewport edge. Looked like "cut in half".
 *
 * Fix: make the rail a full-viewport-bleed element via the classic
 * `width: 100vw; margin-left: calc(50% - 50vw);` trick, then use
 * scroll-container padding-left/right to position the first card
 * flush with the content gutter and leave equivalent space on the
 * right. Cards in the padding zone are NOT clipped — overflow on a
 * scroll container hides content outside the PADDING box, so
 * content inside padding is fully visible, and cards scrolling out
 * slide all the way to the real viewport edges.
 *
 * Visible card counts (user request): 2 / 3 / 4 per view. Card
 * widths are computed from 100vw minus the symmetric gutter and the
 * N-1 inter-card gaps, so exactly N cards fit with no peek.
 *
 * A CSS variable `--rail-gutter` is set on the Wrap and drives both
 * the rail's side padding AND the card-width formula so the two
 * always stay in sync. */
const ScrollRow = styled.div`
  display: flex;
  gap: 16px;
  overflow-x: auto;
  overflow-y: visible;
  scroll-snap-type: x mandatory;
  /* scroll-padding-inline MUST match padding-inline below.
   * Without this, scroll-snap-align: start on the first card makes
   * the browser auto-scroll by padding-left so the card's start
   * aligns with the content-box start (inset by padding). Result:
   * the initial scrollLeft is non-zero and the first card ends up
   * flush with the viewport edge — the exact misalignment bug. */
  scroll-padding-inline: var(--rail-gutter);
  width: 100vw;
  margin-left: calc(50% - 50vw);
  padding: 4px var(--rail-gutter) 20px;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    display: none;
  }

  > * {
    flex-shrink: 0;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    /* Mobile: 2 cards per view — (viewport − 2 gutters − 1 gap) / 2. */
    width: calc((100vw - var(--rail-gutter) * 2 - 16px) / 2);
  }

  ${mq.md} {
    gap: 20px;

    > * {
      /* Tablet: 3 cards per view. */
      width: calc((100vw - var(--rail-gutter) * 2 - 20px * 2) / 3);
    }
  }

  ${mq.lg} {
    gap: 24px;

    > * {
      /* Desktop: 4 cards per view. */
      width: calc((100vw - var(--rail-gutter) * 2 - 24px * 3) / 4);
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
