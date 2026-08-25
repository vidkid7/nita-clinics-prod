'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  FiSearch,
  FiFilter,
  FiPhone,
  FiMapPin,
  FiTruck,
  FiXCircle,
  FiRefreshCw,
  FiPlus,
  FiUser,
  FiClock,
  FiCalendar,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { get, post, patch, getErrorMessage } from '@/lib/api';
import { format, parseISO, addDays } from 'date-fns';

// ── Types ────────────────────────────────────────────────────────────────────

type HomeCollectionStatus =
  | 'requested'
  | 'assigned'
  | 'en_route'
  | 'collected'
  | 'completed'
  | 'cancelled';

interface HomeCollection {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail?: string;
  address: string;
  city?: string;
  landmark?: string;
  preferredDate: string;
  preferredTimeSlot: string;
  status: HomeCollectionStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  serviceCharge?: number;
  collectionNotes?: string;
  adminNotes?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface StatsOverview {
  total: number;
  requested: number;
  assigned: number;
  en_route: number;
  collected: number;
  completed: number;
  cancelled: number;
}

/** Backend returns camelCase `enRoute`; normalize for the UI. */
function normalizeStats(raw: Record<string, number> | null | undefined): StatsOverview | null {
  if (!raw || typeof raw.total !== 'number') return null;
  return {
    total: raw.total,
    requested: raw.requested ?? 0,
    assigned: raw.assigned ?? 0,
    en_route: raw.en_route ?? raw.enRoute ?? 0,
    collected: raw.collected ?? 0,
    completed: raw.completed ?? 0,
    cancelled: raw.cancelled ?? 0,
  };
}

interface PaginatedCollections {
  data: HomeCollection[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Status helpers ───────────────────────────────────────────────────────────

const COLLECTION_STATUSES: HomeCollectionStatus[] = [
  'requested',
  'assigned',
  'en_route',
  'collected',
  'completed',
  'cancelled',
];

const statusColorMap: Record<HomeCollectionStatus, string> = {
  requested: 'bg-yellow-100 text-yellow-700',
  assigned: 'bg-blue-100 text-blue-700',
  en_route: 'bg-purple-100 text-purple-700',
  collected: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusDotColor: Record<HomeCollectionStatus, string> = {
  requested: 'bg-yellow-500',
  assigned: 'bg-blue-500',
  en_route: 'bg-purple-500',
  collected: 'bg-orange-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const VALID_NEXT_STATUSES: Record<HomeCollectionStatus, HomeCollectionStatus[]> = {
  requested: ['assigned', 'cancelled'],
  assigned: ['en_route', 'cancelled'],
  en_route: ['collected', 'cancelled'],
  collected: ['completed'],
  completed: [],
  cancelled: [],
};

function formatStatus(s: string) {
  return s.replace(/_/g, ' ');
}

function safeFormat(dateStr: string | undefined, fmt: string): string {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), fmt);
  } catch {
    return dateStr;
  }
}

const EMPTY_FORM = {
  patientName: '',
  patientPhone: '',
  patientEmail: '',
  address: '',
  city: '',
  landmark: '',
  preferredDate: '',
  preferredTimeSlot: '',
  serviceCharge: '',
  collectionNotes: '',
};

// ── Component ────────────────────────────────────────────────────────────────

export default function AdminHomeCollectionPage() {
  const [collections, setCollections] = useState<HomeCollection[]>([]);
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | HomeCollectionStatus>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedCollection, setSelectedCollection] = useState<HomeCollection | null>(null);
  const [detailModal, setDetailModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);
  const [assignTarget, setAssignTarget] = useState<HomeCollection | null>(null);
  const [assignStaffId, setAssignStaffId] = useState('');
  const [assignStaffName, setAssignStaffName] = useState('');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const limit = 20;

  // ── Data fetching ────────────────────────────────────────────────────────

  const fetchStats = useCallback(async () => {
    try {
      const data = await get<Record<string, number>>('home-collection/stats');
      const normalized = normalizeStats(data);
      if (normalized) setStats(normalized);
    } catch {
      // stats are non-critical
    }
  }, []);

  const fetchCollections = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: Record<string, string | number> = { page, limit };
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await get<PaginatedCollections>('home-collection', { params });
      setCollections(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Failed to load home collections');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, statusFilter]);

  useEffect(() => {
    fetchCollections();
    fetchStats();
  }, [fetchCollections, fetchStats]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter]);

  // ── Actions ──────────────────────────────────────────────────────────────

  const updateStatus = async (id: string, status: HomeCollectionStatus) => {
    try {
      setUpdatingId(id);
      await patch(`home-collection/${id}`, { status });
      toast.success(`Status updated to ${formatStatus(status)}`);
      await Promise.all([fetchCollections(), fetchStats()]);
      if (selectedCollection?.id === id) {
        const updated = await get<HomeCollection>(`home-collection/${id}`);
        setSelectedCollection(updated);
      }
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const cancelCollection = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this collection?')) return;
    await updateStatus(id, 'cancelled');
  };

  const openAssignModal = (collection: HomeCollection) => {
    setAssignTarget(collection);
    setAssignStaffId(collection.assignedStaffId || '');
    setAssignStaffName(collection.assignedStaffName || '');
    setAssignModal(true);
  };

  const handleAssignStaff = async () => {
    if (!assignTarget) return;
    if (!assignStaffId.trim() || !assignStaffName.trim()) {
      toast.error('Please enter both Staff ID and Staff Name');
      return;
    }
    try {
      setUpdatingId(assignTarget.id);
      await patch(`home-collection/${assignTarget.id}/assign`, {
        staffId: assignStaffId.trim(),
        staffName: assignStaffName.trim(),
      });
      toast.success(`Staff assigned: ${assignStaffName.trim()}`);
      setAssignModal(false);
      setAssignTarget(null);
      await Promise.all([fetchCollections(), fetchStats()]);
      if (selectedCollection?.id === assignTarget.id) {
        const updated = await get<HomeCollection>(`home-collection/${assignTarget.id}`);
        setSelectedCollection(updated);
      }
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Failed to assign staff');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!createForm.patientName.trim() || !createForm.patientPhone.trim() || !createForm.address.trim()) {
      toast.error('Please fill in required fields');
      return;
    }
    try {
      setIsSubmitting(true);
      const payload: Record<string, unknown> = {
        patientName: createForm.patientName.trim(),
        patientPhone: createForm.patientPhone.trim(),
        address: createForm.address.trim(),
      };
      if (createForm.patientEmail.trim()) payload.patientEmail = createForm.patientEmail.trim();
      if (createForm.city.trim()) payload.city = createForm.city.trim();
      if (createForm.landmark.trim()) payload.landmark = createForm.landmark.trim();
      if (createForm.preferredDate) payload.preferredDate = createForm.preferredDate;
      if (createForm.preferredTimeSlot.trim()) payload.preferredTimeSlot = createForm.preferredTimeSlot.trim();
      if (createForm.serviceCharge) payload.serviceCharge = Number(createForm.serviceCharge);
      if (createForm.collectionNotes.trim()) payload.collectionNotes = createForm.collectionNotes.trim();

      if (!payload.preferredDate) {
        payload.preferredDate = format(addDays(new Date(), 1), 'yyyy-MM-dd');
      }
      if (!payload.preferredTimeSlot || !String(payload.preferredTimeSlot).trim()) {
        payload.preferredTimeSlot = '9:00 AM - 11:00 AM';
      }

      await post('home-collection', payload);
      toast.success('Home collection created successfully');
      setCreateModal(false);
      setCreateForm(EMPTY_FORM);
      await Promise.all([fetchCollections(), fetchStats()]);
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Failed to create home collection');
    } finally {
      setIsSubmitting(false);
    }
  };

  const openDetail = async (collection: HomeCollection) => {
    try {
      const detail = await get<HomeCollection>(`home-collection/${collection.id}`);
      setSelectedCollection(detail);
      setDetailModal(true);
    } catch {
      setSelectedCollection(collection);
      setDetailModal(true);
    }
  };

  // ── Computed stats ───────────────────────────────────────────────────────

  const displayStats: StatsOverview = stats || {
    total: collections.length,
    requested: collections.filter((c) => c.status === 'requested').length,
    assigned: collections.filter((c) => c.status === 'assigned').length,
    en_route: collections.filter((c) => c.status === 'en_route').length,
    collected: collections.filter((c) => c.status === 'collected').length,
    completed: collections.filter((c) => c.status === 'completed').length,
    cancelled: collections.filter((c) => c.status === 'cancelled').length,
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Home Collection</h1>
          <p className="text-neutral-600 mt-1">Manage home sample collection requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            onClick={() => { fetchCollections(); fetchStats(); }}
            className="flex items-center gap-2"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button onClick={() => setCreateModal(true)} className="flex items-center gap-2">
            <FiPlus className="w-4 h-4" />
            New Collection
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        {([
          { label: 'Total', key: 'total' as const, color: 'bg-primary-500', filterVal: 'all' as const },
          { label: 'Requested', key: 'requested' as const, color: statusDotColor.requested, filterVal: 'requested' as const },
          { label: 'Assigned', key: 'assigned' as const, color: statusDotColor.assigned, filterVal: 'assigned' as const },
          { label: 'En Route', key: 'en_route' as const, color: statusDotColor.en_route, filterVal: 'en_route' as const },
          { label: 'Collected', key: 'collected' as const, color: statusDotColor.collected, filterVal: 'collected' as const },
          { label: 'Completed', key: 'completed' as const, color: statusDotColor.completed, filterVal: 'completed' as const },
          { label: 'Cancelled', key: 'cancelled' as const, color: statusDotColor.cancelled, filterVal: 'cancelled' as const },
        ]).map((stat) => (
          <button
            key={stat.key}
            onClick={() => setStatusFilter(stat.filterVal)}
            className={`bg-white rounded-xl p-4 shadow-soft text-left transition-all ${
              statusFilter === stat.filterVal ? 'ring-2 ring-primary-500' : ''
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${stat.color}`} />
              <span className="text-neutral-600 text-sm">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{displayStats[stat.key]}</p>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-soft p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2 ml-auto">
            <FiFilter className="w-4 h-4 text-neutral-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | HomeCollectionStatus)}
              className="border border-neutral-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="all">All Statuses</option>
              {COLLECTION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {formatStatus(s).replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Collections table */}
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Patient</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Address</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Schedule</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Staff</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Charge</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td className="px-6 py-8 text-center text-neutral-500" colSpan={7}>
                    Loading home collections...
                  </td>
                </tr>
              ) : collections.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center" colSpan={7}>
                    <FiTruck className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-500">No home collections found</p>
                    {statusFilter !== 'all' && (
                      <button
                        onClick={() => setStatusFilter('all')}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
                      >
                        Clear all filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                collections.map((collection) => {
                  const nextStatuses = VALID_NEXT_STATUSES[collection.status];
                  const isUpdating = updatingId === collection.id;

                  return (
                    <tr key={collection.id} className="hover:bg-neutral-50 transition-colors">
                      {/* Patient */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => openDetail(collection)}
                          className="font-medium text-primary-600 hover:text-primary-700 hover:underline text-left"
                        >
                          {collection.patientName}
                        </button>
                        <p className="text-sm text-neutral-500 flex items-center gap-1 mt-0.5">
                          <FiPhone className="w-3 h-3" />
                          {collection.patientPhone}
                        </p>
                      </td>

                      {/* Address */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-900 flex items-center gap-1">
                          <FiMapPin className="w-3 h-3 flex-shrink-0 text-neutral-400" />
                          <span className="line-clamp-2">{collection.address}</span>
                        </p>
                      </td>

                      {/* Schedule */}
                      <td className="px-6 py-4">
                        <p className="text-sm text-neutral-900 flex items-center gap-1">
                          <FiCalendar className="w-3 h-3 text-neutral-400" />
                          {collection.preferredDate
                            ? safeFormat(collection.preferredDate, 'MMM dd, yyyy')
                            : '—'}
                        </p>
                        {collection.preferredTimeSlot && (
                          <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                            <FiClock className="w-3 h-3" />
                            {collection.preferredTimeSlot}
                          </p>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColorMap[collection.status]}`}
                        >
                          {formatStatus(collection.status)}
                        </span>
                      </td>

                      {/* Staff */}
                      <td className="px-6 py-4">
                        {collection.assignedStaffName ? (
                          <p className="text-sm text-neutral-900 flex items-center gap-1">
                            <FiUser className="w-3 h-3 text-neutral-400" />
                            {collection.assignedStaffName}
                          </p>
                        ) : (
                          <span className="text-sm text-neutral-400">Unassigned</span>
                        )}
                      </td>

                      {/* Charge */}
                      <td className="px-6 py-4">
                        <p className="font-medium text-neutral-900">
                          {collection.serviceCharge != null
                            ? `NPR ${collection.serviceCharge.toLocaleString()}`
                            : '—'}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {/* Assign staff */}
                          {collection.status !== 'completed' && collection.status !== 'cancelled' && (
                            <button
                              onClick={() => openAssignModal(collection)}
                              className="p-2 text-neutral-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Assign Staff"
                            >
                              <FiUser className="w-4 h-4" />
                            </button>
                          )}

                          {/* Status transition */}
                          {nextStatuses.length > 0 && (
                            <select
                              disabled={isUpdating}
                              value=""
                              onChange={(e) => {
                                const val = e.target.value as HomeCollectionStatus;
                                if (val === 'cancelled') cancelCollection(collection.id);
                                else updateStatus(collection.id, val);
                              }}
                              className="text-xs border border-neutral-300 rounded-lg px-2 py-1.5 bg-white focus:ring-2 focus:ring-primary-500 outline-none disabled:opacity-50"
                            >
                              <option value="" disabled>
                                Update…
                              </option>
                              {nextStatuses.map((s) => (
                                <option key={s} value={s}>
                                  → {formatStatus(s).replace(/\b\w/g, (c) => c.toUpperCase())}
                                </option>
                              ))}
                            </select>
                          )}

                          {/* Cancel */}
                          {collection.status !== 'cancelled' && collection.status !== 'completed' && (
                            <button
                              disabled={isUpdating}
                              onClick={() => cancelCollection(collection.id)}
                              className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                              title="Cancel Collection"
                            >
                              <FiXCircle className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-soft px-6 py-4">
          <p className="text-sm text-neutral-600">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={detailModal}
        onClose={() => { setDetailModal(false); setSelectedCollection(null); }}
        title="Collection Details"
      >
        {selectedCollection && (
          <CollectionDetailView
            collection={selectedCollection}
            onUpdateStatus={updateStatus}
            onCancel={cancelCollection}
            onAssign={openAssignModal}
            updatingId={updatingId}
          />
        )}
      </Modal>

      {/* Assign Staff Modal */}
      <Modal
        isOpen={assignModal}
        onClose={() => { setAssignModal(false); setAssignTarget(null); }}
        title="Assign Staff"
      >
        <div className="p-6 space-y-4">
          <p className="text-sm text-neutral-600">
            Assign a staff member to collect samples for{' '}
            <span className="font-medium text-neutral-900">{assignTarget?.patientName}</span>
          </p>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Staff ID *</label>
            <input
              type="text"
              value={assignStaffId}
              onChange={(e) => setAssignStaffId(e.target.value)}
              placeholder="Enter staff ID"
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Staff Name *</label>
            <input
              type="text"
              value={assignStaffName}
              onChange={(e) => setAssignStaffName(e.target.value)}
              placeholder="Enter staff name"
              className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => { setAssignModal(false); setAssignTarget(null); }}>
              Cancel
            </Button>
            <Button
              onClick={handleAssignStaff}
              disabled={updatingId === assignTarget?.id}
            >
              {updatingId === assignTarget?.id ? 'Assigning...' : 'Assign Staff'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Create Collection Modal */}
      <Modal
        isOpen={createModal}
        onClose={() => { setCreateModal(false); setCreateForm(EMPTY_FORM); }}
        title="Create Home Collection"
      >
        <form onSubmit={handleCreate} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Patient Name *</label>
              <input
                type="text"
                required
                value={createForm.patientName}
                onChange={(e) => setCreateForm((f) => ({ ...f, patientName: e.target.value }))}
                placeholder="Full name"
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Phone *</label>
              <input
                type="tel"
                required
                value={createForm.patientPhone}
                onChange={(e) => setCreateForm((f) => ({ ...f, patientPhone: e.target.value }))}
                placeholder="Phone number"
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
              <input
                type="email"
                value={createForm.patientEmail}
                onChange={(e) => setCreateForm((f) => ({ ...f, patientEmail: e.target.value }))}
                placeholder="Email address"
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Address *</label>
              <input
                type="text"
                required
                value={createForm.address}
                onChange={(e) => setCreateForm((f) => ({ ...f, address: e.target.value }))}
                placeholder="Full address"
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
              <input
                type="text"
                value={createForm.city}
                onChange={(e) => setCreateForm((f) => ({ ...f, city: e.target.value }))}
                placeholder="City"
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Landmark</label>
              <input
                type="text"
                value={createForm.landmark}
                onChange={(e) => setCreateForm((f) => ({ ...f, landmark: e.target.value }))}
                placeholder="Nearby landmark"
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Preferred Date</label>
              <input
                type="date"
                value={createForm.preferredDate}
                onChange={(e) => setCreateForm((f) => ({ ...f, preferredDate: e.target.value }))}
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Time Slot</label>
              <input
                type="text"
                value={createForm.preferredTimeSlot}
                onChange={(e) => setCreateForm((f) => ({ ...f, preferredTimeSlot: e.target.value }))}
                placeholder="e.g. 9:00 AM - 11:00 AM"
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Service Charge (NPR)</label>
              <input
                type="number"
                min="0"
                value={createForm.serviceCharge}
                onChange={(e) => setCreateForm((f) => ({ ...f, serviceCharge: e.target.value }))}
                placeholder="0"
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Collection Notes</label>
              <textarea
                rows={3}
                value={createForm.collectionNotes}
                onChange={(e) => setCreateForm((f) => ({ ...f, collectionNotes: e.target.value }))}
                placeholder="Any special instructions..."
                className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => { setCreateModal(false); setCreateForm(EMPTY_FORM); }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Collection'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

// ── Collection detail modal view ─────────────────────────────────────────────

interface CollectionDetailProps {
  collection: HomeCollection;
  onUpdateStatus: (id: string, status: HomeCollectionStatus) => void;
  onCancel: (id: string) => void;
  onAssign: (collection: HomeCollection) => void;
  updatingId: string | null;
}

function CollectionDetailView({
  collection,
  onUpdateStatus,
  onCancel,
  onAssign,
  updatingId,
}: CollectionDetailProps) {
  const nextStatuses = VALID_NEXT_STATUSES[collection.status];
  const isUpdating = updatingId === collection.id;

  return (
    <div className="p-6 space-y-6">
      {/* Info grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-neutral-500">Patient Name</p>
          <p className="font-medium text-neutral-900">{collection.patientName}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Status</p>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColorMap[collection.status]}`}
          >
            {formatStatus(collection.status)}
          </span>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Phone</p>
          <p className="font-medium text-neutral-900">{collection.patientPhone}</p>
        </div>
        {collection.patientEmail && (
          <div>
            <p className="text-sm text-neutral-500">Email</p>
            <p className="font-medium text-neutral-900">{collection.patientEmail}</p>
          </div>
        )}
        <div className="col-span-2">
          <p className="text-sm text-neutral-500">Address</p>
          <p className="font-medium text-neutral-900">{collection.address}</p>
        </div>
        {collection.city && (
          <div>
            <p className="text-sm text-neutral-500">City</p>
            <p className="font-medium text-neutral-900">{collection.city}</p>
          </div>
        )}
        {collection.landmark && (
          <div>
            <p className="text-sm text-neutral-500">Landmark</p>
            <p className="font-medium text-neutral-900">{collection.landmark}</p>
          </div>
        )}
        <div>
          <p className="text-sm text-neutral-500">Preferred Date</p>
          <p className="font-medium text-neutral-900">
            {collection.preferredDate
              ? safeFormat(collection.preferredDate, 'MMM dd, yyyy')
              : '—'}
          </p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Time Slot</p>
          <p className="font-medium text-neutral-900">{collection.preferredTimeSlot || '—'}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Service Charge</p>
          <p className="font-medium text-neutral-900">
            {collection.serviceCharge != null
              ? `NPR ${collection.serviceCharge.toLocaleString()}`
              : '—'}
          </p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Assigned Staff</p>
          <p className="font-medium text-neutral-900">
            {collection.assignedStaffName || 'Unassigned'}
          </p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Created</p>
          <p className="font-medium text-neutral-900">
            {safeFormat(collection.createdAt, 'MMM dd, yyyy hh:mm a')}
          </p>
        </div>
        {collection.updatedAt && (
          <div>
            <p className="text-sm text-neutral-500">Last Updated</p>
            <p className="font-medium text-neutral-900">
              {safeFormat(collection.updatedAt, 'MMM dd, yyyy hh:mm a')}
            </p>
          </div>
        )}
        {collection.collectionNotes && (
          <div className="col-span-2">
            <p className="text-sm text-neutral-500">Collection Notes</p>
            <p className="text-neutral-700">{collection.collectionNotes}</p>
          </div>
        )}
        {collection.adminNotes && (
          <div className="col-span-2">
            <p className="text-sm text-neutral-500">Admin Notes</p>
            <p className="text-neutral-700">{collection.adminNotes}</p>
          </div>
        )}
      </div>

      {/* Admin actions */}
      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-200">
        {/* Assign staff */}
        {collection.status !== 'completed' && collection.status !== 'cancelled' && (
          <Button size="sm" variant="ghost" onClick={() => onAssign(collection)}>
            <FiUser className="w-4 h-4 mr-1" />
            {collection.assignedStaffName ? 'Reassign Staff' : 'Assign Staff'}
          </Button>
        )}

        {/* Status transitions */}
        {nextStatuses.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-600">Update status:</span>
            {nextStatuses
              .filter((s) => s !== 'cancelled')
              .map((s) => (
                <Button
                  key={s}
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => onUpdateStatus(collection.id, s)}
                >
                  {formatStatus(s).replace(/\b\w/g, (c) => c.toUpperCase())}
                </Button>
              ))}
          </div>
        )}

        {/* Cancel */}
        {collection.status !== 'cancelled' && collection.status !== 'completed' && (
          <Button
            size="sm"
            variant="ghost"
            disabled={isUpdating}
            onClick={() => onCancel(collection.id)}
            className="text-red-600 hover:bg-red-50 ml-auto"
          >
            Cancel Collection
          </Button>
        )}
      </div>
    </div>
  );
}
