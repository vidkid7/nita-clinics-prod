import { NextRequest, NextResponse } from 'next/server';
import { paymentProxyHeaders } from '@/lib/payment-proxy-headers';

const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const response = await fetch(`${backendUrl}/api/v1/payments/demo-complete`, {
    method: 'POST',
    headers: paymentProxyHeaders(req),
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));
  return NextResponse.json(data, { status: response.status });
}
