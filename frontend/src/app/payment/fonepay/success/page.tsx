import Link from 'next/link';

export default function FonepaySuccessPage() {
  return (
    <main className="container-custom py-16 text-center">
      <h1 className="text-3xl font-heading font-bold mb-4">FonePay Payment Successful</h1>
      <p className="text-neutral-600">Your payment was completed successfully.</p>
      <div className="mt-6">
        <Link href="/" className="btn-primary">Go Home</Link>
      </div>
    </main>
  );
}

