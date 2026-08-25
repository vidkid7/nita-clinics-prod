'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiLock, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';
import { useAuth } from '@/contexts/AuthContext';

const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { resetPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setTokenValid(false);
    }
  }, [token]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const password = watch('password', '');

  const passwordRequirements = [
    { label: 'At least 8 characters', met: password.length >= 8 },
    { label: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { label: 'One lowercase letter', met: /[a-z]/.test(password) },
    { label: 'One number', met: /[0-9]/.test(password) },
    { label: 'One special character', met: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const success = await resetPassword(token, data.password);
      if (success) {
        setResetSuccess(true);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-800 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-elevated p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLock className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-neutral-600 mb-6">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <button
              onClick={() => router.push('/admin/login')}
              className="btn-primary"
            >
              Back to Login
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (resetSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-800 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-elevated p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-2">
              Password Reset Successful
            </h2>
            <p className="text-neutral-600 mb-6">
              Your password has been reset successfully. You can now login with your new password.
            </p>
            <button
              onClick={() => router.push('/admin/login')}
              className="btn-primary"
            >
              Go to Login
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-2xl shadow-elevated p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiLock className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-neutral-900">
              Reset Password
            </h2>
            <p className="text-neutral-600 mt-1">
              Enter your new password below
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="w-5 h-5 text-neutral-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  className={`input pl-10 pr-10 ${errors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FiEyeOff className="w-5 h-5 text-neutral-400 hover:text-neutral-600" />
                  ) : (
                    <FiEye className="w-5 h-5 text-neutral-400 hover:text-neutral-600" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-neutral-50 rounded-lg p-4">
              <p className="text-sm font-medium text-neutral-700 mb-2">Password requirements:</p>
              <ul className="space-y-1">
                {passwordRequirements.map((req, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    <span className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      req.met ? 'bg-green-500 text-white' : 'bg-neutral-200'
                    }`}>
                      {req.met && <FiCheck className="w-3 h-3" />}
                    </span>
                    <span className={req.met ? 'text-green-700' : 'text-neutral-600'}>
                      {req.label}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiLock className="w-5 h-5 text-neutral-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  className={`input pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500 focus:ring-red-500' : ''}`}
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <FiEyeOff className="w-5 h-5 text-neutral-400 hover:text-neutral-600" />
                  ) : (
                    <FiEye className="w-5 h-5 text-neutral-400 hover:text-neutral-600" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-primary-200 text-sm mt-6">
          &copy; {new Date().getFullYear()} Nita Clinic
        </p>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-800">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-white rounded-full animate-spin" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
