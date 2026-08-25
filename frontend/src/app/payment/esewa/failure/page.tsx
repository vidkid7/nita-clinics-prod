import Link from 'next/link';

export default function EsewaFailurePage() {
  return (
    <main className="container-custom py-16 text-center">
      <h1 className="text-3xl font-heading font-bold mb-4">eSewa Payment Failed</h1>
      <p className="text-neutral-600">Your payment was not completed. Please try again.</p>
      <div className="mt-6 flex items-center justify-center gap-3">
        <Link href="/payment/checkout" className="btn-primary">Try Again</Link>
        <Link href="/" className="btn-secondary">Go Home</Link>
      </div>
    </main>
  );
}

