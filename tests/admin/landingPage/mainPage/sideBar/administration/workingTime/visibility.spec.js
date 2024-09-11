const { test, expect } = require('@playwright/test');
const { getTranslations } = require('../../../../../../translations/languageDetector');

test.describe('Switch visibility and text tests', () => {
    let translation;

    test.beforeEach(async ({ page }) => {
        // Navigate to the page with a longer timeout
        await page.goto('https://admin.prod.buerokratt.ee/chat/working-time');

        // Fetch translations
        translation = await getTranslations(page);
    });

    test('check visibility and text of "considerPublicHolidays" switch', async ({ page }) => {
        // Wait for the switch to be visible
        await page.waitForSelector('.switch', { state: 'visible', timeout: 15000 });

        // Select the first switch (assuming it's the one for "considerPublicHolidays")
        const switchElem = page.locator('.switch').nth(1);

        // Wait for the label to be visible
        const labelElem = switchElem.locator('.switch__label');
        await labelElem.waitFor({ state: 'visible', timeout: 15000 });

        const label = await labelElem.textContent();

        // Check visibility
        await expect(switchElem).toBeVisible();

        // Check text content
        await expect(label?.trim()).toBe(translation["considerPublicHolidays"]);
    });

    test('check visibility and text of "closedOnWeekends" switch', async ({ page }) => {
        // Wait for the switch to be visible
        await page.waitForSelector('.switch', { state: 'visible', timeout: 15000 });

        // Select the second switch (assuming it's the one for "closedOnWeekends")
        const switchElem = page.locator('.switch').nth(2);

        // Wait for the label to be visible
        const labelElem = switchElem.locator('.switch__label');
        await labelElem.waitFor({ state: 'visible', timeout: 15000 });

        const label = await labelElem.textContent();

        // Check visibility
        await expect(switchElem).toBeVisible();

        // Check text content
        await expect(label?.trim()).toBe(translation["closedOnWeekends"]);
    });

    test('check visibility and text of "sameOnAllWorkingDays" switch', async ({ page }) => {
        // Wait for the switch to be visible
        await page.waitForSelector('.switch', { state: 'visible', timeout: 15000 });

        // Select the third switch (assuming it's the one for "sameOnAllWorkingDays")
        const switchElem = page.locator('.switch').nth(3);

        // Wait for the label to be visible
        const labelElem = switchElem.locator('.switch__label');
        await labelElem.waitFor({ state: 'visible', timeout: 15000 });

        const label = await labelElem.textContent();

        // Check visibility
        await expect(switchElem).toBeVisible();

        // Check text content
        await expect(label?.trim()).toBe(translation["sameOnAllWorkingDays"]);
    });
});
