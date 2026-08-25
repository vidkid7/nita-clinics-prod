'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCreditCard, FiArrowLeft, FiCheckCircle, FiClock, FiXCircle, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { get, getErrorMessage } from '@/lib/api';

interface Transaction {
  id: string;
  reference: string;
  gateway: string;
  purpose: string;
  status: string;
  amount: number;
  currency: string;
  createdAt: string;
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  success: <FiCheckCircle className="w-5 h-5 text-green-500" />,
  pending: <FiClock className="w-5 h-5 text-yellow-500" />,
  failed: <FiXCircle className="w-5 h-5 text-red-500" />,
  initialized: <FiClock className="w-5 h-5 text-neutral-400" />,
};

const STATUS_BADGE: Record<string, string> = {
  success: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  initialized: 'bg-neutral-100 text-neutral-600',
};

export default function MyPaymentsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('patient_auth_token');
    if (!token) { router.push('/patients/login'); return; }
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    try {
      const res = await get<{ data: Transaction[] }>('payments/my-transactions?limit=20');
      setTransactions(res.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/patients/dashboard" className="text-neutral-500 hover:text-primary-600">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">Payment History</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12 text-neutral-500">Loading...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <FiCreditCard className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">No payment history found.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-white rounded-xl shadow-soft p-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    {STATUS_ICON[tx.status] || <FiClock className="w-5 h-5 text-neutral-400" />}
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 capitalize">{tx.purpose.replace(/_/g, ' ')}</p>
                    <p className="text-sm text-neutral-500">
                      {tx.gateway.toUpperCase()} · {tx.reference}
                    </p>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {format(new Date(tx.createdAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-semibold text-neutral-900">
                    {tx.currency} {tx.amount.toLocaleString()}
                  </p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize ${STATUS_BADGE[tx.status] || 'bg-neutral-100 text-neutral-600'}`}>
                    {tx.status}
                  </span>
                  {tx.status === 'success' && (
                    <Link
                      href={`/payment/receipt/${tx.reference}`}
                      className="flex items-center gap-1 text-xs text-primary-600 hover:underline mt-1"
                    >
                      <FiDownload className="w-3 h-3" /> Receipt
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
