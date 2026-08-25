'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiMail, FiLock, FiLogIn, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { post, getErrorMessage } from '@/lib/api';
import {
  PATIENT_TOKEN_KEY,
  PATIENT_USER_KEY,
  isPatientLoggedIn,
  dispatchPatientAuthChanged,
  getSafePatientReturnUrl,
} from '@/lib/patient-auth';

export default function PatientLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [registerHref, setRegisterHref] = useState('/patients/register');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const q = window.location.search;
    setRegisterHref(q ? `/patients/register${q}` : '/patients/register');
  }, []);

  useEffect(() => {
    if (!isPatientLoggedIn() || typeof window === 'undefined') return;
    const next = getSafePatientReturnUrl(
      new URLSearchParams(window.location.search).get('returnUrl'),
    );
    router.replace(next || '/patients/dashboard');
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      toast.error('Please enter your email');
      return;
    }
    setIsLoading(true);
    try {
      const res = await post<{ user: { id: string; email: string; name: string; role: string }; accessToken: string; refreshToken: string }>(
        'auth/login',
        { email: trimmedEmail, password },
      );
      if (res.user.role !== 'patient') {
        toast.error('This login is for patients only. Staff accounts use the admin portal.');
        return;
      }
      localStorage.setItem(PATIENT_TOKEN_KEY, res.accessToken);
      localStorage.setItem(PATIENT_USER_KEY, JSON.stringify(res.user));
      dispatchPatientAuthChanged();
      toast.success('Login successful!');
      const next = getSafePatientReturnUrl(
        typeof window !== 'undefined'
          ? new URLSearchParams(window.location.search).get('returnUrl')
          : null,
      );
      router.push(next || '/patients/dashboard');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-card p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLogIn className="w-8 h-8 text-primary-600" />
            </div>
            <h1 className="text-2xl font-bold text-neutral-900">Patient Login</h1>
            <p className="text-neutral-500 mt-2">Access your health records and reports</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="patient-login-email" className="block text-sm font-medium text-neutral-700 mb-1">
                Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="patient-login-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-10"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="patient-login-password" className="block text-sm font-medium text-neutral-700 mb-1">
                Password
              </label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  id="patient-login-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-10 pr-10"
                  placeholder="••••••••"
                  required
                  minLength={6}
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
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-neutral-500">
            <p>
              Don&apos;t have an account?{' '}
              <Link href={registerHref} className="text-primary-600 hover:underline">
                Register here
              </Link>
            </p>
            <p className="mt-2"><Link href="/patients/forgot-password" className="text-primary-600 hover:underline">Forgot password?</Link></p>
            <p className="mt-2"><Link href="/" className="text-primary-600 hover:underline">← Back to Home</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
}
