'use client';

import { FormEvent, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useSearchParams } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { influencers } from '@/data/influencers';
import { procedures } from '@/data/procedures';
import { readAttribution, trackEvent } from '@/lib/tracking';
import { buildWhatsAppUrl, WHATSAPP_NUMBER } from '@/lib/whatsapp';
import { mq } from '@/styles/theme';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  ${mq.md} { padding: 32px; }
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 13px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textMuted};
`;

const Input = styled.input`
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.text};
  transition: border-color 0.2s, background 0.2s;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textMuted};
    opacity: 0.7;
  }
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ContextBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 14px 16px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.surfaceAlt};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  font-size: 13px;

  span.row {
    display: flex;
    justify-content: space-between;
    gap: 16px;
    color: ${({ theme }) => theme.colors.textMuted};
  }
  span.row strong {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 700;
  }
`;

const Submit = styled.button<{ $disabled?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  border-radius: ${({ theme }) => theme.radius.pill};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  transition: background 0.2s, transform 0.2s;
  opacity: ${({ $disabled }) => ($disabled ? 0.55 : 1)};
  pointer-events: ${({ $disabled }) => ($disabled ? 'none' : 'auto')};
  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; transform: translateY(-1px); }
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-size: 13px;
  font-weight: 600;
`;

const Agreement = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 12px;
  text-align: center;
`;

type Labels = {
  name: string;
  namePh: string;
  phone: string;
  phonePh: string;
  selectedInfluencer: string;
  selectedProcedure: string;
  submit: string;
  errorName: string;
  errorPhone: string;
  agreement: string;
  waIntro: string;
};

type Props = {
  locale: Locale;
  labels: Labels;
  /** Optional hard-coded context (from procedure/influencer page). */
  influencerSlug?: string;
  procedureSlug?: string;
};

export function BookingForm({ locale, labels, influencerSlug, procedureSlug }: Props) {
  const search = useSearchParams();

  // Resolve context: explicit props > URL params > attribution storage
  const ctxInfluencer =
    influencerSlug ?? search?.get('ref') ?? readAttribution().ref;
  const ctxProcedure =
    procedureSlug ?? search?.get('p') ?? readAttribution().procedure;

  const influencer = useMemo(
    () => (ctxInfluencer ? influencers.find((i) => i.slug === ctxInfluencer) : null),
    [ctxInfluencer]
  );
  const procedure = useMemo(
    () => (ctxProcedure ? procedures.find((p) => p.slug === ctxProcedure) : null),
    [ctxProcedure]
  );

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const buildMessage = () => {
    const attribution = readAttribution();
    const lines = [
      labels.waIntro,
      '',
      `• ${labels.name}: ${name}`,
      `• ${labels.phone}: ${phone}`,
    ];
    if (procedure) lines.push(`• ${labels.selectedProcedure}: ${procedure.name[locale]}`);
    if (influencer)
      lines.push(`• ${labels.selectedInfluencer}: ${influencer.name[locale]} (@${influencer.handle})`);
    // Silent attribution for ops: helps trace where this lead came from.
    const src = attribution.utm_source;
    const campaign = attribution.utm_campaign;
    if (src || campaign) {
      lines.push('', `— src:${src ?? '-'} / campaign:${campaign ?? '-'}`);
    }
    return lines.join('\n');
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const nextErrors: typeof errors = {};
    if (!name.trim()) nextErrors.name = labels.errorName;
    if (!phone.trim()) nextErrors.phone = labels.errorPhone;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setSubmitting(true);
    trackEvent('lead_submit', {
      procedure: ctxProcedure,
      influencer: ctxInfluencer,
      locale,
    });

    const url = buildWhatsAppUrl({
      phoneNumber: WHATSAPP_NUMBER,
      message: buildMessage(),
    });

    // Open WhatsApp in a new tab so the user's browsing history is preserved.
    window.open(url, '_blank', 'noopener,noreferrer');
    // Fallback: if popups blocked, navigate same-tab.
    setTimeout(() => {
      window.location.href = url;
    }, 400);
  };

  const disabled = submitting || !name.trim() || !phone.trim();

  return (
    <Form onSubmit={onSubmit} noValidate>
      {(influencer || procedure) && (
        <ContextBox>
          {procedure && (
            <span className="row">
              <span>{labels.selectedProcedure}</span>
              <strong>{procedure.name[locale]}</strong>
            </span>
          )}
          {influencer && (
            <span className="row">
              <span>{labels.selectedInfluencer}</span>
              <strong>
                {influencer.name[locale]} · @{influencer.handle}
              </strong>
            </span>
          )}
        </ContextBox>
      )}

      <Field>
        {labels.name}
        <Input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={labels.namePh}
          autoComplete="name"
          required
        />
        {errors.name && <ErrorText>{errors.name}</ErrorText>}
      </Field>

      <Field>
        {labels.phone}
        <Input
          type="tel"
          inputMode="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={labels.phonePh}
          autoComplete="tel"
          required
        />
        {errors.phone && <ErrorText>{errors.phone}</ErrorText>}
      </Field>

      <Submit type="submit" $disabled={disabled}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M20.52 3.48A11.8 11.8 0 0 0 12 0a12 12 0 0 0-10.4 18L0 24l6.2-1.6A12 12 0 1 0 20.52 3.48Zm-8.5 18.4a9.9 9.9 0 0 1-5-1.37l-.36-.22-3.67.96.98-3.58-.23-.37A9.94 9.94 0 1 1 22 12a9.94 9.94 0 0 1-9.98 9.88Zm5.47-7.43c-.3-.15-1.78-.88-2.05-.98s-.47-.15-.67.15-.77.97-.94 1.17-.35.22-.65.07a8.2 8.2 0 0 1-2.42-1.49 9.18 9.18 0 0 1-1.68-2.1c-.17-.3 0-.46.13-.6s.3-.35.45-.52.2-.3.3-.5.05-.37 0-.52-.67-1.6-.92-2.2c-.24-.58-.48-.5-.66-.51h-.57a1.1 1.1 0 0 0-.8.37 3.34 3.34 0 0 0-1.04 2.48 5.78 5.78 0 0 0 1.22 3.08 13.28 13.28 0 0 0 5.1 4.51c.72.3 1.28.49 1.72.63a4.15 4.15 0 0 0 1.9.12 3.1 3.1 0 0 0 2.04-1.44 2.54 2.54 0 0 0 .17-1.44c-.07-.13-.27-.2-.57-.35Z" />
        </svg>
        {labels.submit}
      </Submit>

      <Agreement>{labels.agreement}</Agreement>
    </Form>
  );
}
