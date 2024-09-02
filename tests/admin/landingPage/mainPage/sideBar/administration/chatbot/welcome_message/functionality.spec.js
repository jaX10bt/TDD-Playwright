import { test, expect } from '@playwright/test';

test.describe('Welcome message Functionality Tests', () => {

  test.beforeEach(async ({ page }) => {
    // Navigate to the page before each test
    await page.goto('https://admin.test.buerokratt.ee/chat/chatbot/welcome-message'); // Replace with your actual page URL
  });



  test('Check if the switch on "Tervitus aktiivne"/"Greeting active" works', 

    async ({ page }) => {

    // Locate the "Teade aktiivne" switch by its associated label
    const masterSwitch = await page.locator('button.switch__button').nth(1);

    // Check initial state (assumed to be 'Sees')
    await expect(masterSwitch).toHaveAttribute('data-state', 'checked');

    // Click to toggle the switch to "Väljas"
    await masterSwitch.click();

    // Verify the switch is now "Väljas"
    await expect(masterSwitch).toHaveAttribute('data-state', 'unchecked');
    await expect(masterSwitch.locator('span.switch__off')).toBeVisible();

    // Click again to toggle the switch back to "Sees"
    await masterSwitch.click();

    // Verify the switch is now "Sees" again
    await expect(masterSwitch).toHaveAttribute('data-state', 'checked');
    await expect(masterSwitch.locator('span.switch__on')).toBeVisible();
});

test('Check writing to input and character counter updates', async ({ page }) => {
    // Locate the textarea and character count element
    const textarea = page.locator('//label[text()="Tervitussõnum"]/following-sibling::div//textarea');
    const charCount = page.locator('.textarea__max-length-bottom');

    // Verify textarea is visible
    await expect(textarea).toBeVisible();

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

    await page.goto('https://test.buerokratt.ee'); // Replace with actual widget page URL

    const logoImage = page.locator('img[alt="Buerokratt logo"]'); // Adjust selector if necessary
    await logoImage.click();

    // Add a wait for the text to appear in the widget
    await page.waitForTimeout(2000); // Adjust timing as needed

    // Verify the sample text is present in the widget
    const messageDisplay = page.toHaveText(sampleText); // Adjust selector to match the actual element
    await expect(messageDisplay).toHaveText(sampleText);
  });

});
