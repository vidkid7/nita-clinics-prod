'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function KhaltiCallbackContent() {
  const params = useSearchParams();
  const pidx = params.get('pidx');
  const reference = params.get('purchase_order_id') || params.get('reference') || '';
  const [verified, setVerified] = useState<boolean | null>(null);

  useEffect(() => {
    const verify = async () => {
      if (!pidx || !reference) return;
      const res = await fetch('/api/payment/khalti/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pidx, reference }),
      });
      const json = await res.json();
      setVerified(Boolean(json?.verified));
    };
    verify();
  }, [pidx, reference]);

  return (
    <main className="container-custom py-16 text-center">
      <h1 className="text-3xl font-heading font-bold mb-4">Khalti Payment Status</h1>
      {verified === null ? (
        <p>Verifying payment...</p>
      ) : verified ? (
        <p className="text-green-700 font-semibold">Payment completed successfully.</p>
      ) : (
        <p className="text-red-700 font-semibold">Payment could not be verified.</p>
      )}
      <div className="mt-6">
        <Link href="/" className="btn-primary">Go Home</Link>
      </div>
    </main>
  );
}

export default function KhaltiCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <KhaltiCallbackContent />
    </Suspense>
  );
}

