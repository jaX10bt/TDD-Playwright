const { test, expect } = require('@playwright/test');


test.describe('Session Length/Sessiooni pikkus Visibility tests', () => {


    test('Check visibility of all elements', async ({ page }) => {
        // Navigate to the page
        await page.goto('https://admin.test.buerokratt.ee/chat/session-length'); // Replace with your actual URL

        // Check if the main header is visible
        const mainHeader = page.locator('h1');
        await expect(mainHeader).toBeVisible();

        // Check if the session length label is visible
        const sessionLengthLabel = page.locator('.input__label');
        await expect(sessionLengthLabel).toBeVisible();

        // Check if the session length input field is visible
        const sessionLengthInput = page.locator('input[name="session-length"]');
        await expect(sessionLengthInput).toBeVisible();

        // Check if the unit label "minutes" is visible
        const minutesLabel = page.locator('label.minute');
        await expect(minutesLabel).toBeVisible();

        // Check if the rule label is visible
        const ruleLabel = page.locator('label.rule');
        await expect(ruleLabel).toBeVisible();

        // Check if the save button is visible
        const saveButton = page.locator('button.btn--primary');
        await expect(saveButton).toBeVisible();
    });
});