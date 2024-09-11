const { test, expect } = require('@playwright/test');
const { getTranslations } = require('../../../../../../translations/languageDetector');

test.describe('Switches Functionality Tests', () => {
    let initialState = {};
    let translation;

    test.beforeEach(async ({ page }) => {
        // Navigate to the page
        await page.goto('https://admin.prod.buerokratt.ee/chat/working-time');

        // Wait for the page to be fully loaded
        await page.waitForLoadState('domcontentloaded');

        // Fetch translations
        translation = await getTranslations(page);

        // Capture initial state
        initialState = {};
        const switches = page.locator('.switch__button');

        // Save initial state of switches
        for (let i = 1; i < await switches.count(); i++) {
            const switchElem = switches.nth(i);
            initialState[`switch_${i}`] = await switchElem.getAttribute('aria-checked');
        }
    });

    test('check functionality of "considerPublicHolidays" switch', async ({ page }) => {
        const switchElem = page.locator('.switch__button').nth(1);

        // Wait for the switch to be visible
        await switchElem.waitFor({ state: 'visible', timeout: 15000 });

        // Capture initial state of this specific switch
        const initialChecked = await switchElem.getAttribute('aria-checked');

        // Toggle the switch
        await switchElem.click();
        await page.waitForTimeout(1000); // Wait for 1 second for the state to update

        const isCheckedAfterToggle = await switchElem.getAttribute('aria-checked');
        console.log(`State after toggle of "considerPublicHolidays": ${isCheckedAfterToggle}`);

        // Verify the switch has toggled
        await expect(isCheckedAfterToggle).not.toBe(initialChecked); // Ensure the state has changed

        // Toggle back to original state
        await switchElem.click();
        await page.waitForTimeout(1000); // Wait for 1 second for the state to update

        const finalChecked = await switchElem.getAttribute('aria-checked');
        console.log(`Final state of "considerPublicHolidays": ${finalChecked}`);
        await expect(finalChecked).toBe(initialChecked); // Ensure it returns to original state
    });

    test('check functionality of "closedOnWeekends" switch', async ({ page }) => {
        // Locate the "closedOnWeekends" switch (assuming it's the second switch)
        const closedOnWeekendsSwitch = page.locator('.switch').nth(2).locator('.switch__button');

        // Locate Saturday and Sunday divs
        const saturdayDiv = page.locator(`label:has-text("${translation["saturday"]}")`);
        const sundayDiv = page.locator(`label:has-text("${translation["sunday"]}")`);

        // Check visibility of Saturday and Sunday divs before toggling
        await expect(saturdayDiv).toBeVisible();
        await expect(sundayDiv).toBeVisible();

        // Toggle the "closedOnWeekends" switch
        await closedOnWeekendsSwitch.click();
        await page.waitForTimeout(1000); // Wait for 1 second for the state to update

        // Verify that Saturday and Sunday divs are hidden
        await expect(saturdayDiv).not.toBeVisible();
        await expect(sundayDiv).not.toBeVisible();

        // Toggle back to original state
        await closedOnWeekendsSwitch.click();
        await page.waitForTimeout(1000); // Wait for 1 second for the state to update

        // Verify that Saturday and Sunday divs are visible again
        await expect(saturdayDiv).toBeVisible();
        await expect(sundayDiv).toBeVisible();
    });

    test('check functionality of "sameOnAllWorkingDays" switch', async ({ page }) => {
        const switchElem = page.locator('.switch__button').nth(3);

        // Wait for the switch to be visible
        await switchElem.waitFor({ state: 'visible', timeout: 15000 });

        // Capture initial state of this specific switch
        const initialChecked = await switchElem.getAttribute('aria-checked');
        const closedOnWeekendsSwitch = page.locator('.switch').nth(2).locator('.switch__button');
        const closedOnWeekends = await closedOnWeekendsSwitch.getAttribute('aria-checked') === 'true';

        // Define the days of the week and their selectors
        const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

        let initialDivCounts = {};
        for (const day of days) {
            const dayDiv = page.locator(`label:has-text("${translation[day]}")`).locator('..');
            const count = await dayDiv.count();
            initialDivCounts[day] = count;
        }

        // Toggle the switch
        await switchElem.click();
        await page.waitForTimeout(1000); // Wait for 1 second for the state to update

        // Determine expected visible text based on switch stat
        const expectedText = closedOnWeekends ? "M-F" : "M-S";

        // Find and count visible divs
        const visibleDivs = page.locator(`label:has-text("${expectedText}")`).locator('..');
        const visibleDivCount = await visibleDivs.count();

        // Ensure only one div is visible
        await expect(visibleDivCount).toBe(1);

        // Ensure the visible div does not contain a switch button
        const visibleDiv = page.locator(`label:has-text("${expectedText}")`).locator('..');
        const switchButtonInVisibleDiv = visibleDiv.locator('.switch__button');
        const switchButtonCount = await switchButtonInVisibleDiv.count();
        await expect(switchButtonCount).toBe(0); // Ensure the visible div does not contain a switch button

        // Toggle back to the original state
        await switchElem.click();
        await page.waitForTimeout(1000); // Wait for 1 second for the state to update

        // Verify the div counts return to the initial state
        let finalDivCounts = {};
        for (const day of days) {
            const dayDiv = page.locator(`label:has-text("${translation[day]}")`).locator('..');
            const count = await dayDiv.count();
            finalDivCounts[day] = count;
        }
        for (const day of days) {
            await expect(finalDivCounts[day]).toBe(initialDivCounts[day]); // Ensure div counts return to the original state
        }
    });





    // Add similar tests for other switches as needed
});
