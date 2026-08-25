'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { FiLock } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { post, getErrorMessage } from '@/lib/api';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    setIsLoading(true);
    try {
      await post('auth/reset-password', { token, newPassword: password });
      toast.success('Password reset successfully!');
      router.push('/patients/login');
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Invalid or expired reset link');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center">
        <p className="text-red-600 font-medium">Invalid reset link.</p>
        <Link href="/patients/forgot-password" className="text-primary-600 hover:underline mt-2 block">
          Request a new one
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiLock className="w-8 h-8 text-primary-600" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900">Set New Password</h1>
        <p className="text-neutral-500 mt-2">Choose a strong password for your account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">New Password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input pl-10"
              placeholder="Min 8 characters"
              required
              minLength={8}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">Confirm Password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="input pl-10"
              placeholder="Repeat new password"
              required
            />
          </div>
        </div>
        <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
          {isLoading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-card p-8">
          <Suspense fallback={<div className="text-center text-neutral-500">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
