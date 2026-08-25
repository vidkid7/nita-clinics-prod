import { NextRequest, NextResponse } from 'next/server';
import { paymentProxyHeaders } from '@/lib/payment-proxy-headers';

const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const rawPurpose = body.purpose || 'package';
  const purpose =
    rawPurpose === 'cart' || rawPurpose === 'test' ? 'lab_test' : rawPurpose;
  const response = await fetch(`${backendUrl}/api/v1/payments/initiate`, {
    method: 'POST',
    headers: paymentProxyHeaders(req),
    body: JSON.stringify({
      ...body,
      gateway: 'fonepay',
      purpose,
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/payment/fonepay/success`,
      failureUrl: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'}/payment/fonepay/failure`,
    }),
  });

  const data = await response.json();
  return NextResponse.json(data, { status: response.status });
}

