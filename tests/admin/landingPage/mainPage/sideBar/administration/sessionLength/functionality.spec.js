const { test, expect } = require('@playwright/test');

test.describe.serial('Session Length/Sessiooni pikkus Functionality Tests', () => {

    test('Change to same session length, save, and verify persistence', async ({ page }) => {

        test.info().annotations.push({
            type: 'Note',
            description: 'This test has had some issues with being flaky and failing due to suspected timing issues. Please take this into consideration when running the test.',
        })

        await page.goto('https://admin.test.buerokratt.ee/chat/session-length'); // Replace with your actual URL

        await page.waitForTimeout(2000);

        // Store the original value
        const originalValue = await page.locator('input[name="session-length"]').inputValue();

        // Set to a valid session length within the range (e.g., 60 minutes)
        const newValue = originalValue;
        await page.fill('input[name="session-length"]', newValue);
        await page.click('button.btn--primary'); // Click the save button

        // Wait for success toast
        const toast = page.locator('li.toast.toast--success');

        // Ensure the toast is visible
        await expect(toast).toBeVisible();

        await page.waitForTimeout(2000);

        // Refresh the page
        await page.reload();

        await page.waitForTimeout(2000);

        const savedValue = await page.locator('input[name="session-length"]').inputValue();
        expect(savedValue).toBe(newValue);

        // Revert to original value
        await page.fill('input[name="session-length"]', originalValue);
        await page.click('button.btn--primary'); 

        // Wait for success toast
        const toast2 = page.locator('li.toast.toast--success');

        // Ensure the toast is visible
        await expect(toast2).toBeVisible();

        await page.waitForTimeout(2000);

        // Refresh and check that the original value is restored
        await page.reload();
        await page.waitForTimeout(2000);
        const revertedValue = await page.inputValue('input[name="session-length"]');
        expect(revertedValue).toBe(originalValue);
    });

    test('Attempt to set an invalid session length and check for error message', async ({ page }) => {
        await page.goto('https://admin.test.buerokratt.ee/chat/session-length'); // Replace with your actual URL


        await page.waitForTimeout(2000);
        // Set an invalid session length (e.g., 500 minutes)
        const invalidValue = '500';
        await page.fill('input[name="session-length"]', invalidValue);
        await page.click('button.btn--primary'); // Click the save button

        // Verify the error toast is visible
        const toast = page.locator('li.toast.toast--error');

        // Ensure the toast is visible
        await expect(toast).toBeVisible();

        await page.waitForTimeout(1000);

        // You can also check the error message content if needed
        const errorMessage = await page.locator('.toast.toast--error .toast__content').textContent();
        expect(errorMessage).toContain('Seansi pikkus peab olema vahemikus 30 - 480 minutit');
    });


    test('Change to different session length, save, and verify persistence', async ({ page }) => {

        test.info().annotations.push({
            type: 'Note',
            description: 'This test has had some serious timing issues in regard to page load. Please take this into consideration when running the test.',
        })

        function randomIntFromInterval(min, max) { // min and max included 
            return (Math.floor(Math.random() * (max - min + 1) + min)).toString();
        }

        await page.goto('https://admin.test.buerokratt.ee/chat/session-length'); // Replace with your actual URL

        await page.waitForTimeout(2000);

        // Store the original value
        const originalValue = await page.locator('input[name="session-length"]').inputValue();


        await page.waitForTimeout(1000);
        // Set to a valid session length within the range (e.g., 60 minutes)
        const newValue = randomIntFromInterval(30, 480);
        await page.fill('input[name="session-length"]', newValue);
        await page.click('button.btn--primary'); // Click the save button

        // Wait for success toast
        const toast = page.locator('li.toast.toast--success');

        // Ensure the toast is visible
        await expect(toast).toBeVisible();

        await page.waitForTimeout(2000);

        // Refresh the page
        await page.reload();

        await page.waitForTimeout(2000);

        const savedValue = await page.locator('input[name="session-length"]').inputValue();
        expect(savedValue).toBe(newValue);

        // Revert to original value
        await page.fill('input[name="session-length"]', originalValue);
        await page.click('button.btn--primary');

        // Wait for success toast
        const toast2 = page.locator('li.toast.toast--success');

        // Ensure the toast is visible
        await expect(toast2).toBeVisible();

        await page.waitForTimeout(2000);

        // Refresh and check that the original value is restored
        await page.reload();
        await page.waitForTimeout(2000);
        const revertedValue = await page.inputValue('input[name="session-length"]');
        expect(revertedValue).toBe(originalValue);
    });
});
