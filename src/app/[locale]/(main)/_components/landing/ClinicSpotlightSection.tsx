'use client';

import Image from 'next/image';
import styled from 'styled-components';
import { mq } from '@/styles/theme';
import { CLINIC } from '@/data/clinic';
import type { Locale } from '@/i18n/config';
import {
  SectionInner,
  SectionWrap,
  SerifH2,
  WhatsAppGlyph,
  primaryCtaCss,
} from './_shared';

interface Props {
  locale: Locale;
  whatsappHref: string;
  dict: {
    eyebrow: string;
    title: string;
    subtitle: string;
    doctorTitle: string;
    credentials: {
      boardCertified: string;
      gangnam: string;
      english: string;
    };
    addressLabel: string;
    supportLabel: string;
    ctaLabel: string;
  };
}

const Band = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Inner = styled.div`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: 72px 20px;

  ${mq.md} {
    padding: 112px 32px;
  }
`;

const Columns = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;
  align-items: center;

  ${mq.md} {
    grid-template-columns: 1.1fr 0.9fr;
    gap: 64px;
  }
`;

const Portrait = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: 200px 200px 24px 24px;
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.md};

  img { object-fit: cover; }
`;

const Credentials = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
`;

const Cred = styled.li`
  padding: 6px 12px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  color: ${({ theme }) => theme.colors.text};
  font-size: 12px;
  font-weight: 500;
`;

const DoctorLine = styled.p`
  margin-top: 20px;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};

  strong {
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.heading};
    font-weight: 500;
    font-size: 17px;
    letter-spacing: -0.01em;
    display: inline-block;
    margin-right: 8px;
  }
`;

const MetaTable = styled.dl`
  margin: 28px 0 0;
  display: grid;
  grid-template-columns: 120px 1fr;
  row-gap: 10px;
  font-size: 14px;

  dt {
    color: ${({ theme }) => theme.colors.textMuted};
  }
  dd {
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
  }
`;

const InteriorStrip = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  margin-top: 40px;

  ${mq.md} { gap: 16px; }
`;

const InteriorTile = styled.div`
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadow.sm};

  img { object-fit: cover; }
`;

const CtaA = styled.a`
  ${primaryCtaCss}
  margin-top: 28px;
`;

export function ClinicSpotlightSection({ locale, whatsappHref, dict }: Props) {
  return (
    <Band id="clinic">
      <Inner>
        <Columns>
          <div>
            <SerifH2 $large>{dict.title}</SerifH2>

            <Credentials>
              <Cred>{dict.credentials.boardCertified}</Cred>
              <Cred>{dict.credentials.gangnam}</Cred>
              <Cred>{dict.credentials.english}</Cred>
            </Credentials>

            <DoctorLine>
              <strong>{CLINIC.doctor.name}</strong>
              {CLINIC.doctor.title[locale as 'ko' | 'en']}
            </DoctorLine>

            <MetaTable>
              <dt>{dict.addressLabel}</dt>
              <dd>{CLINIC.address[locale as 'ko' | 'en']}</dd>
              <dt>{dict.supportLabel}</dt>
              <dd>{CLINIC.support[locale as 'ko' | 'en']}</dd>
            </MetaTable>

            <CtaA
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="clinic-cta"
            >
              <WhatsAppGlyph size={16} />
              {dict.ctaLabel}
            </CtaA>
          </div>

          <Portrait>
            <Image
              src={CLINIC.doctorImage}
              alt={CLINIC.doctor.name}
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
            />
          </Portrait>
        </Columns>

        <InteriorStrip>
          {CLINIC.interiorImages.map((url, i) => (
            <InteriorTile key={i}>
              <Image
                src={url}
                alt=""
                fill
                sizes="(min-width: 768px) 30vw, 33vw"
              />
            </InteriorTile>
          ))}
        </InteriorStrip>
      </Inner>
    </Band>
  );
}
