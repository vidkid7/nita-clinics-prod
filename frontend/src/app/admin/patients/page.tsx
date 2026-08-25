'use client';

import { useEffect, useRef, useState } from 'react';
import {
  FiPlus,
  FiSearch,
  FiEdit,
  FiTrash2,
  FiUser,
  FiPhone,
  FiMail,
  FiChevronDown,
  FiChevronUp,
} from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Textarea } from '@/components/ui/Textarea';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import toast from 'react-hot-toast';
import { get, post, patch, del, PaginatedResponse, getErrorMessage } from '@/lib/api';
import { isPasswordStrong, PASSWORD_HINT, PASSWORD_MIN_LENGTH } from '@/lib/password-rules';

interface Patient {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth?: string;
  gender?: string;
  bloodGroup?: string;
  address?: string;
  city?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalHistory?: string;
  allergies?: string;
  isActive: boolean;
  createdAt?: string;
}

interface PatientFormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  address: string;
  city: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalHistory: string;
  allergies: string;
}

const genderOptions = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

const bloodGroupOptions = [
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];

const emptyFormData: PatientFormData = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
  newPassword: '',
  confirmNewPassword: '',
  dateOfBirth: '',
  gender: '',
  bloodGroup: '',
  address: '',
  city: '',
  emergencyContactName: '',
  emergencyContactPhone: '',
  medicalHistory: '',
  allergies: '',
};

function patientToForm(p: Patient): PatientFormData {
  return {
    fullName: p.fullName || '',
    email: p.email || '',
    phone: p.phone || '',
    password: '',
    confirmPassword: '',
    newPassword: '',
    confirmNewPassword: '',
    dateOfBirth: p.dateOfBirth ? p.dateOfBirth.split('T')[0] : '',
    gender: p.gender || '',
    bloodGroup: p.bloodGroup || '',
    address: p.address || '',
    city: p.city || '',
    emergencyContactName: p.emergencyContactName || '',
    emergencyContactPhone: p.emergencyContactPhone || '',
    medicalHistory: p.medicalHistory || '',
    allergies: p.allergies || '',
  };
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editModal, setEditModal] = useState<{ open: boolean; patient: Patient | null }>({
    open: false,
    patient: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; patient: Patient | null }>({
    open: false,
    patient: null,
  });
  const [formData, setFormData] = useState<PatientFormData>(emptyFormData);
  const [isSaving, setIsSaving] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editModal.open) {
      setShowMore(false);
      // give modal a tick to mount before focusing
      const t = setTimeout(() => firstFieldRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [editModal.open]);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setIsLoading(true);
      const response = await get<PaginatedResponse<Patient>>('patients');
      setPatients(response.data);
    } catch (error) {
      console.error('Failed to load patients', error);
      toast.error(getErrorMessage(error) || 'Failed to load patients');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPatients = patients.filter((patient) => {
    const query = searchQuery.toLowerCase();
    return (
      patient.fullName.toLowerCase().includes(query) ||
      patient.email.toLowerCase().includes(query) ||
      (patient.phone && patient.phone.includes(query))
    );
  });

  const openAddModal = () => {
    setFormData(emptyFormData);
    setEditModal({ open: true, patient: null });
  };

  const openEditModal = async (patient: Patient) => {
    setEditModal({ open: true, patient });
    setFormData(patientToForm(patient));
    try {
      const full = await get<Patient>(`patients/${patient.id}`);
      setEditModal({ open: true, patient: full });
      setFormData(patientToForm(full));
    } catch {
      toast.error('Using list data; some fields may be incomplete until refresh.');
    }
  };

  const handleSave = async () => {
    if (!formData.fullName || !formData.phone) {
      toast.error('Full name and phone are required');
      return;
    }

    if (!editModal.patient) {
      if (!formData.email) {
        toast.error('Email is required for new patients');
        return;
      }
      if (!isPasswordStrong(formData.password)) {
        toast.error(PASSWORD_HINT);
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }

    if (editModal.patient) {
      if (formData.newPassword || formData.confirmNewPassword) {
        if (formData.newPassword !== formData.confirmNewPassword) {
          toast.error('New passwords do not match');
          return;
        }
        if (!isPasswordStrong(formData.newPassword)) {
          toast.error(PASSWORD_HINT);
          return;
        }
      }
    }

    setIsSaving(true);
    try {
      if (editModal.patient) {
        const body: Record<string, unknown> = {
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          dateOfBirth: formData.dateOfBirth || undefined,
          gender: formData.gender || undefined,
          bloodGroup: formData.bloodGroup || undefined,
          address: formData.address.trim() || undefined,
          city: formData.city.trim() || undefined,
          emergencyContactName: formData.emergencyContactName.trim() || undefined,
          emergencyContactPhone: formData.emergencyContactPhone.trim() || undefined,
          medicalHistory: formData.medicalHistory.trim() || undefined,
          allergies: formData.allergies.trim() || undefined,
        };
        if (formData.newPassword) {
          body.newPassword = formData.newPassword;
        }
        const updated = await patch<Patient>(`patients/${editModal.patient.id}`, body);
        setPatients((prev) => prev.map((p) => (p.id === updated.id ? { ...p, ...updated } : p)));
        toast.success('Patient updated successfully');
      } else {
        const newPatient = await post<Patient>('patients', {
          fullName: formData.fullName.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          password: formData.password,
          dateOfBirth: formData.dateOfBirth || undefined,
          gender: formData.gender || undefined,
          bloodGroup: formData.bloodGroup || undefined,
          address: formData.address.trim() || undefined,
          city: formData.city.trim() || undefined,
          emergencyContactName: formData.emergencyContactName.trim() || undefined,
          emergencyContactPhone: formData.emergencyContactPhone.trim() || undefined,
          medicalHistory: formData.medicalHistory.trim() || undefined,
          allergies: formData.allergies.trim() || undefined,
        });
        setPatients((prev) => [newPatient, ...prev]);
        toast.success('Patient created successfully');
      }
      setEditModal({ open: false, patient: null });
    } catch (error) {
      console.error('Failed to save patient', error);
      toast.error(getErrorMessage(error) || 'Failed to save patient');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.patient) return;
    try {
      await del<void>(`patients/${deleteModal.patient.id}`);
      setPatients((prev) => prev.filter((p) => p.id !== deleteModal.patient!.id));
      toast.success('Patient deleted successfully');
      setDeleteModal({ open: false, patient: null });
    } catch (error) {
      console.error('Failed to delete patient', error);
      toast.error(getErrorMessage(error) || 'Failed to delete patient');
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      await patch<Patient>(`patients/${id}`, { isActive: newStatus });
      setPatients((prev) =>
        prev.map((p) => (p.id === id ? { ...p, isActive: newStatus } : p)),
      );
      toast.success(`Patient ${newStatus ? 'activated' : 'deactivated'}`);
    } catch (error) {
      console.error('Failed to update patient status', error);
      toast.error(getErrorMessage(error) || 'Failed to update patient status');
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Patients</h1>
          <p className="text-neutral-600 mt-1">Manage patient records and accounts</p>
        </div>
        <Button onClick={openAddModal}>
          <FiPlus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Patients', value: patients.length, color: 'bg-primary-500' },
          { label: 'Active', value: patients.filter((p) => p.isActive).length, color: 'bg-green-500' },
          { label: 'Inactive', value: patients.filter((p) => !p.isActive).length, color: 'bg-neutral-400' },
          { label: 'This Month', value: patients.filter((p) => {
            if (!p.createdAt) return false;
            const now = new Date();
            const created = new Date(p.createdAt);
            return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
          }).length, color: 'bg-blue-500' },
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow-soft">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${stat.color}`} />
              <span className="text-neutral-600 text-sm">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-soft p-4">
        <Input
          placeholder="Search patients by name, email, or phone..."
          leftIcon={<FiSearch className="w-5 h-5" />}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50 border-b border-neutral-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Patient</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Contact</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Details</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">City</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-neutral-600">Status</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-neutral-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                <tr>
                  <td className="px-6 py-8 text-center text-neutral-500" colSpan={6}>
                    Loading patients...
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-neutral-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <FiUser className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900">{patient.fullName}</p>
                          <p className="text-sm text-neutral-500">
                            {patient.gender ? patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1) : '—'}
                            {patient.bloodGroup ? ` · ${patient.bloodGroup}` : ''}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-neutral-600 flex items-center gap-1">
                          <FiMail className="w-3 h-3" />
                          {patient.email}
                        </p>
                        <p className="text-sm text-neutral-600 flex items-center gap-1">
                          <FiPhone className="w-3 h-3" />
                          {patient.phone || '—'}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-neutral-900">{formatDate(patient.dateOfBirth)}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-neutral-600">{patient.city || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleStatus(patient.id, patient.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                          patient.isActive
                            ? 'bg-green-100 text-green-700'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {patient.isActive ? 'active' : 'inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => openEditModal(patient)}
                          className="p-2 text-neutral-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <FiEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteModal({ open: true, patient })}
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
        {!isLoading && filteredPatients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-500">No patients found</p>
          </div>
        )}
      </div>

      {/* Add/Edit Patient Modal */}
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, patient: null })}
        title={editModal.patient ? 'Edit Patient' : 'Add New Patient'}
        size="xl"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
          className="flex flex-col min-h-full"
        >
          <div className="p-6 space-y-4">
            <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              Fields marked <span className="text-red-500 font-semibold">*</span> are required
              to create a patient account. You can add the rest later.
            </div>

            <Input
              ref={firstFieldRef}
              label="Full Name"
              placeholder="Enter patient's full name"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              required
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                placeholder="patient@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required={!editModal.patient}
              />
              <Input
                label="Phone"
                type="tel"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
            {!editModal.patient && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Password"
                  type="password"
                  placeholder={`Min ${PASSWORD_MIN_LENGTH} characters, mixed case + number`}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>
            )}

            {/* Collapsible additional details */}
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              className="flex items-center gap-2 text-sm font-medium text-primary-700 hover:text-primary-800 transition-colors"
            >
              {showMore ? (
                <FiChevronUp className="w-4 h-4" />
              ) : (
                <FiChevronDown className="w-4 h-4" />
              )}
              {showMore ? 'Hide additional details' : 'Add more details (optional)'}
            </button>
            {showMore && (
              <div className="space-y-4 pt-2">
                {editModal.patient && (
                  <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4 space-y-3">
                    <p className="text-sm font-medium text-neutral-800">Reset login password (optional)</p>
                    <p className="text-xs text-neutral-500">{PASSWORD_HINT}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="New password"
                        type="password"
                        placeholder="Leave blank to keep current"
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      />
                      <Input
                        label="Confirm new password"
                        type="password"
                        placeholder="Confirm new password"
                        value={formData.confirmNewPassword}
                        onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })}
                      />
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Input
                    label="Date of Birth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                  <Select
                    label="Gender"
                    placeholder="Select gender"
                    options={genderOptions}
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  />
                  <Select
                    label="Blood Group"
                    placeholder="Select blood group"
                    options={bloodGroupOptions}
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                  />
                </div>
                <Textarea
                  label="Address"
                  placeholder="Enter full address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="min-h-[64px]"
                />
                <Input
                  label="City"
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Emergency contact name"
                    placeholder="Name"
                    value={formData.emergencyContactName}
                    onChange={(e) => setFormData({ ...formData, emergencyContactName: e.target.value })}
                  />
                  <Input
                    label="Emergency contact phone"
                    placeholder="Phone"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => setFormData({ ...formData, emergencyContactPhone: e.target.value })}
                  />
                </div>
                <Textarea
                  label="Medical history"
                  placeholder="Notes for clinical staff"
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                  className="min-h-[64px]"
                />
                <Textarea
                  label="Allergies"
                  placeholder="Known allergies"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                  className="min-h-[56px]"
                />
              </div>
            )}
          </div>

          {/* Sticky footer with action buttons (always visible) */}
          <div className="sticky bottom-0 z-10 flex justify-end gap-3 px-6 py-4 border-t border-neutral-100 bg-white">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setEditModal({ open: false, patient: null })}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isSaving}>
              {editModal.patient ? 'Update' : 'Add'} Patient
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, patient: null })}
        title="Delete Patient"
      >
        <div className="p-6">
          <p className="text-neutral-600">
            Are you sure you want to delete <strong>{deleteModal.patient?.fullName}</strong>?
            This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setDeleteModal({ open: false, patient: null })}>
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
