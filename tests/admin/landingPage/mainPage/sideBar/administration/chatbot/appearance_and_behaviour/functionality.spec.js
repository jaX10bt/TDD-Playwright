import { test, expect } from '@playwright/test';
import { timeout } from '../../../../../../../../playwright.config';

test.describe('Functionality Tests for "Välimus ja käitumine"/"Appearance and behaviour" Page', () => {

    let originalStates = {};

    test.info().annotations.push({
        type: 'Known bug',
        description: 'There is a bug regarding this test as its supposed to turn the switches on after first press but its first state is checked while the UI remains as if its unchecked meaning the first press only makes the state unchecked and thus nothing changes for the user in regard to UI. This is the action sequence ==> Open page => Switch appears unchecked => Inspect the element => Element says its state is checked => Click the element => Switch doesnt change appearance but state changes to unchecked.',
    })

    test.info().annotations.push({
        type: 'Test working condition',
        description: 'Currently this test passes when the notification message is turned on by default. Other this shouldnt affect the test results. Since the aforementioned bug runs throught all of the tests and pages, it would be better to focus on this after the bug is fixed.',
    })

    test.beforeEach(async ({ page }) => {
        // Navigate to the page before each test
        await page.goto('https://admin.test.buerokratt.ee/chat/chatbot/appearance'); // Replace with your actual page URL

        // Capture original states of all inputs and switches using more reliable selectors
        originalStates.animationDuration = await page.locator('input[name="widgetProactiveSeconds"]').inputValue();
        originalStates.notificationSwitch = await page.locator('button.switch__button[aria-checked]').nth(1).getAttribute('aria-checked');
        originalStates.animationStartTime = await page.locator('input[name="widgetDisplayBubbleMessageSeconds"]').inputValue();
        originalStates.notificationMessage = await page.locator('input[name="widgetBubbleMessageText"]').inputValue();
        originalStates.primaryColor = await page.locator('input[name="widgetColor"]').inputValue();
        const dropdownTrigger = page.locator('div.select__trigger');
        originalStates.animationDropdown = await dropdownTrigger.textContent();
    });

    test.beforeEach(async ({ page }) => {
        // Navigate to the page before each test
        await page.goto('https://admin.test.buerokratt.ee/chat/chatbot/appearance'); // Replace with your actual page URL

        // Capture original states of all inputs and switches using more reliable selectors
        originalStates.animationDuration = await page.locator('input[name="widgetProactiveSeconds"]').inputValue();
        originalStates.notificationSwitch = await page.locator('button.switch__button[aria-checked]').nth(1).getAttribute('aria-checked');
        originalStates.animationStartTime = await page.locator('input[name="widgetDisplayBubbleMessageSeconds"]').inputValue();
        originalStates.notificationMessage = await page.locator('input[name="widgetBubbleMessageText"]').inputValue();
        originalStates.primaryColor = await page.locator('input[name="widgetColor"]').inputValue();
        const dropdownTrigger = page.locator('div.select__trigger');
        originalStates.animationDropdown = await dropdownTrigger.textContent();
    });

    test('Check functionality of all fields and "Eelvaade" button', async ({ page }) => {

        function rgbToHex(rgb) {
            const [r, g, b] = rgb.match(/\d+/g).map(Number);
            return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
        }

        // Fill in the animation duration
        const newAnimationDuration = '5';
        await page.locator('input[name="widgetProactiveSeconds"]').fill(newAnimationDuration);
        await expect(page.locator('input[name="widgetProactiveSeconds"]')).toHaveValue(newAnimationDuration);

        // Toggle the notification switch
        const notificationSwitch = page.locator('button.switch__button[aria-checked]').nth(1);
        const originalNotificationState = await notificationSwitch.getAttribute('aria-checked');
        await notificationSwitch.click();
        const newNotificationState = originalNotificationState === 'true' ? 'false' : 'true';
        await expect(notificationSwitch).toHaveAttribute('aria-checked', newNotificationState);

        // Fill in the animation start time
        const newAnimationStartTime = '3';
        await page.locator('input[name="widgetDisplayBubbleMessageSeconds"]').fill(newAnimationStartTime);
        await expect(page.locator('input[name="widgetDisplayBubbleMessageSeconds"]')).toHaveValue(newAnimationStartTime);

        // Fill in the notification message
        const newNotificationMessage = 'Test notification';
        await page.locator('input[name="widgetBubbleMessageText"]').fill(newNotificationMessage);
        await expect(page.locator('input[name="widgetBubbleMessageText"]')).toHaveValue(newNotificationMessage);

        await page.locator('input[name="widgetColor"]').click();
        const editableInput = await page.locator('input[id="rc-editable-input-1"]')
        editableInput.clear();
        editableInput.fill('#FF0000');

        await page.locator('div.select__trigger').click();
        // Wait for the dropdown menu to be visible
        const dropdownMenu = await page.locator('ul.select__menu');
        await expect(dropdownMenu).toBeVisible();

        // Click on the desired option in the dropdown
        await dropdownMenu.locator('li:has-text("Jump")').click();

        // Verify the selected option in the dropdown trigger
        await expect(page.locator('div.select__trigger')).toHaveText('JumpDropdown icon');

        // Click the "Eelvaade" button to trigger the mock widget
        await page.locator('button:has-text("Eelvaade")').click();

        // Wait for the mock widget to appear and verify the changes
        const mockWidget = page.locator('img[alt="Buerokratt logo"]'); // Adjust selector to match the actual mock widget
        await expect(mockWidget).toBeVisible();

        // Conditionally verify the notification message based on the switch state
        if (newNotificationState === 'true') {
            // Verify the mock widget reflects the new settings if the switch is enabled
            await expect(mockWidget.locator('.profile__greeting-message.profile__greeting-message--active')).toHaveText(newNotificationMessage);
        } else {
            // If the switch is off, ensure the message is not visible
            await expect(mockWidget.locator('.profile__greeting-message.profile__greeting-message--active')).not.toBeVisible();
        }

        const parentDiv = await mockWidget.evaluateHandle(el => el.parentElement);

        await page.waitForTimeout(6000);

        // Check other properties (background color, animation, etc.)
        const backgroundColor = await parentDiv.evaluate(el => window.getComputedStyle(el).backgroundColor);
        expect(rgbToHex(backgroundColor)).toBe('#FF0000');

        // Get animation-iteration-count
        const animationIterationCount = await parentDiv.evaluate(el => window.getComputedStyle(el).animationIterationCount);
        expect(animationIterationCount).toBe('5');

        const hasAnimationClass = await page.locator('div.profile.profile--jump').count() > 0;
        expect(hasAnimationClass).toBe(true);

    });

    /* test.afterEach(async ({ page }) => {
        // Restore original states
        await page.locator('input[name="widgetProactiveSeconds"]').fill(originalStates.animationDuration);
        if (await page.locator('button.switch__button[aria-checked]').nth(1).getAttribute('aria-checked') !== originalStates.notificationSwitch) {
            await page.locator('button.switch__button[aria-checked]').nth(1).click();
        }
        await page.locator('input[name="widgetDisplayBubbleMessageSeconds"]').fill(originalStates.animationStartTime);
        await page.locator('input[name="widgetBubbleMessageText"]').fill(originalStates.notificationMessage);
        // Assuming there's a way to reset color (may require specific interactions depending on the UI)
        await page.locator('input[name="widgetColor"]').click();
        const editableInput = await page.locator('input[id="rc-editable-input-1"]')
        editableInput.clear();
        editableInput.fill(originalStates.primaryColor);
        await page.locator('div.select__trigger').click();
        await page.locator(`li:has-text("${originalStates.animationDropdown}")`).click();

    }); */
});
