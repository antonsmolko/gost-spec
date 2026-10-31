import { test, expect } from '@playwright/test';

test('existing greeting still handles a name and empty input', async ({ page }) => {
  await page.goto('/');
  await page.getByLabel('Name', { exact: true }).fill('  Ada  ');
  await page.getByRole('button', { name: 'Greet', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Hello, Ada!');
  await page.getByLabel('Name', { exact: true }).fill('');
  await page.getByRole('button', { name: 'Greet', exact: true }).click();
  await expect(page.getByRole('status')).toHaveText('Hello, visitor!');
});
