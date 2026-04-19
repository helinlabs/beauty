'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { mq } from '@/styles/theme';
import { trackEvent } from '@/lib/tracking';
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from '@/lib/whatsapp';
import { submitLeadToAdmin } from '@/lib/submit-lead';
import type { Locale } from '@/i18n/config';

export interface ContactModalLabels {
  title: string;
  subtitle: string;
  nameLabel: string;
  namePlaceholder: string;
  phoneLabel: string;
  phonePlaceholder: string;
  submit: string;
  errorName: string;
  errorPhone: string;
  agreement: string;
  waIntro: string;
  /** Label shown on the left of the referred-by chip. Defaults to
   *  "Referred by" / "소개인" if not provided. */
  referredByLabel?: string;
  closeLabel?: string;
}

export interface ContactModalReferrer {
  /** Display name — e.g. "Kylie Jenner". */
  name: string;
  /** Instagram handle without the "@" — e.g. "kyliejenner". */
  handle: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  labels: ContactModalLabels;
  locale: Locale;
  /** Optional — when present, renders a non-interactive chip at the
   *  top of the form showing the influencer who referred the visitor.
   *  Also appended to the WhatsApp message so the clinic knows the
   *  referral source. */
  referrer?: ContactModalReferrer | null;
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(12px) scale(0.98); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
`;

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(27, 26, 23, 0.45);
  backdrop-filter: blur(6px);
  animation: ${fadeIn} 180ms ease-out;
`;

const Modal = styled.div`
  position: relative;
  width: 100%;
  max-width: 520px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  padding: 44px 24px 28px;
  border-radius: 24px;
  background: ${({ theme }) => theme.colors.bg};
  box-shadow: 0 24px 60px rgba(27, 26, 23, 0.22);
  animation: ${slideIn} 200ms cubic-bezier(0.2, 0.8, 0.2, 1);

  ${mq.md} {
    padding: 56px 40px 32px;
    border-radius: 28px;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textMuted};
  transition: background 0.15s, color 0.15s;
  &:hover {
    background: ${({ theme }) => theme.colors.surfaceAlt};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const Title = styled.h2`
  margin: 0;
  font-family: var(--font-garamond), Georgia, serif;
  font-weight: 400;
  font-style: normal;
  letter-spacing: -0.01em;
  line-height: 1.1;
  font-size: clamp(30px, 4.6vw, 44px);
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
`;

const Subtitle = styled.p`
  margin: 10px auto 0;
  max-width: 36ch;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textMuted};
  text-align: center;

  ${mq.md} {
    font-size: 15px;
  }
`;

/* Non-interactive referral chip — dashed border reinforces that it's
 * metadata (display-only), not a field the user edits or taps. */
const ReferredBy = styled.div`
  margin-top: 28px;
  padding: 16px 20px;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  cursor: default;
  user-select: none;
  background: transparent;
`;

const ReferredLabel = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const ReferredValue = styled.span`
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  text-align: right;

  ${mq.md} {
    font-size: 15px;
  }
`;

const Form = styled.form`
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
`;

const Input = styled.input`
  padding: 16px 18px;
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid transparent;
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: 0;
  transition: border-color 0.15s, background 0.15s;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: 500;
    opacity: 0.6;
  }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.text};
  }
`;

const ErrorText = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.primary};
`;

const Submit = styled.button<{ $disabled?: boolean }>`
  margin-top: 12px;
  padding: 18px 20px;
  border-radius: 999px;
  background: ${({ theme }) => theme.colors.text};
  color: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  font-family: ${({ theme }) => theme.fonts.body};
  font-weight: 600;
  font-size: 16px;
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
  opacity: ${({ $disabled }) => ($disabled ? 0.55 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 28px rgba(27, 26, 23, 0.22);
  }

  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
`;

const Agreement = styled.p`
  margin-top: 14px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-family: ${({ theme }) => theme.fonts.body};
  font-size: 13px;
  line-height: 1.55;
  text-align: center;
`;

function WhatsAppGlyph() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.3 5.2 4.6 2.6 1 3.1.8 3.7.8.6-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.1-.3-.2-.6-.4zM12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3C4.2 14.8 3.8 13.4 3.8 12c0-4.5 3.7-8.2 8.2-8.2s8.2 3.7 8.2 8.2-3.7 8-8.2 8z" />
    </svg>
  );
}

export function ContactModal({ open, onClose, labels, locale, referrer }: Props) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const nameRef = useRef<HTMLInputElement>(null);

  // Focus first input + lock body scroll while open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => nameRef.current?.focus(), 60);
    return () => {
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  function submit(e: FormEvent) {
    e.preventDefault();
    const next: typeof errors = {};
    if (!name.trim()) next.name = labels.errorName;
    if (!phone.trim()) next.phone = labels.errorPhone;
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    trackEvent('lead_submit', {
      locale,
      source: 'contact_modal',
      referrer: referrer?.handle,
    });

    // Push a pending "consultation" row into the admin's local store so
    // the team sees the request the next time they open the dashboard.
    submitLeadToAdmin({
      name,
      phone,
      language: locale === 'ko' ? 'en' : 'en',
      referrerName: referrer?.name,
    });

    const lines = [
      labels.waIntro,
      '',
      `• ${labels.nameLabel}: ${name}`,
      `• ${labels.phoneLabel}: ${phone}`,
    ];
    if (referrer) {
      lines.push(
        `• ${labels.referredByLabel ?? 'Referred by'}: ${referrer.name} (@${referrer.handle})`,
      );
    }

    const url = buildWhatsAppUrl({
      phoneNumber: WHATSAPP_NUMBER,
      message: lines.join('\n'),
    });

    window.open(url, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => {
      window.location.href = url;
    }, 400);
  }

  const disabled = !name.trim() || !phone.trim();
  const referredByLabel = labels.referredByLabel ?? 'Referred by';

  return (
    <Backdrop
      role="dialog"
      aria-modal="true"
      aria-label={labels.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <Modal>
        <CloseBtn
          type="button"
          aria-label={labels.closeLabel ?? 'Close'}
          onClick={onClose}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6 6l12 12M6 18L18 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </CloseBtn>

        <Title>{labels.title}</Title>
        <Subtitle>{labels.subtitle}</Subtitle>

        {referrer && (
          <ReferredBy aria-label={referredByLabel}>
            <ReferredLabel>{referredByLabel}</ReferredLabel>
            <ReferredValue>{referrer.name}</ReferredValue>
          </ReferredBy>
        )}

        <Form onSubmit={submit} noValidate>
          <Field>
            {labels.nameLabel}
            <Input
              ref={nameRef}
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={labels.namePlaceholder}
              autoComplete="name"
              required
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </Field>

          <Field>
            {labels.phoneLabel}
            <Input
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={labels.phonePlaceholder}
              autoComplete="tel"
              required
            />
            {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
          </Field>

          <Submit type="submit" $disabled={disabled}>
            <WhatsAppGlyph />
            {labels.submit}
          </Submit>
        </Form>

        <Agreement>{labels.agreement}</Agreement>
      </Modal>
    </Backdrop>
  );
}
