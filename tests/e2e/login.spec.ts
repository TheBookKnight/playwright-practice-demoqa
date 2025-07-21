import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
    test.beforeEach(async ({page}) => {
        // Go to the login page before each test.
        await page.goto('login');
    });

    test('Welcome banner displays', async ({ page }) => {
        const welcomeLabel = page.getByText('Welcome');
        await expect(welcomeLabel).toBeVisible();
    });
});