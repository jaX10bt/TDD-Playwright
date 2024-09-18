import { test, expect } from '@playwright/test';
import { getTranslations } from '../../../../../../../translations/languageDetector';

test.describe.serial('Welcome message/Tervitussõnum Functionality Tests', () => {

  let translation;
  let originalText;
  let initialSwitchState;

  test.beforeEach(async ({ page }) => {
    // Navigate to the page before each test
    await page.goto('https://admin.prod.buerokratt.ee/chat/chatbot/welcome-message'); // Replace with your actual page URL
    translation = await getTranslations(page);

    // Capture the original state before each test
    const textarea = page.locator(`//label[text()="${translation["welcomeMessage"]}"]/following-sibling::div//textarea`);
    originalText = await textarea.inputValue();

    const masterSwitch = page.locator('button.switch__button').nth(1);
    initialSwitchState = await masterSwitch.getAttribute('data-state');
  });

  test.afterEach(async ({ page }) => {
    // Restore the original text
    await page.goto('https://admin.prod.buerokratt.ee/chat/chatbot/welcome-message');
    const textarea = page.locator(`//label[text()="${translation["welcomeMessage"]}"]/following-sibling::div//textarea`);
    const saveButton = page.locator(`button:has-text("${translation["save"]}")`);
    await textarea.fill(originalText);
    await saveButton.click();

    // Restore the original switch state
    const masterSwitch = page.locator('button.switch__button').nth(1);
    const currentSwitchState = await masterSwitch.getAttribute('data-state');

    if (currentSwitchState !== initialSwitchState) {
      await masterSwitch.click();
      await saveButton.click();
    }
  });

  test('Check if the switch on "Tervitus aktiivne"/"Greeting active" works', async ({ page }) => {
    const textarea = page.locator(`//label[text()="${translation["welcomeMessage"]}"]/following-sibling::div//textarea`);
    const masterSwitch = page.locator('button.switch__button').nth(1);
    const saveButton = page.locator('button.btn--primary');

    if (initialSwitchState === 'checked') {
      // Toggle the switch off
      await masterSwitch.click();
      await expect(masterSwitch).toHaveAttribute('data-state', 'unchecked');
      await expect(masterSwitch.locator('span.switch__off')).toBeVisible();
      await saveButton.click();
    }

    await page.goto('https://prod.buerokratt.ee'); // Replace with actual widget page URL
    await page.waitForTimeout(2000); // Adjust timing as needed

    // Verify the welcome message is not displayed
    const logoImage = page.locator('img[alt="Buerokratt logo"]');
    await logoImage.click();
    await page.waitForTimeout(2000); // Wait for changes to reflect

    // Verify the sample text is not present in the widget
    const messageDisplay = page.locator(`text=${originalText}`);
    await expect(messageDisplay).toHaveCount(0); // Expect no elements matching the text selector
  });

  test('Check writing to input and character counter updates', async ({ page }) => {
    const textarea = page.locator(`//label[text()="${translation["welcomeMessage"]}"]/following-sibling::div//textarea`);
    const charCount = page.locator('.textarea__max-length-bottom');
    const saveButton = page.locator(`text=${translation["save"]}`);
    const masterSwitch = page.locator('button.switch__button').nth(1);

    if (initialSwitchState === 'unchecked') {
      // Toggle the switch on
      await masterSwitch.click();
      await expect(masterSwitch).toHaveAttribute('data-state', 'checked');
      await expect(masterSwitch.locator('span.switch__off')).toBeVisible();
    }

    // Write new text and verify character count
    const sampleText = 'Tere, see on proovitekst!';
    await textarea.fill(sampleText);
    await expect(charCount).toHaveText(`${sampleText.length}/250`);
    await saveButton.click();
    await expect(page.locator('.toast.toast--success')).toBeVisible();

    // Verify the text is displayed in the widget
    await page.goto('https://prod.buerokratt.ee');
    const logoImage = page.locator('img[alt="Buerokratt logo"]');
    await logoImage.click();
    await page.waitForTimeout(2000);
    const messageDisplay = page.locator(`text=${sampleText}`);
    await expect(messageDisplay).toHaveText(sampleText);
  });
});
