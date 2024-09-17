const { test, expect } = require('@playwright/test');
const { getTranslations } = require('../../../../../../translations/languageDetector');

test.describe.serial('Switches Functionality Tests', () => {
    let translation;

    test.beforeEach(async ({ page }) => {
        // Navigate to the page
        await page.goto('https://admin.prod.buerokratt.ee/chat/working-time');

        // Wait for the page to be fully loaded
        await page.waitForLoadState('domcontentloaded');

        // Fetch translations
        translation = await getTranslations(page);
    });

    async function saveChanges(page) {
        const saveButton = page.locator(`text=${translation["save"]}`);
        await saveButton.click();
        await expect(page.locator('.toast.toast--success')).toBeVisible();
        await page.goto(page.url()); // Reload the page by navigating to the current URL
        await page.waitForTimeout(3000); // Wait for the reload to complete
    }

    test('check functionality of "considerPublicHolidays" switch', async ({ page }) => {
        const switchElem = page.locator('.switch__button').nth(1);

        // Wait for the switch to be visible
        await switchElem.waitFor({ state: 'visible', timeout: 15000 });

        // Capture initial state of this specific switch
        const initialChecked = await switchElem.getAttribute('data-state');

        // Toggle the switch
        await switchElem.click();
        await page.waitForTimeout(1000); // Wait for 1 second for the state to update
        await saveChanges(page);

        // Verify the switch has toggled
        const isCheckedAfterToggle = await switchElem.getAttribute('data-state');
        await expect(isCheckedAfterToggle).not.toBe(initialChecked); // Ensure the state has changed

        // Toggle back to original state
        await switchElem.click();
        await page.waitForTimeout(1000);

        // Click the Save button
        await saveChanges(page);

        // Verify the state returns to original
        const finalChecked = await switchElem.getAttribute('data-state');
        await expect(finalChecked).toBe(initialChecked); // Ensure it returns to original state
    });

    test('check functionality of "closedOnWeekends" switch', async ({ page }) => {
        // Locators for the switches
        const closedOnWeekendsSwitch = page.locator('.switch').nth(2).locator('.switch__button');
        const sameOnAllWorkingDaysSwitch = page.locator('.switch').nth(3).locator('.switch__button');

        // Capture the initial state of the switches
        const initialClosedOnWeekendsState = await closedOnWeekendsSwitch.getAttribute('aria-checked') === 'true';
        const sameOnAllWorkingDaysState = await sameOnAllWorkingDaysSwitch.getAttribute('aria-checked') === 'true';

        // Function to toggle switch and save changes
        async function toggleSwitchAndSave(switchElem) {
            await switchElem.click();
            await page.waitForLoadState('networkidle');
            await saveChanges(page);
        }

        // Adjust state if needed
        if (sameOnAllWorkingDaysState) {
            await toggleSwitchAndSave(sameOnAllWorkingDaysSwitch);
        }

        // Toggle the "closedOnWeekends" switch if it is initially on
        if (initialClosedOnWeekendsState) {
            await toggleSwitchAndSave(closedOnWeekendsSwitch);
        }

        // Locate Saturday and Sunday divs
        const saturdayDiv = page.locator(`label:has-text("${translation["saturday"]}")`).locator('..');
        const sundayDiv = page.locator(`label:has-text("${translation["sunday"]}")`).locator('..');

        const newClosedOnWeekendSwitch = await closedOnWeekendsSwitch.getAttribute('aria-checked') === 'true';

        // Check visibility of Saturday and Sunday divs before toggling
        if (!newClosedOnWeekendSwitch) {
            await expect(saturdayDiv).toBeVisible();
            await expect(sundayDiv).toBeVisible();

            // Toggle the switch to turn it on
            await toggleSwitchAndSave(closedOnWeekendsSwitch);
        }

        // Verify that Saturday and Sunday divs are hidden
        await expect(saturdayDiv).not.toBeVisible();
        await expect(sundayDiv).not.toBeVisible();

        // Toggle back to the original state
        await toggleSwitchAndSave(closedOnWeekendsSwitch);

        // Verify that Saturday and Sunday divs are visible again
        await expect(saturdayDiv).toBeVisible();
        await expect(sundayDiv).toBeVisible();

        const checkerClosedOnWeekendsState = await closedOnWeekendsSwitch.getAttribute('aria-checked') === 'true';
        const checkerSameOnAllWorkingDaysState = await sameOnAllWorkingDaysSwitch.getAttribute('aria-checked') === 'true';

        // Restore the original state of "closedOnWeekends" if it was initially off
        if (checkerClosedOnWeekendsState !== initialClosedOnWeekendsState) {
            await toggleSwitchAndSave(closedOnWeekendsSwitch);
        }
        if (checkerSameOnAllWorkingDaysState !== sameOnAllWorkingDaysState) {
            await toggleSwitchAndSave(sameOnAllWorkingDaysSwitch);
        }
    });

    test('check functionality of "sameOnAllWorkingDays" switch', async ({ page }) => {
        const switchElem = page.locator('.switch__button').nth(3);

        // Wait for the switch to be visible
        await switchElem.waitFor({ state: 'visible', timeout: 15000 });

        // Capture initial state of this specific switch
        const initialChecked = await switchElem.getAttribute('aria-checked');
        const closedOnWeekendsSwitch = page.locator('.switch').nth(2).locator('.switch__button');

        // Define the days of the week and their selectors
        const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

        let initialDivCounts = {};
        for (const day of days) {
            const dayDiv = page.locator(`label:has-text("${translation[day]}")`).locator('..');
            const count = await dayDiv.count();
            initialDivCounts[day] = count;
        }

        if (initialChecked === 'false') {
            // Toggle the switch
            await switchElem.click();
            await page.waitForTimeout(1000); // Wait for 1 second for the state to update
        }

        // Click the Save button
        await saveChanges(page);

        const closedOnWeekendsChecker = await closedOnWeekendsSwitch.getAttribute('aria-checked') === 'true';

        // Determine expected visible text based on switch state
        const expectedText = closedOnWeekendsChecker ? "M-F" : "M-S";

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

        // Click the Save button
        await saveChanges(page);

        const afterChecked = await switchElem.getAttribute('aria-checked');
        if (afterChecked !== initialChecked) {
            await switchElem.click();
            await page.waitForTimeout(1000); // Wait for 1 second for the state to update
            await saveChanges(page);
        }

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
});
