import { test, expect } from '@playwright/test';
import { hasAdminCreds, loginAsAdmin } from './auth-helpers';

/**
 * Every URL from admin sidebar (layout). Verifies: still authenticated (not bounced to login)
 * and shell renders (sidebar). Does not perform CRUD — that needs a disposable test DB.
 */
const ADMIN_ROUTES = [
  '/admin',
  '/admin/patients',
  '/admin/doctors',
  '/admin/doctors/new',
  '/admin/appointments',
  '/admin/services',
  '/admin/packages',
  '/admin/subscriptions',
  '/admin/health-card',
  '/admin/health-cards/applications',
  '/admin/health-cards/issued',
  '/admin/partners',
  '/admin/lab-tests',
  '/admin/lab-orders',
  '/admin/lab-reports',
  '/admin/home-collection',
  '/admin/vaccinations',
  '/admin/payments',
  '/admin/content',
  '/admin/content/pages',
  '/admin/blog',
  '/admin/testimonials',
  '/admin/gallery',
  '/admin/enquiries',
  '/admin/media',
  '/admin/settings',
  '/admin/settings/seo',
  '/admin/settings/payment-config',
  '/admin/users',
  '/admin/settings/security',
] as const;

test.describe('Admin — all sidebar routes', () => {
  test('each route loads while authenticated (API + UI shell)', async ({ page }) => {
    test.skip(!hasAdminCreds, 'Set E2E_ADMIN_EMAIL and E2E_ADMIN_PASSWORD in e2e/.env');
    // Default project timeout is 60s; ~30 routes need several minutes end-to-end.
    test.setTimeout(360_000);

    await loginAsAdmin(page);

    for (const path of ADMIN_ROUTES) {
      await test.step(path, async () => {
        await page.goto(path, { waitUntil: 'domcontentloaded', timeout: 60_000 });
        await expect(page).not.toHaveURL(/\/admin\/login/);
        // Sidebar shell (layout) — more stable than waiting on slow page data fetches.
        await expect(page.locator('aside').first()).toBeVisible({ timeout: 30_000 });
      });
    }
  });
});
