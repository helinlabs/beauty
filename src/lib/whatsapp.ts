/**
 * Build a wa.me deep link with a prefilled message.
 * All numbers should be in international format, digits only.
 */
export function buildWhatsAppUrl(params: {
  phoneNumber: string;
  message: string;
}): string {
  const num = params.phoneNumber.replace(/\D/g, '');
  const text = encodeURIComponent(params.message);
  return `https://wa.me/${num}?text=${text}`;
}

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '821012345678';
