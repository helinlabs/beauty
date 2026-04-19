'use client';

import Image from 'next/image';
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import styled from 'styled-components';
import type { Locale } from '@/i18n/config';
import type { Influencer } from '@/data/influencers';
import type { Procedure, ProcedureCategory } from '@/data/procedures';
import { formatFollowers } from '@/lib/format';
import { mq } from '@/styles/theme';
import {
  ContactModal,
  type ContactModalLabels,
} from '@/components/ContactModal';

/* Split view: left pane is a sticky 100vh video column; right pane
 * scrolls the document body. Using position: sticky (not fixed) so the
 * left stops sticking once the shell ends, letting the site footer flow
 * naturally below both columns. */
const Shell = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  ${mq.md} {
    flex-direction: row;
    align-items: flex-start;
  }
`;

/* The pane itself uses the page's cream background so the margin around
 * the rounded video frame blends into the rest of the page. Top padding
 * clears the fixed Header (~74px tall on desktop, ~64px mobile) so the
 * frame never slides under it. */
const LeftPane = styled.div`
  width: 100%;
  height: 100vh;
  /* On mobile the frame runs right to the pane bottom so the tagline
     below tucks in flush. Desktop restores generous bottom padding so
     the rounded frame clears the floating CTA that sits in the right
     column's gutter. */
  padding: 84px 16px 16px;
  box-sizing: border-box;
  background: ${({ theme }) => theme.colors.bg};

  ${mq.md} {
    width: 50vw;
    height: 100vh;
    padding: 88px 24px 28px 28px;
    position: sticky;
    top: 0;
    flex-shrink: 0;
  }
`;

/* The video/image lives inside this 40px-radius frame; the LeftPane
 * padding controls the visible cream margin around it. */
const VideoFrame = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 28px;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceAlt};

  ${mq.md} {
    border-radius: 40px;
  }
`;

const LoopVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

/* Fallback when no video is available — use thumbnail photo. */
const LeftFallback = styled.div`
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
`;

const RightPane = styled.div`
  flex: 1;
  min-width: 0;
  /* Mobile keeps the tagline tucked right under the video frame (tiny
     top padding). Big bottom padding so content never hides behind the
     floating CTA. */
  padding: 16px 24px 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;

  ${mq.md} {
    min-height: 100vh;
    padding: 140px 48px 160px;
  }

  ${mq.lg} {
    padding: 160px 72px 180px;
  }
`;

/* Service tagline — single line above the avatar that tells first-time
 * visitors what Seoul Glow actually is (a clinic booking bridge, not a
 * blog or a clinic page). Editorial treatment: a tiny live-dot, the
 * brand set in the header's EB Garamond italic, then the service copy
 * in a neutral sans. Keeps the composition quiet but unambiguous. */
const ServiceTagline = styled.p`
  margin: 0 0 56px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.02em;
  line-height: 1.35;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;

  ${mq.md} {
    font-size: 14px;
    margin-bottom: 36px;
  }
`;

const LiveDot = styled.span`
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #25d366;
  box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.18);
  flex-shrink: 0;
`;

const TaglineBrand = styled.span`
  font-family: var(--font-serif), Georgia, serif;
  font-weight: 500;
  font-style: italic;
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  margin-right: 2px;

  ${mq.md} {
    font-size: 17px;
  }
`;

const AvatarPhoto = styled.div`
  width: 140px;
  height: 140px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};

  ${mq.md} {
    width: 160px;
    height: 160px;
  }

  img {
    object-fit: cover;
  }
`;

const AvatarFallback = styled.div<{ $gradient: string }>`
  width: 100%;
  height: 100%;
  background: ${({ $gradient }) => $gradient};
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: var(--font-garamond), Georgia, serif;
  font-size: 48px;
`;

const NameRow = styled.div`
  margin-top: 28px;
  display: inline-flex;
  align-items: center;
  gap: 10px;
`;

const Name = styled.h1`
  margin: 0;
  font-family: var(--font-serif), Georgia, serif;
  font-weight: 400;
  font-style: italic;
  font-size: clamp(28px, 3.2vw, 40px);
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
`;

const VerifiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #1d9bf0;

  svg {
    width: 22px;
    height: 22px;
  }
`;

const Followers = styled.p`
  margin: 8px 0 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Quote = styled.blockquote`
  margin: 36px 0 0;
  padding: 0;
  font-family: var(--font-garamond), Georgia, serif;
  font-weight: 400;
  font-size: clamp(20px, 2.1vw, 28px);
  line-height: 1.4;
  color: ${({ theme }) => theme.colors.textMuted};
  max-width: 36ch;
`;

const Highlighted = styled.strong`
  font-family: inherit;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

/* Non-interactive hashtag row shown under the quote. Plain spans (not
 * links) + cursor:default so the treatment labels read as metadata, not
 * clickable filters. */
const TagRow = styled.div`
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
`;

const Tag = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: default;
  user-select: none;
`;

const Pair = styled.div`
  margin-top: 48px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  width: 100%;
  max-width: 520px;

  ${mq.md} {
    margin-top: 64px;
    gap: 18px;
  }
`;

const PairCol = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`;

const PairLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Frame = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 4 / 5;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.border};

  img {
    object-fit: cover;
  }
`;

/* Mobile-only soft backdrop behind the floating CTA + subcopy. Fills
 * the viewport bottom with a cream-tinted blur that fades to transparent
 * toward the top so the CTA group always reads cleanly against the
 * scrolling content underneath. Desktop doesn't need it — the CTA sits
 * within the quieter right-column gutter. */
const MobileCtaBackdrop = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 150px;
  z-index: 19;
  pointer-events: none;
  background: linear-gradient(
    to top,
    ${({ theme }) => theme.colors.bg} 0%,
    rgba(251, 247, 241, 0.88) 55%,
    rgba(251, 247, 241, 0) 100%
  );
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  /* Mask fades the blur itself from solid at the bottom to none at the
     top, so there's no hard edge where the blurred region ends. */
  -webkit-mask-image: linear-gradient(
    to top,
    #000 0%,
    #000 45%,
    transparent 100%
  );
  mask-image: linear-gradient(
    to top,
    #000 0%,
    #000 45%,
    transparent 100%
  );

  ${mq.md} {
    display: none;
  }
`;

/* The CTA + its reassurance line float at the bottom of the viewport,
 * centered horizontally within the right column on desktop and within
 * the whole viewport on mobile. RightPane's large bottom padding keeps
 * content from hiding behind this block. */
const FloatingCtaWrap = styled.div`
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  pointer-events: none;

  ${mq.md} {
    left: 75%;
    bottom: 44px;
  }

  /* Re-enable pointer events on the CTA itself; the wrapper stays
     non-interactive so clicks on its transparent bounds fall through
     to the content below. Covers both <button> and <a> so changes to
     the CTA element type don't silently break clicks. */
  button,
  a {
    pointer-events: auto;
  }
`;

const FloatingCTA = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 36px;
  border: none;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.text};
  color: #fff;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadow.md};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 12px 36px rgba(27, 26, 23, 0.2);
  }

  ${mq.md} {
    /* min-width targets ~1.5× the mobile rendered width (~172 → 258). */
    min-width: 258px;
    padding: 18px 36px;
    font-size: 17px;
  }
`;

/* Reassurance microcopy — clarifies the CTA opens a WhatsApp thread
 * (not a phone call, not a long form) and that replies are fast +
 * free. The WhatsApp glyph makes the channel legible at a glance. */
const CtaSub = styled.p`
  margin: 0;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.01em;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
  white-space: nowrap;
  text-shadow: 0 1px 2px rgba(251, 247, 241, 0.9);

  svg {
    width: 14px;
    height: 14px;
    color: #25d366;
    flex-shrink: 0;
  }

  ${mq.md} {
    font-size: 13px;

    svg {
      width: 15px;
      height: 15px;
    }
  }
`;

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6 2.6 1 3.1.8 3.7.8.6-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3C4.2 14.8 3.8 13.4 3.8 12c0-4.5 3.7-8.2 8.2-8.2s8.2 3.7 8.2 8.2-3.7 8-8.2 8z" />
    </svg>
  );
}

/* Trust section — sits between the Before/After pair and How it works.
 * Introduces the partner clinic + one featured doctor, plus a 4-up
 * stat strip. Stays within the right column so the sticky video keeps
 * pinning through it. */
const TrustWrap = styled.section`
  align-self: stretch;
  margin: 96px 0 0;
  padding: 0;
  text-align: center;

  ${mq.md} {
    margin: 160px 0 0;
  }
`;

const TrustEyebrow = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ClinicName = styled.h2`
  margin: 12px 0 0;
  font-family: var(--font-garamond), Georgia, serif;
  font-weight: 400;
  font-style: normal;
  letter-spacing: -0.01em;
  line-height: 1.08;
  font-size: clamp(32px, 4.2vw, 48px);
  color: ${({ theme }) => theme.colors.text};
`;

const InfoRow = styled.ul`
  list-style: none;
  padding: 0;
  margin: 18px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textMuted};

  li {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }

  svg {
    width: 14px;
    height: 14px;
    color: ${({ theme }) => theme.colors.text};
  }

  ${mq.md} {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px 20px;
    font-size: 14px;
  }
`;

const DoctorCard = styled.figure`
  margin: 32px auto 0;
  max-width: 280px;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${mq.md} {
    margin: 40px auto 0;
    max-width: 320px;
  }
`;

const DoctorPortrait = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surfaceAlt};

  img {
    object-fit: cover;
  }
`;

const DoctorMeta = styled.figcaption`
  margin-top: 14px;
  text-align: center;
`;

const DoctorRole = styled.p`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const DoctorName = styled.p`
  margin: 4px 0 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};

  ${mq.md} {
    font-size: 20px;
  }
`;

const StatsGrid = styled.dl`
  margin: 40px 0 0;
  padding: 28px 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px 12px;

  ${mq.md} {
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 32px 0;
  }
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`;

const StatValue = styled.dt`
  font-family: var(--font-garamond), Georgia, serif;
  font-weight: 400;
  font-size: clamp(28px, 3.4vw, 38px);
  line-height: 1;
  color: ${({ theme }) => theme.colors.text};
`;

const StatLabel = styled.dd`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;
`;

/* FAQ — sits after How it works inside RightPane. Reuses the landing
 * FAQ copy (questions about safety, language, aftercare, etc.) via the
 * shared `landing.faq.items` dictionary. Accordion via <details>. */
const FaqWrap = styled.section`
  align-self: stretch;
  margin: 96px 0 0;
  padding: 0;
  text-align: center;

  ${mq.md} {
    margin: 160px 0 0;
  }
`;

const FaqTitle = styled.h2`
  margin: 0;
  font-family: var(--font-garamond), Georgia, serif;
  font-weight: 400;
  font-style: normal;
  letter-spacing: -0.015em;
  line-height: 1.08;
  font-size: clamp(32px, 4.2vw, 48px);
  color: ${({ theme }) => theme.colors.text};
`;

const FaqList = styled.div`
  margin: 32px auto 0;
  max-width: 640px;
  display: flex;
  flex-direction: column;
  gap: 0;
  text-align: left;

  ${mq.md} {
    margin-top: 48px;
  }
`;

const FaqItem = styled.details`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &[open] summary::after {
    transform: rotate(45deg);
  }
  &[open] > div {
    opacity: 1;
    max-height: 600px;
    padding: 0 4px 22px;
  }
`;

const FaqSummary = styled.summary`
  list-style: none;
  cursor: pointer;
  padding: 22px 4px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 500;
  font-size: 16px;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.text};
  transition: color 0.2s;

  &::-webkit-details-marker {
    display: none;
  }
  &::after {
    content: '+';
    font-family: ${({ theme }) => theme.fonts.body};
    font-weight: 400;
    font-size: 22px;
    color: ${({ theme }) => theme.colors.primary};
    transition: transform 0.25s ease;
    flex-shrink: 0;
  }
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FaqAnswer = styled.div`
  opacity: 0;
  max-height: 0;
  overflow: hidden;
  padding: 0 4px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  line-height: 1.65;
  transition: opacity 0.2s ease, max-height 0.3s ease, padding 0.2s ease;
`;

/* "How it works" section — renders INSIDE RightPane as its last child
 * so the sticky LeftPane stays pinned until this block finishes
 * scrolling. Transparent background + theme text colors so it sits on
 * the same cream page surface as the rest of the column. */
const HowWrap = styled.section`
  align-self: stretch;
  position: relative;
  margin: 120px 0 0;
  padding: 0 0 40px;

  ${mq.md} {
    margin: 200px 0 0;
    padding: 0 0 40px;
  }
`;

const HowInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HowTitle = styled.h2`
  font-family: var(--font-garamond), Georgia, serif;
  font-weight: 400;
  font-style: normal;
  letter-spacing: -0.015em;
  line-height: 1.08;
  font-size: clamp(36px, 5vw, 56px);
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin: 0 auto;
  max-width: 22ch;
`;

const HowSteps = styled.ol`
  list-style: none;
  padding: 0;
  margin: 48px 0 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 36px;
  counter-reset: step;
  position: relative;

  ${mq.md} {
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;

    /* Thin connector between the three numerals on desktop. Anchored at
       the vertical center of the 48px Numeral. */
    &::before {
      content: '';
      position: absolute;
      top: 24px;
      left: 12%;
      right: 12%;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent,
        ${({ theme }) => theme.colors.border} 15%,
        ${({ theme }) => theme.colors.border} 85%,
        transparent
      );
      pointer-events: none;
    }
  }
`;

const HowStepCard = styled.li`
  position: relative;
  counter-increment: step;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const HowNumeral = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-family: ${({ theme }) => theme.fonts.heading};
  font-style: italic;
  font-weight: 500;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 16px;

  &::before {
    content: counter(step, decimal-leading-zero);
  }
`;

const HowStepHeading = styled.h3`
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 500;
  letter-spacing: -0.015em;
  line-height: 1.2;
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;

  ${mq.md} {
    font-size: 20px;
  }
`;

const HowStepBody = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 14px;
  line-height: 1.6;
  margin-top: 8px;
  max-width: 34ch;
`;

function VerifiedCheck() {
  return (
    <svg viewBox="0 0 22 22" aria-hidden>
      <path
        fill="currentColor"
        d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.245.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
      />
    </svg>
  );
}

function renderHighlighted(text: string, phrases: string[]): ReactNode[] {
  if (!phrases.length) return [text];
  type Part = string | { h: string };
  let parts: Part[] = [text];
  for (const phrase of phrases) {
    parts = parts.flatMap((p) => {
      if (typeof p !== 'string') return [p];
      const idx = p.indexOf(phrase);
      if (idx < 0) return [p];
      const out: Part[] = [];
      if (idx > 0) out.push(p.slice(0, idx));
      out.push({ h: phrase });
      const rest = p.slice(idx + phrase.length);
      if (rest) out.push(rest);
      return out;
    });
  }
  return parts.map((p, i) =>
    typeof p === 'string' ? (
      <Fragment key={i}>{p}</Fragment>
    ) : (
      <Highlighted key={i}>{p.h}</Highlighted>
    ),
  );
}

type Props = {
  influencer: Influencer;
  locale: Locale;
  // Still accepted by the route but no longer rendered in the redesign —
  // kept so the page.tsx wiring doesn't have to change in this pass.
  procedures: Procedure[];
  dict: {
    procedureList: string;
    bookCTA: string;
    followers: string;
    procedureCountLabel: string;
    categories: Record<ProcedureCategory, string>;
    minutes: string;
    beforeLabel: string;
    afterLabel: string;
    getTheBeauty: string;
    ctaSub: string;
    serviceTagline: string;
    trust: {
      eyebrow: string;
      clinicName: string;
      address: string;
      kmaLabel: string;
      coordinatorLabel: string;
      doctorRole: string;
      doctorName: string;
      stats: { value: string; label: string }[];
    };
    howTitle: string;
    howSteps: { title: string; description: string }[];
    howCta: string;
    faq: {
      title: string;
      items: { q: string; a: string }[];
    };
  };
  modalLabels: ContactModalLabels;
};

export function InfluencerDetail({
  influencer,
  locale,
  dict,
  modalLabels,
}: Props) {
  const lang = locale as 'ko' | 'en';
  const quoteText = influencer.quote?.[lang];
  const highlights = influencer.quoteHighlight?.[lang] ?? [];
  const hasPair = !!(influencer.beforeImage && influencer.afterImage);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  /* Keep the sticky left video cheap: pause it whenever it scrolls out
   * of viewport OR the tab is backgrounded, so CPU/GPU isn't decoding a
   * frame loop that nobody can see. Resumes only when the user returns
   * and the frame is in view. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let inView = true;
    const tryPlay = () => {
      if (!document.hidden && inView) {
        video.play().catch(() => {});
      }
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (entry.isIntersecting) tryPlay();
        else video.pause();
      },
      { threshold: 0.05 },
    );
    io.observe(video);

    const onVisibility = () => {
      if (document.hidden) video.pause();
      else tryPlay();
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      io.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [influencer.video]);

  return (
    <>
    <Shell>
      <LeftPane>
        <VideoFrame>
          {influencer.video ? (
            <LoopVideo
              ref={videoRef}
              src={influencer.video}
              autoPlay
              loop
              muted
              playsInline
              /* preload="auto" fetches enough bytes to render the first
                 frame before autoplay kicks in; no poster so the profile
                 thumbnail never flashes behind the video. */
              preload="auto"
            />
          ) : influencer.thumbnail ? (
            <LeftFallback
              style={{ backgroundImage: `url(${influencer.thumbnail})` }}
            />
          ) : null}
        </VideoFrame>
      </LeftPane>

      <RightPane>
        <ServiceTagline>
          <span>
            <TaglineBrand>Seoul Glow</TaglineBrand>
            {' '}
            {dict.serviceTagline}
          </span>
        </ServiceTagline>

        <AvatarPhoto>
          {influencer.thumbnail ? (
            <Image
              src={influencer.thumbnail}
              alt={influencer.name[locale]}
              fill
              sizes="160px"
            />
          ) : (
            <AvatarFallback $gradient={influencer.avatar}>
              {influencer.name[locale].charAt(0)}
            </AvatarFallback>
          )}
        </AvatarPhoto>

        <NameRow>
          <Name>{influencer.name[locale]}</Name>
          {influencer.verified && (
            <VerifiedBadge aria-label="Verified">
              <VerifiedCheck />
            </VerifiedBadge>
          )}
        </NameRow>

        <Followers>
          {formatFollowers(influencer.followers, locale)} {dict.followers}
        </Followers>

        {quoteText && (
          <Quote>“{renderHighlighted(quoteText, highlights)}”</Quote>
        )}

        {influencer.treatmentTags && influencer.treatmentTags.length > 0 && (
          <TagRow aria-label="Treatments">
            {influencer.treatmentTags.map((t) => (
              <Tag key={t}>#{t}</Tag>
            ))}
          </TagRow>
        )}

        {hasPair && (
          <Pair>
            <PairCol>
              <PairLabel>{dict.beforeLabel}</PairLabel>
              <Frame>
                <Image
                  src={influencer.beforeImage!}
                  alt={dict.beforeLabel}
                  fill
                  sizes="(min-width: 768px) 22vw, 45vw"
                />
              </Frame>
            </PairCol>
            <PairCol>
              <PairLabel>{dict.afterLabel}</PairLabel>
              <Frame>
                <Image
                  src={influencer.afterImage!}
                  alt={dict.afterLabel}
                  fill
                  sizes="(min-width: 768px) 22vw, 45vw"
                />
              </Frame>
            </PairCol>
          </Pair>
        )}

        <TrustWrap>
          <TrustEyebrow>{dict.trust.eyebrow}</TrustEyebrow>
          <ClinicName>{dict.trust.clinicName}</ClinicName>
          <InfoRow>
            <li>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 2 4 5v6c0 5 3.5 9.5 8 11 4.5-1.5 8-6 8-11V5l-8-3Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <path
                  d="m9 12 2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {dict.trust.kmaLabel}
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.6" />
              </svg>
              {dict.trust.address}
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 7h10M9 4v3M7 10s-1.5 3.5-3 5M11 11c1 2 3 3.5 5 4.5M14 20l5-11 5 11m-9-3h8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {dict.trust.coordinatorLabel}
            </li>
          </InfoRow>

          <DoctorCard>
            <DoctorPortrait>
              <Image
                src="/images/doctors/choi-soon-woo.jpg"
                alt={dict.trust.doctorName}
                fill
                sizes="(min-width: 768px) 320px, 280px"
              />
            </DoctorPortrait>
            <DoctorMeta>
              <DoctorRole>{dict.trust.doctorRole}</DoctorRole>
              <DoctorName>{dict.trust.doctorName}</DoctorName>
            </DoctorMeta>
          </DoctorCard>

          <StatsGrid>
            {dict.trust.stats.map((s) => (
              <Stat key={s.label}>
                <StatValue>{s.value}</StatValue>
                <StatLabel>{s.label}</StatLabel>
              </Stat>
            ))}
          </StatsGrid>
        </TrustWrap>

        <HowWrap>
          <HowInner>
            <HowTitle>{dict.howTitle}</HowTitle>
            <HowSteps>
              {dict.howSteps.slice(0, 3).map((s, i) => (
                <HowStepCard key={i}>
                  <HowNumeral />
                  <HowStepHeading>{s.title}</HowStepHeading>
                  <HowStepBody>{s.description}</HowStepBody>
                </HowStepCard>
              ))}
            </HowSteps>
          </HowInner>
        </HowWrap>

        <FaqWrap>
          <FaqTitle>{dict.faq.title}</FaqTitle>
          <FaqList>
            {dict.faq.items.map((item, i) => (
              <FaqItem key={i}>
                <FaqSummary>{item.q}</FaqSummary>
                <FaqAnswer>{item.a}</FaqAnswer>
              </FaqItem>
            ))}
          </FaqList>
        </FaqWrap>
      </RightPane>
    </Shell>

    <MobileCtaBackdrop aria-hidden />
    <FloatingCtaWrap>
      <FloatingCTA type="button" onClick={() => setModalOpen(true)}>
        {dict.getTheBeauty}
      </FloatingCTA>
      <CtaSub>
        <WhatsAppIcon />
        {dict.ctaSub}
      </CtaSub>
    </FloatingCtaWrap>

    <ContactModal
      open={modalOpen}
      onClose={() => setModalOpen(false)}
      labels={modalLabels}
      locale={locale}
      referrer={{
        name: influencer.name[locale],
        handle: influencer.handle,
      }}
    />
  </>
  );
}
