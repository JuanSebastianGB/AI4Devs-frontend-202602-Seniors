import { test, expect } from '@playwright/test';

test('recruiter dashboard loads', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByRole('heading', { name: /Dashboard del Reclutador/i }),
  ).toBeVisible();
});
