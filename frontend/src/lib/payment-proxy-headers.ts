import type { NextRequest } from 'next/server';

/** Forward patient Bearer token to the Nest API for payment routes. */
export function paymentProxyHeaders(req: NextRequest): HeadersInit {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const auth = req.headers.get('authorization');
  if (auth) headers.Authorization = auth;
  return headers;
}
