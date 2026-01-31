import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
    test('should login successfully with any credentials', async ({ page }) => {
        await page.goto('/login');

        await page.fill('input[type="email"]', 'test@example.com');
        await page.fill('input[type="password"]', 'password');
        await page.click('button[type="submit"]');

        await expect(page).toHaveURL('/');
        await expect(page.getByText('Dashboard')).toBeVisible();
        await expect(page.getByText('test@example.com')).toBeVisible();
    });

    test('should redirect unauthenticated users to login', async ({ page }) => {
        await page.goto('/');
        await expect(page).toHaveURL('/login');
    });
});
