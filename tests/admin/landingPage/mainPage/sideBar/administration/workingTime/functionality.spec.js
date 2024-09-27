const { test, expect } = require('@playwright/test');
const { getTranslations } = require('../../../../../../translations/languageDetector');

test.describe.serial('Working time Functionality Tests', () => {
    let translation;
    let initialStates = {}; // To store the initial states of all switches
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
    let initialDivCounts = {};

    test.beforeEach(async ({ page }) => {
        // Navigate to the page
        await page.goto('https://admin.prod.buerokratt.ee/chat/working-time');

        // Wait for the page to be fully loaded
        await page.waitForLoadState('domcontentloaded');

        // Fetch translations
        translation = await getTranslations(page);

        // Capture initial states of relevant switches
        const switches = {
            considerPublicHolidays: page.locator('.switch__button').nth(1),
            closedOnWeekends: page.locator('.switch__button').nth(2),
            sameOnAllWorkingDays: page.locator('.switch__button').nth(3)
        };

        // Save initial states to restore later
        for (const key in switches) {
            initialStates[key] = await switches[key].getAttribute('aria-checked');
        }

        for (const day of days) {
            const dayDiv = page.locator(`label:has-text("${translation[day]}")`).locator('..');
            const count = await dayDiv.count();
            initialDivCounts[day] = count;
        }
    });

    test.afterEach(async ({ page }) => {
        // Restore all switches to their initial states if they were changed
        const switches = {
            considerPublicHolidays: page.locator('.switch__button').nth(1),
            closedOnWeekends: page.locator('.switch__button').nth(2),
            sameOnAllWorkingDays: page.locator('.switch__button').nth(3)
        };

        for (const key in switches) {
            const currentState = await switches[key].getAttribute('aria-checked');
            if (currentState !== initialStates[key]) {
                // If state was changed during the test, toggle it back
                await switches[key].click();
                await saveChanges(page);
            }
        }
        // Verify the div counts return to the initial state
        for (const day of days) {
            const dayDiv = page.locator(`label:has-text("${translation[day]}")`).locator('..');
            const count = await dayDiv.count();
            await expect(count).toBe(initialDivCounts[day]);
        }
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

        // Toggle the switch
        await switchElem.click();
        await page.waitForTimeout(1000); // Wait for 1 second for the state to update
        await saveChanges(page);

        // Verify the switch has toggled
        const newChecked = await switchElem.getAttribute('aria-checked');
        await expect(newChecked).not.toBe(initialStates["considerPublicHolidays"]); // Ensure the state has changed
    });

    test('check functionality of "closedOnWeekends" switch', async ({ page }) => {
        const closedOnWeekendsSwitch = page.locator('.switch__button').nth(2);
        const closedOnWeekendsState = await closedOnWeekendsSwitch.getAttribute('aria-checked');

        const sameOnAllWorkingDaysSwitch = page.locator('.switch__button').nth(3);
        const sameOnAllWorkingDaysState = await sameOnAllWorkingDaysSwitch.getAttribute('aria-checked');

        const saturdayDiv = page.locator(`label:has-text("${translation["saturday"]}")`).locator('..');
        const sundayDiv = page.locator(`label:has-text("${translation["sunday"]}")`).locator('..');

        // Toggle the "closedOnWeekends" switch
        if (closedOnWeekendsState === 'false') {
            await closedOnWeekendsSwitch.click();
            await saveChanges(page)
        }

        if (sameOnAllWorkingDaysState === 'true') {
            await sameOnAllWorkingDaysSwitch.click();
            await saveChanges(page)
        }

        // Verify that Saturday and Sunday divs are hidden
        await expect(saturdayDiv).not.toBeVisible();
        await expect(sundayDiv).not.toBeVisible();

        // Toggle back to the original state
        await closedOnWeekendsSwitch.click();
        await saveChanges(page);

        // Verify that Saturday and Sunday divs are visible again
        await expect(saturdayDiv).toBeVisible();
        await expect(sundayDiv).toBeVisible();
    });

    test('check functionality of "sameOnAllWorkingDays" switch', async ({ page }) => {
        const switchElem = page.locator('.switch__button').nth(3);
        const switchState = await switchElem.getAttribute('aria-checked');
        
        if (switchState === 'false') {
            // Toggle the "sameOnAllWorkingDays" switch
            await switchElem.click();
            await saveChanges(page);
        }

        const closedOnWeekendsSwitch = page.locator('.switch__button').nth(2);
        const closedOnWeekendsChecker = await closedOnWeekendsSwitch.getAttribute('aria-checked') === 'true';
        const expectedText = closedOnWeekendsChecker ? "M-F" : "M-S";

        // Verify only one div is visible
        const visibleDiv = page.locator(`label:has-text("${expectedText}")`).locator('..');
        await expect(visibleDiv).toHaveCount(1);
        await expect(visibleDiv.locator('.switch__button')).toHaveCount(0);
        
    });

    
    test('Verify working time settings for Monday', async ({ page }) => {
        // Navigate to the relevant page
    
        // Define translation keys for weekday
    
        // Locate the track for Monday based on the translated weekday
        const trackLocator = page.locator(`.track:has-text("${translation["monday"]}")`);
    
        // Ensure the track for Monday is visible
        await expect(trackLocator).toBeVisible();
    
        // Verify start time input
        const startTimeLocator = trackLocator.locator('.startTime input[type="text"]');
        await expect(startTimeLocator).toBeVisible();
    
        // Verify end time input
        const endTimeLocator = trackLocator.locator('.endTime input[type="text"]');
        await expect(endTimeLocator).toBeVisible();
    
        // Capture the old start and end times before making changes
        const oldStartTime = await startTimeLocator.inputValue();
        const oldEndTime = await endTimeLocator.inputValue();
    
        // Enter new start and end time
        await startTimeLocator.fill('09:00:00'); // Adjust the format as needed
        await endTimeLocator.fill('17:00:00'); // Adjust the format as needed
    
        // Optional: Add assertions to check if new values are entered correctly
        await expect(startTimeLocator).toHaveValue('09:00:00');
        await expect(endTimeLocator).toHaveValue('17:00:00');
    
        // Save changes
        await saveChanges(page)// Replace with actual selector for the save button
    
    
        // Ensure that the changes persisted after the refresh
        await expect(startTimeLocator).toHaveValue('09:00:00');
        await expect(endTimeLocator).toHaveValue('17:00:00');
    
        // Revert to the old values
        await startTimeLocator.fill(oldStartTime);
        await endTimeLocator.fill(oldEndTime);
    
        // Save the old state again
        await saveChanges(page); // Replace with actual selector for the save button
    
    
        // Verify that the old state is restored
        await expect(startTimeLocator).toHaveValue(oldStartTime);
        await expect(endTimeLocator).toHaveValue(oldEndTime);
    });
    
});