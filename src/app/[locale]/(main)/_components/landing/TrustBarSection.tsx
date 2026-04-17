'use client';

import styled from 'styled-components';
import { mq } from '@/styles/theme';
import { FadeIn } from './FadeIn';
import { SerifWordmark } from './_shared';

interface Stat {
  value: string;
  label: string;
}

interface Props {
  dict: {
    stats: {
      patients: Stat;
      reviews: Stat;
      english: Stat;
      certified: Stat;
    };
    partnerLabel: string;
    partnerName: string;
    certs: string[];
  };
}

/* Clinic interior background: sits full-bleed behind the content. The
 * section height grows so the entire image is visible, and a soft
 * bottom→top scrim keeps the stats + partner row readable without
 * hiding the photo. */
const Band = styled.section`
  position: relative;
  isolation: isolate;
  background: transparent;
`;

const Backdrop = styled.div`
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url('/images/clinic-interior.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  /* Readability scrim — darker near the content area, transparent at the
   * top so the ceiling reads clearly. */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(251, 247, 241, 0) 0%,
      rgba(251, 247, 241, 0.15) 55%,
      rgba(251, 247, 241, 0.85) 100%
    );
  }
`;

const Inner = styled.div`
  position: relative;
  z-index: 1;
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 420px 20px 64px;

  ${mq.md} {
    padding: 620px 32px 96px;
  }

  ${mq.lg} {
    padding: 760px 32px 112px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px 16px;

  ${mq.md} {
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }
`;

const StatBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-align: center;
`;

const StatValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 400;
  font-size: clamp(28px, 3.2vw, 42px);
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
`;

const StatLabel = styled.span`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
`;

const PartnerRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
  margin-top: 40px;
  padding-top: 28px;
  border-top: 1px dashed ${({ theme }) => theme.colors.border};

  ${mq.md} {
    flex-direction: row;
    justify-content: space-between;
  }
`;

const PartnerLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 14px;

  small {
    font-size: 15px;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

const CertRow = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CertPill = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  font-weight: 500;
`;

function ShieldIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2.5l8 3v6.3c0 4.4-3 8-8 9.7-5-1.7-8-5.3-8-9.7V5.5l8-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12l2.6 2.6L15.7 10"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function TrustBarSection({ dict }: Props) {
  const entries = [
    dict.stats.patients,
    dict.stats.reviews,
    dict.stats.english,
    dict.stats.certified,
  ];

  return (
    <Band id="trust">
      <Backdrop aria-hidden />
      <Inner>
        <StatsGrid>
          {entries.map((s, i) => (
            <FadeIn key={i} delay={i * 80}>
              <StatBlock>
                <StatValue>{s.value}</StatValue>
                <StatLabel>{s.label}</StatLabel>
              </StatBlock>
            </FadeIn>
          ))}
        </StatsGrid>

        <FadeIn>
        <PartnerRow>
          <PartnerLeft>
            <small>{dict.partnerLabel}</small>
            <SerifWordmark>{dict.partnerName}</SerifWordmark>
          </PartnerLeft>
          <CertRow>
            {dict.certs.map((c, i) => (
              <CertPill key={i}>
                <ShieldIcon />
                {c}
              </CertPill>
            ))}
          </CertRow>
        </PartnerRow>
        </FadeIn>
      </Inner>
    </Band>
  );
}
