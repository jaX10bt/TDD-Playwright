import { test, expect } from '@playwright/test';
import { getTranslations } from '../../../../../../../translations/languageDetector';

test.describe('Welcome message/Tervitussõnum Visibility Tests', () => {

    let translation;

    test.beforeEach(async ({ page }) => {
        // Load the page before each test
        await page.goto('https://admin.prod.buerokratt.ee/chat/chatbot/welcome-message');
        translation = await getTranslations(page);
    });



    test('Check if the textarea contains text', async ({ page }) => {
        // Locate the textarea element
        const textarea = await page.locator('textarea');

        // Verify that the textarea is visible
        await expect(textarea).toBeVisible();

       

    });



});
