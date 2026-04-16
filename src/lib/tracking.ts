'use client';

/**
 * Lightweight first-touch UTM/referral capture.
 * Stores the first set of marketing params in sessionStorage so we can
 * include them in the WhatsApp message when the user converts.
 */

const KEY = 'glowlist_attribution_v1';
const UTM_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
] as const;

export type Attribution = {
  ref?: string; // influencer slug
  procedure?: string; // procedure slug
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  landingPath?: string;
  capturedAt?: string;
};

export function captureAttribution(search: string, pathname: string): Attribution {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(search);

  const incoming: Attribution = {
    ref: params.get('ref') ?? undefined,
    procedure: params.get('p') ?? undefined,
    landingPath: pathname,
    capturedAt: new Date().toISOString(),
  };
  for (const k of UTM_KEYS) {
    const v = params.get(k);
    if (v) (incoming as Record<string, string>)[k] = v;
  }

  const existing = readAttribution();
  // First-touch attribution: keep original unless no attribution yet.
  const merged: Attribution = existing && Object.keys(existing).length > 2 ? existing : incoming;

  try {
    sessionStorage.setItem(KEY, JSON.stringify(merged));
  } catch {}

  // Push to dataLayer for GA4 / Meta Pixel routers.
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event: 'attribution_captured', ...merged });

  return merged;
}

export function readAttribution(): Attribution {
  if (typeof window === 'undefined') return {};
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

export function trackEvent(
  event: string,
  payload: Record<string, unknown> = {}
) {
  if (typeof window === 'undefined') return;
  const w = window as unknown as { dataLayer?: Record<string, unknown>[] };
  w.dataLayer = w.dataLayer ?? [];
  w.dataLayer.push({ event, ...payload });
}
