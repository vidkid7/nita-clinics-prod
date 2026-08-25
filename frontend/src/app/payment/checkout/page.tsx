'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiCreditCard, FiShoppingCart, FiX } from 'react-icons/fi';
import { getCartItems, getCartTotals } from '@/lib/cart';
import {
  getPatientToken,
  isPatientLoggedIn,
  PATIENT_USER_KEY,
} from '@/lib/patient-auth';

type Gateway = 'esewa' | 'khalti' | 'fonepay';

function mapPurposeForApi(raw: string, fromCart: boolean): string {
  if (raw === 'cart' || fromCart || raw === 'test') return 'lab_test';
  return raw || 'package';
}

function patientPaymentHeaders(): HeadersInit {
  const token = getPatientToken();
  const h: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

function PaymentCheckoutContent() {
  const router = useRouter();
  const params = useSearchParams();
  const amount = Number(params.get('amount') || 0);
  const productName = params.get('productName') || params.get('package') || 'Healthcare Service';
  const purposeParam = params.get('purpose') || 'package';
  const fromCart = params.get('fromCart') === '1';
  const testId = params.get('testId') || '';
  const isCartCheckout = purposeParam === 'cart' || fromCart;
  const apiPurpose = mapPurposeForApi(purposeParam, fromCart);

  const [selectedGateway, setSelectedGateway] = useState<Gateway | null>(null);
  const [loading, setLoading] = useState(false);
  const [modeModalOpen, setModeModalOpen] = useState(false);
  /** `next dev` only, unless NEXT_PUBLIC_PAYMENT_DEMO=true (e.g. staging). Set NEXT_PUBLIC_PAYMENT_DEMO=false to hide in local dev. */
  const showDemoOption =
    process.env.NEXT_PUBLIC_PAYMENT_DEMO === 'true' ||
    (process.env.NEXT_PUBLIC_PAYMENT_DEMO !== 'false' && process.env.NODE_ENV === 'development');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isPatientLoggedIn()) {
      const ret = `${window.location.pathname}${window.location.search}`;
      router.replace(`/patients/login?returnUrl=${encodeURIComponent(ret)}`);
      return;
    }
    try {
      const raw = localStorage.getItem(PATIENT_USER_KEY);
      if (raw) {
        const u = JSON.parse(raw) as { email?: string; name?: string };
        if (u.email) setCustomerEmail(u.email);
        if (u.name) setCustomerName(u.name);
      }
    } catch {
      /* ignore */
    }
    setAuthReady(true);
  }, [router]);

  const cartItems = useMemo(() => (isCartCheckout ? getCartItems() : []), [isCartCheckout]);
  const cartTotals = useMemo(() => getCartTotals(cartItems), [cartItems]);
  const payableAmount = isCartCheckout && cartTotals.amount > 0 ? cartTotals.amount : amount;

  const cartItemsForApi = useMemo(() => {
    if (isCartCheckout && cartItems.length > 0) {
      return cartItems.map((i) => ({
        testId: i.id,
        testName: i.name,
        price: i.amount,
        quantity: i.quantity,
      }));
    }
    if (testId && apiPurpose === 'lab_test') {
      return [{ testId, testName: productName, price: amount, quantity: 1 }];
    }
    return undefined;
  }, [isCartCheckout, cartItems, testId, apiPurpose, productName, amount]);

  const gateways = useMemo(
    () => [
      { id: 'esewa' as Gateway, name: 'eSewa', color: 'border-green-300 bg-green-50', active: 'border-green-500 ring-2 ring-green-400' },
      { id: 'khalti' as Gateway, name: 'Khalti', color: 'border-primary-300 bg-primary-50', active: 'border-primary-500 ring-2 ring-primary-400' },
      { id: 'fonepay' as Gateway, name: 'FonePay', color: 'border-primary-300 bg-primary-50', active: 'border-primary-500 ring-2 ring-primary-400' },
    ],
    []
  );

  const isFormValid =
    Boolean(selectedGateway && payableAmount > 0 && customerName.trim() && customerEmail.trim());

  const buildPaymentBody = () => ({
    gateway: selectedGateway,
    amount: payableAmount,
    productName,
    purpose: apiPurpose,
    customerName: customerName.trim(),
    customerEmail: customerEmail.trim().toLowerCase(),
    customerPhone: customerPhone.trim() || undefined,
    ...(cartItemsForApi?.length ? { cartItems: cartItemsForApi } : {}),
  });

  const runRealGatewayPayment = async () => {
    if (!selectedGateway) return;
    setModeModalOpen(false);
    setLoading(true);
    try {
      const res = await fetch(`/api/payment/${selectedGateway}/initiate`, {
        method: 'POST',
        headers: patientPaymentHeaders(),
        body: JSON.stringify(buildPaymentBody()),
      });
      const data = await res.json();
      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error(data?.message || data?.error || 'Unable to initiate payment');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Payment failed to start');
      setLoading(false);
    }
  };

  const runDemoPayment = async () => {
    if (!selectedGateway) return;
    setModeModalOpen(false);
    setLoading(true);
    try {
      const res = await fetch('/api/payment/demo/complete', {
        method: 'POST',
        headers: patientPaymentHeaders(),
        body: JSON.stringify(buildPaymentBody()),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || data?.error || 'Demo payment failed');
      }
      if (data?.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        throw new Error('No redirect URL from demo payment');
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Demo payment failed');
      setLoading(false);
    }
  };

  const onPayClick = () => {
    if (!isFormValid) return;
    if (showDemoOption) {
      setModeModalOpen(true);
    } else {
      void runRealGatewayPayment();
    }
  };

  if (!authReady) {
    return (
      <div className="max-w-lg mx-auto py-12 px-4 text-center text-neutral-500">
        Checking your session…
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-12 px-4">
      <h1 className="text-2xl font-bold text-neutral-800 mb-2">Complete Payment</h1>
      <p className="text-neutral-500 mb-1">Product: <strong>{productName}</strong></p>
      <p className="text-neutral-500 mb-6">
        Amount:{' '}
        <strong className="text-primary-600 text-xl">NPR {payableAmount.toLocaleString()}</strong>
      </p>

      {isCartCheckout && cartItems.length > 0 && (
        <div className="mb-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
          <p className="text-sm font-semibold text-neutral-700 mb-2 inline-flex items-center gap-2">
            <FiShoppingCart className="w-4 h-4" />
            Cart Items ({cartTotals.count})
          </p>
          <ul className="space-y-1 text-sm text-neutral-600">
            {cartItems.slice(0, 4).map((item) => (
              <li key={item.id} className="flex justify-between gap-2">
                <span className="line-clamp-1">{item.name} x {item.quantity}</span>
                <span>NPR {(item.amount * item.quantity).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Customer info form */}
      <div className="mb-6 space-y-3">
        <div>
          <label htmlFor="customerName" className="block text-sm font-medium text-neutral-700 mb-1">Full Name *</label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            placeholder="Enter your full name"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
        <div>
          <label htmlFor="customerEmail" className="block text-sm font-medium text-neutral-700 mb-1">
            Email (your account) *
          </label>
          <input
            id="customerEmail"
            type="email"
            readOnly
            value={customerEmail}
            placeholder="Sign in to pay"
            className="w-full px-3 py-2 border border-neutral-200 rounded-lg bg-neutral-50 text-neutral-700 cursor-not-allowed"
          />
          <p className="text-xs text-neutral-500 mt-1">
            Payments are tied to your signed-in patient account.
          </p>
        </div>
        <div>
          <label htmlFor="customerPhone" className="block text-sm font-medium text-neutral-700 mb-1">Phone (optional)</label>
          <input
            id="customerPhone"
            type="tel"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
            placeholder="Enter your phone number"
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>
      </div>

      <div className="space-y-3 mb-8">
        {gateways.map((gw) => (
          <button
            key={gw.id}
            onClick={() => setSelectedGateway(gw.id)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
              selectedGateway === gw.id ? gw.active : gw.color
            }`}
          >
            <span className="font-semibold text-neutral-700">{gw.name}</span>
            {selectedGateway === gw.id && <span className="ml-auto text-green-600">✓</span>}
          </button>
        ))}
      </div>

      <button
        type="button"
        onClick={onPayClick}
        disabled={!isFormValid || loading}
        className="w-full bg-primary-600 text-white font-bold py-4 rounded-xl hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <FiCreditCard className="w-4 h-4 inline mr-2" />
        {loading
          ? 'Please wait...'
          : showDemoOption
            ? `Continue with ${selectedGateway ? selectedGateway.charAt(0).toUpperCase() + selectedGateway.slice(1) : '…'}`
            : `Pay with ${selectedGateway ? selectedGateway.charAt(0).toUpperCase() + selectedGateway.slice(1) : '…'}`}
      </button>
      <p className="text-center text-xs text-neutral-400 mt-3">
        {showDemoOption
          ? 'Development: choose Demo (instant success) or Real (actual gateway).'
          : 'Secure payment. You will be redirected to the selected gateway.'}
      </p>

      {modeModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="payment-mode-title"
        >
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 relative">
            <button
              type="button"
              onClick={() => setModeModalOpen(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-neutral-400 hover:bg-neutral-100"
              aria-label="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
            <h2 id="payment-mode-title" className="text-lg font-bold text-neutral-900 pr-8 mb-1">
              How should we process this payment?
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              <span className="text-amber-700 font-medium">Demo</span> completes instantly for testing (records a
              successful payment and lab order rules). <span className="font-medium">Real</span> uses the live gateway
              flow.
            </p>
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => void runDemoPayment()}
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold bg-amber-100 text-amber-950 border-2 border-amber-300 hover:bg-amber-200 disabled:opacity-50"
              >
                Demo — mark as paid now
              </button>
              <button
                type="button"
                onClick={() => void runRealGatewayPayment()}
                disabled={loading}
                className="w-full py-3 rounded-xl font-semibold bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50"
              >
                Real — open {selectedGateway ? selectedGateway : 'gateway'}
              </button>
              <button
                type="button"
                onClick={() => setModeModalOpen(false)}
                className="w-full py-2 text-sm text-neutral-500 hover:text-neutral-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function PaymentCheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PaymentCheckoutContent />
    </Suspense>
  );
}

