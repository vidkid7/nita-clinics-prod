'use client';

import { useEffect, useState } from 'react';
import { del, get, patch, post } from '@/lib/api';
import { getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';

interface HealthCardCategory {
  id: string;
  name: string;
  type: string;
  summary?: string;
  opdDiscount?: string;
  labDiscount?: string;
  medicineDiscount?: string;
  queueBenefit?: string;
  notes?: string;
  price?: number;
  image?: string;
  isActive?: boolean;
  order?: number;
}

const initialForm = {
  name: '',
  type: 'general_public',
  summary: '',
  opdDiscount: '',
  labDiscount: '',
  medicineDiscount: '',
  queueBenefit: '',
  notes: '',
  price: 0,
  image: '',
  isActive: true,
  order: 0,
};

type FormState = typeof initialForm;

function toPayload(form: FormState) {
  return {
    name: form.name.trim(),
    type: form.type,
    summary: form.summary.trim() || undefined,
    opdDiscount: form.opdDiscount.trim() || undefined,
    labDiscount: form.labDiscount.trim() || undefined,
    medicineDiscount: form.medicineDiscount.trim() || undefined,
    queueBenefit: form.queueBenefit.trim() || undefined,
    notes: form.notes.trim() || undefined,
    image: form.image.trim() || undefined,
    price: form.price > 0 ? form.price : undefined,
    isActive: form.isActive,
    order: form.order,
  };
}

export default function AdminHealthCardPage() {
  const [items, setItems] = useState<HealthCardCategory[]>([]);
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [heroTitle, setHeroTitle] = useState('');
  const [heroSubtitle, setHeroSubtitle] = useState('');

  const loadData = async () => {
    try {
      const categories = await get<HealthCardCategory[]>('health-card/categories', {
        params: { includeInactive: true },
      });
      setItems(categories || []);
      const pageData = await get<Record<string, string>>('health-card/page');
      setHeroTitle(pageData.healthCardHeroTitle || '');
      setHeroSubtitle(pageData.healthCardHeroSubtitle || '');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const startEdit = (item: HealthCardCategory) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      type: item.type,
      summary: item.summary || '',
      opdDiscount: item.opdDiscount || '',
      labDiscount: item.labDiscount || '',
      medicineDiscount: item.medicineDiscount || '',
      queueBenefit: item.queueBenefit || '',
      notes: item.notes || '',
      price: item.price != null ? Number(item.price) : 0,
      image: item.image || '',
      isActive: item.isActive !== false,
      order: item.order ?? 0,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const onSaveCategory = async () => {
    if (!form.name.trim()) {
      toast.error('Category name is required');
      return;
    }
    try {
      const payload = toPayload(form);
      if (editingId) {
        await patch(`health-card/categories/${editingId}`, payload);
        toast.success('Category updated');
      } else {
        await post('health-card/categories', payload);
        toast.success('Category created');
      }
      cancelEdit();
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm('Delete this category?')) {
      return;
    }
    try {
      await del(`health-card/categories/${id}`);
      toast.success('Category removed');
      if (editingId === id) cancelEdit();
      loadData();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const onSavePage = async () => {
    try {
      await patch('health-card/page', { heroTitle, heroSubtitle });
      toast.success('Page content updated');
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-heading font-semibold text-neutral-900">Health Card</h1>

      <section className="bg-white border border-neutral-200 rounded-xl p-5">
        <h2 className="text-lg font-medium mb-4">Page Content</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input className="input" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="Hero title" />
          <input className="input" value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} placeholder="Hero subtitle" />
        </div>
        <button type="button" className="btn-primary mt-4" onClick={onSavePage}>
          Save Page Content
        </button>
      </section>

      <section className="bg-white border border-neutral-200 rounded-xl p-5">
        <h2 className="text-lg font-medium mb-4">{editingId ? 'Edit category' : 'Add category'}</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <input className="input" placeholder="Category name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
          <select className="input" value={form.type} onChange={(e) => setForm((prev) => ({ ...prev, type: e.target.value }))}>
            <option value="licensed_doctors">Licensed Doctors</option>
            <option value="family">Family</option>
            <option value="partner_staff">Partner Staff</option>
            <option value="general_public">General Public</option>
          </select>
          <input className="input md:col-span-2" placeholder="Summary / tagline (short)" value={form.summary} onChange={(e) => setForm((prev) => ({ ...prev, summary: e.target.value }))} />
          <input className="input md:col-span-2" placeholder="Image URL (Cloudinary or HTTPS)" value={form.image} onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))} />
          <input className="input" placeholder="OPD discount" value={form.opdDiscount} onChange={(e) => setForm((prev) => ({ ...prev, opdDiscount: e.target.value }))} />
          <input className="input" placeholder="Lab discount" value={form.labDiscount} onChange={(e) => setForm((prev) => ({ ...prev, labDiscount: e.target.value }))} />
          <input className="input" placeholder="Medicine discount" value={form.medicineDiscount} onChange={(e) => setForm((prev) => ({ ...prev, medicineDiscount: e.target.value }))} />
          <input className="input" placeholder="Queue benefit" value={form.queueBenefit} onChange={(e) => setForm((prev) => ({ ...prev, queueBenefit: e.target.value }))} />
          <input className="input" type="number" placeholder="Price (optional)" value={form.price || ''} onChange={(e) => setForm((prev) => ({ ...prev, price: Number(e.target.value) || 0 }))} />
          <input className="input" type="number" placeholder="Sort order" value={form.order} onChange={(e) => setForm((prev) => ({ ...prev, order: Number(e.target.value) || 0 }))} />
          <label className="flex items-center gap-2 text-sm text-neutral-700 md:col-span-2">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => setForm((prev) => ({ ...prev, isActive: e.target.checked }))}
            />
            Active (visible on public health card page)
          </label>
          <input className="input md:col-span-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} />
        </div>
        <div className="flex flex-wrap gap-3 mt-4">
          <button type="button" className="btn-primary" onClick={onSaveCategory}>
            {editingId ? 'Update category' : 'Create category'}
          </button>
          {editingId ? (
            <button type="button" className="btn-secondary" onClick={cancelEdit}>
              Cancel
            </button>
          ) : null}
        </div>
      </section>

      <section className="bg-white border border-neutral-200 rounded-xl p-5 space-y-3">
        <h2 className="text-lg font-medium">Categories</h2>
        {items.length === 0 ? <p className="text-sm text-neutral-500">No categories yet.</p> : null}
        {items.map((item) => (
          <div key={item.id} className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-lg border border-neutral-200">
            <div className="flex items-center gap-3 min-w-0">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt="" className="w-14 h-10 object-cover rounded-md border border-neutral-200 flex-shrink-0" />
              ) : (
                <div className="w-14 h-10 rounded-md bg-neutral-100 border border-neutral-200 flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="font-medium truncate">{item.name}</p>
                <p className="text-sm text-neutral-500">
                  {item.type}
                  {item.isActive === false ? ' · inactive' : ''}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" className="text-primary-600 text-sm font-medium" onClick={() => startEdit(item)}>
                Edit
              </button>
              <button type="button" className="text-red-600 text-sm" onClick={() => onDelete(item.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
