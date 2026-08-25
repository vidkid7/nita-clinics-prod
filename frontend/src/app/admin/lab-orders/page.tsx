'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  FiSearch,
  FiFilter,
  FiChevronDown,
  FiChevronUp,
  FiPhone,
  FiPackage,
  FiDollarSign,
  FiClipboard,
  FiXCircle,
  FiRefreshCw,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { get, patch, getErrorMessage } from '@/lib/api';
import { format, parseISO } from 'date-fns';
import type {
  LabOrder,
  LabOrderStatus,
  LabOrderPaymentStatus,
} from '@/types';

// ── Types ────────────────────────────────────────────────────────────────────

type AdminLabOrder = LabOrder;

interface StatsOverview {
  total: number;
  placed: number;
  confirmed: number;
  sample_collected: number;
  processing: number;
  completed: number;
  cancelled: number;
}

interface PaginatedOrders {
  data: AdminLabOrder[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ── Status helpers ───────────────────────────────────────────────────────────

const ORDER_STATUSES: LabOrderStatus[] = [
  'placed',
  'confirmed',
  'sample_collected',
  'processing',
  'completed',
  'cancelled',
];

const statusColorMap: Record<LabOrderStatus, string> = {
  placed: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  sample_collected: 'bg-purple-100 text-purple-700',
  processing: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusDotColor: Record<LabOrderStatus, string> = {
  placed: 'bg-yellow-500',
  confirmed: 'bg-blue-500',
  sample_collected: 'bg-purple-500',
  processing: 'bg-orange-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
};

const paymentStatusColors: Record<LabOrderPaymentStatus, string> = {
  unpaid: 'bg-red-100 text-red-700',
  paid: 'bg-green-100 text-green-700',
  refunded: 'bg-neutral-200 text-neutral-700',
};

const itemStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  collected: 'bg-blue-100 text-blue-700',
  processing: 'bg-orange-100 text-orange-700',
  completed: 'bg-green-100 text-green-700',
};

const VALID_NEXT_STATUSES: Record<LabOrderStatus, LabOrderStatus[]> = {
  placed: ['confirmed', 'cancelled'],
  confirmed: ['sample_collected', 'cancelled'],
  sample_collected: ['processing', 'cancelled'],
  processing: ['completed'],
  completed: [],
  cancelled: [],
};

const VALID_ITEM_NEXT: Record<string, string[]> = {
  pending: ['collected'],
  collected: ['processing'],
  processing: ['completed'],
  completed: [],
};

function formatStatus(s: string) {
  return s.replace(/_/g, ' ');
}

// ── Component ────────────────────────────────────────────────────────────────

export default function AdminLabOrdersPage() {
  const [orders, setOrders] = useState<AdminLabOrder[]>([]);
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | LabOrderStatus>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<AdminLabOrder | null>(null);
  const [detailModal, setDetailModal] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const limit = 20;

  // ── Data fetching ────────────────────────────────────────────────────────

  const fetchStats = useCallback(async () => {
    try {
      const data = await get<StatsOverview>('lab-orders/stats');
      setStats(data);
    } catch {
      // stats are non-critical, silently fall back
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: Record<string, string | number> = { page, limit };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchQuery.trim()) params.search = searchQuery.trim();

      const res = await get<PaginatedOrders>('lab-orders', { params });
      setOrders(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Failed to load lab orders');
    } finally {
      setIsLoading(false);
    }
  }, [page, limit, statusFilter, searchQuery]);

  useEffect(() => {
    fetchOrders();
    fetchStats();
  }, [fetchOrders, fetchStats]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, searchQuery]);

  // ── Order actions ────────────────────────────────────────────────────────

  const updateOrderStatus = async (orderId: string, status: LabOrderStatus) => {
    try {
      setUpdatingId(orderId);
      await patch(`lab-orders/${orderId}`, { status });
      toast.success(`Order status updated to ${formatStatus(status)}`);
      await Promise.all([fetchOrders(), fetchStats()]);
      if (selectedOrder?.id === orderId) {
        const updated = await get<AdminLabOrder>(`lab-orders/${orderId}`);
        setSelectedOrder(updated);
      }
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Failed to update order status');
    } finally {
      setUpdatingId(null);
    }
  };

  const updatePaymentStatus = async (orderId: string, paymentStatus: LabOrderPaymentStatus) => {
    try {
      setUpdatingId(orderId);
      await patch(`lab-orders/${orderId}`, { paymentStatus });
      toast.success(`Payment status updated to ${paymentStatus}`);
      await fetchOrders();
      if (selectedOrder?.id === orderId) {
        const updated = await get<AdminLabOrder>(`lab-orders/${orderId}`);
        setSelectedOrder(updated);
      }
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Failed to update payment status');
    } finally {
      setUpdatingId(null);
    }
  };

  const updateItemStatus = async (orderId: string, itemId: string, status: string) => {
    try {
      setUpdatingId(itemId);
      await patch(`lab-orders/items/${itemId}`, { status });
      toast.success(`Item status updated to ${formatStatus(status)}`);
      if (selectedOrder?.id === orderId) {
        const updated = await get<AdminLabOrder>(`lab-orders/${orderId}`);
        setSelectedOrder(updated);
      }
      await fetchOrders();
    } catch (error) {
      toast.error(getErrorMessage(error) || 'Failed to update item status');
    } finally {
      setUpdatingId(null);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    await updateOrderStatus(orderId, 'cancelled');
  };

  // ── Open detail modal ────────────────────────────────────────────────────

  const openDetail = async (order: AdminLabOrder) => {
    try {
      const detail = await get<AdminLabOrder>(`lab-orders/${order.id}`);
      setSelectedOrder(detail);
      setDetailModal(true);
    } catch {
      setSelectedOrder(order);
      setDetailModal(true);
    }
  };

  // ── Computed stats (fallback when API stats not available) ────────────────

  const displayStats: StatsOverview = stats || {
    total: orders.length,
    placed: orders.filter((o) => o.status === 'placed').length,
    confirmed: orders.filter((o) => o.status === 'confirmed').length,
    sample_collected: orders.filter((o) => o.status === 'sample_collected').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    completed: orders.filter((o) => o.status === 'completed').length,
    cancelled: orders.filter((o) => o.status === 'cancelled').length,
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Lab Orders</h1>
          <p className="text-neutral-600 mt-1">Manage lab test orders and track progress</p>
        </div>
        <Button
          variant="ghost"
          onClick={() => { fetchOrders(); fetchStats(); }}
          className="flex items-center gap-2"
        >
          <FiRefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4">
        {([
          { label: 'Total', key: 'total' as const, color: 'bg-primary-500', filterVal: 'all' as const },
          { label: 'Placed', key: 'placed' as const, color: statusDotColor.placed, filterVal: 'placed' as const },
          { label: 'Confirmed', key: 'confirmed' as const, color: statusDotColor.confirmed, filterVal: 'confirmed' as const },
          { label: 'Collected', key: 'sample_collected' as const, color: statusDotColor.sample_collected, filterVal: 'sample_collected' as const },
          { label: 'Processing', key: 'processing' as const, color: statusDotColor.processing, filterVal: 'processing' as const },
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
          <div className="flex-1">
            <Input
              placeholder="Search by order number, patient name, or phone..."
              leftIcon={<FiSearch className="w-5 h-5" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <FiFilter className="w-4 h-4 text-neutral-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | LabOrderStatus)}
              className="border border-neutral-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            >
              <option value="all">All Statuses</option>
              {ORDER_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {formatStatus(s).replace(/\b\w/g, (c) => c.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Order</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Patient</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Collection</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Payment</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Date</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td className="px-6 py-8 text-center text-neutral-500" colSpan={8}>
                    Loading lab orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td className="px-6 py-12 text-center" colSpan={8}>
                    <FiPackage className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                    <p className="text-neutral-500">No lab orders found</p>
                    {(searchQuery || statusFilter !== 'all') && (
                      <button
                        onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
                      >
                        Clear all filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <OrderRow
                    key={order.id}
                    order={order}
                    isExpanded={expandedOrderId === order.id}
                    onToggleExpand={() =>
                      setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
                    }
                    onViewDetail={() => openDetail(order)}
                    onUpdateStatus={updateOrderStatus}
                    onCancel={cancelOrder}
                    onUpdatePayment={updatePaymentStatus}
                    updatingId={updatingId}
                  />
                ))
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
        onClose={() => { setDetailModal(false); setSelectedOrder(null); }}
        title="Order Details"
      >
        {selectedOrder && (
          <OrderDetailView
            order={selectedOrder}
            onUpdateStatus={updateOrderStatus}
            onUpdatePayment={updatePaymentStatus}
            onUpdateItemStatus={updateItemStatus}
            onCancel={cancelOrder}
            updatingId={updatingId}
          />
        )}
      </Modal>
    </div>
  );
}

// ── Order table row ──────────────────────────────────────────────────────────

interface OrderRowProps {
  order: AdminLabOrder;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onViewDetail: () => void;
  onUpdateStatus: (id: string, status: LabOrderStatus) => void;
  onCancel: (id: string) => void;
  onUpdatePayment: (id: string, status: LabOrderPaymentStatus) => void;
  updatingId: string | null;
}

function OrderRow({
  order,
  isExpanded,
  onToggleExpand,
  onViewDetail,
  onUpdateStatus,
  onCancel,
  onUpdatePayment,
  updatingId,
}: OrderRowProps) {
  const nextStatuses = VALID_NEXT_STATUSES[order.status];
  const isUpdating = updatingId === order.id;

  return (
    <>
      <tr className="hover:bg-neutral-50 transition-colors">
        {/* Order number */}
        <td className="px-6 py-4">
          <button
            onClick={onViewDetail}
            className="font-medium text-primary-600 hover:text-primary-700 hover:underline"
          >
            {order.orderNumber}
          </button>
          <p className="text-xs text-neutral-400 mt-0.5">
            {order.items?.length || 0} item{(order.items?.length || 0) !== 1 ? 's' : ''}
          </p>
        </td>

        {/* Patient */}
        <td className="px-6 py-4">
          <p className="font-medium text-neutral-900">{order.patientName}</p>
          <p className="text-sm text-neutral-500 flex items-center gap-1">
            <FiPhone className="w-3 h-3" />
            {order.patientPhone}
          </p>
        </td>

        {/* Status */}
        <td className="px-6 py-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColorMap[order.status]}`}
          >
            {formatStatus(order.status)}
          </span>
        </td>

        {/* Collection type */}
        <td className="px-6 py-4">
          <span className="capitalize text-neutral-700 text-sm">{order.collectionType}</span>
          {order.collectionDate && (
            <p className="text-xs text-neutral-400 mt-0.5">
              {order.collectionDate}
              {order.collectionTime ? ` ${order.collectionTime}` : ''}
            </p>
          )}
        </td>

        {/* Amount */}
        <td className="px-6 py-4">
          <p className="font-medium text-neutral-900">
            {order.currency || 'NPR'} {order.totalAmount?.toLocaleString()}
          </p>
        </td>

        {/* Payment */}
        <td className="px-6 py-4">
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${paymentStatusColors[order.paymentStatus]}`}
          >
            {order.paymentStatus}
          </span>
        </td>

        {/* Date */}
        <td className="px-6 py-4">
          <p className="text-sm text-neutral-900">
            {safeFormat(order.createdAt, 'MMM dd, yyyy')}
          </p>
          <p className="text-xs text-neutral-500">
            {safeFormat(order.createdAt, 'hh:mm a')}
          </p>
        </td>

        {/* Actions */}
        <td className="px-6 py-4">
          <div className="flex items-center justify-end gap-1">
            {/* Expand items inline */}
            <button
              onClick={onToggleExpand}
              className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="Toggle items"
            >
              {isExpanded ? <FiChevronUp className="w-4 h-4" /> : <FiChevronDown className="w-4 h-4" />}
            </button>

            {/* View detail */}
            <button
              onClick={onViewDetail}
              className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
              title="View details"
            >
              <FiClipboard className="w-4 h-4" />
            </button>

            {/* Status transition dropdown */}
            {nextStatuses.length > 0 && (
              <select
                disabled={isUpdating}
                value=""
                onChange={(e) => {
                  const val = e.target.value as LabOrderStatus;
                  if (val === 'cancelled') onCancel(order.id);
                  else onUpdateStatus(order.id, val);
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

            {/* Payment update */}
            {order.paymentStatus !== 'paid' && order.status !== 'cancelled' && (
              <button
                disabled={isUpdating}
                onClick={() => onUpdatePayment(order.id, 'paid')}
                className="p-2 text-neutral-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                title="Mark as Paid"
              >
                <FiDollarSign className="w-4 h-4" />
              </button>
            )}

            {/* Cancel */}
            {order.status !== 'cancelled' && order.status !== 'completed' && (
              <button
                disabled={isUpdating}
                onClick={() => onCancel(order.id)}
                className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                title="Cancel Order"
              >
                <FiXCircle className="w-4 h-4" />
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Expanded items row */}
      {isExpanded && order.items && order.items.length > 0 && (
        <tr>
          <td colSpan={8} className="px-6 py-4 bg-neutral-50">
            <div className="space-y-2">
              <p className="text-sm font-medium text-neutral-700 mb-2">Order Items</p>
              <div className="grid gap-2">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between bg-white rounded-lg px-4 py-3 border border-neutral-200"
                  >
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{item.testName}</p>
                      <p className="text-xs text-neutral-500">
                        {order.currency || 'NPR'} {item.price?.toLocaleString()}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${itemStatusColors[item.status] || 'bg-neutral-100 text-neutral-600'}`}
                    >
                      {formatStatus(item.status)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── Order detail modal view ──────────────────────────────────────────────────

interface OrderDetailProps {
  order: AdminLabOrder;
  onUpdateStatus: (id: string, status: LabOrderStatus) => void;
  onUpdatePayment: (id: string, status: LabOrderPaymentStatus) => void;
  onUpdateItemStatus: (orderId: string, itemId: string, status: string) => void;
  onCancel: (id: string) => void;
  updatingId: string | null;
}

function OrderDetailView({
  order,
  onUpdateStatus,
  onUpdatePayment,
  onUpdateItemStatus,
  onCancel,
  updatingId,
}: OrderDetailProps) {
  const nextStatuses = VALID_NEXT_STATUSES[order.status];
  const isUpdating = updatingId === order.id;

  return (
    <div className="p-6 space-y-6">
      {/* Order info */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-neutral-500">Order Number</p>
          <p className="font-medium text-neutral-900">{order.orderNumber}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Status</p>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColorMap[order.status]}`}
          >
            {formatStatus(order.status)}
          </span>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Patient Name</p>
          <p className="font-medium text-neutral-900">{order.patientName}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Phone</p>
          <p className="font-medium text-neutral-900">{order.patientPhone}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Email</p>
          <p className="font-medium text-neutral-900">{order.patientEmail}</p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Collection Type</p>
          <p className="font-medium text-neutral-900 capitalize">{order.collectionType}</p>
        </div>
        {order.collectionDate && (
          <div>
            <p className="text-sm text-neutral-500">Collection Date</p>
            <p className="font-medium text-neutral-900">
              {order.collectionDate}
              {order.collectionTime ? ` at ${order.collectionTime}` : ''}
            </p>
          </div>
        )}
        <div>
          <p className="text-sm text-neutral-500">Total Amount</p>
          <p className="font-medium text-neutral-900">
            {order.currency || 'NPR'} {order.totalAmount?.toLocaleString()}
          </p>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Payment Status</p>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${paymentStatusColors[order.paymentStatus]}`}
          >
            {order.paymentStatus}
          </span>
        </div>
        <div>
          <p className="text-sm text-neutral-500">Created</p>
          <p className="font-medium text-neutral-900">
            {safeFormat(order.createdAt, 'MMM dd, yyyy hh:mm a')}
          </p>
        </div>
        {order.notes && (
          <div className="col-span-2">
            <p className="text-sm text-neutral-500">Notes</p>
            <p className="text-neutral-700">{order.notes}</p>
          </div>
        )}
      </div>

      {/* Order items */}
      {order.items && order.items.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 mb-3">
            Items ({order.items.length})
          </h3>
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-50">
                <tr>
                  <th className="text-left px-4 py-2 text-xs font-medium text-neutral-600">Test</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-neutral-600">Price</th>
                  <th className="text-left px-4 py-2 text-xs font-medium text-neutral-600">Status</th>
                  <th className="text-right px-4 py-2 text-xs font-medium text-neutral-600">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {order.items.map((item) => {
                  const itemNext = VALID_ITEM_NEXT[item.status] || [];
                  return (
                    <tr key={item.id} className="hover:bg-neutral-50">
                      <td className="px-4 py-3 text-sm text-neutral-900">{item.testName}</td>
                      <td className="px-4 py-3 text-sm text-neutral-700">
                        {order.currency || 'NPR'} {item.price?.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${itemStatusColors[item.status] || 'bg-neutral-100 text-neutral-600'}`}
                        >
                          {formatStatus(item.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {itemNext.length > 0 && (
                          <select
                            disabled={updatingId === item.id}
                            value=""
                            onChange={(e) =>
                              onUpdateItemStatus(order.id, item.id, e.target.value)
                            }
                            className="text-xs border border-neutral-300 rounded-lg px-2 py-1 bg-white focus:ring-2 focus:ring-primary-500 outline-none disabled:opacity-50"
                          >
                            <option value="" disabled>
                              Update…
                            </option>
                            {itemNext.map((s) => (
                              <option key={s} value={s}>
                                → {formatStatus(s).replace(/\b\w/g, (c) => c.toUpperCase())}
                              </option>
                            ))}
                          </select>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Admin actions */}
      <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-neutral-200">
        {/* Order status transition */}
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
                  onClick={() => onUpdateStatus(order.id, s)}
                >
                  {formatStatus(s).replace(/\b\w/g, (c) => c.toUpperCase())}
                </Button>
              ))}
          </div>
        )}

        {/* Payment actions */}
        {order.paymentStatus === 'unpaid' && order.status !== 'cancelled' && (
          <Button
            size="sm"
            variant="ghost"
            disabled={isUpdating}
            onClick={() => onUpdatePayment(order.id, 'paid')}
            className="text-green-600 hover:bg-green-50"
          >
            Mark Paid
          </Button>
        )}
        {order.paymentStatus === 'paid' && order.status === 'cancelled' && (
          <Button
            size="sm"
            variant="ghost"
            disabled={isUpdating}
            onClick={() => onUpdatePayment(order.id, 'refunded')}
            className="text-neutral-600 hover:bg-neutral-100"
          >
            Refund
          </Button>
        )}

        {/* Cancel */}
        {order.status !== 'cancelled' && order.status !== 'completed' && (
          <Button
            size="sm"
            variant="ghost"
            disabled={isUpdating}
            onClick={() => onCancel(order.id)}
            className="text-red-600 hover:bg-red-50 ml-auto"
          >
            Cancel Order
          </Button>
        )}
      </div>
    </div>
  );
}

// ── Utility ──────────────────────────────────────────────────────────────────

function safeFormat(dateStr: string | undefined, fmt: string): string {
  if (!dateStr) return '—';
  try {
    return format(parseISO(dateStr), fmt);
  } catch {
    return dateStr;
  }
}
