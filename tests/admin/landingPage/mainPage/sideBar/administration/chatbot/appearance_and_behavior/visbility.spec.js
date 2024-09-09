import { test, expect } from '@playwright/test';
import { getTranslations } from '../../../../../../../translations/languageDetector';

test.describe('Visibility Tests for "Välimus ja käitumine"/"Appearance and Behaviour" Page', () => {

    const translation = getTranslations('https://admin.test.buerokratt.ee/chat/chatbot/appearance');

    test.beforeEach(async ({ page }) => {
        // Navigate to the page before each test
        await page.goto('https://admin.test.buerokratt.ee/chat/chatbot/appearance');
    });

    test('Check visibility of the header', async ({ page }) => {
        const header = page.locator(`h1:has-text("${translation['AppearanceAndBehvaior']}")`);
        await expect(header).toBeVisible();
    });

    test('Check visibility of animation duration input', async ({ page }) => {
        const animationDurationInput = page.locator(`label:has-text("${translation['WidgetProactiveSeconds']}") + div input`);
        await expect(animationDurationInput).toBeVisible();
    });

    test('Check visibility of notification switch', async ({ page }) => {
        const notificationSwitch = page.locator(`label:has-text("${translation['WidgetBubbleMessage']}") + button.switch__button`);
        await expect(notificationSwitch).toBeVisible();
    });

    test('Check visibility of animation start time input', async ({ page }) => {
        const animationStartTimeInput = page.locator(`label:has-text("${translation['WidgetBubbleMessageSeconds']}") + div input`);
        await expect(animationStartTimeInput).toBeVisible();
    });

    test('Check visibility of notification message input', async ({ page }) => {
        const notificationMessageInput = page.locator(`label:has-text("${translation['WidgetBubbleMessage']}") + div input`);
        await expect(notificationMessageInput).toBeVisible();
    });

    test('Check visibility of primary color picker', async ({ page }) => {
        const primaryColorPicker = page.locator(`label:has-text("${translation['WidgetColor']}") + div input`);
        await expect(primaryColorPicker).toBeVisible();
    });

    test('Check visibility of color picker button', async ({ page }) => {
        const colorPickerButton = page.locator(`label:has-text("${translation['WidgetColor']}") + div input`);
        await expect(colorPickerButton).toBeVisible();
    });

    test('Check visibility of animation dropdown', async ({ page }) => {
        const animationDropdown = page.locator(`label:has-text("${translation['WidgetAnimation']}") + div div.select__trigger`);
        await expect(animationDropdown).toBeVisible();
    });

    test('Check visibility of save button', async ({ page }) => {
        const saveButton = page.locator(`button:has-text("${translation['Save']}")`);
        await expect(saveButton).toBeVisible();
    });

    test('Check visibility of preview button', async ({ page }) => {
        const previewButton = page.locator(`button:has-text("${translation['Preview']}")`);
        await expect(previewButton).toBeVisible();
    });

});
