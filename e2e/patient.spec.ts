import { test, expect } from '@playwright/test';
import { hasPatientCreds, loginAsPatient } from './auth-helpers';

test.describe('Patient portal', () => {
  test('logs in and sees dashboard', async ({ page }) => {
    test.skip(!hasPatientCreds, 'Set E2E_PATIENT_EMAIL and E2E_PATIENT_PASSWORD in e2e/.env');
    await loginAsPatient(page);
    await expect(page.getByRole('heading', { name: /patient dashboard/i })).toBeVisible();
  });

  test('profile page loads when authenticated', async ({ page }) => {
    test.skip(!hasPatientCreds, 'Set E2E_PATIENT_EMAIL and E2E_PATIENT_PASSWORD in e2e/.env');
    await loginAsPatient(page);
    await page.goto('/patients/profile');
    await expect(page.getByRole('heading', { name: /^My Profile$/i })).toBeVisible();
  });

  test('appointments page loads when authenticated', async ({ page }) => {
    test.skip(!hasPatientCreds, 'Set E2E_PATIENT_EMAIL and E2E_PATIENT_PASSWORD in e2e/.env');
    await loginAsPatient(page);
    await page.goto('/patients/appointments');
    await expect(page.getByRole('heading', { name: /^My Appointments$/i })).toBeVisible();
  });
});
