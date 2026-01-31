import { test, expect } from '@playwright/test';

test.describe('Issue Management', () => {
    test.beforeEach(async ({ page }) => {
        // Login first
        await page.goto('/login');
        await page.fill('input[type="email"]', 'test@example.com');
        await page.fill('input[type="password"]', 'password');
        await page.click('button[type="submit"]');
        await expect(page).toHaveURL('/');
    });

    test('should create, view, and delete an issue', async ({ page }) => {
        // Create
        await page.click('text=New Issue');
        await expect(page.getByText('Create New Issue')).toBeVisible();

        const title = `Test Issue ${Date.now()}`;
        await page.fill('input[placeholder="Issue title"]', title);
        await page.fill('textarea', 'This is a test description');
        await page.selectOption('select[name="priority"]', 'HIGH');
        await page.click('button:text("Create Issue")');

        // Verify in list
        await expect(page.getByText(title)).toBeVisible();
        await expect(page.getByText('High')).toBeVisible();

        // Verify Dashboard stats updated (implied by visual check, but we can check specific elements if tagged)

        // Delete
        // Need to handle confirm dialog
        page.on('dialog', dialog => dialog.accept());

        // Hover over the card to see delete button (or just click it if visible/targetable)
        // The delete button is opacity-0 group-hover:opacity-100. Playwright can click invisible elements usually or we hover first.
        await page.locator(`text=${title}`).first().hover();
        await page.getByTitle('Delete Issue').click();

        await expect(page.getByText(title)).not.toBeVisible();
    });
});
