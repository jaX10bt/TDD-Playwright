import { test, expect } from '@playwright/test';
import { getTranslations } from '../../../../../../../translations/languageDetector';

test.describe('Visibility Tests for "Välimus ja käitumine"/"Appearance and Behaviour" Page', async ( ) => {
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
        const animationDurationInput = page.locator(`label:has-text("${translation['widgetProactiveSeconds']}") + div input`);
        await expect(animationDurationInput).toBeVisible();
    });

    test('Check visibility of notification switch', async ({ page }) => {
        const notificationSwitch = page.locator(`label:has-text("${translation['widgetBubbleMessage']}") + button.switch__button`);
        await expect(notificationSwitch).toBeVisible();
    });

    test('Check visibility of animation start time input', async ({ page }) => {
        const animationStartTimeInput = page.locator(`label:has-text("${translation['widgetBubbleMessageSeconds']}") + div input`);
        await expect(animationStartTimeInput).toBeVisible();
    });

    test('Check visibility of notification message input', async ({ page }) => {
        const notificationMessageInput = page.locator(`label:has-text("${translation['widgetBubbleMessage']}") + div input`);
        await expect(notificationMessageInput).toBeVisible();
        
    });

    test('Check visibility of primary color picker', async ({ page }) => {
        const primaryColorPicker = page.locator(`label:has-text("${translation['widgetColor']}") + div input`);
        await expect(primaryColorPicker).toBeVisible();
    });

    test('Check visibility of color picker button', async ({ page }) => {
        const colorPickerButton = page.locator(`label:has-text("${translation['widgetColor']}") + div input`);
        await expect(colorPickerButton).toBeVisible();
    });

    test('Check visibility of animation dropdown', async ({ page }) => {
        const animationDropdown = page.locator(`label:has-text("${translation['widgetAnimation']}") + div div.select__trigger`);
        await expect(animationDropdown).toBeVisible();
    });

    test('Check visibility of save button', async ({ page }) => {
        const saveButton = page.locator(`button:has-text("${translation['save']}")`);
        await expect(saveButton).toBeVisible();
    });

    test('Check visibility of preview button', async ({ page }) => {
        const previewButton = page.locator(`button:has-text("${translation['preview']}")`);
        await expect(previewButton).toBeVisible();
    });

});
