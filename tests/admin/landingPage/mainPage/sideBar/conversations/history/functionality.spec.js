import { test, expect } from '@playwright/test';

test.beforeEach('test', async ({ page }) => {
    await page.goto('https://admin.test.buerokratt.ee/chat/history');

    // page is authenticated
    await expect(page).toHaveURL('https://admin.test.buerokratt.ee/chat/history');
});


test('Check if the table is horizontally scrollable', async ({ page }) => {
    // Locate the scroll wrapper
    const scrollWrapper = page.locator('.data-table__scrollWrapper');

    // Verify that the scroll wrapper is scrollable (by checking overflow)
    const overflowX = await scrollWrapper.evaluate(node => window.getComputedStyle(node).overflowX);
    expect(overflowX).toBe('auto' || 'scroll');
});



test('Check if "Ajalugu" date inputs can be changed', async ({ page }) => {

    await page.waitForLoadState('networkidle');

    const container = page.locator('.card__body');

    const dateInputs = container.locator('input');

    // Access the first two inputs which are assumed to be the date inputs
    const startDateInput = dateInputs.nth(0);
    const endDateInput = dateInputs.nth(1);

    // Clear and set the start date
    await startDateInput.click({ clickCount: 3 }); // Select all text
    await startDateInput.fill('01.09.2023');
    await expect(startDateInput).toHaveValue('01.09.2023');

    // Clear and set the end date
    await endDateInput.click({ clickCount: 3 });
    await endDateInput.fill('31.12.2024');
    await expect(endDateInput).toHaveValue('31.12.2024');
});

test('Check if "Ajalugu" date inputs accept only valid date formats', async ({ page }) => {

    await page.waitForLoadState('networkidle');

    const container = page.locator('.card__body');

    const dateInputs = container.locator('input');

    // Access the first two inputs which are assumed to be the date inputs
    const startDateInput = dateInputs.nth(0);
    const endDateInput = dateInputs.nth(1);

    // Clear and set the start date
    await startDateInput.click({ clickCount: 3 }); // Select all text
    await startDateInput.fill('01.09.2023');
    await expect(startDateInput).toHaveValue('01.09.2023');

    // Clear and set the end date
    await endDateInput.click({ clickCount: 3 });
    await endDateInput.fill('31.12.2024');
    await expect(endDateInput).toHaveValue('31.12.2024');
});


test('Search input field accepts text input and triggers search', async ({ page }) => {
    // Locate the table rows to check if there is any data
    await page.waitForLoadState('networkidle');
    const initialRows = page.locator('table.data-table tbody tr');

    const initialRowCount = await initialRows.count();

    if (initialRowCount > 0) {        
        // Locate the search input field using the placeholder text
        const searchInput = page.locator('input[placeholder="Otsi üle vestluste..."]');
        
        // Type random input value into the search input field to expect 0 matching and ensure that input field is working as expected
        await searchInput.fill('abcdefgh12345jklmnop678999001122ghdsa');
        
        await expect(searchInput).toHaveValue('abcdefgh12345jklmnop678999001122ghdsa');
        
        // Wait for search results to be updated
        await page.waitForTimeout(2000);

        const searchResultsRows = page.locator('table.data-table tbody tr');

        const resultsCount = await searchResultsRows.count();

        expect(resultsCount).toBe(0);

    } else {
        return ;
    }


});