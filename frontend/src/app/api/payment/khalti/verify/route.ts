import { NextRequest, NextResponse } from 'next/server';

const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export async function POST(req: NextRequest) {
  const body = await req.json();
  // Pass pidx and reference to backend; backend will call Khalti lookup API
  const response = await fetch(`${backendUrl}/api/v1/payments/callback/khalti`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pidx: body.pidx,
      purchase_order_id: body.reference,
      reference: body.reference,
    }),
  });
  const payload = await response.json();
  return NextResponse.json(
    { verified: payload?.status === 'SUCCESS' },
    { status: response.status },
  );
}

