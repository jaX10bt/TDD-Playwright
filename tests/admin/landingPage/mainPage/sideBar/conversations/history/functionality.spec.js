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