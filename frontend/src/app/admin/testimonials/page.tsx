'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiStar,
  FiEye,
  FiEyeOff,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { get, post, patch, del, getErrorMessage } from '@/lib/api';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  isActive: boolean;
  order?: number;
  photo?: string;
  createdAt: string;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editModal, setEditModal] = useState<{ open: boolean; testimonial: Testimonial | null }>({
    open: false,
    testimonial: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; testimonial: Testimonial | null }>({
    open: false,
    testimonial: null,
  });
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    rating: '5',
    content: '',
    order: '0',
    photo: '',
  });

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setIsLoading(true);
        const data = await get<Testimonial[]>('testimonials/admin/list');
        setTestimonials(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Failed to load testimonials', error);
        toast.error(getErrorMessage(error) || 'Failed to load testimonials');
      } finally {
        setIsLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  const filteredTestimonials = testimonials.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openAddModal = () => {
    setFormData({ name: '', role: '', rating: '5', content: '', order: '0', photo: '' });
    setEditModal({ open: true, testimonial: null });
  };

  const openEditModal = (testimonial: Testimonial) => {
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      rating: testimonial.rating.toString(),
      content: testimonial.content,
      order: (testimonial.order ?? 0).toString(),
      photo: testimonial.photo ?? '',
    });
    setEditModal({ open: true, testimonial });
  };

  const handleSave = async () => {
    if (!formData.name || !formData.content) {
      toast.error('Please fill required fields');
      return;
    }

    try {
      const photo = formData.photo.trim() || undefined;
      if (editModal.testimonial) {
        const updated = await patch<Testimonial>(`testimonials/${editModal.testimonial.id}`, {
          name: formData.name,
          role: formData.role,
          rating: Number(formData.rating),
          content: formData.content,
          order: Number(formData.order) || 0,
          photo,
        });
        setTestimonials(testimonials.map((t) => (t.id === updated.id ? updated : t)));
        toast.success('Testimonial updated');
      } else {
        const newTestimonial = await post<Testimonial>('testimonials', {
          name: formData.name,
          role: formData.role,
          rating: Number(formData.rating),
          content: formData.content,
          isActive: true,
          order: Number(formData.order) || 0,
          photo,
        });
        setTestimonials([newTestimonial, ...testimonials]);
        toast.success('Testimonial added');
      }
      setEditModal({ open: false, testimonial: null });
    } catch (error) {
      console.error('Failed to save testimonial', error);
      toast.error(getErrorMessage(error) || 'Failed to save testimonial');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.testimonial) return;
    try {
      await del<void>(`testimonials/${deleteModal.testimonial.id}`);
      setTestimonials(testimonials.filter((t) => t.id !== deleteModal.testimonial!.id));
      toast.success('Testimonial deleted');
      setDeleteModal({ open: false, testimonial: null });
    } catch (error) {
      console.error('Failed to delete testimonial', error);
      toast.error(getErrorMessage(error) || 'Failed to delete testimonial');
    }
  };

  const toggleActive = async (id: string, current: boolean) => {
    try {
      const updated = await patch<Testimonial>(`testimonials/${id}`, { isActive: !current });
      setTestimonials(testimonials.map((t) => (t.id === id ? updated : t)));
      toast.success('Testimonial visibility updated');
    } catch (error) {
      console.error('Failed to update testimonial', error);
      toast.error(getErrorMessage(error) || 'Failed to update testimonial');
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <FiStar
        key={i}
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-neutral-300'}`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Testimonials</h1>
          <p className="text-neutral-600 mt-1">Manage patient reviews and feedback</p>
        </div>
        <Button onClick={openAddModal}>
          <FiPlus className="w-4 h-4 mr-2" />
          Add Testimonial
        </Button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-soft p-4">
        <Input
          placeholder="Search testimonials..."
          leftIcon={<FiSearch className="w-5 h-5" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Testimonials Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {isLoading ? (
          <div className="col-span-full text-center py-12">
            <p className="text-neutral-500">Loading testimonials...</p>
          </div>
        ) : (
          filteredTestimonials.map((testimonial) => (
          <motion.div
            key={testimonial.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white rounded-xl shadow-soft p-6 ${!testimonial.isActive ? 'opacity-60' : ''}`}
          >
            <div className="flex items-start justify-between gap-2 mb-4">
              <div className="min-w-0 flex gap-3">
                {testimonial.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={testimonial.photo}
                    alt=""
                    className="w-12 h-12 rounded-full object-cover shrink-0 border border-neutral-100"
                  />
                ) : null}
                <div className="min-w-0">
                <h3 className="font-heading font-semibold text-neutral-900 truncate">{testimonial.name}</h3>
                <p className="text-sm text-primary-600 break-words">{testimonial.role}</p>
                {typeof testimonial.order === 'number' && (
                  <p className="text-xs text-neutral-400 mt-1">Order: {testimonial.order}</p>
                )}
                </div>
              </div>
              <button
                onClick={() => toggleActive(testimonial.id, testimonial.isActive)}
                className={`p-2 rounded-lg transition-colors ${
                  testimonial.isActive
                    ? 'text-green-600 hover:bg-green-50'
                    : 'text-neutral-400 hover:bg-neutral-100'
                }`}
                title={testimonial.isActive ? 'Visible on website' : 'Hidden from website'}
              >
                {testimonial.isActive ? <FiEye className="w-5 h-5" /> : <FiEyeOff className="w-5 h-5" />}
              </button>
            </div>

            <div className="flex gap-1 mb-3">{renderStars(testimonial.rating)}</div>

            <p className="text-neutral-600 text-sm mb-4 line-clamp-3">{testimonial.content}</p>

            <div className="flex items-center justify-between pt-4 border-t border-neutral-100">
              <span className="text-xs text-neutral-500">{new Date(testimonial.createdAt).toLocaleDateString()}</span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => openEditModal(testimonial)}>
                  <FiEdit className="w-4 h-4 mr-1" />
                  Edit
                </Button>
                <button
                  onClick={() => setDeleteModal({ open: true, testimonial })}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {!isLoading && filteredTestimonials.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-soft">
          <p className="text-neutral-500">No testimonials found</p>
        </div>
      )}

      {/* Edit/Add Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, testimonial: null })}
        title={editModal.testimonial ? 'Edit Testimonial' : 'Add Testimonial'}
      >
        <div className="p-6 space-y-4">
          <Input
            label="Patient Name"
            placeholder="Full name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Role"
            placeholder="e.g., Patient · Family Medicine"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          />
          <Input
            label="Photo URL (optional)"
            placeholder="https://… profile or avatar image"
            value={formData.photo}
            onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
          />
          <Input
            label="Display order"
            type="number"
            min={0}
            placeholder="0 = first on homepage"
            value={formData.order}
            onChange={(e) => setFormData({ ...formData, order: e.target.value })}
          />
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">Rating</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: num.toString() })}
                  className="p-1"
                >
                  <FiStar
                    className={`w-6 h-6 transition-colors ${
                      num <= Number(formData.rating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-neutral-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <Textarea
            label="Testimonial"
            placeholder="Write the patient's feedback..."
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={4}
            required
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setEditModal({ open: false, testimonial: null })}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editModal.testimonial ? 'Update' : 'Add'} Testimonial
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, testimonial: null })}
        title="Delete Testimonial"
      >
        <div className="p-6">
          <p className="text-neutral-600">
            Are you sure you want to delete the testimonial from <strong>{deleteModal.testimonial?.name}</strong>?
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setDeleteModal({ open: false, testimonial: null })}>
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
