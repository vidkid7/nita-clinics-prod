'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { post, getErrorMessage } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await post('auth/forgot-password', { email });
      setSent(true);
    } catch (err) {
      toast.error(getErrorMessage(err) || 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-card p-8">
          <Link href="/patients/login" className="inline-flex items-center text-sm text-neutral-500 hover:text-primary-600 mb-6">
            <FiArrowLeft className="mr-1" /> Back to Login
          </Link>

          {sent ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiMail className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-neutral-900 mb-2">Check your email</h1>
              <p className="text-neutral-500">
                If an account with <span className="font-medium text-neutral-700">{email}</span> exists, a password reset link has been sent.
              </p>
              <p className="text-sm text-neutral-400 mt-4">Didn&apos;t receive it? Check your spam folder.</p>
            </div>
          ) : (
            <>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FiMail className="w-8 h-8 text-primary-600" />
                </div>
                <h1 className="text-2xl font-bold text-neutral-900">Forgot Password</h1>
                <p className="text-neutral-500 mt-2">Enter your email to receive a reset link</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="input pl-10"
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
