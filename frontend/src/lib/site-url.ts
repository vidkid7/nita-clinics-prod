/**
 * Railway env vars are often host-only (`app.up.railway.app`). Browsers and `new URL()` need a scheme.
 * Localhost stays on `http` when no scheme is given.
 */
export function absoluteUrl(raw: string | undefined, fallback: string): string {
  const v = raw?.trim();
  if (!v) return fallback;
  if (/^https?:\/\//i.test(v)) return v.replace(/\/$/, '');
  const host = v.replace(/^\/+/, '').replace(/\/$/, '');
  if (/^(localhost|127\.0\.0\.1)(\:|$)/i.test(host)) {
    return `http://${host}`;
  }
  return `https://${host}`;
}
