import { test, expect } from '@playwright/test';
import { hasAdminCreds, loginAsAdmin } from './auth-helpers';

test.describe('Admin panel', () => {
  test('logs in and reaches dashboard', async ({ page }) => {
    test.skip(!hasAdminCreds, 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in e2e/.env');
    await loginAsAdmin(page);
    await expect(page).toHaveURL(/\/admin\/?$/);
    await expect(page.getByRole('heading', { name: /dashboard/i })).toBeVisible();
  });

  test('opens Packages after login', async ({ page }) => {
    test.skip(!hasAdminCreds, 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in e2e/.env');
    await loginAsAdmin(page);
    await page.goto('/admin/packages');
    await expect(page.getByRole('heading', { name: /check-up packages/i })).toBeVisible();
  });

  test('opens Lab Tests after login', async ({ page }) => {
    test.skip(!hasAdminCreds, 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in e2e/.env');
    await loginAsAdmin(page);
    await page.goto('/admin/lab-tests');
    await expect(page.getByRole('heading', { name: /^Lab Tests$/i })).toBeVisible();
  });

  test('opens Health Card categories after login', async ({ page }) => {
    test.skip(!hasAdminCreds, 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in e2e/.env');
    await loginAsAdmin(page);
    await page.goto('/admin/health-card');
    await expect(page.getByRole('heading', { name: /health card/i })).toBeVisible();
  });
});
