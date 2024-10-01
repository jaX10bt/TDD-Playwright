import { test, expect } from '@playwright/test';
import { getTranslations } from '../../../../../../../translations/languageDetector';

test.describe('Visibility Tests for "Välimus ja käitumine"/"Appearance and Behaviour" Page', async () => {
    let translation;
    let context;
    let page;

    test.beforeAll(async ({ browser }) => {
        // Create a new context and page manually
        context = await browser.newContext();
        page = await context.newPage();
        await page.goto('https://admin.prod.buerokratt.ee/chat/chatbot/appearance');
        translation = await getTranslations(page);
    });

    test.beforeEach(async ({ page }) => {
        // Navigate to the page before each test
        let translation
        await page.goto('https://admin.prod.buerokratt.ee/chat/chatbot/appearance');
        //translation = await getTranslations(page);
    });

    test('Check visibility of the header', async ({ page }) => {
        const header = page.locator(`h1:has-text("${translation['appearanceAndBehaviour']}")`);
        await expect(header).toBeVisible();
    });

    test('Check visibility of animation duration input', async ({ page }) => {
        const label = page.locator(`label:has-text("${translation['widgetProactiveSeconds']}")`);
        await expect(label).toBeVisible();
        const inputField = page.locator('input[name="widgetProactiveSeconds"]');
        await expect(inputField).toBeVisible();
    });

    // EDGE CASE: two labels with the same text
    test('Check visibility of notification switch', async ({ page }) => {
        const notificationSwitch = page.locator(`label:has-text("${translation['widgetBubbleMessageText']}") + button.switch__button`);
        await expect(notificationSwitch).toBeVisible();
    });

    // This test had issue in our case that its label text and input name do not match. Had to add extra field in business dsl and inprove DSLConverter populateTemplate funtion.
    test('Check visibility of animation start time input', async ({ page }) => {
        // const labelLocator = page.locator('label:has-text("' + translation.widgetBubbleMessageSeconds + '")');
        // const inputLocator = page.locator('input[name="widgetDisplayBubbleMessageSeconds"]');
        // await expect(labelLocator).toBeVisible();
        // await expect(inputLocator).toBeVisible();

        const animationStartTimeInput = page.locator(`label:has-text("${translation['widgetBubbleMessageSeconds']}") + div input`);
        await expect(animationStartTimeInput).toBeVisible();
    });

    test('Check visibility of notification message input', async ({ page }) => {
        const notificationMessageInput = page.locator(`label:has-text("${translation['widgetBubbleMessageText']}") + div input`);
        await expect(notificationMessageInput).toBeVisible();

    });

    test('Check visibility of color picker', async ({ page }) => {
        const labelLocator = page.locator('label:has-text("' + translation.widgetColor + '")');
        const colorPickerLocator = page.locator('input[readonly]');
        const buttonLocator = page.locator('label:has-text("' + translation.widgetColor + '") + div input');
        await expect(labelLocator).toBeVisible();
        await expect(colorPickerLocator).toBeVisible();
        await expect(buttonLocator).toBeVisible();
    });

    // Changed locator search to combobox
    test('Check visibility of animation dropdown', async ({ page }) => {
        const dropdownLocator = page.getByRole('combobox', { name: translation.widgetAnimation });
        await expect(dropdownLocator).toBeVisible();
    });

    test('Check visibility of save button', async ({ page }) => {
        const saveButton = page.locator(`button.btn:has-text("${translation.save}")`);
        await expect(saveButton).toBeVisible();
    });

    test('Check visibility of preview button', async ({ page }) => {
        const previewButton = page.locator(`button:has-text("${translation.preview}")`);
        await expect(previewButton).toBeVisible();
    });
});
