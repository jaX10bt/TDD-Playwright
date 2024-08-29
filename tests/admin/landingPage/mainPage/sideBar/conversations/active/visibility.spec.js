import { test, expect } from '@playwright/test';

test.beforeEach('test', async ({ page }) => {
    await page.goto('https://admin.test.buerokratt.ee/chat/active');
    // page is authenticated
    await expect(page).toHaveURL('https://admin.test.buerokratt.ee/chat/active');
});


test.describe('"Aktiivsed" tab visibility', () => {

    test('should have the correct URL', async ({ page }) => {
        await expect(page).toHaveURL('https://admin.test.buerokratt.ee/chat/active');
    });
});