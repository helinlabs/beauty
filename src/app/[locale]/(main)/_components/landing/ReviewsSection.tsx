'use client';

import Image from 'next/image';
import styled from 'styled-components';
import { mq } from '@/styles/theme';
import type { Locale } from '@/i18n/config';
import { reviews, type Review } from '@/data/reviews';
import { FadeIn } from './FadeIn';
import {
  SectionInner,
  SectionWrap,
  SerifH2,
} from './_shared';

interface Props {
  locale: Locale;
  dict: {
    title: string;
    subtitle: string;
    beforeLabel: string;
    afterLabel: string;
    readStory: string;
  };
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-top: 48px;

  ${mq.md} {
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
  }
`;

const BACard = styled.article`
  position: relative;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const BAPair = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;

  > div {
    position: relative;
    aspect-ratio: 1;

    img { object-fit: cover; }
  }
  > div + div {
    border-left: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const BALabel = styled.span`
  position: absolute;
  top: 10px;
  left: 10px;
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: rgba(27, 26, 23, 0.55);
  color: #fff;
  font-size: 15px;
  font-weight: 600;
  text-transform: uppercase;
  backdrop-filter: blur(3px);
`;

const CardBody = styled.div`
  padding: 18px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Quote = styled.blockquote`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-size: 18px;
  line-height: 1.45;
  color: ${({ theme }) => theme.colors.text};

  &::before {
    content: '"';
    color: ${({ theme }) => theme.colors.primary};
    margin-right: 2px;
  }
  &::after { content: '"'; color: ${({ theme }) => theme.colors.primary}; }
`;

const Attribution = styled.p`
  margin-top: 6px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
    margin-right: 6px;
  }
`;

const TextCard = styled.article`
  padding: 24px 24px 22px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Stars = styled.span`
  display: inline-block;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.colors.primary};
`;

function isBeforeAfter(r: Review): r is Review & { beforeImage: string; afterImage: string } {
  return r.kind === 'beforeAfter' && !!r.beforeImage && !!r.afterImage;
}

/* Centered "Real US patients, real Seoul trips" title — overrides
 * SerifH2's default left alignment so the heading sits in the middle
 * of the section. */
const CenteredTitle = styled(SerifH2)`
  text-align: center;
  margin-left: auto;
  margin-right: auto;
`;

export function ReviewsSection({ locale, dict }: Props) {
  const bas = reviews.filter(isBeforeAfter).slice(0, 2);
  const texts = reviews.filter((r) => r.kind === 'text').slice(0, 2);

  return (
    <SectionWrap id="reviews">
      <SectionInner>
        <FadeIn>
          <CenteredTitle $large>{dict.title}</CenteredTitle>
        </FadeIn>

        <Grid>
          {bas.map((r, idx) => (
            <FadeIn key={r.id} delay={idx * 90}>
            <BACard>
              <BAPair>
                <div>
                  <Image src={r.beforeImage} alt="Before" fill sizes="(min-width: 768px) 25vw, 50vw" />
                  <BALabel>{dict.beforeLabel}</BALabel>
                </div>
                <div>
                  <Image src={r.afterImage} alt="After" fill sizes="(min-width: 768px) 25vw, 50vw" />
                  <BALabel>{dict.afterLabel}</BALabel>
                </div>
              </BAPair>
              <CardBody>
                <Stars>{'★'.repeat(r.rating)}</Stars>
                <Quote>{r.quote[locale as 'ko' | 'en']}</Quote>
                <Attribution>
                  <strong>{r.reviewerName}</strong>
                  {r.reviewerLocation}
                </Attribution>
              </CardBody>
            </BACard>
            </FadeIn>
          ))}

          {texts.map((r, idx) => (
            <FadeIn key={r.id} delay={(idx + bas.length) * 80}>
            <TextCard>
              <Stars>{'★'.repeat(r.rating)}</Stars>
              <Quote>{r.quote[locale as 'ko' | 'en']}</Quote>
              <Attribution>
                <strong>{r.reviewerName}</strong>
                {r.reviewerLocation}
              </Attribution>
            </TextCard>
            </FadeIn>
          ))}

        </Grid>

      </SectionInner>
    </SectionWrap>
  );
}
