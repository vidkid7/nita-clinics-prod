'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

function FonepayCallbackContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState('Processing payment...');

  useEffect(() => {
    async function verifyPayment() {
      // Collect all Fonepay callback params
      const callbackData: Record<string, string> = {};
      const fields = ['PRN', 'PID', 'PS', 'RC', 'DV', 'UID', 'BC', 'INI', 'P_AMT', 'R_AMT'];
      for (const field of fields) {
        const value = params.get(field);
        if (value) callbackData[field] = value;
      }

      const reference = callbackData.PRN;
      if (!reference) {
        setStatus('Invalid callback: missing payment reference');
        setTimeout(() => router.replace('/payment/fonepay/failure'), 2000);
        return;
      }

      // Also pass the reference field for the payment service
      callbackData.reference = reference;

      try {
        // Send ALL callback data to backend for DV verification
        const response = await axios.post(
          `${API_URL}/payments/callback/fonepay`,
          callbackData,
        );

        if (response.data?.status === 'SUCCESS') {
          router.replace(`/payment/fonepay/success?ref=${encodeURIComponent(reference)}`);
        } else {
          setStatus(`Payment verification failed: ${response.data?.errorMessage || 'Unknown error'}`);
          setTimeout(() => router.replace('/payment/fonepay/failure'), 3000);
        }
      } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : 'Verification error';
        setStatus(`Payment verification failed: ${msg}`);
        setTimeout(() => router.replace('/payment/fonepay/failure'), 3000);
      }
    }

    verifyPayment();
  }, [params, router]);

  return (
    <div className="container-custom py-16 text-center">
      <div className="animate-pulse">{status}</div>
    </div>
  );
}

export default function FonepayCallbackPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <FonepayCallbackContent />
    </Suspense>
  );
}

