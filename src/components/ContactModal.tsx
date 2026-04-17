'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { mq } from '@/styles/theme';
import { trackEvent } from '@/lib/tracking';
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from '@/lib/whatsapp';
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
  closeLabel?: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  labels: ContactModalLabels;
  locale: Locale;
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
  max-width: 460px;
  padding: 28px 24px 24px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadow.md};
  animation: ${slideIn} 200ms cubic-bezier(0.2, 0.8, 0.2, 1);

  ${mq.md} {
    padding: 36px 32px 32px;
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
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
  font-family: ${({ theme }) => theme.fonts.display};
  font-weight: 400;
  font-style: italic;
  letter-spacing: -0.01em;
  font-size: clamp(24px, 4vw, 32px);
  color: ${({ theme }) => theme.colors.text};
`;

const Subtitle = styled.p`
  margin-top: 6px;
  font-size: 14px;
  line-height: 1.55;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Form = styled.form`
  margin-top: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Input = styled.input`
  padding: 12px 14px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 15px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  letter-spacing: 0;
  text-transform: none;
  transition: border-color 0.15s, background 0.15s;
  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.7;
  }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const ErrorText = styled.span`
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0;
  text-transform: none;
  color: ${({ theme }) => theme.colors.primary};
`;

const Submit = styled.button<{ $disabled?: boolean }>`
  margin-top: 6px;
  padding: 14px 20px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  transition: background 0.15s, transform 0.15s;
  opacity: ${({ $disabled }) => ($disabled ? 0.55 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
  &:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-1px);
  }
`;

const Agreement = styled.p`
  margin-top: 10px;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 11px;
  line-height: 1.55;
  text-align: center;
`;

export function ContactModal({ open, onClose, labels, locale }: Props) {
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

    trackEvent('lead_submit', { locale, source: 'contact_modal' });

    const message = [
      labels.waIntro,
      '',
      `• ${labels.nameLabel}: ${name}`,
      `• ${labels.phoneLabel}: ${phone}`,
    ].join('\n');

    const url = buildWhatsAppUrl({
      phoneNumber: WHATSAPP_NUMBER,
      message,
    });

    window.open(url, '_blank', 'noopener,noreferrer');
    window.setTimeout(() => {
      window.location.href = url;
    }, 400);
  }

  const disabled = !name.trim() || !phone.trim();

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
            {labels.submit}
          </Submit>
        </Form>

        <Agreement>{labels.agreement}</Agreement>
      </Modal>
    </Backdrop>
  );
}
