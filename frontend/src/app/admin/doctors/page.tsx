'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiPhone,
  FiMail,
  FiEye,
} from 'react-icons/fi';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { get, del, patch, PaginatedResponse, getErrorMessage } from '@/lib/api';

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo?: string;
  qualification: string;
  specialization: string;
  experience: number;
  consultationFee?: number;
  isActive: boolean;
}

const specializations = [
  'All',
  'General Medicine',
  'Gynecology and Obstetrics',
  'Pediatrics',
  'Internal Medicine',
  'Tuberculosis Care',
  'Preventive Care',
  'Lab Services',
  'Vaccination Services',
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; doctor: Doctor | null }>({
    open: false,
    doctor: null,
  });

  // Load doctors from API
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setIsLoading(true);
        // Call without query params to avoid potential errors
        const response = await get<PaginatedResponse<Doctor>>('doctors');
        setDoctors(response.data);
      } catch (error) {
        console.error('Failed to load doctors', error);
        toast.error(getErrorMessage(error) || 'Failed to load doctors');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialization =
      selectedSpecialization === 'All' || doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  const handleDelete = async () => {
    if (!deleteModal.doctor) return;

    try {
      await del<void>(`doctors/${deleteModal.doctor.id}`);
      setDoctors((prev) => prev.filter((d) => d.id !== deleteModal.doctor!.id));
      toast.success('Doctor deleted successfully');
    } catch (error) {
      console.error('Failed to delete doctor', error);
      toast.error(getErrorMessage(error) || 'Failed to delete doctor');
    } finally {
      setDeleteModal({ open: false, doctor: null });
    }
  };

  const toggleStatus = async (id: string, current: boolean) => {
    const newStatus = !current;
    try {
      await patch<Doctor, Partial<Doctor>>(`doctors/${id}`, { isActive: newStatus });
      setDoctors((prev) =>
        prev.map((d) => (d.id === id ? { ...d, isActive: newStatus } : d)),
      );
      toast.success('Doctor status updated');
    } catch (error) {
      console.error('Failed to update doctor status', error);
      toast.error(getErrorMessage(error) || 'Failed to update doctor status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Doctors</h1>
          <p className="text-neutral-600 mt-1">Manage your specialist team</p>
        </div>
        <Link href="/admin/doctors/new">
          <Button>
            <FiPlus className="w-4 h-4 mr-2" />
            Add Doctor
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Doctors', value: doctors.length, color: 'bg-primary-500' },
          { label: 'Active', value: doctors.filter((d) => d.isActive).length, color: 'bg-green-500' },
          { label: 'Inactive', value: doctors.filter((d) => !d.isActive).length, color: 'bg-neutral-400' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-soft">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${stat.color}`} />
              <span className="text-neutral-600 text-sm">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-neutral-900 mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-soft p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search doctors..."
              leftIcon={<FiSearch className="w-5 h-5" />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {specializations.slice(0, 4).map((spec) => (
              <button
                key={spec}
                onClick={() => setSelectedSpecialization(spec)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSpecialization === spec
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {spec}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Doctor</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Specialization</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Contact</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Fee</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
          {isLoading ? (
            <tr>
              <td className="px-6 py-8 text-center text-neutral-500" colSpan={6}>
                Loading doctors...
              </td>
            </tr>
          ) : (
            filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="hover:bg-neutral-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {doctor.photo ? (
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img
                            src={doctor.photo}
                            alt={doctor.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-primary-600 font-semibold text-sm">
                            {doctor.name
                              .split(' ')
                              .slice(0, 2)
                              .map((n) => n[0])
                              .join('')}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-neutral-900">{doctor.name}</p>
                        <p className="text-sm text-neutral-500">{doctor.qualification}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-neutral-900">{doctor.specialization}</span>
                    <p className="text-sm text-neutral-500">{doctor.experience} yrs exp</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-neutral-600 flex items-center gap-1">
                        <FiMail className="w-3 h-3" />
                        {doctor.email}
                      </p>
                      <p className="text-sm text-neutral-600 flex items-center gap-1">
                        <FiPhone className="w-3 h-3" />
                        {doctor.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-neutral-900">
                      Rs. {doctor.consultationFee ?? 0}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleStatus(doctor.id, doctor.isActive)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        doctor.isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {doctor.isActive ? 'active' : 'inactive'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/doctors/${doctor.id}`}
                        className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="View"
                      >
                        <FiEye className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/admin/doctors/${doctor.id}/edit`}
                        className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <FiEdit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ open: true, doctor })}
                        className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
          )}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredDoctors.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500">No doctors found matching your criteria</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, doctor: null })}
        title="Delete Doctor"
      >
        <div className="p-6">
          <p className="text-neutral-600">
            Are you sure you want to delete <strong>{deleteModal.doctor?.name}</strong>? 
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="ghost"
              onClick={() => setDeleteModal({ open: false, doctor: null })}
            >
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
