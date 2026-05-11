import { test, expect } from '@playwright/test';

test('position kanban loads from seeded API', async ({ page }) => {
  await page.goto('/positions/1');
  await expect(page.getByTestId('position-board-title')).toHaveText(
    /Senior Full-Stack Engineer/i,
    { timeout: 30_000 },
  );
  await expect(page.getByTestId('kanban-column-1')).toBeVisible();
  await expect(page.getByText('John Doe')).toBeVisible();
});
