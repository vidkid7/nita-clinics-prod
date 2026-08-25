import { test, expect } from '@playwright/test';
import { hasPatientCreds, loginAsPatient } from './auth-helpers';

/** Authenticated patient area — each page should show its main h1, not redirect to login. */
const PATIENT_ROUTES: { path: string; heading: RegExp }[] = [
  { path: '/patients/dashboard', heading: /Patient Dashboard/i },
  { path: '/patients/profile', heading: /My Profile/i },
  { path: '/patients/appointments', heading: /My Appointments/i },
  { path: '/patients/lab-orders', heading: /My Lab Orders/i },
  { path: '/patients/reports', heading: /My Lab Reports/i },
  { path: '/patients/health-card', heading: /My Health Card/i },
  { path: '/patients/home-collection', heading: /Home Collection/i },
  { path: '/patients/payments', heading: /Payment History/i },
  { path: '/patients/subscriptions', heading: /My Subscriptions/i },
];

test.describe('Patient — all portal routes', () => {
  test('each route loads when authenticated (API + UI)', async ({ page }) => {
    test.skip(!hasPatientCreds, 'Set E2E_PATIENT_EMAIL and E2E_PATIENT_PASSWORD in e2e/.env');
    test.setTimeout(120_000);

    await loginAsPatient(page);

    for (const { path, heading } of PATIENT_ROUTES) {
      await test.step(path, async () => {
        await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 60_000 });
        await expect(page).not.toHaveURL(/\/patients\/login/);
        await expect(page.getByRole('heading', { name: heading })).toBeVisible({ timeout: 20_000 });
      });
    }
  });
});
