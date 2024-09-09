import { test, expect } from '@playwright/test';

test.describe('Welcome message/Tervitussõnum Visibility Tests', () => {

    test.beforeEach(async ({ page }) => {
        // Load the page before each test
        await page.goto('https://admin.test.buerokratt.ee/chat/chatbot/welcome-message');
    });

    test('Check visibility of the main title', async ({ page }) => {
        // Check if the main title is visible
        const mainTitle = page.locator('h1:has-text("Tervitussõnum")');
        await expect(mainTitle).toBeVisible();
    });

    test('Check visibility of the description paragraph', async ({ page }) => {
        // Check if the description paragraph is visible
        const descriptionParagraph = page.locator('p:has-text("Bürokrati automaatne tervitussõnum, mida kuvatakse esimese sõnumina vestlusakna avamisel")');
        await expect(descriptionParagraph).toBeVisible();
    });

    test('Check visibility of the switch label "Tervitus aktiivne"', async ({ page }) => {
        // Check if the switch label "Tervitus aktiivne" is visible
        const switchLabel = page.locator('label:has-text("Tervitus aktiivne")');
        await expect(switchLabel).toBeVisible();
    });

    test('Check visibility of the switch button', async ({ page }) => {
        // Check if the correct switch button associated with "Tervitus aktiivne" is visible
        const switchButton = page.locator('.switch__button[data-state="checked"]');
        await expect(switchButton).toBeVisible();
    });

    test('Check visibility of the textarea label', async ({ page }) => {
        // Check if the textarea label is visible
        const textareaLabel = page.locator('label:has-text("Tervitussõnum")');
        await expect(textareaLabel).toBeVisible();
    });

    test('Check if the textarea contains text', async ({ page }) => {
        // Locate the correct textarea using XPath
        const textarea = page.locator('//label[text()="Tervitussõnum"]/following-sibling::div//textarea');

        // Retrieve the value from the textarea
        const textareaValue = await textarea.inputValue();

        // Check if the textarea contains any text
        await expect(textareaValue).not.toBe('');
    });

    test('Check if the character count reflects the length of the message', async ({ page }) => {
        // Locate the correct textarea using XPath
        const textarea = page.locator('//label[text()="Tervitussõnum"]/following-sibling::div//textarea');

        // Retrieve the value from the textarea
        const textareaValue = await textarea.inputValue();

        // Verify the character count reflects the length of the message
        const charCount = page.locator('.textarea__max-length-bottom');
        await expect(charCount).toBeVisible();

        // Verify that the character count matches the length of the message
        const messageLength = textareaValue.length;
        await expect(charCount).toHaveText(`${messageLength}/250`);
    });

    test('Check visibility of the "Salvesta" button', async ({ page }) => {
        // Check if the "Salvesta" button is visible
        const saveButton = page.locator('button.btn--primary:has-text("Salvesta")');
        await expect(saveButton).toBeVisible();
    });

});
