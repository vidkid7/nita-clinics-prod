'use client';

import { useEffect, useState } from 'react';
import {
  FiSearch,
  FiCalendar,
  FiClock,
  FiPhone,
  FiCheck,
  FiX,
  FiEye,
  FiBell,
  FiFilter,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { get, patch, PaginatedResponse, getErrorMessage } from '@/lib/api';
import { format, formatDistanceToNow, parseISO, subDays } from 'date-fns';

type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorName: string;
  serviceName?: string;
  date: string;
  startTime: string;
  endTime: string;
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const statusColors: Record<AppointmentStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-green-100 text-green-700',
  completed: 'bg-primary-100 text-primary-700',
  cancelled: 'bg-red-100 text-red-700',
  no_show: 'bg-neutral-200 text-neutral-700',
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [viewModal, setViewModal] = useState(false);
  const [dateFilter, setDateFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'createdAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [unseenAppointmentIds, setUnseenAppointmentIds] = useState<Set<string>>(new Set());
  const [showNotifications, setShowNotifications] = useState(false);

  // Load seen appointments from localStorage on mount
  useEffect(() => {
    const seenIds = localStorage.getItem('seenAppointmentIds');
    if (seenIds) {
      try {
        const parsed = JSON.parse(seenIds);
        // Keep only IDs from last 7 days
        const sevenDaysAgo = subDays(new Date(), 7).getTime();
        const recentSeenIds = Object.keys(parsed).filter(
          (id) => parsed[id] > sevenDaysAgo
        );
        const cleanedData: Record<string, number> = {};
        recentSeenIds.forEach((id) => {
          cleanedData[id] = parsed[id];
        });
        localStorage.setItem('seenAppointmentIds', JSON.stringify(cleanedData));
      } catch (error) {
        console.error('Error loading seen appointments', error);
        localStorage.removeItem('seenAppointmentIds');
      }
    }
  }, []);

  const fetchAppointments = async () => {
    try {
      setIsLoading(true);
      const params: Record<string, string | number> = {
        page: 1,
        limit: 100,
        sortBy: sortBy,
        sortOrder: sortOrder,
      };
      if (statusFilter !== 'all') {
        params.status = statusFilter.toUpperCase();
      }
      if (dateFilter) {
        params.startDate = dateFilter;
        params.endDate = dateFilter;
      }

      const response = await get<PaginatedResponse<Appointment>>('appointments', { params });
      // Map backend shape to frontend shape if needed
      const mappedAppointments = response.data.map((apt: any) => ({
        ...apt,
        doctorName: apt.doctor?.name || apt.doctorName || 'Unknown Doctor',
        serviceName: apt.serviceName || 'N/A',
      }));
      setAppointments(mappedAppointments);

      // Get seen appointment IDs from localStorage
      const seenIdsStr = localStorage.getItem('seenAppointmentIds');
      const seenIds: Record<string, number> = seenIdsStr ? JSON.parse(seenIdsStr) : {};
      
      // Calculate 7 days ago timestamp
      const sevenDaysAgo = subDays(new Date(), 7);

      // Find unseen appointments (pending, created in last 7 days, not in seenIds)
      const unseen = new Set<string>();
      mappedAppointments.forEach((apt: Appointment) => {
        const createdDate = parseISO(apt.createdAt);
        const isRecent = createdDate >= sevenDaysAgo;
        const isPending = apt.status === 'pending';
        const notSeen = !seenIds[apt.id];
        
        if (isPending && isRecent && notSeen) {
          unseen.add(apt.id);
        }
      });

      setUnseenAppointmentIds(unseen);
    } catch (error) {
      console.error('Failed to load appointments', error);
      toast.error(getErrorMessage(error) || 'Failed to load appointments');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    // Auto-refresh every 30 seconds to check for new appointments
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, dateFilter, sortBy, sortOrder]);

  const markAllAsSeen = () => {
    // Get current seen IDs
    const seenIdsStr = localStorage.getItem('seenAppointmentIds');
    const seenIds: Record<string, number> = seenIdsStr ? JSON.parse(seenIdsStr) : {};
    
    // Mark all unseen appointments as seen with current timestamp
    const now = Date.now();
    unseenAppointmentIds.forEach((id) => {
      seenIds[id] = now;
    });

    // Save to localStorage
    localStorage.setItem('seenAppointmentIds', JSON.stringify(seenIds));
    
    // Clear unseen count
    setUnseenAppointmentIds(new Set());
    setShowNotifications(false);
    
    toast.success('All appointments marked as seen');
  };

  // Get unseen appointments for notification panel
  const unseenAppointments = appointments.filter((apt) => unseenAppointmentIds.has(apt.id));

  // Close notification panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showNotifications && !target.closest('.notification-panel') && !target.closest('.notification-button')) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications]);

  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.patientPhone.includes(searchQuery) ||
      apt.patientEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  // Sort appointments
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    if (sortBy === 'createdAt') {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    } else {
      // Sort by appointment date and time
      const dateTimeA = new Date(`${a.date}T${a.startTime}`).getTime();
      const dateTimeB = new Date(`${b.date}T${b.startTime}`).getTime();
      return sortOrder === 'desc' ? dateTimeB - dateTimeA : dateTimeA - dateTimeB;
    }
  });

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    cancelled: appointments.filter((a) => a.status === 'cancelled').length,
  };

  const updateStatus = async (id: string, newStatus: AppointmentStatus) => {
    try {
      let url = '';
      if (newStatus === 'confirmed') url = `appointments/${id}/confirm`;
      else if (newStatus === 'completed') url = `appointments/${id}/complete`;
      else if (newStatus === 'cancelled') url = `appointments/${id}/cancel`;
      else if (newStatus === 'no_show') url = `appointments/${id}/no-show`;

      if (!url) return;

      await patch(url);
      // Refresh from server so DOM reflects latest status for testsprite
      await fetchAppointments();
      toast.success(`Appointment ${newStatus.replace('_', ' ')}`);
    } catch (error) {
      console.error('Failed to update appointment status', error);
      toast.error(getErrorMessage(error) || 'Failed to update appointment status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Notification Bell */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Appointments</h1>
          <p className="text-neutral-600 mt-1">Manage patient appointments</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="notification-button relative p-3 bg-white rounded-xl shadow-soft hover:shadow-md transition-shadow"
            title={unseenAppointmentIds.size > 0 ? `${unseenAppointmentIds.size} new appointment(s)` : 'No new appointments'}
          >
            <FiBell className="w-6 h-6 text-neutral-600" />
            {unseenAppointmentIds.size > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                {unseenAppointmentIds.size}
              </span>
            )}
          </button>

          {/* Notification Dropdown Panel */}
          {showNotifications && (
            <div className="notification-panel absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-neutral-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-neutral-200 flex items-center justify-between">
                <h3 className="font-semibold text-neutral-900">
                  New Appointments ({unseenAppointmentIds.size})
                </h3>
                {unseenAppointmentIds.size > 0 && (
                  <button
                    onClick={markAllAsSeen}
                    className="text-xs text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Mark all as seen
                  </button>
                )}
              </div>

              {/* Notification List */}
              <div className="overflow-y-auto flex-1">
                {unseenAppointments.length === 0 ? (
                  <div className="p-8 text-center">
                    <FiBell className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="text-neutral-500 text-sm">No new appointments</p>
                    <p className="text-neutral-400 text-xs mt-1">
                      You're all caught up!
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {unseenAppointments.map((apt) => (
                      <div
                        key={apt.id}
                        className="p-4 hover:bg-neutral-50 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedAppointment(apt);
                          setViewModal(true);
                          setShowNotifications(false);
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-neutral-900 text-sm">
                              {apt.patientName}
                            </p>
                            <p className="text-xs text-neutral-600 mt-1">
                              Dr. {apt.doctorName}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-neutral-500">
                              <FiCalendar className="w-3 h-3" />
                              <span>{apt.date}</span>
                              <FiClock className="w-3 h-3 ml-1" />
                              <span>{apt.startTime}</span>
                            </div>
                            <p className="text-xs text-neutral-400 mt-2">
                              {formatDistanceToNow(parseISO(apt.createdAt), { addSuffix: true })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {unseenAppointments.length > 0 && (
                <div className="p-3 border-t border-neutral-200 bg-neutral-50">
                  <button
                    onClick={() => {
                      setStatusFilter('pending');
                      setShowNotifications(false);
                    }}
                    className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    View all pending appointments →
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: 'Total', value: stats.total, color: 'bg-primary-500', status: 'all' as const },
          { label: 'Pending', value: stats.pending, color: 'bg-yellow-500', status: 'pending' as const },
          { label: 'Confirmed', value: stats.confirmed, color: 'bg-green-500', status: 'confirmed' as const },
          { label: 'Completed', value: stats.completed, color: 'bg-primary-500', status: 'completed' as const },
          { label: 'Cancelled', value: stats.cancelled, color: 'bg-red-500', status: 'cancelled' as const },
        ].map((stat, index) => (
          <button
            key={index}
            onClick={() => setStatusFilter(stat.status === 'all' ? 'all' : stat.status)}
            className={`bg-white rounded-xl p-4 shadow-soft text-left transition-all ${
              statusFilter === stat.status ? 'ring-2 ring-primary-500' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${stat.color}`} />
              <span className="text-neutral-600 text-sm">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-soft p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by patient name, doctor, phone, or email..."
                leftIcon={<FiSearch className="w-5 h-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Input
                type="date"
                className="w-auto"
                placeholder="Filter by date"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
              {dateFilter && (
                <Button
                  variant="ghost"
                  onClick={() => setDateFilter('')}
                  className="whitespace-nowrap"
                >
                  Clear Date
                </Button>
              )}
            </div>
          </div>
          
          {/* Sort Options */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FiFilter className="w-4 h-4 text-neutral-500" />
              <span className="text-neutral-600 font-medium">Sort by:</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSortBy('createdAt');
                  setSortOrder('desc');
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  sortBy === 'createdAt'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Booking Time
              </button>
              <button
                onClick={() => {
                  setSortBy('date');
                  setSortOrder('asc');
                }}
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  sortBy === 'date'
                    ? 'bg-primary-100 text-primary-700 font-medium'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Appointment Date
              </button>
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="px-3 py-1.5 rounded-lg bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors"
            >
              {sortOrder === 'asc' ? '↑ Oldest First' : '↓ Newest First'}
            </button>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Patient</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Doctor</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Appointment</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Booked At</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td className="px-6 py-8 text-center text-neutral-500" colSpan={6}>
                    Loading appointments...
                  </td>
                </tr>
              ) : (
                sortedAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-neutral-900">{apt.patientName}</p>
                        <p className="text-sm text-neutral-500 flex items-center gap-1">
                          <FiPhone className="w-3 h-3" />
                          {apt.patientPhone}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-neutral-900">{apt.doctorName}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-900">{apt.date}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <FiClock className="w-4 h-4 text-neutral-400" />
                        <span className="text-neutral-600 text-sm">
                          {apt.startTime} - {apt.endTime}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-neutral-900">
                          {format(parseISO(apt.createdAt), 'MMM dd, yyyy')}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {format(parseISO(apt.createdAt), 'hh:mm a')}
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          {formatDistanceToNow(parseISO(apt.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[apt.status]}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => {
                            setSelectedAppointment(apt);
                            setViewModal(true);
                          }}
                          className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FiEye className="w-4 h-4" />
                        </button>
                        {apt.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateStatus(apt.id, 'confirmed')}
                              className="p-2 text-neutral-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Confirm"
                            >
                              <FiCheck className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateStatus(apt.id, 'cancelled')}
                              className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Cancel"
                            >
                              <FiX className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {apt.status === 'confirmed' && (
                          <button
                            onClick={() => updateStatus(apt.id, 'completed')}
                            className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                            title="Mark Complete"
                          >
                            <FiCheck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && sortedAppointments.length === 0 && (
          <div className="text-center py-12">
            <FiCalendar className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <p className="text-neutral-500">No appointments found</p>
            {(searchQuery || dateFilter || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setDateFilter('');
                  setStatusFilter('all');
                }}
                className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
              >
                Clear all filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* View Appointment Modal */}
      <Modal
        isOpen={viewModal}
        onClose={() => {
          setViewModal(false);
          setSelectedAppointment(null);
        }}
        title="Appointment Details"
      >
        {selectedAppointment && (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-neutral-500">Patient Name</p>
                <p className="font-medium text-neutral-900">{selectedAppointment.patientName}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Phone</p>
                <p className="font-medium text-neutral-900">{selectedAppointment.patientPhone}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Email</p>
                <p className="font-medium text-neutral-900">{selectedAppointment.patientEmail}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Doctor</p>
                <p className="font-medium text-neutral-900">{selectedAppointment.doctorName}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Appointment Date</p>
                <p className="font-medium text-neutral-900">{selectedAppointment.date}</p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Appointment Time</p>
                <p className="font-medium text-neutral-900">
                  {selectedAppointment.startTime} - {selectedAppointment.endTime}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Booked At</p>
                <p className="font-medium text-neutral-900">
                  {format(parseISO(selectedAppointment.createdAt), 'MMM dd, yyyy hh:mm a')}
                </p>
                <p className="text-xs text-neutral-500 mt-1">
                  {formatDistanceToNow(parseISO(selectedAppointment.createdAt), { addSuffix: true })}
                </p>
              </div>
              <div>
                <p className="text-sm text-neutral-500">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColors[selectedAppointment.status]}`}>
                  {selectedAppointment.status}
                </span>
              </div>
              {selectedAppointment.notes && (
                <div className="col-span-2">
                  <p className="text-sm text-neutral-500">Notes</p>
                  <p className="text-neutral-700">{selectedAppointment.notes}</p>
                </div>
              )}
            </div>
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="ghost" onClick={() => setViewModal(false)}>
                Close
              </Button>
              {selectedAppointment.status === 'pending' && (
                <Button onClick={() => {
                  updateStatus(selectedAppointment.id, 'confirmed');
                  setViewModal(false);
                }}>
                  Confirm Appointment
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
