import type { Page } from '@playwright/test';

export const hasAdminCreds =
  !!process.env.E2E_ADMIN_EMAIL?.trim() && !!process.env.E2E_ADMIN_PASSWORD;

export const hasPatientCreds =
  !!process.env.E2E_PATIENT_EMAIL?.trim() && !!process.env.E2E_PATIENT_PASSWORD;

export async function loginAsAdmin(page: Page) {
  const email = process.env.E2E_ADMIN_EMAIL!.trim();
  const password = process.env.E2E_ADMIN_PASSWORD!;
  await page.goto('/admin/login');
  await page.getByLabel('Email Address').fill(email);
  await page.getByLabel('Password').fill(password);
  const loginResponse = page.waitForResponse(
    (r) =>
      r.request().method() === 'POST' &&
      /\/api\/v1\/auth\/login/i.test(r.url()),
  );
  await page.getByRole('button', { name: /^Sign In$/i }).click();
  const res = await loginResponse;
  if (!res.ok()) {
    throw new Error(`Admin auth/login failed: HTTP ${res.status()}`);
  }
  await page.waitForURL(
    (u) =>
      u.pathname === '/admin' ||
      (u.pathname.startsWith('/admin/') &&
        !u.pathname.startsWith('/admin/login') &&
        !u.pathname.startsWith('/admin/reset-password')),
    { timeout: 45_000, waitUntil: 'commit' },
  );
}

export async function loginAsPatient(page: Page) {
  const email = process.env.E2E_PATIENT_EMAIL!.trim();
  const password = process.env.E2E_PATIENT_PASSWORD!;
  await page.goto('/patients/login');
  await page.locator('#patient-login-email').fill(email);
  await page.locator('#patient-login-password').fill(password);
  const loginResponse = page.waitForResponse(
    (r) =>
      r.request().method() === 'POST' &&
      /\/api\/v1\/auth\/login/i.test(r.url()),
  );
  await page.getByRole('button', { name: /^Sign In$/i }).click();
  const res = await loginResponse;
  if (!res.ok()) {
    throw new Error(`Patient auth/login failed: HTTP ${res.status()}`);
  }
  await page.waitForURL(/\/patients\/dashboard/, { timeout: 45_000, waitUntil: 'commit' });
}
