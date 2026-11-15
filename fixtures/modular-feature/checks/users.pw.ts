import { expect, test } from '@playwright/test';

test('list reacts to intent changes and shows mapped rows', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
  await expect(page.getByTestId('user-row')).toHaveText(['Ada', 'Grace']);
  await page.getByLabel('Search').fill('Grace');
  await expect(page.getByTestId('user-row')).toHaveText(['Grace']);
  await page.getByLabel('Search').fill('missing');
  await expect(page.getByText('No users')).toBeVisible();
});

test('creation follows app navigation and opens a fresh list', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByTestId('user-row')).toHaveCount(2);
  await page.getByLabel('Search').fill('Grace');
  await page.getByRole('button', { name: 'Create user', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'New user' })).toBeVisible();
  await page.getByRole('button', { name: 'Save user' }).click();
  await expect(page.getByRole('alert')).toHaveText('Name is required');
  await page.getByLabel('Name', { exact: true }).fill('Linus');
  await page.getByRole('button', { name: 'Save user' }).click();
  await expect(page.getByRole('heading', { name: 'Users' })).toBeVisible();
  await expect(page.getByLabel('Search')).toHaveValue('');
  await expect(page.getByTestId('user-row')).toHaveText(['Ada', 'Grace', 'Linus']);
  await page.getByRole('button', { name: 'Create user', exact: true }).click();
  await expect(page.getByLabel('Name', { exact: true })).toHaveValue('');
});

test('API failure renders the error state', async ({ page }) => {
  await page.goto('/?failure=http');
  await expect(page.getByRole('alert')).toHaveText('Demo denied');
});

test('missing provider reports context failure without constructing a fallback', async ({ page }) => {
  const error = page.waitForEvent('pageerror');
  await page.goto('/?missing-provider');
  expect((await error).message).toMatch(/missing_context|Context was not set/);
});
