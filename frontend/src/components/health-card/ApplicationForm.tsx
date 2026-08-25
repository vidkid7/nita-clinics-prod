'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Upload, FileText, X, ShieldCheck, AlertCircle } from 'lucide-react';
import { getErrorMessage } from '@/lib/api';
import { PATIENT_USER_KEY } from '@/lib/patient-auth';
import { SectionHeader } from '@/components/ui/SectionHeader';

const ACCEPTED_DOC_TYPES: Record<string, string> = {
  passport: 'Passport',
  citizenship: 'Citizenship Certificate',
  driving_license: 'Driving License',
  nmc_registration: 'NMC Registration Card',
  employee_id: 'Employee ID Card',
};

const schema = z.object({
  holderType: z.enum(['doctor', 'doctor_family', 'partner_staff', 'general_public']),
  fullName: z.string().min(2, 'Name is required'),
  phone: z.string().min(7, 'Valid phone is required'),
  email: z
    .string()
    .min(1, 'Email is required so we can show your application status on your dashboard')
    .email('Invalid email'),
  organization: z.string().optional(),
  nmcRegistrationId: z.string().optional(),
  relationWithDoctor: z.string().optional(),
  documentType: z.enum([
    'passport',
    'citizenship',
    'driving_license',
    'nmc_registration',
    'employee_id',
  ]),
  documentNumber: z.string().min(1, 'Document number is required for verification'),
});

type FormValues = z.infer<typeof schema>;

/**
 * Suggested document by holder type — users can still pick another one if their
 * primary ID is unavailable.
 */
function defaultDocumentForHolder(holder: FormValues['holderType']): FormValues['documentType'] {
  if (holder === 'doctor' || holder === 'doctor_family') return 'nmc_registration';
  if (holder === 'partner_staff') return 'employee_id';
  return 'citizenship';
}

export function ApplicationForm() {
  const inputClass =
    'w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400';
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [documentPreview, setDocumentPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { register, handleSubmit, watch, reset, setValue, formState: { errors } } =
    useForm<FormValues>({
      resolver: zodResolver(schema),
      defaultValues: {
        holderType: 'general_public',
        documentType: 'citizenship',
      },
    });

  const holderType = watch('holderType');
  const documentType = watch('documentType');

  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(PATIENT_USER_KEY) : null;
      if (raw) {
        const u = JSON.parse(raw) as { email?: string };
        if (u.email) {
          setValue('email', String(u.email).trim().toLowerCase());
        }
      }
    } catch {
      /* ignore */
    }
  }, [setValue]);

  // Auto-pick the most relevant document type when the holder changes — but only
  // if the user hasn't manually picked something else.
  useEffect(() => {
    const suggested = defaultDocumentForHolder(holderType);
    if (documentType !== suggested) {
      setValue('documentType', suggested);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holderType]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setDocumentFile(f);
    if (documentPreview) {
      URL.revokeObjectURL(documentPreview);
    }
    if (f && f.type.startsWith('image/')) {
      setDocumentPreview(URL.createObjectURL(f));
    } else {
      setDocumentPreview(null);
    }
  };

  const clearFile = () => {
    setDocumentFile(null);
    if (documentPreview) {
      URL.revokeObjectURL(documentPreview);
      setDocumentPreview(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (values: FormValues) => {
    if (!documentFile) {
      toast.error('Please upload an identity document to verify your eligibility.');
      return;
    }
    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('holderType', values.holderType);
      formData.append('fullName', values.fullName);
      formData.append('phone', values.phone);
      formData.append('email', values.email.trim().toLowerCase());
      if (values.organization) formData.append('organization', values.organization);
      if (values.nmcRegistrationId) formData.append('nmcRegistrationId', values.nmcRegistrationId);
      if (values.relationWithDoctor) formData.append('relationWithDoctor', values.relationWithDoctor);
      formData.append('documentType', values.documentType);
      formData.append('documentNumber', values.documentNumber);
      formData.append('document', documentFile);

      // Submit directly via fetch so the browser sets the multipart boundary
      // automatically — going through axios requires more boilerplate.
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/v1/health-card/applications`, {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const detail = Array.isArray(errBody?.message)
          ? errBody.message.join(', ')
          : errBody?.message || `Submission failed (HTTP ${response.status})`;
        throw new Error(detail);
      }
      const data = (await response.json()) as { id: string };
      setReference(data.id);
      toast.success('Application submitted — verification in progress');
      clearFile();
      reset({
        holderType: values.holderType,
        fullName: '',
        phone: '',
        email: values.email.trim().toLowerCase(),
        documentType: defaultDocumentForHolder(values.holderType),
        documentNumber: '',
      });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="apply" className="section-padding bg-white border-t border-neutral-100">
      <div className="container-custom max-w-3xl">
        <SectionHeader
          eyebrow="Apply Now"
          title="Apply for Health"
          highlight="Card"
          subtitle="Fill in your details and upload an identity document. Our team will review your application within 24–48 hours."
        />

        {reference && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-green-700">
            <p className="font-semibold">Application submitted — reference {reference}</p>
            <p className="text-sm mt-1">
              We&rsquo;ve sent a confirmation to your email. Track status from your patient dashboard.
            </p>
          </div>
        )}

        <div className="relative overflow-hidden rounded-3xl border border-neutral-200/70 bg-white p-6 sm:p-8 shadow-soft">
          <span className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-primary-500 via-teal-400 to-primary-500 opacity-50" />
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Holder Type
              </label>
              <select className={inputClass} {...register('holderType')}>
                <option value="doctor">Doctor (any specialty)</option>
                <option value="doctor_family">Doctor&rsquo;s Family</option>
                <option value="partner_staff">Partner Organisation Staff</option>
                <option value="general_public">General Public</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                <input className={inputClass} {...register('fullName')} />
                {errors.fullName && (
                  <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
                <input className={inputClass} {...register('phone')} placeholder="+977-98XXXXXXXX" />
                {errors.phone && (
                  <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email *</label>
              <input className={inputClass} {...register('email')} />
              {errors.email && (
                <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>
              )}
            </div>

            {holderType === 'partner_staff' && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Organization
                </label>
                <select className={inputClass} {...register('organization')}>
                  <option value="">Select organization</option>
                  <option value="Engineering Nita">Engineering Nita</option>
                  <option value="Him River Power">Him River Power</option>
                  <option value="SN Energy Ltd">SN Energy Ltd</option>
                </select>
              </div>
            )}

            {(holderType === 'doctor' || holderType === 'doctor_family') && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  NMC Registration ID
                </label>
                <input className={inputClass} {...register('nmcRegistrationId')} />
              </div>
            )}

            {holderType === 'doctor_family' && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Relation with Doctor
                </label>
                <select className={inputClass} {...register('relationWithDoctor')}>
                  <option value="">Select relation</option>
                  <option value="spouse">Spouse</option>
                  <option value="parent">Parent</option>
                  <option value="child">Child</option>
                </select>
              </div>
            )}

            {/* ─────────── IDENTITY DOCUMENT SECTION ─────────── */}
            <div className="rounded-2xl border border-primary-200 bg-primary-50/40 p-4 space-y-3">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 text-primary-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="text-sm font-semibold text-neutral-800">
                    Identity Document for Verification
                  </h3>
                  <p className="text-xs text-neutral-600 mt-0.5">
                    Upload a clear image or PDF of one of the following. Our team reviews it
                    before approving your card.
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Document Type
                  </label>
                  <select className={inputClass} {...register('documentType')}>
                    {Object.entries(ACCEPTED_DOC_TYPES).map(([value, label]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-700 mb-1">
                    Document Number
                  </label>
                  <input
                    className={inputClass}
                    placeholder={
                      documentType === 'citizenship'
                        ? 'Citizenship No.'
                        : documentType === 'passport'
                          ? 'Passport No.'
                          : documentType === 'driving_license'
                            ? 'License No.'
                            : documentType === 'nmc_registration'
                              ? 'NMC No.'
                              : 'Employee ID'
                    }
                    {...register('documentNumber')}
                  />
                  {errors.documentNumber && (
                    <p className="text-xs text-red-600 mt-1">{errors.documentNumber.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-700 mb-1">
                  Upload Document (JPG, PNG, WEBP or PDF · max 8MB)
                </label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="cursor-pointer rounded-xl border-2 border-dashed border-primary-300 bg-white hover:border-primary-500 hover:bg-primary-50/30 transition-colors p-4 flex items-center gap-3"
                >
                  {documentFile ? (
                    <>
                      {documentPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={documentPreview}
                          alt="Document preview"
                          className="w-16 h-16 object-cover rounded-md border border-neutral-200"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-md bg-red-50 border border-red-200 flex items-center justify-center">
                          <FileText className="w-7 h-7 text-red-500" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-800 truncate">
                          {documentFile.name}
                        </p>
                        <p className="text-xs text-neutral-500">
                          {(documentFile.size / 1024).toFixed(1)} KB · {documentFile.type || 'unknown'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearFile();
                        }}
                        className="p-1 rounded-full hover:bg-neutral-100"
                        aria-label="Remove file"
                      >
                        <X className="w-4 h-4 text-neutral-500" />
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-12 h-12 rounded-md bg-primary-100 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-neutral-800">
                          Click to choose a file
                        </p>
                        <p className="text-xs text-neutral-500">
                          Passports, citizenship, driving license, NMC ID, employee ID
                        </p>
                      </div>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp,application/pdf"
                    onChange={handleFileChange}
                  />
                </div>
                {!documentFile && (
                  <p className="text-xs text-amber-700 mt-1.5 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> A document is required to submit.
                  </p>
                )}
              </div>
            </div>

            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit Application for Verification'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
