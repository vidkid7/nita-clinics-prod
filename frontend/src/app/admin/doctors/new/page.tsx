'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiArrowLeft, FiSave, FiUpload, FiX } from 'react-icons/fi';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import { get, post, getErrorMessage, uploadFile } from '@/lib/api';

const doctorSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().min(10, 'Valid phone number required'),
  specialization: z.string().min(1, 'Specialization is required'),
  qualification: z.string().min(2, 'Qualification is required'),
  experience: z.string().min(1, 'Experience is required'),
  consultationFee: z.string().min(1, 'Consultation fee is required'),
  departmentId: z.string().min(1, 'Department is required'),
  about: z.string().optional(),
  staffType: z.enum(['doctor', 'admin_staff', 'nurse', 'technician']).default('doctor'),
  nmcRegistrationNumber: z.string().optional(),
  qualificationsExtra: z.string().optional(),
  isFeatured: z.boolean().optional(),
});

type DoctorFormData = z.infer<typeof doctorSchema>;

const specializations = [
  { value: 'General Medicine', label: 'General Medicine' },
  { value: 'Gynecology and Obstetrics', label: 'Gynecology and Obstetrics' },
  { value: 'Pediatrics', label: 'Pediatrics' },
  { value: 'Internal Medicine', label: 'Internal Medicine' },
  { value: 'Tuberculosis Care', label: 'Tuberculosis Care' },
  { value: 'Preventive Care', label: 'Preventive Care' },
  { value: 'Lab Services', label: 'Lab Services' },
  { value: 'Vaccination Services', label: 'Vaccination Services' },
];

interface DepartmentOption {
  id: string;
  name: string;
}

export default function AddDoctorPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DoctorFormData>({
    resolver: zodResolver(doctorSchema),
  });

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        const data = await get<DepartmentOption[]>('departments');
        setDepartments(data);
      } catch (error) {
        console.error('Failed to load departments', error);
        toast.error(getErrorMessage(error) || 'Failed to load departments');
      }
    };

    loadDepartments();
  }, []);

  const onSubmit = async (data: DoctorFormData) => {
    setIsLoading(true);
    try {
      let photoUrl: string | undefined;

      // Upload photo to Cloudinary if selected
      if (photoFile) {
        setIsUploadingPhoto(true);
        try {
          const uploadResponse = await uploadFile('media/upload', photoFile, undefined, 'doctors');

          photoUrl = uploadResponse.url;
          toast.success('Photo uploaded successfully');
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Failed to upload photo, but continuing...');
        } finally {
          setIsUploadingPhoto(false);
        }
      }

      const doctor = await post<{ id: string }>('doctors', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        specialization: data.specialization,
        staffType: data.staffType,
        qualification: data.qualification,
        experience: Number(data.experience) || 0,
        consultationFee: Number(data.consultationFee) || 0,
        bio: [data.about, data.nmcRegistrationNumber ? `NMC: ${data.nmcRegistrationNumber}` : '', data.qualificationsExtra || '']
          .filter(Boolean)
          .join('\n'),
        departmentId: data.departmentId,
        photo: photoUrl,
        isActive: true,
      });
      toast.success('Doctor added. Set their available days and times below.');
      router.push(`/admin/doctors/${doctor.id}/edit`);
    } catch (error) {
      console.error('Failed to add doctor', error);
      toast.error(getErrorMessage(error) || 'Failed to add doctor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setPhotoFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/doctors"
          className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
        >
          <FiArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold text-neutral-900">Add New Doctor</h1>
          <p className="text-neutral-600 mt-1">Add a new doctor to your team</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-lg font-heading font-semibold mb-4">Basic Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  placeholder="Dr. Name Surname"
                  error={errors.name?.message}
                  {...register('name')}
                  required
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="doctor@clinic.com"
                  error={errors.email?.message}
                  {...register('email')}
                  required
                />
                <Input
                  label="Phone Number"
                  placeholder="+977 98XXXXXXXX"
                  error={errors.phone?.message}
                  {...register('phone')}
                  required
                />
                <Select
                  label="Specialization"
                  options={specializations}
                  placeholder="Select specialization"
                  error={errors.specialization?.message}
                  {...register('specialization')}
                  required
                />
                <Select
                  label="Staff Type"
                  options={[
                    { value: 'doctor', label: 'Doctor' },
                    { value: 'admin_staff', label: 'Administrative Staff' },
                    { value: 'nurse', label: 'Nurse' },
                    { value: 'technician', label: 'Technician' },
                  ]}
                  placeholder="Select staff type"
                  error={errors.staffType?.message}
                  {...register('staffType')}
                  required
                />
                <Select
                  label="Department"
                  options={departments.map((d) => ({ value: d.id, label: d.name }))}
                  placeholder="Select department"
                  error={errors.departmentId?.message}
                  {...register('departmentId')}
                  required
                />
                <Input
                  label="Qualification"
                  placeholder="MBBS, MD, MS, BSc Nursing, etc."
                  error={errors.qualification?.message}
                  {...register('qualification')}
                  required
                />
                <Input
                  label="Years of Experience"
                  type="number"
                  placeholder="10"
                  error={errors.experience?.message}
                  {...register('experience')}
                  required
                />
                <Input
                  label="NMC Registration Number (Optional)"
                  placeholder="NMC-XXXX"
                  error={errors.nmcRegistrationNumber?.message}
                  {...register('nmcRegistrationNumber')}
                />
                <Input
                  label="Additional Qualifications (Optional)"
                  placeholder="MBBS, MD Gynecology"
                  error={errors.qualificationsExtra?.message}
                  {...register('qualificationsExtra')}
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-lg font-heading font-semibold mb-4">Professional Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Input
                  label="Consultation Fee (Rs.)"
                  type="number"
                  placeholder="500"
                  error={errors.consultationFee?.message}
                  {...register('consultationFee')}
                  required
                />
              </div>
              <div className="mt-4">
                <Textarea
                  label="About"
                  placeholder="Brief description about the doctor..."
                  rows={4}
                  error={errors.about?.message}
                  {...register('about')}
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-lg font-heading font-semibold mb-4">Photo</h2>
              <div className="text-center">
                {imagePreview ? (
                  <div className="relative w-32 h-32 mx-auto rounded-full overflow-hidden mb-4">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 mx-auto rounded-full bg-neutral-100 flex items-center justify-center mb-4">
                    <FiUpload className="w-8 h-8 text-neutral-400" />
                  </div>
                )}
                <label className="btn-secondary cursor-pointer inline-flex items-center gap-2">
                  <FiUpload className="w-4 h-4" />
                  {imagePreview ? 'Change Photo' : 'Upload Photo'}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
                <p className="text-sm text-neutral-500 mt-2">
                  JPG, PNG. Max 5MB.
                </p>
                {isUploadingPhoto && (
                  <p className="text-sm text-primary-600 mt-2">Uploading photo...</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-soft p-6">
              <h2 className="text-lg font-heading font-semibold mb-4">Status</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-neutral-700">Active (Available for appointments)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer mt-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  {...register('isFeatured')}
                />
                <span className="text-neutral-700">Show on Homepage (featured)</span>
              </label>
            </div>

            <div className="flex flex-col gap-3">
              <Button type="submit" isLoading={isLoading} className="w-full">
                <FiSave className="w-4 h-4 mr-2" />
                Save Doctor
              </Button>
              <Link href="/admin/doctors">
                <Button variant="ghost" className="w-full">
                  Cancel
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
