'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FiFileText, FiShoppingBag, FiHeart, FiUser, FiLogOut, FiCalendar, FiDownload,
  FiHome, FiCreditCard, FiClipboard,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { get, PaginatedResponse } from '@/lib/api';
import { PATIENT_USER_KEY, clearPatientSession, isPatientLoggedIn } from '@/lib/patient-auth';
import { format } from 'date-fns';

interface PatientUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<PatientUser | null>(null);
  const [reports, setReports] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [healthApps, setHealthApps] = useState<any[]>([]);
  const [homeCollections, setHomeCollections] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(PATIENT_USER_KEY);
    if (!isPatientLoggedIn() || !stored) {
      router.push('/patients/login');
      return;
    }
    setUser(JSON.parse(stored));
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
        reportsRes,
        ordersRes,
        apptRes,
        healthRes,
        homeRes,
        payRes,
      ] = await Promise.allSettled([
        get<PaginatedResponse<any>>('lab-reports/my-reports?limit=5'),
        get<PaginatedResponse<any>>('lab-orders/my-orders?limit=5'),
        get<PaginatedResponse<any>>('appointments/my-appointments?limit=8'),
        get<any[]>('health-card/applications/my'),
        get<PaginatedResponse<any>>('home-collection/my-requests?limit=5'),
        get<{ data: any[] }>('payments/my-transactions?limit=5'),
      ]);
      if (reportsRes.status === 'fulfilled') setReports(reportsRes.value.data || []);
      if (ordersRes.status === 'fulfilled') setOrders(ordersRes.value.data || []);
      if (apptRes.status === 'fulfilled') setAppointments(apptRes.value.data || []);
      if (healthRes.status === 'fulfilled') setHealthApps(Array.isArray(healthRes.value) ? healthRes.value : []);
      if (homeRes.status === 'fulfilled') setHomeCollections(homeRes.value.data || []);
      if (payRes.status === 'fulfilled') setPayments(payRes.value.data || []);
    } catch (err) {
      console.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatApptTime = (t: string) => {
    if (!t) return '';
    const s = t.length >= 5 ? t.slice(0, 5) : t;
    return s;
  };

  const handleLogout = () => {
    clearPatientSession();
    toast.success('Logged out');
    router.push('/patients/login');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-neutral-900">Patient Dashboard</h1>
            <p className="text-sm text-neutral-500">Welcome, {user.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/patients/profile" className="btn btn-ghost btn-sm"><FiUser className="mr-1" /> Profile</Link>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm text-red-600"><FiLogOut className="mr-1" /> Logout</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Book Appointment', icon: FiCalendar, href: '/appointments/book', color: 'bg-primary-100 text-primary-700' },
            { label: 'Order Lab Test', icon: FiShoppingBag, href: '/services/laboratory', color: 'bg-blue-100 text-blue-700' },
            { label: 'My Lab Orders', icon: FiClipboard, href: '/patients/lab-orders', color: 'bg-sky-100 text-sky-700' },
            { label: 'My Reports', icon: FiFileText, href: '/patients/reports', color: 'bg-green-100 text-green-700' },
            { label: 'My Health Card', icon: FiHeart, href: '/patients/health-card', color: 'bg-rose-100 text-rose-700' },
            { label: 'Appointments', icon: FiCalendar, href: '/patients/appointments', color: 'bg-indigo-100 text-indigo-700' },
            { label: 'Home Collection', icon: FiShoppingBag, href: '/patients/home-collection#request-home-collection', color: 'bg-teal-100 text-teal-700' },
            { label: 'Payment History', icon: FiCreditCard, href: '/patients/payments', color: 'bg-amber-100 text-amber-700' },
            { label: 'My Profile', icon: FiUser, href: '/patients/profile', color: 'bg-neutral-100 text-neutral-700' },
          ].map((action) => (
            <Link key={action.label} href={action.href} className="bg-white rounded-xl p-5 shadow-soft hover:shadow-card transition flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color}`}>
                <action.icon className="w-6 h-6" />
              </div>
              <span className="font-medium text-neutral-900">{action.label}</span>
            </Link>
          ))}
        </div>

        {/* Upcoming appointments */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">My appointments</h2>
            <Link href="/patients/appointments" className="text-sm text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          {isLoading ? (
            <p className="text-neutral-500 py-4">Loading...</p>
          ) : appointments.length === 0 ? (
            <div className="py-4">
              <p className="text-neutral-500 mb-3">No appointments yet.</p>
              <Link href="/appointments/book" className="btn btn-primary btn-sm inline-flex items-center gap-2">
                <FiCalendar className="w-4 h-4" />
                Book an appointment
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((appt: any) => (
                <div
                  key={appt.id}
                  className="flex flex-wrap items-center justify-between gap-2 p-3 bg-neutral-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-neutral-900">
                      {appt.doctor?.name ? `Dr. ${appt.doctor.name}` : 'Appointment'}
                    </p>
                    <p className="text-sm text-neutral-500">
                      {format(new Date(appt.date), 'MMM d, yyyy')} · {formatApptTime(appt.startTime)}
                      {appt.doctor?.specialization ? ` · ${appt.doctor.specialization}` : ''}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${
                      appt.status === 'confirmed'
                        ? 'bg-green-100 text-green-700'
                        : appt.status === 'cancelled'
                          ? 'bg-red-100 text-red-700'
                          : appt.status === 'completed'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Lab Reports</h2>
            <Link href="/patients/reports" className="text-sm text-primary-600 hover:underline">View all</Link>
          </div>
          {isLoading ? (
            <p className="text-neutral-500 py-4">Loading...</p>
          ) : reports.length === 0 ? (
            <p className="text-neutral-500 py-4">No reports yet.</p>
          ) : (
            <div className="space-y-3">
              {reports.map((report: any) => (
                <div key={report.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-900">{report.testName}</p>
                    <p className="text-sm text-neutral-500">{report.reportDate}</p>
                  </div>
                  {report.reportFileUrl ? (
                    <a href={report.reportFileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                      <FiDownload className="mr-1" /> Download
                    </a>
                  ) : (
                    <span className="text-xs text-neutral-400">File pending</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Lab Orders</h2>
            <Link href="/patients/lab-orders" className="text-sm text-primary-600 hover:underline">
              View all
            </Link>
          </div>
          {isLoading ? (
            <p className="text-neutral-500 py-4">Loading...</p>
          ) : orders.length === 0 ? (
            <p className="text-neutral-500 py-4">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {orders.map((order: any) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-900">Order #{order.orderNumber}</p>
                    <p className="text-sm text-neutral-500">{order.items?.length || 0} test(s) • {order.currency} {order.totalAmount}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    order.status === 'completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Health card applications */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Health card</h2>
            <Link href="/patients/health-card" className="text-sm text-primary-600 hover:underline">View all</Link>
          </div>
          {isLoading ? (
            <p className="text-neutral-500 py-4">Loading...</p>
          ) : healthApps.length === 0 ? (
            <p className="text-neutral-500 py-4">No applications yet.</p>
          ) : (
            <div className="space-y-3">
              {healthApps.slice(0, 5).map((app: any) => {
                const displayStatus =
                  app.isCollected && app.status === 'approved' ? 'collected' : app.status;
                const label =
                  displayStatus === 'collected'
                    ? 'Card collected'
                    : displayStatus === 'approved'
                      ? 'Approved'
                      : displayStatus === 'rejected'
                        ? 'Rejected'
                        : displayStatus === 'pending'
                          ? 'Pending review'
                          : String(displayStatus || 'Unknown');
                const badgeClass =
                  displayStatus === 'collected' || displayStatus === 'approved'
                    ? 'bg-green-100 text-green-800'
                    : displayStatus === 'rejected'
                      ? 'bg-red-100 text-red-800'
                      : displayStatus === 'pending'
                        ? 'bg-amber-100 text-amber-900'
                        : 'bg-neutral-100 text-neutral-700';
                return (
                  <div key={app.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div>
                      <p className="font-medium text-neutral-900">{app.fullName || app.applicantName || 'Application'}</p>
                      <p className="text-sm text-neutral-500 capitalize">{String(app.holderType || '').replace(/_/g, ' ') || 'Health card'}</p>
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${badgeClass}`}>
                      {label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Home collection */}
        <div className="bg-white rounded-xl shadow-soft p-6 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Home collection</h2>
            <div className="flex items-center gap-3">
              <Link
                href="/patients/home-collection#request-home-collection"
                className="text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 px-3 py-1.5 rounded-lg transition-colors"
              >
                Request pickup
              </Link>
              <Link href="/patients/home-collection" className="text-sm text-primary-600 hover:underline">
                View all
              </Link>
            </div>
          </div>
          {isLoading ? (
            <p className="text-neutral-500 py-4">Loading...</p>
          ) : homeCollections.length === 0 ? (
            <div className="py-4">
              <p className="text-neutral-500 mb-3">No requests yet.</p>
              <Link
                href="/patients/home-collection#request-home-collection"
                className="btn btn-primary btn-sm inline-flex items-center gap-2"
              >
                <FiHome className="w-4 h-4" />
                Request home collection
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {homeCollections.map((req: any) => (
                <div key={req.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <FiHome className="w-4 h-4 text-primary-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="font-medium text-neutral-900">{req.patientName}</p>
                      {req.preferredDate && (
                        <p className="text-sm text-neutral-500">
                          {format(new Date(req.preferredDate), 'MMM d, yyyy')}
                          {req.preferredTimeSlot ? ` · ${req.preferredTimeSlot}` : ''}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full capitalize bg-neutral-100 text-neutral-700">
                    {req.status?.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payments */}
        <div className="bg-white rounded-xl shadow-soft p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-neutral-900">Recent payments</h2>
            <Link href="/patients/payments" className="text-sm text-primary-600 hover:underline">View all</Link>
          </div>
          {isLoading ? (
            <p className="text-neutral-500 py-4">Loading...</p>
          ) : payments.length === 0 ? (
            <p className="text-neutral-500 py-4">No payments yet.</p>
          ) : (
            <div className="space-y-3">
              {payments.map((tx: any) => (
                <div key={tx.id || tx.reference} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                  <div>
                    <p className="font-medium text-neutral-900 capitalize">{String(tx.purpose || '').replace(/_/g, ' ') || 'Payment'}</p>
                    <p className="text-sm text-neutral-500">{tx.reference}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-neutral-900">NPR {Number(tx.amount || 0).toLocaleString()}</p>
                    <span className={`text-xs font-medium capitalize ${tx.status === 'success' ? 'text-green-600' : 'text-neutral-500'}`}>
                      {tx.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
