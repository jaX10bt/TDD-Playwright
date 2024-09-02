import { test, expect } from '@playwright/test';

test.describe('"Vastamata" page visibility', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://admin.test.buerokratt.ee/chat/pending');
    });

    test('should have the correct URL', async ({ page }) => {
        await expect(page).toHaveURL('https://admin.test.buerokratt.ee/chat/pending');
    });

    test('should have "uued", "toos" titles', async ({ page }) => {
        const divElement = page.locator('.vertical-tabs__group-header');

        const pText1 = divElement.locator('p').nth(0);
        await expect(pText1).toHaveText(/uued/);

        const pText2 = divElement.locator('p').nth(1);
        await expect(pText2).toHaveText(/töös/);  
    });


    test('should have "kustutamiseks" title', async ({ page }) => {
        // Should mark active status, after that chat becomes visible.
        const button = page.locator('.switch__button');
        button.click();

        const divElement = page.locator('.vertical-tabs__sub-group-header');

        const pText = divElement.locator('p').nth(0);
        await expect(pText).toHaveText(/kustutamiseks\s*\(\d+\)/i);
    });



});