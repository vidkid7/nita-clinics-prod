'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCreditCard, FiArrowLeft, FiCheckCircle, FiClock, FiXCircle, FiAlertCircle, FiPrinter, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { get, getErrorMessage } from '@/lib/api';
import { HealthCard } from '@/components/health-card/HealthCard';

interface HealthCardApplication {
  id: string;
  fullName?: string;
  applicantName?: string;
  name?: string;
  holderType?: string;
  cardType?: string;
  email?: string;
  phone?: string;
  status: string;
  cardNumber?: string;
  validUntil?: string;
  validFrom?: string;
  validTo?: string;
  rejectionReason?: string;
  createdAt: string;
  isCollected?: boolean;
  documentNumber?: string;
  nmcRegistrationId?: string;
}

function formatHolderLabel(t?: string) {
  if (!t) return 'Health Card';
  return t.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

const STATUS_INFO: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  pending: { icon: <FiClock className="w-5 h-5 text-yellow-500" />, label: 'Under Review', color: 'bg-yellow-100 text-yellow-700' },
  approved: { icon: <FiCheckCircle className="w-5 h-5 text-green-500" />, label: 'Approved', color: 'bg-green-100 text-green-700' },
  rejected: { icon: <FiXCircle className="w-5 h-5 text-red-500" />, label: 'Rejected', color: 'bg-red-100 text-red-700' },
  collected: { icon: <FiCreditCard className="w-5 h-5 text-primary-500" />, label: 'Card Collected', color: 'bg-primary-100 text-primary-700' },
};

export default function MyHealthCardPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<HealthCardApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('patient_auth_token');
    if (!token) { router.push('/patients/login'); return; }
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const res = await get<HealthCardApplication[]>('health-card/applications/my');
      setApplications(Array.isArray(res) ? res : []);
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Failed to load health card applications');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/patients/dashboard" className="text-neutral-500 hover:text-primary-600">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">My Health Card</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="text-center py-12 text-neutral-500">Loading...</div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12">
            <FiCreditCard className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500 mb-2">No health card application found.</p>
            <Link href="/health-card" className="btn btn-primary inline-block mt-2">
              Apply for Health Card
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {applications.map((app) => {
              const displayStatus =
                app.isCollected && app.status === 'approved' ? 'collected' : app.status;
              const info =
                STATUS_INFO[displayStatus] || {
                  icon: <FiAlertCircle className="w-5 h-5" />,
                  label: app.status,
                  color: 'bg-neutral-100 text-neutral-600',
                };
              const isActive = app.status === 'approved' || displayStatus === 'collected';
              return (
                <div key={app.id} className="bg-white rounded-2xl shadow-lg shadow-neutral-900/5 border border-neutral-100 overflow-hidden">
                  {/* Header */}
                  <div className="px-6 py-5 flex items-start justify-between gap-4 border-b border-neutral-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
                        {info.icon}
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900">
                          {formatHolderLabel(app.holderType || app.cardType)}
                        </p>
                        <p className="text-xs text-neutral-500 mt-0.5">
                          Applied {format(new Date(app.createdAt), 'MMM d, yyyy')}
                          {isActive && app.validUntil && (
                            <> · Valid until {format(new Date(app.validUntil), 'MMM yyyy')}</>
                          )}
                        </p>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${info.color}`}>
                      {info.label}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="p-6 sm:p-8">
                    {isActive ? (
                      <>
                        {/* On-screen flip card */}
                        <div className="flex justify-center print:hidden">
                          <HealthCard data={app} />
                        </div>
                        {/* Hidden print layout — both faces stacked, picked up by print CSS */}
                        <div className="health-card-print hidden print:block">
                          <HealthCard data={app} static />
                        </div>
                        <div className="mt-6 flex flex-wrap justify-center gap-2 print:hidden">
                          <button
                            onClick={() => window.print()}
                            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
                          >
                            <FiPrinter className="w-4 h-4" /> Print Card
                          </button>
                          <Link
                            href="/health-card"
                            className="inline-flex items-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-colors"
                          >
                            <FiDownload className="w-4 h-4" /> View Benefits
                          </Link>
                        </div>
                        <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-3 print:hidden">
                          {[
                            ['Show at reception', 'Present your active card before service.'],
                            ['Keep it personal', 'Membership benefits are non-transferable.'],
                            ['Check validity', 'Your dates are printed on the card front.'],
                          ].map(([title, copy]) => (
                            <div key={title} className="rounded-2xl border border-primary-100 bg-primary-50/60 p-4 text-center">
                              <p className="text-xs font-bold uppercase tracking-wide text-primary-800">{title}</p>
                              <p className="mt-1 text-xs leading-relaxed text-neutral-600">{copy}</p>
                            </div>
                          ))}
                        </div>
                        <p className="mt-4 text-center text-xs text-neutral-500 max-w-sm mx-auto print:hidden">
                          Tap the card to flip and see terms. Carry this card on every visit to claim
                          your membership discounts.
                        </p>
                      </>
                    ) : app.status === 'rejected' ? (
                      <div className="rounded-xl bg-red-50 border border-red-100 p-4">
                        <p className="text-sm font-semibold text-red-800">Application Rejected</p>
                        {app.rejectionReason && (
                          <p className="text-sm text-red-700 mt-1">
                            <span className="font-medium">Reason: </span>
                            {app.rejectionReason}
                          </p>
                        )}
                        <Link
                          href="/health-card"
                          className="inline-block mt-3 text-sm font-semibold text-red-700 underline hover:text-red-800"
                        >
                          Re-apply →
                        </Link>
                      </div>
                    ) : (
                      <div className="rounded-xl bg-amber-50 border border-amber-100 p-4 flex gap-3">
                        <FiClock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-900">
                            Your application is being reviewed
                          </p>
                          <p className="text-sm text-amber-800 mt-0.5">
                            We typically approve within 24–48 hours. You'll receive an SMS or call
                            once your card is ready.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
