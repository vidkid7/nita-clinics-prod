'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiHome, FiArrowLeft, FiClock, FiMapPin, FiX, FiTruck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { get, post, patch, getErrorMessage, PaginatedResponse } from '@/lib/api';

interface HomeCollection {
  id: string;
  patientName: string;
  address: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
  scheduledDate?: string;
  scheduledTime?: string;
  status: string;
  notes?: string;
  collectionNotes?: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  requested: 'bg-yellow-100 text-yellow-700',
  pending: 'bg-yellow-100 text-yellow-700',
  assigned: 'bg-blue-100 text-blue-700',
  en_route: 'bg-indigo-100 text-indigo-700',
  collected: 'bg-green-100 text-green-700',
  completed: 'bg-primary-100 text-primary-700',
  cancelled: 'bg-red-100 text-red-700',
};

const TIME_SLOT_OPTIONS = [
  { value: '7:00 AM - 9:00 AM', label: '7:00 AM – 9:00 AM' },
  { value: '9:00 AM - 11:00 AM', label: '9:00 AM – 11:00 AM' },
  { value: '11:00 AM - 1:00 PM', label: '11:00 AM – 1:00 PM' },
  { value: '1:00 PM - 3:00 PM', label: '1:00 PM – 3:00 PM' },
  { value: '3:00 PM - 5:00 PM', label: '3:00 PM – 5:00 PM' },
  { value: '5:00 PM - 7:00 PM', label: '5:00 PM – 7:00 PM' },
];

const inputClass =
  'w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-500';

export default function MyHomeCollectionPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<HomeCollection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [labOrders, setLabOrders] = useState<Array<{ id: string; orderNumber: string }>>([]);

  const [form, setForm] = useState({
    patientName: '',
    patientPhone: '',
    patientEmail: '',
    address: '',
    city: '',
    landmark: '',
    preferredDate: '',
    preferredTimeSlot: '',
    orderId: '',
    collectionNotes: '',
  });

  const loadRequests = useCallback(async () => {
    try {
      const res = await get<PaginatedResponse<HomeCollection>>('home-collection/my-requests?limit=20');
      setRequests(res.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('patient_auth_token');
    if (!token) {
      router.push('/patients/login');
      return;
    }
    loadRequests();
  }, [router, loadRequests]);

  useEffect(() => {
    (async () => {
      try {
        const me = await get<{ fullName: string; email: string; phone: string }>('patients/me');
        setForm((f) => ({
          ...f,
          patientName: f.patientName.trim() || me.fullName || '',
          patientEmail: f.patientEmail.trim() || (me.email || '').trim().toLowerCase(),
          patientPhone: f.patientPhone.trim() || me.phone || '',
        }));
      } catch {
        /* guest profile missing */
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await get<PaginatedResponse<{ id: string; orderNumber: string }>>(
          'lab-orders/my-orders?limit=30',
        );
        setLabOrders(res.data || []);
      } catch {
        setLabOrders([]);
      }
    })();
  }, []);

  useEffect(() => {
    const scrollToForm = () => {
      if (typeof window === 'undefined') return;
      if (window.location.hash === '#request-home-collection') {
        document.getElementById('request-home-collection')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    scrollToForm();
    window.addEventListener('hashchange', scrollToForm);
    return () => window.removeEventListener('hashchange', scrollToForm);
  }, []);

  const minDate = format(new Date(), 'yyyy-MM-dd');

  const cancelRequest = async (id: string) => {
    if (!confirm('Cancel this home collection request?')) return;
    setCancelling(id);
    try {
      await patch(`home-collection/${id}/cancel`, {});
      toast.success('Request cancelled');
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r)));
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Could not cancel request');
    } finally {
      setCancelling(null);
    }
  };

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.patientName.trim() || !form.patientPhone.trim() || !form.address.trim()) {
      toast.error('Please fill name, phone, and address');
      return;
    }
    if (!form.patientEmail.trim()) {
      toast.error('Email is required so this request appears on your dashboard');
      return;
    }
    if (!form.preferredDate || !form.preferredTimeSlot.trim()) {
      toast.error('Please choose a preferred date and time slot');
      return;
    }

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {
        patientName: form.patientName.trim(),
        patientPhone: form.patientPhone.trim(),
        patientEmail: form.patientEmail.trim().toLowerCase(),
        address: form.address.trim(),
        preferredDate: form.preferredDate,
        preferredTimeSlot: form.preferredTimeSlot.trim(),
      };
      if (form.city.trim()) payload.city = form.city.trim();
      if (form.landmark.trim()) payload.landmark = form.landmark.trim();
      if (form.orderId) payload.orderId = form.orderId;
      if (form.collectionNotes.trim()) payload.collectionNotes = form.collectionNotes.trim();

      await post<HomeCollection>('home-collection', payload);
      toast.success('Home collection request submitted. We will contact you to confirm.');
      setForm((f) => ({
        ...f,
        address: '',
        city: '',
        landmark: '',
        preferredDate: '',
        preferredTimeSlot: '',
        orderId: '',
        collectionNotes: '',
      }));
      await loadRequests();
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Could not submit request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/patients/dashboard" className="text-neutral-500 hover:text-primary-600">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">Home Collection</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        <section
          id="request-home-collection"
          className="bg-white rounded-xl shadow-soft p-6 scroll-mt-24"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center shrink-0">
              <FiTruck className="w-5 h-5 text-teal-700" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">Request home sample collection</h2>
              <p className="text-sm text-neutral-500 mt-1">
                After purchasing lab tests, you can ask our team to collect samples at your address. Use the same email
                as your patient account so this request shows here.
              </p>
            </div>
          </div>

          <form onSubmit={handleRequestSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Full name *</label>
                <input
                  className={inputClass}
                  value={form.patientName}
                  onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone *</label>
                <input
                  type="tel"
                  className={inputClass}
                  value={form.patientPhone}
                  onChange={(e) => setForm((f) => ({ ...f, patientPhone: e.target.value }))}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Email *</label>
                <input
                  type="email"
                  className={inputClass}
                  value={form.patientEmail}
                  onChange={(e) => setForm((f) => ({ ...f, patientEmail: e.target.value }))}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Collection address *</label>
                <textarea
                  className={`${inputClass} resize-none min-h-[80px]`}
                  value={form.address}
                  onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
                  required
                  placeholder="House no., street, area"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
                <input
                  className={inputClass}
                  value={form.city}
                  onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Landmark</label>
                <input
                  className={inputClass}
                  value={form.landmark}
                  onChange={(e) => setForm((f) => ({ ...f, landmark: e.target.value }))}
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Preferred date *</label>
                <input
                  type="date"
                  min={minDate}
                  className={inputClass}
                  value={form.preferredDate}
                  onChange={(e) => setForm((f) => ({ ...f, preferredDate: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Preferred time slot *</label>
                <select
                  className={inputClass}
                  value={form.preferredTimeSlot}
                  onChange={(e) => setForm((f) => ({ ...f, preferredTimeSlot: e.target.value }))}
                  required
                >
                  <option value="">Select a slot</option>
                  {TIME_SLOT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
              {labOrders.length > 0 && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Link to lab order (optional)
                  </label>
                  <select
                    className={inputClass}
                    value={form.orderId}
                    onChange={(e) => setForm((f) => ({ ...f, orderId: e.target.value }))}
                  >
                    <option value="">No specific order</option>
                    {labOrders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.orderNumber}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Notes for our team</label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={3}
                  value={form.collectionNotes}
                  onChange={(e) => setForm((f) => ({ ...f, collectionNotes: e.target.value }))}
                  placeholder="Fasting required, gate code, etc."
                />
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit request'}
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-neutral-900 mb-4">Your requests</h2>
          {isLoading ? (
            <div className="text-center py-12 text-neutral-500">Loading...</div>
          ) : requests.length === 0 ? (
            <div className="text-center py-10 rounded-xl border border-dashed border-neutral-200 bg-white">
              <FiHome className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
              <p className="text-neutral-500 text-sm">No requests yet. Submit the form above to schedule a visit.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req.id} className="bg-white rounded-xl shadow-soft p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiHome className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-neutral-900">{req.patientName}</p>
                        <p className="text-sm text-neutral-500 flex items-center gap-1 mt-0.5">
                          <FiMapPin className="w-3 h-3 shrink-0" />
                          {req.address}
                        </p>
                        {(req.preferredDate || req.scheduledDate) && (
                          <p className="text-sm text-neutral-500 flex items-center gap-1 mt-0.5">
                            <FiClock className="w-3 h-3 shrink-0" />
                            {format(new Date(req.preferredDate || req.scheduledDate!), 'MMM d, yyyy')}
                            {(req.preferredTimeSlot || req.scheduledTime) &&
                              ` · ${req.preferredTimeSlot || req.scheduledTime}`}
                          </p>
                        )}
                        <p className="text-xs text-neutral-400 mt-1">
                          Requested {format(new Date(req.createdAt), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                          STATUS_COLORS[req.status] || 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {req.status?.replace(/_/g, ' ')}
                      </span>
                      {['requested', 'pending', 'assigned', 'en_route'].includes(req.status) && (
                        <button
                          type="button"
                          onClick={() => cancelRequest(req.id)}
                          disabled={cancelling === req.id}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Cancel"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  {(req.collectionNotes || req.notes) && (
                    <p className="text-sm text-neutral-500 mt-2 ml-14">{req.collectionNotes || req.notes}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
