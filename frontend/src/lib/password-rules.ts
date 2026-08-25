export const PASSWORD_MIN_LENGTH = 10;

export const PASSWORD_HINT =
  'At least 10 characters with uppercase, lowercase, and a number.';

/** Client-side check aligned with backend patient/register rules. */
export function isPasswordStrong(password: string): boolean {
  if (password.length < PASSWORD_MIN_LENGTH) return false;
  if (!/[a-z]/.test(password)) return false;
  if (!/[A-Z]/.test(password)) return false;
  if (!/\d/.test(password)) return false;
  return true;
}
