'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiCalendar, FiClock, FiUser, FiX, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { get, patch, getErrorMessage, PaginatedResponse } from '@/lib/api';

interface Appointment {
  id: string;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  reason?: string;
  notes?: string;
  doctor?: { name: string; specialization: string };
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-blue-100 text-blue-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function MyAppointmentsPage() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('patient_auth_token');
    if (!token) { router.push('/patients/login'); return; }
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const res = await get<PaginatedResponse<Appointment>>('appointments/my-appointments?limit=20');
      setAppointments(res.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelAppointment = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    setCancelling(id);
    try {
      await patch(`appointments/${id}/cancel`, {});
      toast.success('Appointment cancelled');
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: 'cancelled' } : a));
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Could not cancel appointment');
    } finally {
      setCancelling(null);
    }
  };

  const upcoming = appointments.filter((a) => ['pending', 'confirmed'].includes(a.status));
  const past = appointments.filter((a) => !['pending', 'confirmed'].includes(a.status));

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <Link href="/patients/dashboard" className="text-neutral-500 hover:text-primary-600">
            <FiArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">My Appointments</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {isLoading ? (
          <div className="text-center py-12 text-neutral-500">Loading appointments...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12">
            <FiCalendar className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
            <p className="text-neutral-500">No appointments found.</p>
            <Link href="/appointments/book" className="btn btn-primary mt-4 inline-block">
              Book an Appointment
            </Link>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Upcoming</h2>
                <div className="space-y-3">
                  {upcoming.map((appt) => (
                    <div key={appt.id} className="bg-white rounded-xl shadow-soft p-4 flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FiCalendar className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">
                            {appt.doctor ? `Dr. ${appt.doctor.name}` : 'Doctor TBD'}
                          </p>
                          {appt.doctor && <p className="text-sm text-neutral-500">{appt.doctor.specialization}</p>}
                          <div className="flex items-center gap-3 mt-1 text-sm text-neutral-600">
                            <span className="flex items-center gap-1">
                              <FiCalendar className="w-3 h-3" />
                              {format(new Date(appt.date), 'MMM d, yyyy')}
                            </span>
                            <span className="flex items-center gap-1">
                              <FiClock className="w-3 h-3" />
                              {appt.startTime}
                            </span>
                          </div>
                          {appt.notes && <p className="text-sm text-neutral-500 mt-1">{appt.notes}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${STATUS_COLORS[appt.status] || 'bg-neutral-100 text-neutral-600'}`}>
                          {appt.status}
                        </span>
                        <button
                          onClick={() => cancelAppointment(appt.id)}
                          disabled={cancelling === appt.id}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Cancel appointment"
                        >
                          <FiX className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {past.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Past</h2>
                <div className="space-y-3">
                  {past.map((appt) => (
                    <div key={appt.id} className="bg-white rounded-xl shadow-soft p-4 flex items-start justify-between gap-4 opacity-80">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <FiUser className="w-5 h-5 text-neutral-400" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">
                            {appt.doctor ? `Dr. ${appt.doctor.name}` : 'Doctor'}
                          </p>
                          <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500">
                            <span>{format(new Date(appt.date), 'MMM d, yyyy')}</span>
                            <span>{appt.startTime}</span>
                          </div>
                        </div>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full capitalize flex-shrink-0 ${STATUS_COLORS[appt.status] || 'bg-neutral-100 text-neutral-600'}`}>
                        {appt.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
