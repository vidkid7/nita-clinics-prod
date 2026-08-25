'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiShoppingBag } from 'react-icons/fi';
import { get, getErrorMessage, PaginatedResponse } from '@/lib/api';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function PatientLabOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('patient_auth_token');
    if (!token) {
      router.push('/patients/login');
      return;
    }
    (async () => {
      try {
        const res = await get<PaginatedResponse<any>>('lab-orders/my-orders?limit=50');
        setOrders(res.data || []);
      } catch (e) {
        toast.error(getErrorMessage(e) || 'Failed to load lab orders');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [router]);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <Link href="/patients/dashboard" className="text-sm text-primary-600 hover:underline flex items-center gap-1 mb-2">
            <FiArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">My Lab Orders</h1>
          <p className="text-sm text-neutral-500 mt-1">Orders from your online purchases and bookings.</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="text-center py-12 text-neutral-500">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <FiShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 mb-4">No lab orders yet.</p>
            <Link href="/services/laboratory" className="btn btn-primary btn-sm">
              Browse lab tests
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-white rounded-xl p-5 shadow-soft">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="font-semibold text-neutral-900">#{order.orderNumber}</p>
                    <p className="text-sm text-neutral-500">
                      {order.createdAt ? format(new Date(order.createdAt), 'MMM d, yyyy') : ''}
                      {order.paymentStatus === 'paid' && (
                        <span className="ml-2 text-green-600 text-xs font-medium">Paid</span>
                      )}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {order.status?.replace(/_/g, ' ')}
                  </span>
                </div>
                <ul className="text-sm text-neutral-600 space-y-1 border-t border-neutral-100 pt-3">
                  {(order.items || []).map((item: any) => (
                    <li key={item.id} className="flex justify-between gap-2">
                      <span>{item.testName}</span>
                      <span className="text-neutral-500 shrink-0">NPR {Number(item.price || 0).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-medium text-neutral-800 mt-3 text-right">
                  Total: {order.currency || 'NPR'} {Number(order.totalAmount || 0).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
