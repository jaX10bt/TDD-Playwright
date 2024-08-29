import { test, expect } from '@playwright/test';

test.describe('"Vastamata" page visibility', () => {

    test.beforeEach(async ({ page }) => {
        // Visit the page (replace 'your-url' with the actual URL)
        await page.goto('https://admin.test.buerokratt.ee/chat/chatbot/emergency-notices');
    });

    test('should have the correct URL', async ({ page }) => {
        await expect(page).toHaveURL('https://admin.test.buerokratt.ee/chat/unanswered');
    });
});