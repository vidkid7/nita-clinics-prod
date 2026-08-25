'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { get, patch, getErrorMessage } from '@/lib/api';

export default function PatientProfilePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('patient_auth_token');
    if (!token) { router.push('/patients/login'); return; }
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await get('patients/me');
      setProfile(data);
    } catch {
      toast.error('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await patch('patients/me', {
        fullName: profile.fullName,
        phone: profile.phone,
        dateOfBirth: profile.dateOfBirth,
        gender: profile.gender,
        bloodGroup: profile.bloodGroup,
        address: profile.address,
        city: profile.city,
        emergencyContactName: profile.emergencyContactName,
        emergencyContactPhone: profile.emergencyContactPhone,
        medicalHistory: profile.medicalHistory,
        allergies: profile.allergies,
      });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: string, value: string) => setProfile((prev: any) => ({ ...prev, [field]: value }));

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!profile) return null;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/patients/dashboard" className="text-sm text-primary-600 hover:underline flex items-center gap-1 mb-2">
            <FiArrowLeft /> Back to Dashboard
          </Link>
          <h1 className="text-xl font-bold text-neutral-900">My Profile</h1>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-soft p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
              <input type="text" value={profile.fullName || ''} onChange={(e) => updateField('fullName', e.target.value)} className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
              <input type="email" value={profile.email || ''} disabled className="input w-full bg-neutral-100" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
              <input type="tel" value={profile.phone || ''} onChange={(e) => updateField('phone', e.target.value)} className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Date of Birth</label>
              <input type="date" value={profile.dateOfBirth || ''} onChange={(e) => updateField('dateOfBirth', e.target.value)} className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Gender</label>
              <select value={profile.gender || ''} onChange={(e) => updateField('gender', e.target.value)} className="input w-full">
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Blood Group</label>
              <select value={profile.bloodGroup || ''} onChange={(e) => updateField('bloodGroup', e.target.value)} className="input w-full">
                <option value="">Select</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((bg) => <option key={bg} value={bg}>{bg}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">Address</label>
              <input type="text" value={profile.address || ''} onChange={(e) => updateField('address', e.target.value)} className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">City</label>
              <input type="text" value={profile.city || ''} onChange={(e) => updateField('city', e.target.value)} className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Emergency Contact Name</label>
              <input type="text" value={profile.emergencyContactName || ''} onChange={(e) => updateField('emergencyContactName', e.target.value)} className="input w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Emergency Contact Phone</label>
              <input type="tel" value={profile.emergencyContactPhone || ''} onChange={(e) => updateField('emergencyContactPhone', e.target.value)} className="input w-full" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Medical History</label>
            <textarea value={profile.medicalHistory || ''} onChange={(e) => updateField('medicalHistory', e.target.value)} className="input w-full" rows={3} />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Allergies</label>
            <textarea value={profile.allergies || ''} onChange={(e) => updateField('allergies', e.target.value)} className="input w-full" rows={2} />
          </div>
          <button onClick={handleSave} disabled={isSaving} className="btn btn-primary">
            <FiSave className="mr-2" /> {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
