'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';

function EsewaSuccessContent() {
  const params = useSearchParams();
  const data = params.get('data');
  const [verified, setVerified] = useState<boolean | null>(null);
  const [reference, setReference] = useState<string>('');

  useEffect(() => {
    const verify = async () => {
      if (!data) return;
      const res = await fetch('/api/payment/esewa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data }),
      });
      const json = await res.json();
      setVerified(Boolean(json?.verified));
      setReference(json?.reference || '');
    };
    verify();
  }, [data]);

  return (
    <main className="container-custom py-16 text-center">
      <h1 className="text-3xl font-heading font-bold mb-4">eSewa Payment Status</h1>
      {verified === null ? (
        <p>Verifying payment...</p>
      ) : verified ? (
        <>
          <p className="text-green-700 font-semibold">Payment successful</p>
          {reference && <p className="text-neutral-600 mt-1">Reference: {reference}</p>}
        </>
      ) : (
        <p className="text-red-700 font-semibold">Payment verification failed</p>
      )}
      <div className="mt-6">
        <Link href="/" className="btn-primary">Go Home</Link>
      </div>
    </main>
  );
}

export default function EsewaSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <EsewaSuccessContent />
    </Suspense>
  );
}

