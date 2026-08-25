'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLock, FiMail, FiArrowLeft, FiEye, FiEyeOff, FiShield } from 'react-icons/fi';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

type LoginFormData = z.infer<typeof loginSchema>;
type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, forgotPassword, isAuthenticated, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/admin';
      sessionStorage.removeItem('redirectAfterLogin');
      router.replace(redirectUrl);
    }
  }, [isAuthenticated, authLoading, router]);

  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const {
    register: registerForgot,
    handleSubmit: handleForgotSubmit,
    formState: { errors: forgotErrors },
    reset: resetForgot,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      const success = await login(data.email, data.password, data.rememberMe);
      if (success) {
        const redirectUrl = sessionStorage.getItem('redirectAfterLogin') || '/admin';
        sessionStorage.removeItem('redirectAfterLogin');
        router.push(redirectUrl);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);
    try {
      const success = await forgotPassword(data.email);
      if (success) {
        setForgotPasswordSent(true);
        resetForgot();
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 to-primary-800">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="text-primary-200">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-primary-900 via-primary-800 to-neutral-900">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/patterns/hero-pattern.svg')] opacity-5" />
        <div className="relative z-10 text-center text-white max-w-md">
          <div className="w-24 h-24 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-8">
            <Image
              src="/logo.png"
              alt="Nita Clinic"
              width={80}
              height={80}
              className="rounded-xl"
            />
          </div>
          <h1 className="text-4xl font-heading font-bold mb-4">
            Nita Clinic
          </h1>
          <p className="text-primary-200 text-lg mb-8">
            Admin Control Panel
          </p>
          <div className="flex items-center justify-center gap-3 text-primary-200">
            <FiShield className="w-5 h-5" />
            <span>Secure Admin Access</span>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-white rounded-2xl shadow-elevated p-8">
            <AnimatePresence mode="wait">
              {!showForgotPassword ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {/* Logo for mobile */}
                  <div className="text-center mb-8 lg:hidden">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <span className="text-white font-bold text-2xl">OM</span>
                    </div>
                  </div>

                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-heading font-bold text-neutral-900">
                      Welcome Back
                    </h2>
                    <p className="text-neutral-600 mt-1">
                      Sign in to access the admin panel
                    </p>
                  </div>

                  <form onSubmit={handleLoginSubmit(onLoginSubmit)} className="space-y-5">
                    <div>
                      <label
                        htmlFor="admin-login-email"
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                      >
                        Email Address
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiMail className="w-5 h-5 text-neutral-400" />
                        </div>
                        <input
                          id="admin-login-email"
                          type="email"
                          placeholder="admin@nitaclinics.com"
                          autoComplete="email"
                          className={`input pl-10 ${loginErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                          {...registerLogin('email')}
                        />
                      </div>
                      {loginErrors.email && (
                        <p className="mt-1 text-sm text-red-600">{loginErrors.email.message}</p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="admin-login-password"
                        className="block text-sm font-medium text-neutral-700 mb-1.5"
                      >
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FiLock className="w-5 h-5 text-neutral-400" />
                        </div>
                        <input
                          id="admin-login-password"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          className={`input pl-10 pr-10 ${loginErrors.password ? 'border-red-500 focus:ring-red-500' : ''}`}
                          {...registerLogin('password')}
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
                      {loginErrors.password && (
                        <p className="mt-1 text-sm text-red-600">{loginErrors.password.message}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                          {...registerLogin('rememberMe')}
                        />
                        <span className="text-sm text-neutral-600">Remember me for 7 days</span>
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        <>
                          <FiLock className="w-5 h-5" />
                          Sign In
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="w-full text-center text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Forgot your password?
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotPasswordSent(false);
                    }}
                    className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6"
                  >
                    <FiArrowLeft className="w-4 h-4" />
                    Back to login
                  </button>

                  {!forgotPasswordSent ? (
                    <>
                      <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <FiMail className="w-8 h-8 text-primary-600" />
                        </div>
                        <h2 className="text-2xl font-heading font-bold text-neutral-900">
                          Forgot Password?
                        </h2>
                        <p className="text-neutral-600 mt-1">
                          Enter your email and we'll send you a reset link
                        </p>
                      </div>

                      <form onSubmit={handleForgotSubmit(onForgotSubmit)} className="space-y-5">
                        <div>
                          <label className="block text-sm font-medium text-neutral-700 mb-1.5">
                            Email Address
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <FiMail className="w-5 h-5 text-neutral-400" />
                            </div>
                            <input
                              type="email"
                              placeholder="Enter your email"
                              className={`input pl-10 ${forgotErrors.email ? 'border-red-500 focus:ring-red-500' : ''}`}
                              {...registerForgot('email')}
                            />
                          </div>
                          {forgotErrors.email && (
                            <p className="mt-1 text-sm text-red-600">{forgotErrors.email.message}</p>
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
                              Sending...
                            </>
                          ) : (
                            'Send Reset Link'
                          )}
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="text-2xl font-heading font-bold text-neutral-900 mb-2">
                        Check Your Email
                      </h2>
                      <p className="text-neutral-600 mb-6">
                        We've sent a password reset link to your email address. Please check your inbox and follow the instructions.
                      </p>
                      <button
                        onClick={() => {
                          setShowForgotPassword(false);
                          setForgotPasswordSent(false);
                        }}
                        className="btn-primary"
                      >
                        Back to Login
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-center text-primary-200 text-sm mt-6">
            &copy; {new Date().getFullYear()} Nita Clinic
          </p>
        </motion.div>
      </div>
    </div>
  );
}
