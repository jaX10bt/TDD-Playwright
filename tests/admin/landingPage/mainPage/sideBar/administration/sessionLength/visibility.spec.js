const { test, expect } = require('@playwright/test');

test.describe('Session Length/Sessiooni pikkus Visibility Tests', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the page before each test
        await page.goto('https://admin.test.buerokratt.ee/chat/session-length'); // Replace with your actual URL
    });

    test('Check visibility of the main header', async ({ page }) => {
        // Check if the main header is visible
        const mainHeader = page.locator('h1');
        await expect(mainHeader).toBeVisible();
    });

    test('Check visibility of the session length label', async ({ page }) => {
        // Check if the session length label is visible
        const sessionLengthLabel = page.locator('.input__label');
        await expect(sessionLengthLabel).toBeVisible();
    });

    test('Check visibility of the session length input field', async ({ page }) => {
        // Check if the session length input field is visible
        const sessionLengthInput = page.locator('input[name="session-length"]');
        await expect(sessionLengthInput).toBeVisible();
    });

    test('Check visibility of the unit label "minutes"', async ({ page }) => {
        // Check if the unit label "minutes" is visible
        const minutesLabel = page.locator('label.minute');
        await expect(minutesLabel).toBeVisible();
    });

    test('Check visibility of the rule label', async ({ page }) => {
        // Check if the rule label is visible
        const ruleLabel = page.locator('label.rule');
        await expect(ruleLabel).toBeVisible();
    });

    test('Check visibility of the save button', async ({ page }) => {
        // Check if the save button is visible
        const saveButton = page.locator('button.btn--primary');
        await expect(saveButton).toBeVisible();
    });

});
