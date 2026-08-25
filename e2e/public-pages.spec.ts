import { test, expect } from '@playwright/test';

test.describe('Public site', () => {
  test('home page loads with main heading', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: /your health, our priority/i })).toBeVisible();
  });

  test('diagnostic tests catalog loads', async ({ page }) => {
    await page.goto('/diagnostic-test');
    await expect(page.getByRole('heading', { name: /diagnostic tests/i })).toBeVisible();
  });

  test('patient login page renders', async ({ page }) => {
    await page.goto('/patients/login');
    await expect(page.getByRole('heading', { name: /patient login/i })).toBeVisible();
  });

  test('admin login page renders', async ({ page }) => {
    await page.goto('/admin/login');
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  });
});
