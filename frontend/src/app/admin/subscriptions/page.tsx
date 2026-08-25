'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiStar, FiUsers } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { get, post, patch, del, getErrorMessage } from '@/lib/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Textarea } from '@/components/ui/Textarea';

interface SubscriptionPlan {
  id: string;
  name: string;
  description?: string;
  benefits: string[];
  price: number;
  currency: string;
  durationMonths: number;
  isActive: boolean;
  order: number;
}

interface Subscription {
  id: string;
  patientId?: string;
  planId?: string;
  startDate: string;
  endDate: string;
  status: string;
  pricePaid?: number;
  currency: string;
  createdAt: string;
}

const INITIAL_PLAN_FORM = {
  name: '',
  description: '',
  benefits: '',
  price: '',
  currency: 'NPR',
  durationMonths: '12',
  isActive: true,
  order: '0',
};

export default function AdminSubscriptionsPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'plans' | 'subscriptions'>('plans');
  const [searchQuery, setSearchQuery] = useState('');
  const [planModal, setPlanModal] = useState<{ open: boolean; plan: SubscriptionPlan | null }>({ open: false, plan: null });
  const [formData, setFormData] = useState(INITIAL_PLAN_FORM);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [plansRes, subsRes] = await Promise.allSettled([
        get<SubscriptionPlan[]>('subscriptions/plans?includeInactive=true'),
        get<Subscription[]>('subscriptions'),
      ]);
      if (plansRes.status === 'fulfilled') setPlans(plansRes.value);
      if (subsRes.status === 'fulfilled') setSubscriptions(Array.isArray(subsRes.value) ? subsRes.value : []);
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setFormData(INITIAL_PLAN_FORM);
    setPlanModal({ open: true, plan: null });
  };

  const openEditModal = (plan: SubscriptionPlan) => {
    setFormData({
      name: plan.name,
      description: plan.description || '',
      benefits: plan.benefits.join('\n'),
      price: String(plan.price),
      currency: plan.currency,
      durationMonths: String(plan.durationMonths),
      isActive: plan.isActive,
      order: String(plan.order),
    });
    setPlanModal({ open: true, plan });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price) {
      toast.error('Name and price are required');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        benefits: formData.benefits.split('\n').map((b) => b.trim()).filter(Boolean),
        price: Number(formData.price),
        currency: formData.currency,
        durationMonths: Number(formData.durationMonths),
        isActive: formData.isActive,
        order: Number(formData.order),
      };

      if (planModal.plan) {
        const updated = await patch<SubscriptionPlan>(`subscriptions/plans/${planModal.plan.id}`, payload);
        setPlans((prev) => prev.map((p) => p.id === planModal.plan!.id ? updated : p));
        toast.success('Plan updated');
      } else {
        const created = await post<SubscriptionPlan>('subscriptions/plans', payload);
        setPlans((prev) => [...prev, created]);
        toast.success('Plan created');
      }
      setPlanModal({ open: false, plan: null });
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Failed to save plan');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this subscription plan?')) return;
    try {
      await del(`subscriptions/plans/${id}`);
      setPlans((prev) => prev.filter((p) => p.id !== id));
      toast.success('Plan deleted');
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Failed to delete plan');
    }
  };

  const handleCancelSub = async (id: string) => {
    if (!confirm('Cancel this subscription?')) return;
    try {
      await patch(`subscriptions/${id}/cancel`, {});
      setSubscriptions((prev) => prev.map((s) => s.id === id ? { ...s, status: 'cancelled' } : s));
      toast.success('Subscription cancelled');
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Failed to cancel subscription');
    }
  };

  const filteredPlans = plans.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Subscriptions</h1>
          <p className="text-neutral-500">Manage subscription plans and patient subscriptions</p>
        </div>
        {activeTab === 'plans' && (
          <Button onClick={openCreateModal}>
            <FiPlus className="w-4 h-4 mr-2" />
            New Plan
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-neutral-100 p-1 rounded-lg w-fit">
        {(['plans', 'subscriptions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors capitalize ${
              activeTab === tab ? 'bg-white text-neutral-900 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {tab === 'plans' ? (
              <span className="flex items-center gap-1.5"><FiStar className="w-4 h-4" /> Plans</span>
            ) : (
              <span className="flex items-center gap-1.5"><FiUsers className="w-4 h-4" /> Subscribers ({subscriptions.filter(s => s.status === 'active').length})</span>
            )}
          </button>
        ))}
      </div>

      {/* Plans tab */}
      {activeTab === 'plans' && (
        <div className="space-y-4">
          <div className="max-w-xs">
            <Input
              placeholder="Search plans..."
              leftIcon={<FiSearch className="w-5 h-5" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {isLoading ? (
            <div className="text-center py-12 text-neutral-500">Loading...</div>
          ) : filteredPlans.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <FiStar className="w-10 h-10 mx-auto mb-2 text-neutral-300" />
              <p>No subscription plans yet.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredPlans.map((plan) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`bg-white rounded-xl shadow-soft p-5 ${!plan.isActive ? 'opacity-60' : ''}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-neutral-900">{plan.name}</h3>
                      <p className="text-primary-600 font-bold mt-0.5">
                        {plan.currency} {Number(plan.price).toLocaleString()}
                        <span className="text-xs font-normal text-neutral-500"> / {plan.durationMonths} mo</span>
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${plan.isActive ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                      {plan.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  {plan.description && <p className="text-sm text-neutral-500 mb-3">{plan.description}</p>}
                  {plan.benefits.length > 0 && (
                    <ul className="space-y-1 mb-4">
                      {plan.benefits.slice(0, 3).map((b, i) => (
                        <li key={i} className="text-sm text-neutral-600 flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-primary-500 rounded-full flex-shrink-0" />
                          {b}
                        </li>
                      ))}
                      {plan.benefits.length > 3 && (
                        <li className="text-xs text-neutral-400">+{plan.benefits.length - 3} more</li>
                      )}
                    </ul>
                  )}
                  <div className="flex gap-2">
                    <button onClick={() => openEditModal(plan)} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700">
                      <FiEdit className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => handleDelete(plan.id)} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-700 ml-auto">
                      <FiTrash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Subscriptions tab */}
      {activeTab === 'subscriptions' && (
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          {isLoading ? (
            <div className="text-center py-12 text-neutral-500">Loading...</div>
          ) : subscriptions.length === 0 ? (
            <div className="text-center py-12 text-neutral-500">
              <FiUsers className="w-10 h-10 mx-auto mb-2 text-neutral-300" />
              <p>No subscriptions yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-neutral-600">Plan</th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-600">Start</th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-600">End</th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-600">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-neutral-600">Paid</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {subscriptions.map((sub) => {
                    const plan = plans.find((p) => p.id === sub.planId);
                    return (
                      <tr key={sub.id} className="hover:bg-neutral-50">
                        <td className="px-4 py-3 font-medium text-neutral-900">{plan?.name || '—'}</td>
                        <td className="px-4 py-3 text-neutral-600">{new Date(sub.startDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-neutral-600">{new Date(sub.endDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            sub.status === 'active' ? 'bg-green-100 text-green-700' :
                            sub.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-neutral-100 text-neutral-600'
                          }`}>{sub.status}</span>
                        </td>
                        <td className="px-4 py-3 text-neutral-600">
                          {sub.pricePaid ? `${sub.currency} ${Number(sub.pricePaid).toLocaleString()}` : '—'}
                        </td>
                        <td className="px-4 py-3">
                          {sub.status === 'active' && (
                            <button onClick={() => handleCancelSub(sub.id)} className="text-red-500 hover:text-red-700 text-xs">
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Plan Create/Edit Modal */}
      <Modal
        isOpen={planModal.open}
        onClose={() => setPlanModal({ open: false, plan: null })}
        title={planModal.plan ? 'Edit Subscription Plan' : 'Create Subscription Plan'}
      >
        <div className="space-y-4">
          <Input
            label="Plan Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Annual Health Plan"
            required
          />
          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Brief description of the plan"
            rows={2}
          />
          <Textarea
            label="Benefits (one per line)"
            value={formData.benefits}
            onChange={(e) => setFormData({ ...formData, benefits: e.target.value })}
            placeholder="Free OPD consultation&#10;10% discount on lab tests&#10;Priority booking"
            rows={4}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="5000"
            />
            <Input
              label="Currency"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              placeholder="NPR"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duration (months)"
              type="number"
              value={formData.durationMonths}
              onChange={(e) => setFormData({ ...formData, durationMonths: e.target.value })}
            />
            <Input
              label="Display Order"
              type="number"
              value={formData.order}
              onChange={(e) => setFormData({ ...formData, order: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="rounded"
            />
            Active (visible to patients)
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setPlanModal({ open: false, plan: null })}>
              Cancel
            </Button>
            <Button onClick={handleSave} isLoading={saving}>
              {planModal.plan ? 'Save Changes' : 'Create Plan'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
