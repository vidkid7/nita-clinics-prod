/** Keys for patient portal session (separate from admin `admin_auth_token`). */
export const PATIENT_TOKEN_KEY = 'patient_auth_token';
export const PATIENT_USER_KEY = 'patient_user';

export function getPatientToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PATIENT_TOKEN_KEY);
}

export function getPatientUserJson(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(PATIENT_USER_KEY);
}

export function clearPatientSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PATIENT_TOKEN_KEY);
  localStorage.removeItem(PATIENT_USER_KEY);
  dispatchPatientAuthChanged();
}

/** Same-tab header updates after login/logout (storage event only fires in other tabs). */
export function dispatchPatientAuthChanged(): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event('patient-auth-changed'));
}

/** True only when both token and stored user exist (avoids showing dashboard on orphan token). */
export function isPatientLoggedIn(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem(PATIENT_TOKEN_KEY)?.trim();
  const user = localStorage.getItem(PATIENT_USER_KEY)?.trim();
  return Boolean(token && user);
}

/**
 * Allow only same-site relative paths after login (e.g. return to checkout).
 * Blocks protocol-relative and absolute URLs to avoid open redirects.
 */
export function getSafePatientReturnUrl(raw: string | null): string | null {
  if (!raw || typeof raw !== 'string') return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw.trim());
  } catch {
    return null;
  }
  if (!decoded.startsWith('/') || decoded.startsWith('//')) return null;
  return decoded;
}
