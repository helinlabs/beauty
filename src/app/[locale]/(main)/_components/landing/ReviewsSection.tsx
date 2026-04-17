'use client';

import Image from 'next/image';
import styled from 'styled-components';
import { mq } from '@/styles/theme';
import type { Locale } from '@/i18n/config';
import { reviews, priceCompareRows, type Review } from '@/data/reviews';
import {
  SectionInner,
  SectionWrap,
  SerifH2,
  SerifH3,
} from './_shared';

interface Props {
  locale: Locale;
  dict: {
    title: string;
    subtitle: string;
    beforeLabel: string;
    afterLabel: string;
    priceCompareTitle: string;
    priceCompareSubtitle: string;
    priceLabels: {
      rhinoplasty: string;
      lifting: string;
      laser: string;
    };
    usLabel: string;
    krLabel: string;
    savingsLabel: string;
    videoTitle: string;
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
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.12em;
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
  font-size: 13px;

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
  letter-spacing: 0.1em;
  color: ${({ theme }) => theme.colors.primary};
`;

const VideoCard = styled.article`
  position: relative;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  aspect-ratio: 16 / 11;
  background: ${({ theme }) => theme.colors.surfaceAlt};

  img { object-fit: cover; }
`;

const PlayOverlay = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, rgba(27,26,23,0) 40%, rgba(27,26,23,0.6) 100%);

  span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: rgba(255,255,255,0.92);
    color: ${({ theme }) => theme.colors.text};
    box-shadow: ${({ theme }) => theme.shadow.md};
  }
`;

const VideoFooter = styled.div`
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: 18px;
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 500;
  font-size: 18px;
  line-height: 1.25;
  text-shadow: 0 2px 10px rgba(0,0,0,0.35);
`;

const CompareWrap = styled.section`
  margin-top: 64px;
  padding: 36px 28px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};

  ${mq.md} {
    padding: 48px 56px;
  }
`;

const CompareTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;

  th, td {
    padding: 14px 10px;
    text-align: right;
    font-size: 15px;
    font-variant-numeric: tabular-nums;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
  th:first-child, td:first-child {
    text-align: left;
  }
  thead th {
    font-weight: 600;
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    border-bottom: 1px solid ${({ theme }) => theme.colors.text};
  }
  tbody td:first-child {
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: 500;
    font-size: 17px;
  }
  tbody td.us {
    color: ${({ theme }) => theme.colors.textMuted};
    text-decoration: line-through;
    text-decoration-thickness: 1px;
  }
  tbody td.kr {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 600;
  }
  tbody td.save {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 700;
  }
`;

function isBeforeAfter(r: Review): r is Review & { beforeImage: string; afterImage: string } {
  return r.kind === 'beforeAfter' && !!r.beforeImage && !!r.afterImage;
}

function priceUSD(n: number) {
  return `$${n.toLocaleString('en-US')}`;
}

export function ReviewsSection({ locale, dict }: Props) {
  const bas = reviews.filter(isBeforeAfter).slice(0, 2);
  const texts = reviews.filter((r) => r.kind === 'text').slice(0, 2);
  const video = reviews.find((r) => r.kind === 'video');

  return (
    <SectionWrap id="reviews">
      <SectionInner>
        <SerifH2 $large>{dict.title}</SerifH2>

        <Grid>
          {bas.map((r) => (
            <BACard key={r.id}>
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
          ))}

          {texts.map((r) => (
            <TextCard key={r.id}>
              <Stars>{'★'.repeat(r.rating)}</Stars>
              <Quote>{r.quote[locale as 'ko' | 'en']}</Quote>
              <Attribution>
                <strong>{r.reviewerName}</strong>
                {r.reviewerLocation}
              </Attribution>
            </TextCard>
          ))}

          {video && video.videoPoster && (
            <VideoCard>
              <Image
                src={video.videoPoster}
                alt=""
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
              />
              <PlayOverlay>
                <span>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M8 5v14l11-7L8 5Z" />
                  </svg>
                </span>
              </PlayOverlay>
              <VideoFooter>{dict.videoTitle}</VideoFooter>
            </VideoCard>
          )}
        </Grid>

        <CompareWrap>
          <SerifH3>{dict.priceCompareTitle}</SerifH3>

          <CompareTable>
            <thead>
              <tr>
                <th />
                <th>{dict.usLabel}</th>
                <th>{dict.krLabel}</th>
                <th>{dict.savingsLabel}</th>
              </tr>
            </thead>
            <tbody>
              {priceCompareRows.map((row) => {
                const savings = row.usPrice - row.krPrice;
                const pct = Math.round((savings / row.usPrice) * 100);
                return (
                  <tr key={row.procedureLabelKey}>
                    <td>{dict.priceLabels[row.procedureLabelKey]}</td>
                    <td className="us">{priceUSD(row.usPrice)}</td>
                    <td className="kr">{priceUSD(row.krPrice)}</td>
                    <td className="save">
                      −{pct}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </CompareTable>
        </CompareWrap>
      </SectionInner>
    </SectionWrap>
  );
}
