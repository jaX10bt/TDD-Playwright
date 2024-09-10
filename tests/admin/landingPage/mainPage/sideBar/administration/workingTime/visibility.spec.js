const { test, expect } = require('@playwright/test');
const { getTranslations } = require('../../../../../../translations/languageDetector');

test.describe('Switch visibility and text tests', () => {
    let translation;

    test.beforeEach(async ({ page }) => {
        // Navigate to the page with a longer timeout
        await page.goto('https://admin.prod.buerokratt.ee/chat/working-time', { timeout: 60000 }); // 60 seconds timeout for navigation

        // Fetch translations
        translation = await getTranslations(page); // Ensure to await if getTranslations is async
    });

    test('check visibility and text of switches', async ({ page }) => {
        // Define expected texts for each switch
        const switchLabels = [
            translation["considerPublicHolidays"],
            translation["closedOnWeekends"],
            translation["sameOnAllWorkingDays"]
        ];

        // Wait for the switches to be visible
        await page.waitForSelector('.switch', { state: 'visible', timeout: 10000 }); // Wait up to 10 seconds

        // Select all switches
        const switches = page.locator('.switch');

        // Iterate through switches and check visibility and text
        for (let i = 0; i < await switches.count(); i++) {
            const switchElem = switches.nth(i+1);

            // Wait for each switch to be visible
            await switchElem.waitFor({ state: 'visible', timeout: 10000 }); // Wait up to 10 seconds
            
            const label = await switchElem.locator('.switch__label').textContent();

            // Check visibility
            await expect(switchElem).toBeVisible();
            
            // Check text content
            await expect(label?.trim()).toBe(switchLabels[i]);
        }
    });
});
