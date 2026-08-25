'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { post, getErrorMessage } from '@/lib/api';
import { getSafePatientReturnUrl, isPatientLoggedIn } from '@/lib/patient-auth';
import { isPasswordStrong, PASSWORD_HINT, PASSWORD_MIN_LENGTH } from '@/lib/password-rules';

export default function PatientRegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!isPatientLoggedIn() || typeof window === 'undefined') return;
    const next = getSafePatientReturnUrl(
      new URLSearchParams(window.location.search).get('returnUrl'),
    );
    router.replace(next || '/patients/dashboard');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = form.fullName.trim();
    const email = form.email.trim().toLowerCase();
    const phone = form.phone.trim().replace(/\s+/g, ' ');
    if (fullName.length < 2) {
      toast.error('Please enter your full name');
      return;
    }
    if (!isPasswordStrong(form.password)) {
      toast.error(PASSWORD_HINT);
      return;
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setIsLoading(true);
    try {
      await post('patients/register', {
        fullName,
        email,
        phone,
        password: form.password,
      });
      toast.success('Registration successful! Please sign in.');
      const ret = getSafePatientReturnUrl(
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('returnUrl')
          : null,
      );
      router.push(
        ret ? `/patients/login?returnUrl=${encodeURIComponent(ret)}` : '/patients/login',
      );
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiUser className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">Patient Registration</h1>
            <p className="text-neutral-500 mt-2">Create your account to access health services</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
              <div className="relative">
                <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="text" autoComplete="name" value={form.fullName} onChange={(e) => updateField('fullName', e.target.value)} className="input pl-10" placeholder="Your full name" required minLength={2} maxLength={120} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="email" autoComplete="email" value={form.email} onChange={(e) => updateField('email', e.target.value)} className="input pl-10" placeholder="your@email.com" required maxLength={254} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input type="tel" autoComplete="tel" value={form.phone} onChange={(e) => updateField('phone', e.target.value)} className="input pl-10" placeholder="+977 9812345678" required minLength={6} maxLength={32} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                  minLength={PASSWORD_MIN_LENGTH}
                  maxLength={128}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-xs text-neutral-500 mt-1">{PASSWORD_HINT}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Confirm Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  className="input pl-10"
                  placeholder="••••••••"
                  required
                  minLength={PASSWORD_MIN_LENGTH}
                  maxLength={128}
                />
              </div>
            </div>
            <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
              {isLoading ? 'Creating account...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-500">
            <p>Already have an account? <Link href="/patients/login" className="text-primary-600 hover:underline">Login here</Link></p>
            <p className="mt-2"><Link href="/" className="text-primary-600 hover:underline">← Back to Home</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
