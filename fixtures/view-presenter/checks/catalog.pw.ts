import { expect, test } from '@playwright/test';

for (const route of ['/', '/?before']) {
  test(`catalog display and callbacks ${route}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(route);
    const catalog = page.getByRole('region', { name: 'Catalog' });
    await expect(catalog.getByText('Not requested')).toBeVisible();
    await catalog.getByRole('button', { name: 'Refresh' }).click();
    await expect(page.getByLabel('Refresh count')).toHaveText('1');
    await page.getByRole('button', { name: 'Set loading', exact: true }).click();
    await expect(catalog.getByText('Loading')).toBeVisible();
    await expect(catalog.getByRole('button', { name: 'Refresh' })).toBeDisabled();
    await page.getByRole('button', { name: 'Set empty', exact: true }).click();
    await expect(catalog.getByText('No items')).toBeVisible();
    await page.getByRole('button', { name: 'Set ready', exact: true }).click();
    await expect(catalog.getByRole('listitem')).toHaveText(['Alpha', 'Untitled', 'Untitled']);
    await page.getByRole('button', { name: 'Change rows', exact: true }).click();
    await expect(catalog.getByRole('listitem')).toHaveText(['Beta']);
    await page.getByRole('button', { name: 'Set error', exact: true }).click();
    await expect(catalog.getByRole('alert')).toHaveText('Offline');
    await page.getByRole('button', { name: 'Set nullable error', exact: true }).click();
    await expect(catalog.getByRole('alert')).toHaveText('Please retry');
    await catalog.getByRole('button', { name: 'Refresh' }).click();
    await expect(page.getByLabel('Refresh count')).toHaveText('2');
    await page.getByRole('button', { name: 'Activate', exact: true }).click();
    await expect(page.getByLabel('Activation count')).toHaveText('1');
    expect(errors).toEqual([]);
  });
}
