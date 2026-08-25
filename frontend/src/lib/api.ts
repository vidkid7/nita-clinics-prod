import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { absoluteUrl } from '@/lib/site-url';

const API_URL = absoluteUrl(process.env.NEXT_PUBLIC_API_URL, 'http://localhost:3001');
const FALLBACK_API_URLS = ['http://localhost:3001', 'http://localhost:3003'];

const ADMIN_TOKEN_KEY = 'admin_auth_token';
const PATIENT_TOKEN_KEY = 'patient_auth_token';

/** Attach the correct Bearer token so admin and patient sessions never overwrite each other. */
function getAuthTokenForCurrentArea(): string | null {
  if (typeof window === 'undefined') return null;
  const path = window.location.pathname || '';
  if (path.startsWith('/admin')) {
    return localStorage.getItem(ADMIN_TOKEN_KEY);
  }
  if (path.startsWith('/patients')) {
    return localStorage.getItem(PATIENT_TOKEN_KEY);
  }
  // Booking flow lives under /appointments/* but is used by logged-in patients
  if (path.startsWith('/appointments')) {
    return localStorage.getItem(PATIENT_TOKEN_KEY);
  }
  if (path.startsWith('/payment') || path.startsWith('/cart')) {
    return (
      localStorage.getItem(PATIENT_TOKEN_KEY) ||
      localStorage.getItem(ADMIN_TOKEN_KEY)
    );
  }
  return null;
}

// Create axios instance with default config
// NOTE: Backend uses a global prefix (API_PREFIX=api/v1),
// so we include it here in the base URL.
export const api = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = getAuthTokenForCurrentArea();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        delete config.headers.Authorization;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname || '';
        if (path.startsWith('/admin')) {
          localStorage.removeItem(ADMIN_TOKEN_KEY);
          localStorage.removeItem('admin_user');
          localStorage.removeItem(`${ADMIN_TOKEN_KEY}_timestamp`);
          // Let the login/reset forms handle their own 401 and show the API
          // error. Redirecting here during login reloads the page before the
          // error toast can render, making invalid credentials look ignored.
          if (path !== '/admin/login' && !path.startsWith('/admin/reset-password')) {
            window.location.href = '/admin/login';
          }
        } else if (path.startsWith('/patients')) {
          localStorage.removeItem(PATIENT_TOKEN_KEY);
          localStorage.removeItem('patient_user');
          window.location.href = '/patients/login';
        } else if (path.startsWith('/appointments')) {
          localStorage.removeItem(PATIENT_TOKEN_KEY);
          localStorage.removeItem('patient_user');
          window.location.href = '/patients/login';
        } else if (path.startsWith('/payment') || path.startsWith('/cart')) {
          localStorage.removeItem(PATIENT_TOKEN_KEY);
          localStorage.removeItem('patient_user');
          window.location.href = '/patients/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

// Generic API response type
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Pagination response type
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Error response type
export interface ApiError {
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

function buildBaseUrlFromCurrent(url: string): string {
  return `${url.replace(/\/$/, '')}/api/v1`;
}

function getFallbackBaseUrls(currentBaseUrl?: string): string[] {
  const normalizedCurrent = (currentBaseUrl || '').replace(/\/$/, '');
  const candidateUrls = FALLBACK_API_URLS.map(buildBaseUrlFromCurrent);
  return candidateUrls.filter((url) => url !== normalizedCurrent);
}

async function requestWithFallback<T>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  dataOrConfig?: unknown,
  maybeConfig?: AxiosRequestConfig
): Promise<T> {
  try {
    if (method === 'get' || method === 'delete') {
      const config = dataOrConfig as AxiosRequestConfig | undefined;
      const response = await api[method]<T>(url, config);
      return response.data;
    }

    const response = await api[method]<T>(url, dataOrConfig, maybeConfig);
    return response.data;
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response) {
      throw error;
    }

    const originalBaseUrl = api.defaults.baseURL;
    const fallbackBaseUrls = getFallbackBaseUrls(originalBaseUrl);
    for (const fallbackBaseUrl of fallbackBaseUrls) {
      try {
        if (method === 'get' || method === 'delete') {
          const config = dataOrConfig as AxiosRequestConfig | undefined;
          const response = await axios[method]<T>(`${fallbackBaseUrl}/${url}`, config);
          return response.data;
        }

        const response = await axios[method]<T>(
          `${fallbackBaseUrl}/${url}`,
          dataOrConfig,
          maybeConfig
        );
        return response.data;
      } catch (fallbackError) {
        if (axios.isAxiosError(fallbackError) && !fallbackError.response) {
          continue;
        }
        throw fallbackError;
      }
    }

    throw error;
  }
}

// API helper functions
export async function get<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return requestWithFallback<T>('get', url, config);
}

export async function post<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  return requestWithFallback<T>('post', url, data, config);
}

export async function put<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  return requestWithFallback<T>('put', url, data, config);
}

export async function patch<T, D = unknown>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig
): Promise<T> {
  return requestWithFallback<T>('patch', url, data, config);
}

export async function del<T>(
  url: string,
  config?: AxiosRequestConfig
): Promise<T> {
  return requestWithFallback<T>('delete', url, config);
}

// Upload file helper (backend stores in Cloudinary when configured; optional folder e.g. lab-reports)
export async function uploadFile(
  url: string,
  file: File,
  onProgress?: (progress: number) => void,
  folder?: string
): Promise<{ url: string; publicId: string; name?: string }> {
  const formData = new FormData();
  formData.append('file', file);
  if (folder) {
    formData.append('folder', folder);
  }

  const response = await api.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(progress);
      }
    },
  });

  return response.data;
}

// Extract error message from API error
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiError>;
    return axiosError.response?.data?.message || axiosError.message || 'An error occurred';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
