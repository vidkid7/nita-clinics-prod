import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const response = await fetch(`${backendUrl}/api/v1/payments/callback/esewa`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ data: body.data, reference: body.reference }),
  });
  const payload = await response.json();
  return NextResponse.json(
    { verified: payload?.status === 'success', reference: payload?.reference || payload?.id },
    { status: response.status }
  );
}

