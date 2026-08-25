'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect } from 'react';
import { clearCart } from '@/lib/cart';

function DemoSuccessContent() {
  const params = useSearchParams();
  const reference = params.get('reference') || '';

  useEffect(() => {
    try {
      clearCart();
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <main className="container-custom py-16 text-center max-w-lg mx-auto">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-amber-900 text-sm font-medium mb-6 inline-block">
        Demo payment (development)
      </div>
      <h1 className="text-3xl font-heading font-bold mb-4 text-neutral-900">Payment successful</h1>
      <p className="text-neutral-600 mb-2">
        Your test payment was recorded successfully. Lab orders and payment history will update like a real
        payment.
      </p>
      {reference && (
        <p className="text-sm text-neutral-500 mb-8 font-mono break-all">Reference: {reference}</p>
      )}
      <div className="flex flex-wrap gap-3 justify-center">
        <Link href="/patients/dashboard" className="btn-primary">
          Patient dashboard
        </Link>
        <Link href="/" className="btn btn-ghost border border-neutral-200">
          Home
        </Link>
      </div>
    </main>
  );
}

export default function DemoPaymentSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <DemoSuccessContent />
    </Suspense>
  );
}
