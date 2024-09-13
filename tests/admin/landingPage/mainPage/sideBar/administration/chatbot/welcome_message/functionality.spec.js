import { test, expect } from '@playwright/test';
import { getTranslations } from '../../../../../../../translations/languageDetector';

test.describe('Welcome message/Tervitussõnum Functionality Tests', () => {

  let translation

  test.beforeEach(async ({ page }) => {
    // Navigate to the page before each test
    await page.goto('https://admin.prod.buerokratt.ee/chat/chatbot/welcome-message'); // Replace with your actual page URL
    translation = await getTranslations(page)
  });

  test('Check if the switch on "Tervitus aktiivne"/"Greeting active" works',

    async ({ page }) => {
      const textarea = page.locator(`//label[text()="${translation["welcomeMessage"]}"]/following-sibling::div//textarea`);
      const originalText = await textarea.inputValue();

      // Locate the "Teade aktiivne" switch by its associated label
      const masterSwitch = await page.locator('button.switch__button').nth(1);

      // Check initial state (assumed to be 'Sees')
      await expect(masterSwitch).toHaveAttribute('data-state', 'checked');

      // Click to toggle the switch to "Väljas"
      await masterSwitch.click();

      // Verify the switch is now "Väljas"
      await expect(masterSwitch).toHaveAttribute('data-state', 'unchecked');
      await expect(masterSwitch.locator('span.switch__off')).toBeVisible();

      await page.goto('https://prod.buerokratt.ee'); // Replace with actual widget page URL

      // Wait for any potential elements to load
      await page.waitForTimeout(2000); // Adjust timing as needed

      // Verify the welcome message is not displayed
      const messageDisplay = page.locator(`text=${originalText}`); // Replace with the actual text used in your message
      await expect(messageDisplay).toHaveCount(0); // Expect no elements matching the text selector

      // Navigate back and toggle the switch back to "Sees"
      await page.goto('https://admin.prod.buerokratt.ee/chat/chatbot/welcome-message');
      await masterSwitch.click();

      // Click again to toggle the switch back to "Sees"
      await masterSwitch.click();

      // Verify the switch is now "Sees" again
      await expect(masterSwitch).toHaveAttribute('data-state', 'checked');
      await expect(masterSwitch.locator('span.switch__on')).toBeVisible();
    });

  test('Check writing to input and character counter updates ### Look issue inside', async ({ page }) => {

    test.info().annotations.push({
      type: 'Known issue',
      description: 'The counter doesnt change if the string is the same as before.',
  })

    // Locate the textarea and character count element
    const textarea = page.locator(`//label[text()="${translation["welcomeMessage"]}"]/following-sibling::div//textarea`);
    const charCount = page.locator('.textarea__max-length-bottom');

    // Verify textarea is visible
    await expect(textarea).toBeVisible();

    const originalText = await textarea.inputValue();

    // Define a sample text to type into the textarea
    const sampleText = 'Tere, see on proovitekst!';

    // Type the sample text into the textarea
    await textarea.fill(sampleText);

    // Verify that the textarea value is updated correctly
    const textareaValue = await textarea.inputValue();
    await expect(textareaValue).toBe(sampleText);

    // Verify the character count updates correctly
    const expectedCount = sampleText.length;
    await expect(charCount).toHaveText(`${expectedCount}/250`);

    const saveButton = page.locator(`text=${translation["save"]}`);
    await saveButton.click();

    await page.goto('https://prod.buerokratt.ee'); // Replace with actual widget page URL

    const logoImage = page.locator('img[alt="Buerokratt logo"]'); // Adjust selector if necessary
    await logoImage.click();

    // Add a wait for the text to appear in the widget
    await page.waitForTimeout(2000); // Adjust timing as needed

    // Verify the sample text is present in the widget
    const messageDisplay = page.locator(`text=${sampleText}`); // Adjust selector to match the actual element
    await expect(messageDisplay).toHaveText(sampleText);

    await page.goto('https://admin.prod.buerokratt.ee/chat/chatbot/welcome-message');
    // Verify textarea is visible
    await textarea.fill(originalText);

    // Verify that the textarea value is reverted correctly
    const revertedTextareaValue = await textarea.inputValue();
    await expect(revertedTextareaValue).toBe(originalText);

    // Save the reverted value
    await saveButton.click();

    await page.goto('https://admin.prod.buerokratt.ee/chat/chatbot/welcome-message');

    const checkerTextareaValue = await textarea.inputValue();
    await expect(checkerTextareaValue).toBe(originalText);
  });

});
