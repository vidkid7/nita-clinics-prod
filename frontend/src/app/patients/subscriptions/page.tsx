'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiStar, FiArrowLeft, FiCheckCircle, FiClock, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { get, getErrorMessage } from '@/lib/api';

interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  benefits: string[];
  price: number;
  currency: string;
  durationMonths: number;
}

interface Subscription {
  id: string;
  planId: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'cancelled';
  pricePaid?: number;
  currency: string;
}

const STATUS_ICON: Record<string, React.ReactNode> = {
  active: <FiCheckCircle className="w-4 h-4 text-green-500" />,
  expired: <FiClock className="w-4 h-4 text-neutral-400" />,
  cancelled: <FiXCircle className="w-4 h-4 text-red-400" />,
};

const STATUS_BADGE: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  expired: 'bg-neutral-100 text-neutral-600',
  cancelled: 'bg-red-100 text-red-700',
};

export default function MySubscriptionsPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('patient_auth_token');
    if (!token) { router.push('/patients/login'); return; }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [plansRes, subsRes] = await Promise.allSettled([
        get<SubscriptionPlan[]>('subscriptions/plans'),
        get<Subscription[]>('subscriptions/my'),
      ]);
      if (plansRes.status === 'fulfilled') setPlans(plansRes.value);
      if (subsRes.status === 'fulfilled') setSubscriptions(Array.isArray(subsRes.value) ? subsRes.value : []);
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Failed to load subscriptions');
    } finally {
      setIsLoading(false);
    }
  };

  const activeSub = subscriptions.find((s) => s.status === 'active');
  const activePlan = activeSub ? plans.find((p) => p.id === activeSub.planId) : null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/patients/dashboard" className="text-neutral-500 hover:text-primary-600">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">My Subscriptions</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {isLoading ? (
          <div className="text-center py-12 text-neutral-500">Loading...</div>
        ) : (
          <>
            {/* Current Subscription */}
            {activeSub && activePlan ? (
              <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-3">
                  <FiStar className="w-5 h-5 text-yellow-300" />
                  <span className="font-semibold">Active Subscription</span>
                </div>
                <h2 className="text-2xl font-bold mb-1">{activePlan.name}</h2>
                {activePlan.description && <p className="text-white/75 text-sm mb-3">{activePlan.description}</p>}
                <div className="flex items-center gap-4 text-sm">
                  <span>Valid until: <strong>{format(new Date(activeSub.endDate), 'MMM d, yyyy')}</strong></span>
                  {activeSub.pricePaid && <span>Paid: <strong>{activeSub.currency} {activeSub.pricePaid.toLocaleString()}</strong></span>}
                </div>
                {activePlan.benefits.length > 0 && (
                  <ul className="mt-4 space-y-1">
                    {activePlan.benefits.map((b, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm text-white/90">
                        <FiCheckCircle className="w-4 h-4 text-green-300 flex-shrink-0" />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-soft p-6 text-center">
                <FiStar className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600 mb-2">No active subscription</p>
                <p className="text-sm text-neutral-500">Contact the clinic to subscribe to a health plan.</p>
              </div>
            )}

            {/* Available Plans */}
            {plans.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Available Plans</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {plans.map((plan) => (
                    <div key={plan.id} className="bg-white rounded-xl shadow-soft p-5 border-2 border-transparent hover:border-primary-200 transition">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-neutral-900">{plan.name}</h3>
                        <span className="text-primary-600 font-bold">
                          {plan.currency} {plan.price.toLocaleString()}
                          <span className="text-xs font-normal text-neutral-500"> / {plan.durationMonths}mo</span>
                        </span>
                      </div>
                      {plan.description && <p className="text-sm text-neutral-500 mb-3">{plan.description}</p>}
                      {plan.benefits.length > 0 && (
                        <ul className="space-y-1">
                          {plan.benefits.map((b, i) => (
                            <li key={i} className="flex items-center gap-2 text-sm text-neutral-600">
                              <FiCheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
                              {b}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-neutral-500 mt-3">To subscribe to a plan, please visit or contact the clinic.</p>
              </section>
            )}

            {/* History */}
            {subscriptions.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Subscription History</h2>
                <div className="space-y-3">
                  {subscriptions.map((sub) => {
                    const plan = plans.find((p) => p.id === sub.planId);
                    return (
                      <div key={sub.id} className="bg-white rounded-xl shadow-soft p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {STATUS_ICON[sub.status]}
                          <div>
                            <p className="font-medium text-neutral-900">{plan?.name || 'Subscription Plan'}</p>
                            <p className="text-sm text-neutral-500">
                              {format(new Date(sub.startDate), 'MMM d, yyyy')} – {format(new Date(sub.endDate), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${STATUS_BADGE[sub.status]}`}>
                          {sub.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
