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

/**
 * Trust content block — designed to render OVER the pinned clinic
 * photo provided by PinnedClinicBackdrop. The section is completely
 * transparent (no fill, no rounded top), and every text element
 * except the chips is white so it reads against the (scrimmed) photo
 * behind it. Chips keep their own pill background for contrast.
 */
const Band = styled.section`
  position: relative;
  background: transparent;
`;

const Inner = styled.div`
  position: relative;
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  /* Push content down into the visually-centered part of the pinned
   * image so partner + certs appear in the first view, then stats
   * follow further down. 300px bottom padding gives the section
   * meaningful breathing room before the dashed stats row transitions
   * into the HowItWorks block. */
  padding: 30vh 20px 300px;

  ${mq.md} {
    padding: 35vh 32px 300px;
  }

  ${mq.lg} {
    padding: 40vh 32px 300px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px 16px;
  margin-top: 56px;
  padding-top: 40px;
  border-top: 1px dashed rgba(255, 255, 255, 0.25);

  ${mq.md} {
    grid-template-columns: repeat(4, 1fr);
    gap: 32px;
    margin-top: 72px;
    padding-top: 48px;
  }
`;

const StatBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
`;

/* Stat numbers: bigger editorial serif, pure white — 1.5x bump from
 * the prior clamp so the figures dominate the pinned panel. */
const StatValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 400;
  font-size: clamp(60px, 6.6vw, 90px);
  letter-spacing: -0.015em;
  line-height: 1.05;
  color: #ffffff;
`;

/* StatLabel matches the "Official partner clinic" caption treatment:
 * same 13px uppercase tracking and weight 600 so every small caption
 * in the pinned panel reads as one consistent tier. */
const StatLabel = styled.span`
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const PartnerRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28px;
`;

/* Stacked label + wordmark — white, scaled WAY up so the partner
 * name anchors the sticky panel visually. */
const PartnerLeft = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;

  small {
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.8);
  }

  /* Override default SerifWordmark — much larger so it dominates the
   * first view, in white for contrast against the clinic photo. */
  ${SerifWordmark} {
    font-size: clamp(44px, 6.2vw, 84px);
    letter-spacing: -0.015em;
    line-height: 1.05;
    color: #ffffff;
  }
`;

/* Cert pills keep their own pill background so they read regardless
 * of the photo behind. Tint bumped to a softer cream so they feel
 * like they belong on the darker-scrimmed image. */
const CertRow = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  list-style: none;
  padding: 0;
  margin: 0;

  ${mq.md} {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }
`;

const CertPill = styled.li`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.6);
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

/* Location pin — used on the "Gangnam premium location" cert. */
function PinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle
        cx="12"
        cy="10"
        r="2.6"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  );
}

/* Translate / language — used on the "On-site English coordinator"
 * cert. Two overlapping letterform marks suggest a language swap. */
function TranslateIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 5h10M8 3v2M5 5c1.5 5 3 7 6.5 9"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 14c-2.5-2-3.5-4.2-4-7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.5 21l4-10 4 10M14 18h5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Icon chosen per cert index. dict.certs ships a fixed order:
 * [KMA board-certified, Gangnam premium location, On-site English
 * coordinator], so we just map position → icon. Falls back to the
 * shield for any additional certs the copy team might add later. */
const CERT_ICONS = [ShieldIcon, PinIcon, TranslateIcon] as const;

export function TrustBarSection({ dict }: Props) {
  const entries = [
    dict.stats.patients,
    dict.stats.reviews,
    dict.stats.english,
    dict.stats.certified,
  ];

  return (
    <Band id="trust">
      <Inner>
        <FadeIn>
          <PartnerRow>
            <PartnerLeft>
              <small>{dict.partnerLabel}</small>
              <SerifWordmark>{dict.partnerName}</SerifWordmark>
            </PartnerLeft>
            <CertRow>
              {dict.certs.map((c, i) => {
                const Icon = CERT_ICONS[i] ?? ShieldIcon;
                return (
                  <CertPill key={i}>
                    <Icon />
                    {c}
                  </CertPill>
                );
              })}
            </CertRow>
          </PartnerRow>
        </FadeIn>

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
      </Inner>
    </Band>
  );
}
