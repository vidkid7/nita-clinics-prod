/** Normalize clinic numbers for dialing, omitting Nepal's domestic trunk zero. */
export function toTelHref(phone: string): string {
  const cleaned = phone.replace(/[^\d+]/g, '');
  if (!cleaned) return 'tel:';
  const international = cleaned.replace(/^\+?9770?/, '+977');
  if (international.startsWith('+')) return `tel:${international}`;
  if (cleaned.startsWith('0')) return `tel:+977${cleaned.slice(1)}`;
  if (/^9\d{9}$/.test(cleaned)) return `tel:+977${cleaned}`;
  return `tel:${cleaned}`;
}
