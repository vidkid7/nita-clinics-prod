'use client';

import { useEffect, useState } from 'react';
import { del, get, patch, post } from '@/lib/api';
import { getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';

interface CheckupPackage {
  id: string;
  name: string;
  category: string;
  originalPrice: number;
  discountedPrice: number;
  tests: string[];
  isActive: boolean;
}

function normalizePackage(row: Record<string, unknown>): CheckupPackage {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    category: String(row.category ?? 'female_general'),
    originalPrice: Number(row.originalPrice ?? 0),
    discountedPrice: Number(row.discountedPrice ?? 0),
    tests: Array.isArray(row.tests) ? (row.tests as string[]) : [],
    isActive: row.isActive !== false,
  };
}

const initialForm = {
  name: '',
  category: 'female_general',
  originalPrice: 0,
  discountedPrice: 0,
  tests: '',
};

export default function AdminPackagesPage() {
  const [items, setItems] = useState<CheckupPackage[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadItems = async () => {
    try {
      setLoading(true);
      const response = await get<unknown>('packages/admin/all');
      const rows = Array.isArray(response) ? response : [];
      setItems(rows.map((r) => normalizePackage(r as Record<string, unknown>)));
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const startEdit = (item: CheckupPackage) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      originalPrice: Number(item.originalPrice),
      discountedPrice: Number(item.discountedPrice),
      tests: (item.tests || []).join('\n'),
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const onSave = async () => {
    const payload = {
      ...form,
      tests: form.tests.split('\n').map((item) => item.trim()).filter(Boolean),
    };
    try {
      if (editingId) {
        await patch(`packages/${editingId}`, payload);
        toast.success('Package updated');
        setEditingId(null);
      } else {
        await post('packages', payload);
        toast.success('Package created');
      }
      setForm(initialForm);
      loadItems();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm('Delete this package?')) {
      return;
    }
    try {
      await del(`packages/${id}`);
      toast.success('Package removed');
      if (editingId === id) cancelEdit();
      loadItems();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-semibold text-neutral-900">Check-up Packages</h1>

      <section className="bg-white rounded-xl border border-neutral-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-neutral-900">
            {editingId ? 'Edit Package' : 'Add Package'}
          </h2>
          {editingId && (
            <button onClick={cancelEdit} className="text-sm text-neutral-500 hover:text-neutral-700">
              Cancel Edit
            </button>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <input
            className="input"
            placeholder="Package name"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
          />
          <select
            className="input"
            value={form.category}
            onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
          >
            <option value="female_general">Female General</option>
            <option value="female_premium">Female Premium</option>
            <option value="male_general">Male General</option>
            <option value="male_premium">Male Premium</option>
            <option value="tuberculosis">Tuberculosis</option>
            <option value="pediatrics">Pediatrics</option>
            <option value="gynecology">Gynecology</option>
          </select>
          <input
            className="input"
            type="number"
            placeholder="Original price"
            value={form.originalPrice}
            onChange={(e) => setForm((prev) => ({ ...prev, originalPrice: Number(e.target.value) }))}
          />
          <input
            className="input"
            type="number"
            placeholder="Discounted price"
            value={form.discountedPrice}
            onChange={(e) => setForm((prev) => ({ ...prev, discountedPrice: Number(e.target.value) }))}
          />
          <textarea
            className="input md:col-span-2 min-h-28"
            placeholder="Included tests (one per line)"
            value={form.tests}
            onChange={(e) => setForm((prev) => ({ ...prev, tests: e.target.value }))}
          />
        </div>
        <button onClick={onSave} className="btn-primary mt-4">
          {editingId ? 'Update Package' : 'Save Package'}
        </button>
      </section>

      <section className="bg-white rounded-xl border border-neutral-200 p-5">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Existing Packages</h2>
        {loading ? (
          <p className="text-neutral-500">Loading...</p>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 rounded-lg border border-neutral-200">
                <div>
                  <p className="font-medium text-neutral-900">{item.name}</p>
                  <p className="text-sm text-neutral-500">
                    {item.category} | NPR {item.originalPrice} {'->'} NPR {item.discountedPrice}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-primary-600 text-sm hover:underline" onClick={() => startEdit(item)}>
                    Edit
                  </button>
                  <button className="text-red-600 text-sm" onClick={() => onDelete(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
