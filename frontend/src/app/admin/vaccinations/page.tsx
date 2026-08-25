'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiShield,
  FiFilter,
  FiX,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { get, post, patch, del, getErrorMessage } from '@/lib/api';
import type { Vaccine } from '@/types';

const emptyForm = {
  name: '',
  shortName: '',
  tagline: '',
  description: '',
  longDescription: '',
  category: '',
  whoItIsFor: '',
  schedule: '',
  doses: '',
  protectsAgainst: '',
  sideEffects: '',
  contraindications: '',
  notes: '',
  availability: 'Available',
  priceNote: '',
  image: '',
  isActive: true,
  order: 0,
};

type FormData = typeof emptyForm;

function csvToArray(value: string): string[] {
  return value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
}

function arrayToCsv(arr?: string[]): string {
  return arr?.join(', ') ?? '';
}

export default function VaccinationsPage() {
  const [vaccines, setVaccines] = useState<Vaccine[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [editModal, setEditModal] = useState<{ open: boolean; vaccine: Vaccine | null }>({
    open: false,
    vaccine: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; vaccine: Vaccine | null }>({
    open: false,
    vaccine: null,
  });
  const [formData, setFormData] = useState<FormData>({ ...emptyForm });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchVaccines();
    fetchCategories();
  }, []);

  const fetchVaccines = async () => {
    try {
      setIsLoading(true);
      const data = await get<Vaccine[]>('vaccinations/admin');
      setVaccines(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load vaccines', error);
      toast.error(getErrorMessage(error) || 'Failed to load vaccines');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await get<string[]>('vaccinations/categories');
      setCategories(data);
    } catch {
      // categories are optional; silently ignore
    }
  };

  // Derived stats
  const stats = useMemo(() => {
    const total = vaccines.length;
    const active = vaccines.filter((v) => v.isActive).length;
    const inactive = total - active;
    return { total, active, inactive };
  }, [vaccines]);

  // Filtered list
  const filteredVaccines = useMemo(() => {
    return vaccines.filter((v) => {
      const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        !categoryFilter ||
        (v.category ?? []).some((c) => c.toLowerCase() === categoryFilter.toLowerCase());
      return matchesSearch && matchesCategory;
    });
  }, [vaccines, searchQuery, categoryFilter]);

  // All unique categories from current vaccines (merged with fetched)
  const allCategories = useMemo(() => {
    const fromVaccines = vaccines.flatMap((v) => v.category ?? []);
    return [...new Set([...categories, ...fromVaccines])].sort();
  }, [vaccines, categories]);

  const openAddModal = () => {
    setFormData({ ...emptyForm });
    setEditModal({ open: true, vaccine: null });
  };

  const openEditModal = (vaccine: Vaccine) => {
    setFormData({
      name: vaccine.name,
      shortName: vaccine.shortName ?? '',
      tagline: vaccine.tagline ?? '',
      description: vaccine.description ?? '',
      longDescription: vaccine.longDescription ?? '',
      category: arrayToCsv(vaccine.category),
      whoItIsFor: vaccine.whoItIsFor ?? '',
      schedule: vaccine.schedule ?? '',
      doses: vaccine.doses ?? '',
      protectsAgainst: arrayToCsv(vaccine.protectsAgainst),
      sideEffects: arrayToCsv(vaccine.sideEffects),
      contraindications: arrayToCsv(vaccine.contraindications),
      notes: vaccine.notes ?? '',
      availability: vaccine.availability ?? 'Available',
      priceNote: vaccine.priceNote ?? '',
      image: vaccine.image ?? '',
      isActive: vaccine.isActive,
      order: vaccine.order ?? 0,
    });
    setEditModal({ open: true, vaccine });
  };

  const buildPayload = () => ({
    name: formData.name,
    shortName: formData.shortName || undefined,
    tagline: formData.tagline || undefined,
    description: formData.description || undefined,
    longDescription: formData.longDescription || undefined,
    category: csvToArray(formData.category),
    whoItIsFor: formData.whoItIsFor || undefined,
    schedule: formData.schedule || undefined,
    doses: formData.doses || undefined,
    protectsAgainst: csvToArray(formData.protectsAgainst),
    sideEffects: csvToArray(formData.sideEffects),
    contraindications: csvToArray(formData.contraindications),
    notes: formData.notes || undefined,
    availability: formData.availability || 'Available',
    priceNote: formData.priceNote || undefined,
    image: formData.image || undefined,
    isActive: formData.isActive,
    order: Number(formData.order) || 0,
  });

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error('Vaccine name is required');
      return;
    }
    setIsSaving(true);
    try {
      if (editModal.vaccine) {
        const updated = await patch<Vaccine>(`vaccinations/${editModal.vaccine.id}`, buildPayload());
        setVaccines((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
        toast.success('Vaccine updated successfully');
      } else {
        const created = await post<Vaccine>('vaccinations', buildPayload());
        setVaccines((prev) => [...prev, created]);
        toast.success('Vaccine added successfully');
      }
      setEditModal({ open: false, vaccine: null });
      fetchCategories();
    } catch (error) {
      console.error('Save vaccine failed', error);
      toast.error(getErrorMessage(error) || 'Failed to save vaccine');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.vaccine) return;
    try {
      await del<void>(`vaccinations/${deleteModal.vaccine.id}`);
      setVaccines((prev) => prev.filter((v) => v.id !== deleteModal.vaccine!.id));
      toast.success('Vaccine deleted successfully');
      setDeleteModal({ open: false, vaccine: null });
      fetchCategories();
    } catch (error) {
      console.error('Delete vaccine failed', error);
      toast.error(getErrorMessage(error) || 'Failed to delete vaccine');
    }
  };

  const toggleActive = async (vaccine: Vaccine) => {
    try {
      const updated = await patch<Vaccine>(`vaccinations/${vaccine.id}`, {
        isActive: !vaccine.isActive,
      });
      setVaccines((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
      toast.success(`Vaccine ${updated.isActive ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Toggle active failed', error);
      toast.error(getErrorMessage(error) || 'Failed to update status');
    }
  };

  const updateField = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Vaccinations</h1>
          <p className="text-neutral-600 mt-1">Manage vaccines and immunization listings</p>
        </div>
        <Button onClick={openAddModal}>
          <FiPlus className="w-4 h-4 mr-2" />
          Add Vaccine
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Vaccines', value: stats.total, color: 'bg-blue-50 text-blue-700' },
          { label: 'Active', value: stats.active, color: 'bg-green-50 text-green-700' },
          { label: 'Inactive', value: stats.inactive, color: 'bg-neutral-100 text-neutral-600' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-soft p-4">
            <p className="text-sm text-neutral-500">{stat.label}</p>
            <p className={`text-2xl font-bold mt-1 ${stat.color.split(' ')[1]}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-xl shadow-soft p-4 flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search vaccines by name..."
            leftIcon={<FiSearch className="w-5 h-5" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="relative sm:w-56">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <FiFilter className="w-4 h-4" />
          </div>
          <select
            className="w-full pl-9 pr-8 py-2.5 border border-neutral-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">All Categories</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {categoryFilter && (
            <button
              onClick={() => setCategoryFilter('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              <FiX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Vaccines Table */}
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-soft p-8 text-center text-neutral-500">
          Loading vaccines...
        </div>
      ) : filteredVaccines.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-soft">
          <FiShield className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="text-neutral-500">No vaccines found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-100 bg-neutral-50">
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Categories</th>
                  <th className="text-left px-4 py-3 font-medium text-neutral-600">Availability</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-600">Active</th>
                  <th className="text-center px-4 py-3 font-medium text-neutral-600">Order</th>
                  <th className="text-right px-4 py-3 font-medium text-neutral-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredVaccines.map((vaccine) => (
                  <motion.tr
                    key={vaccine.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`border-b border-neutral-50 hover:bg-neutral-50 transition-colors ${
                      !vaccine.isActive ? 'opacity-60' : ''
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-neutral-900">{vaccine.name}</p>
                        {vaccine.tagline && (
                          <p className="text-xs text-neutral-500 mt-0.5">{vaccine.tagline}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {(vaccine.category ?? []).map((cat) => (
                          <span
                            key={cat}
                            className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-primary-50 text-primary-700"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-neutral-600">{vaccine.availability}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActive(vaccine)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          vaccine.isActive
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-neutral-400 hover:bg-neutral-100'
                        }`}
                        title={vaccine.isActive ? 'Active – click to deactivate' : 'Inactive – click to activate'}
                      >
                        {vaccine.isActive ? <FiEye className="w-5 h-5" /> : <FiEyeOff className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center text-neutral-600">{vaccine.order}</td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openEditModal(vaccine)}>
                          <FiEdit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteModal({ open: true, vaccine })}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add / Edit Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, vaccine: null })}
        title={editModal.vaccine ? 'Edit Vaccine' : 'Add New Vaccine'}
        size="lg"
      >
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Name *"
              placeholder="e.g., BCG Vaccine"
              value={formData.name}
              onChange={(e) => updateField('name', e.target.value)}
              required
            />
            <Input
              label="Short Name"
              placeholder="e.g., BCG"
              value={formData.shortName}
              onChange={(e) => updateField('shortName', e.target.value)}
            />
          </div>

          <Input
            label="Tagline"
            placeholder="Brief one-liner about this vaccine"
            value={formData.tagline}
            onChange={(e) => updateField('tagline', e.target.value)}
          />

          <Textarea
            label="Description"
            placeholder="Short description"
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
            rows={2}
          />

          <Textarea
            label="Long Description"
            placeholder="Detailed description for the vaccine detail page"
            value={formData.longDescription}
            onChange={(e) => updateField('longDescription', e.target.value)}
            rows={4}
          />

          {/* Category & Target */}
          <Input
            label="Categories"
            placeholder="e.g., Child, Travel, Routine (comma-separated)"
            helperText="Separate multiple categories with commas"
            value={formData.category}
            onChange={(e) => updateField('category', e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Who It Is For"
              placeholder="e.g., Infants, Adults"
              value={formData.whoItIsFor}
              onChange={(e) => updateField('whoItIsFor', e.target.value)}
            />
            <Input
              label="Schedule"
              placeholder="e.g., At birth"
              value={formData.schedule}
              onChange={(e) => updateField('schedule', e.target.value)}
            />
            <Input
              label="Doses"
              placeholder="e.g., Single dose"
              value={formData.doses}
              onChange={(e) => updateField('doses', e.target.value)}
            />
          </div>

          {/* Array fields */}
          <Input
            label="Protects Against"
            placeholder="e.g., Tuberculosis, Meningitis (comma-separated)"
            helperText="Separate items with commas"
            value={formData.protectsAgainst}
            onChange={(e) => updateField('protectsAgainst', e.target.value)}
          />

          <Input
            label="Side Effects"
            placeholder="e.g., Mild fever, Soreness (comma-separated)"
            helperText="Separate items with commas"
            value={formData.sideEffects}
            onChange={(e) => updateField('sideEffects', e.target.value)}
          />

          <Input
            label="Contraindications"
            placeholder="e.g., Immunocompromised, Pregnant (comma-separated)"
            helperText="Separate items with commas"
            value={formData.contraindications}
            onChange={(e) => updateField('contraindications', e.target.value)}
          />

          {/* Misc */}
          <Textarea
            label="Notes"
            placeholder="Additional notes or instructions"
            value={formData.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            rows={2}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Availability"
              placeholder="e.g., Available, On Request"
              value={formData.availability}
              onChange={(e) => updateField('availability', e.target.value)}
            />
            <Input
              label="Price Note"
              placeholder="e.g., Rs. 500 per dose"
              value={formData.priceNote}
              onChange={(e) => updateField('priceNote', e.target.value)}
            />
          </div>

          <Input
            label="Image URL"
            placeholder="https://..."
            value={formData.image}
            onChange={(e) => updateField('image', e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <Input
              label="Display Order"
              type="number"
              placeholder="0"
              value={String(formData.order)}
              onChange={(e) => updateField('order', Number(e.target.value) || 0)}
            />
            <label className="flex items-center gap-3 cursor-pointer pb-2">
              <div
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  formData.isActive ? 'bg-green-500' : 'bg-neutral-300'
                }`}
                onClick={() => updateField('isActive', !formData.isActive)}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                    formData.isActive ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </div>
              <span className="text-sm font-medium text-neutral-700">
                {formData.isActive ? 'Active' : 'Inactive'}
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-neutral-100">
            <Button variant="ghost" onClick={() => setEditModal({ open: false, vaccine: null })}>
              Cancel
            </Button>
            <Button onClick={handleSave} isLoading={isSaving}>
              {editModal.vaccine ? 'Update' : 'Add'} Vaccine
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, vaccine: null })}
        title="Delete Vaccine"
      >
        <div className="p-6">
          <p className="text-neutral-600">
            Are you sure you want to delete <strong>{deleteModal.vaccine?.name}</strong>? This action
            cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setDeleteModal({ open: false, vaccine: null })}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
