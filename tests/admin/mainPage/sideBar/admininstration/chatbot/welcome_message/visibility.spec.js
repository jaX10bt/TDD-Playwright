import { test, expect } from '@playwright/test';

test('Check visibility of elements in the welcome message card', async ({ page }) => {


    test.info().annotations.push({
        type: 'Known bug',
        description: 'The number on the bottom right of the text area for the message does not indicate the character count of the message unless typed in or deleted. ',
    })

    // Load the page
    await page.goto('https://admin.test.buerokratt.ee/chat/chatbot/welcome-message');

    // Check if the main title is visible
    const mainTitle = page.locator('h1:has-text("Tervitussõnum")');
    await expect(mainTitle).toBeVisible();

    // Check if the description paragraph is visible
    const descriptionParagraph = page.locator('p:has-text("Bürokrati automaatne tervitussõnum, mida kuvatakse esimese sõnumina vestlusakna avamisel")');
    await expect(descriptionParagraph).toBeVisible();

    // Check if the switch label "Tervitus aktiivne" is visible
    const switchLabel = page.locator('label:has-text("Tervitus aktiivne")');
    await expect(switchLabel).toBeVisible();

    // Check if the correct switch button associated with "Tervitus aktiivne" is visible
    const switchButton = page.locator('.switch__button[data-state="checked"]');
    await expect(switchButton).toBeVisible();

    // Check if the textarea label is visible
    const textareaLabel = page.locator('label:has-text("Tervitussõnum")');
    await expect(textareaLabel).toBeVisible();

    // Locate the correct textarea using XPath
    const textarea = page.locator('//label[text()="Tervitussõnum"]/following-sibling::div//textarea');

    // Retrieve the value from the textarea
    const textareaValue = await textarea.inputValue();

    // Check if the textarea contains any text
    await expect(textareaValue).not.toBe('');

    // Verify the character count reflects the length of the message
    const charCount = page.locator('.textarea__max-length-bottom');
    await expect(charCount).toBeVisible();

    // Verify that the character count matches the length of the message
    const messageLength = textareaValue.length;
    await expect(charCount).toHaveText(`${messageLength}/250`);

    // Check if the "Salvesta" button is visible
    const saveButton = page.locator('button.btn--primary:has-text("Salvesta")');
    await expect(saveButton).toBeVisible();
});
