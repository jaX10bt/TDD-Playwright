const { test, expect } = require('@playwright/test');
const { getTranslations } = require('../../../../../../translations/languageDetector');


test.describe('Full Visibility Test for User Management Page', () => {

    const translation = getTranslations('https://admin.test.buerokratt.ee/chat/users')

    // Navigate to the page before each test
    test.beforeEach(async ({ page }) => {
        await page.goto('https://admin.test.buerokratt.ee/chat/users'); // Replace with your actual URL
    });

    // Test 1: Check if the "Kasutajad" heading is visible
    test('should display the "Kasutajad" heading', async ({ page }) => {
        const heading = await page.locator(`h1:has-text("${translation['Users']}")`);
        await expect(heading).toBeVisible();
    });

    // Test 2: Check if the "Lisa kasutaja" button is visible
    test('should display the "Lisa kasutaja" button', async ({ page }) => {
        const addButton = await page.locator(`button.btn--primary:has-text("${translation['AddUser']}")`);
        await expect(addButton).toBeVisible();
    });

    // Test 3: Check if the user data table is visible
    test('should display the user data table', async ({ page }) => {
        const table = await page.locator('table.data-table');
        await expect(table).toBeVisible();
    });

    // Test 4: Check if the table headers are visible
    test('should display the table headers', async ({ page }) => {
        const headers = await page.locator('table.data-table thead tr th');
        await expect(headers).toHaveCount(8); 

        const headerTexts = [`${translation['Name']}`, `${translation['IdCode']}`, `${translation['Role']}`, `${translation['DisplayName']}`, `${translation['Title']}`, `${translation['Email']}`]; // Adjust as needed
        for (let i = 0; i < headerTexts.length; i++) {
            await expect(headers.nth(i)).toHaveText(headerTexts[i]);
            await expect(headers.nth(i)).toBeVisible();
        }
    });

    test('should have one Edit and one Delete button per row', async ({ page }) => {
        // Wait for the table to be visible
        await page.waitForSelector('.data-table'); // Adjust if needed
        const table = page.locator('.data-table');

        // Check for tbody if it's a separate element
        const body = table.locator('tbody'); // Ensure this is the correct selector for tbody
        const rows = body.locator('tr');
        const rowCount = await rows.count();

        // Ensure there are rows in the table
        expect(rowCount).toBeGreaterThan(0);

        // Initialize flags for checking button counts
        let editButtonsCount = 0;
        let deleteButtonsCount = 0;

        // Iterate through each row to count Edit and Delete buttons
        for (let i = 0; i < rowCount; i++) {
            const row = rows.nth(i);

            // Count Edit buttons in the current row
            const editButtons = row.locator(`button.btn--text:has-text("${translation["Edit"]}")`);
            const editButtonCount = await editButtons.count();
            expect(editButtonCount).toBe(1); // Ensure exactly one Edit button per row
            editButtonsCount += editButtonCount;

            // Count Delete buttons in the current row
            const deleteButtons = row.locator(`button.btn--text:has-text("${translation["Delete"]}")`);
            const deleteButtonCount = await deleteButtons.count();
            expect(deleteButtonCount).toBe(1); // Ensure exactly one Delete button per row
            deleteButtonsCount += deleteButtonCount;
        }

        // Ensure the total count of Edit and Delete buttons matches the row count
        expect(editButtonsCount).toBe(rowCount);
        expect(deleteButtonsCount).toBe(rowCount);
    });

});
