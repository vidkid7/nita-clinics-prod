'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import toast from 'react-hot-toast';
import { post, getErrorMessage } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'staff';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<boolean>;
  resetPassword: (token: string, password: string) => Promise<boolean>;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'admin_auth_token';
const REMEMBER_KEY = 'admin_remember_me';
const USER_KEY = 'admin_user';
const SESSION_EXPIRY = 30 * 60 * 1000; // 30 minutes for session
const REMEMBER_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 days for remember me

// Map backend roles to admin-panel roles
function mapBackendRole(role: string): User['role'] {
  const normalized = role.toLowerCase();
  if (normalized === 'super_admin') return 'super_admin';
  if (normalized === 'admin') return 'admin';
  return 'staff';
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check if token is valid
  const isTokenValid = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    const token = localStorage.getItem(TOKEN_KEY);
    const rememberMe = localStorage.getItem(REMEMBER_KEY) === 'true';
    const tokenTimestamp = localStorage.getItem(`${TOKEN_KEY}_timestamp`);
    
    if (!token || !tokenTimestamp) return false;
    
    const elapsed = Date.now() - parseInt(tokenTimestamp);
    const maxAge = rememberMe ? REMEMBER_EXPIRY : SESSION_EXPIRY;
    
    return elapsed < maxAge;
  }, []);

  // Check authentication on mount
  const checkAuth = useCallback(async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;
    
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);
      
      if (token && savedUser && isTokenValid()) {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        
        // Refresh token timestamp if remember me
        const rememberMe = localStorage.getItem(REMEMBER_KEY) === 'true';
        if (rememberMe) {
          localStorage.setItem(`${TOKEN_KEY}_timestamp`, Date.now().toString());
        }
        
        return true;
      }
      
      // Clear invalid session
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(`${TOKEN_KEY}_timestamp`);
      setUser(null);
      return false;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  }, [isTokenValid]);

  // Login function (backed by NestJS auth)
  const login = async (email: string, password: string, rememberMe = false): Promise<boolean> => {
    setIsLoading(true);
    try {
      type LoginResponse = {
        user: {
          id: string;
          email: string;
          name: string;
          role: string;
          avatar?: string;
        };
        accessToken: string;
        refreshToken: string;
      };

      const response = await post<LoginResponse>('auth/login', { email, password });

      const mappedUser: User = {
        id: response.user.id,
        email: response.user.email,
        name: response.user.name,
        role: mapBackendRole(response.user.role),
        avatar: response.user.avatar,
      };

      localStorage.setItem(TOKEN_KEY, response.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(mappedUser));
      localStorage.setItem(`${TOKEN_KEY}_timestamp`, Date.now().toString());

      if (rememberMe) {
        localStorage.setItem(REMEMBER_KEY, 'true');
      } else {
        localStorage.removeItem(REMEMBER_KEY);
      }

      setUser(mappedUser);
      toast.success('Login successful');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      toast.error(getErrorMessage(error) || 'Login failed. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REMEMBER_KEY);
    localStorage.removeItem(`${TOKEN_KEY}_timestamp`);
    setUser(null);
    toast.success('Logged out successfully');
    router.push('/admin/login');
  }, [router]);

  // Forgot password function
  const forgotPassword = async (email: string): Promise<boolean> => {
    try {
      await post<{ message: string }>('auth/forgot-password', { email });
      toast.success('If an account exists, a reset link will be sent to your email.');
      return true;
    } catch (error) {
      console.error('Forgot password failed:', error);
      toast.error(getErrorMessage(error) || 'Failed to send reset email. Please try again.');
      return false;
    }
  };

  // Reset password function
  const resetPassword = async (token: string, password: string): Promise<boolean> => {
    try {
      await post<{ message: string }>('auth/reset-password', {
        token,
        newPassword: password,
      });
      toast.success('Password reset successfully. Please login with your new password.');
      return true;
    } catch (error) {
      console.error('Reset password failed:', error);
      toast.error(getErrorMessage(error) || 'Failed to reset password. The link may have expired.');
      return false;
    }
  };

  // Initialize auth on mount
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await checkAuth();
      setIsLoading(false);
    };
    initAuth();
  }, [checkAuth]);

  // Check session periodically (every 5 minutes)
  useEffect(() => {
    const interval = setInterval(() => {
      if (user && !isTokenValid()) {
        toast.error('Session expired. Please login again.');
        logout();
      }
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user, isTokenValid, logout]);

  // Handle browser tab focus to check session
  useEffect(() => {
    const handleFocus = () => {
      if (user && !isTokenValid()) {
        toast.error('Session expired. Please login again.');
        logout();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user, isTokenValid, logout]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user && isTokenValid(),
    login,
    logout,
    forgotPassword,
    resetPassword,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Protected route component
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Store intended destination for redirect after login
      sessionStorage.setItem('redirectAfterLogin', pathname);
      router.replace('/admin/login');
    }
  }, [isAuthenticated, isLoading, router, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
