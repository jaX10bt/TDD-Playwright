import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.test.buerokratt.ee/chat/active');
})

test.describe("active status-switch button functionality", () => {
    test('should change button background color when pressed', async ({ page }) => {
        const button = page.locator('.switch__button');
        const initialColor = await button.evaluate(el => getComputedStyle(el).backgroundColor);
        await button.click();

        await page.waitForTimeout(50) // for animation time
    
        const newColor = await button.evaluate(el => getComputedStyle(el).backgroundColor);
        expect(newColor).not.toBe(initialColor);
    });

    test('should change active status dot color', async ({ page }) => {
        const button = page.locator('.switch__button');
        const initialColor = await button.evaluate(el => getComputedStyle(el).backgroundColor);
        await button.click();

        await page.waitForTimeout(50) 
    
        const newColor = await button.evaluate(el => getComputedStyle(el).backgroundColor);
        expect(newColor).not.toBe(initialColor);
    });
})