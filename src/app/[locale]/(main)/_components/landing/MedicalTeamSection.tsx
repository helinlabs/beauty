'use client';

import Image from 'next/image';
import styled from 'styled-components';
import { mq } from '@/styles/theme';
import { FadeIn } from './FadeIn';
import { SectionInner, SectionWrap } from './_shared';

interface Doctor {
  name: string;
  role: string;
  specialty: string;
  bio: string;
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 40px;

  ${mq.md} {
    grid-template-columns: repeat(3, 1fr);
    gap: 32px;
  }
`;

/* Each card is a two-part stack: a cream-filled portrait panel on top
 * (with a credential badge pinned in its corner) and the doctor's
 * name + bio sitting below on the section's own background. */
const Card = styled.article`
  display: flex;
  flex-direction: column;
  gap: 24px;
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

/* Credential block pinned inside the portrait panel — top-right on
 * desktop, bottom on the narrow mobile card so it never overlaps the
 * face region too aggressively. */
const CredentialBlock = styled.div`
  position: absolute;
  right: 16px;
  bottom: 18px;
  padding: 12px 14px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(8px) saturate(1.4);
  -webkit-backdrop-filter: blur(8px) saturate(1.4);
  max-width: 200px;

  ${mq.md} {
    right: 20px;
    bottom: auto;
    top: 20px;
    max-width: 220px;
  }
`;

const Role = styled.p`
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 600;
  font-size: 14px;
  line-height: 1.3;
  letter-spacing: -0.005em;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

/* Specialty line with a short vertical accent bar mirroring the
 * reference design — sans, muted, sits just under the role. */
const Specialty = styled.p`
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0 0;
  padding: 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};

  &::before {
    content: '';
    display: inline-block;
    width: 2px;
    height: 14px;
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 1px;
  }
`;

const Name = styled.h3`
  font-family: ${({ theme }) => theme.fonts.heading};
  font-weight: 500;
  letter-spacing: -0.015em;
  font-size: 22px;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
`;

const Bio = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 15px;
  line-height: 1.65;
  margin: 0;
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

        <Grid>
          {dict.doctors.map((d, i) => (
            <FadeIn key={i} delay={i * 100}>
              <Card>
                <Portrait>
                  <Image
                    src={d.image}
                    alt={d.name}
                    fill
                    sizes="(min-width: 768px) 33vw, 100vw"
                  />
                  <CredentialBlock>
                    <Role>{d.role}</Role>
                    <Specialty>{d.specialty}</Specialty>
                  </CredentialBlock>
                </Portrait>
                <div>
                  <Name>{d.name}</Name>
                  <Bio>{d.bio}</Bio>
                </div>
              </Card>
            </FadeIn>
          ))}
        </Grid>
      </SectionInner>
    </Wrap>
  );
}
