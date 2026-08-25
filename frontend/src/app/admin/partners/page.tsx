'use client';

import { useEffect, useState } from 'react';
import { del, get, patch, post } from '@/lib/api';
import { getErrorMessage } from '@/lib/api';
import toast from 'react-hot-toast';

interface Partner {
  id: string;
  name: string;
  url: string;
  logoUrl?: string;
  section: string;
}

const initialForm = {
  name: '',
  url: '',
  logoUrl: '',
  section: 'health_card',
};

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState<string | null>(null);

  const loadPartners = async () => {
    try {
      const response = await get<Partner[]>('partners', { params: { includeInactive: true } });
      setPartners(response || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  useEffect(() => {
    loadPartners();
  }, []);

  const startEdit = (partner: Partner) => {
    setEditingId(partner.id);
    setForm({
      name: partner.name,
      url: partner.url,
      logoUrl: partner.logoUrl || '',
      section: partner.section,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(initialForm);
  };

  const onSave = async () => {
    try {
      if (editingId) {
        await patch(`partners/${editingId}`, form);
        toast.success('Partner updated');
        setEditingId(null);
      } else {
        await post('partners', form);
        toast.success('Partner added');
      }
      setForm(initialForm);
      loadPartners();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const onDelete = async (id: string) => {
    if (!window.confirm('Delete this partner?')) {
      return;
    }
    try {
      await del(`partners/${id}`);
      toast.success('Partner deleted');
      if (editingId === id) cancelEdit();
      loadPartners();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-semibold text-neutral-900">Partners</h1>
        <p className="text-sm text-neutral-500 mt-1 max-w-2xl">
          Manage corporate / associate partner logos and links.{' '}
          <strong className="text-neutral-700">Homepage</strong> partners appear in the home page “Our Corporate Partners”
          carousel; use <strong className="text-neutral-700">Health Card</strong> or <strong className="text-neutral-700">Footer</strong>{' '}
          where the site reads those sections. Run <code className="text-xs bg-neutral-100 px-1 rounded">npm run seed:catalog</code>{' '}
          in the backend to load default partners if the list is empty.
        </p>
      </div>
      <section className="bg-white border border-neutral-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">{editingId ? 'Edit Partner' : 'Add Partner'}</h2>
          {editingId && (
            <button onClick={cancelEdit} className="text-sm text-neutral-500 hover:text-neutral-700">
              Cancel Edit
            </button>
          )}
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
          <input className="input" placeholder="External URL" value={form.url} onChange={(e) => setForm((prev) => ({ ...prev, url: e.target.value }))} />
          <input className="input" placeholder="Logo URL" value={form.logoUrl} onChange={(e) => setForm((prev) => ({ ...prev, logoUrl: e.target.value }))} />
          <select className="input" value={form.section} onChange={(e) => setForm((prev) => ({ ...prev, section: e.target.value }))}>
            <option value="health_card">Health Card</option>
            <option value="homepage">Homepage</option>
            <option value="footer">Footer</option>
          </select>
        </div>
        <button className="btn-primary mt-4" onClick={onSave}>
          {editingId ? 'Update Partner' : 'Save Partner'}
        </button>
      </section>

      <section className="bg-white border border-neutral-200 rounded-xl p-5 space-y-3">
        {partners.length === 0 && (
          <p className="text-sm text-neutral-500 py-6 text-center border border-dashed border-neutral-200 rounded-lg">
            No partners in the database yet. Add one above, or seed defaults with{' '}
            <code className="text-xs bg-neutral-100 px-1 rounded">npm run seed:catalog</code> from the backend folder.
          </p>
        )}
        {partners.map((partner) => (
          <div key={partner.id} className="flex items-center justify-between p-3 rounded-lg border border-neutral-200">
            <div>
              <p className="font-medium text-neutral-900">{partner.name}</p>
              <p className="text-sm text-neutral-500">{partner.section}</p>
            </div>
            <div className="flex items-center gap-3">
              <button className="text-primary-600 text-sm hover:underline" onClick={() => startEdit(partner)}>
                Edit
              </button>
              <button className="text-red-600 text-sm" onClick={() => onDelete(partner.id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
