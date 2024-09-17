import { test, expect } from '@playwright/test';
import { getTranslations } from '../../../../../../../translations/languageDetector';

test.describe.serial.only('Welcome message/Tervitussõnum Functionality Tests', () => {

  let translation

  test.beforeEach(async ({ page }) => {
    // Navigate to the page before each test
    await page.goto('https://admin.prod.buerokratt.ee/chat/chatbot/welcome-message'); // Replace with your actual page URL
    translation = await getTranslations(page)
  });



  test('Check if the switch on "Tervitus aktiivne"/"Greeting active" works', async ({ page }) => {
      const textarea = page.locator(`//label[text()="${translation["welcomeMessage"]}"]/following-sibling::div//textarea`);
      const originalText = await textarea.inputValue();

      // Locate the "Teade aktiivne" switch
      const masterSwitch = page.locator('button.switch__button').nth(1);

      // Check the current state of the switch
      const initialSwitchState = await masterSwitch.getAttribute('data-state');

      const saveButton = page.locator('button.btn--primary');

      // If the switch is off ('unchecked'), toggle it on
      if (initialSwitchState === 'checked') {
        // Toggle the switch off
        await masterSwitch.click();
        await expect(masterSwitch).toHaveAttribute('data-state', 'unchecked');
        await expect(masterSwitch.locator('span.switch__off')).toBeVisible();
   
        await expect(saveButton).toBeVisible();
        await saveButton.click()
      }

      await page.goto('https://prod.buerokratt.ee'); // Replace with actual widget page URL

      // Wait for any potential elements to load
      await page.waitForTimeout(2000); // Adjust timing as needed

      // Verify the welcome message is not displayed
      const logoImage = page.locator('img[alt="Buerokratt logo"]');
      await logoImage.click();
    
      await page.waitForTimeout(2000); // Wait for changes to reflect
    
        // Verify the sample text is present in the widget
      const messageDisplay = page.locator(`text=${originalText}`);
      await expect(messageDisplay).toHaveCount(0); // Expect no elements matching the text selector

      // Navigate back to the admin page
      await page.goto('https://admin.prod.buerokratt.ee/chat/chatbot/welcome-message');

      await expect(masterSwitch).toHaveAttribute('data-state', 'unchecked');
      await expect(masterSwitch.locator('span.switch__on')).toBeVisible();

      if (initialSwitchState === 'checked') {
        await masterSwitch.click();
      }

      await expect(masterSwitch).toHaveAttribute('data-state', `${initialSwitchState}`)
      await expect(saveButton).toBeVisible();
      await saveButton.click()
    });
    

    test('Check writing to input and character counter updates ### Look issue inside', async ({ page }) => {
      test.info().annotations.push({
        type: 'Known issue',
        description: 'There is an issue where the chaacter counter doesnt display the correct character count initially on page load.',
      });
    
      const textarea = page.locator(`//label[text()="${translation["welcomeMessage"]}"]/following-sibling::div//textarea`);
      const charCount = page.locator('.textarea__max-length-bottom');
      const saveButton = page.locator(`text=${translation["save"]}`);
    
      const originalText = await textarea.inputValue();

      const masterSwitch = page.locator('button.switch__button').nth(1);

      const initialSwitchState = await masterSwitch.getAttribute('data-state');

      
    
      try {
        // Verify textarea is visible

        // If the switch is off ('unchecked'), toggle it on
      if (initialSwitchState === 'unchecked') {
        // Toggle the switch off
        await masterSwitch.click();
        await expect(masterSwitch).toHaveAttribute('data-state', 'checked');
        await expect(masterSwitch.locator('span.switch__off')).toBeVisible();
      }

        await expect(textarea).toBeVisible();
    
        const sampleText = 'Tere, see on proovitekst!';
    
        // Type the sample text into the textarea
        await textarea.fill(sampleText);
    
        // Verify the textarea value is updated correctly
        const textareaValue = await textarea.inputValue();
        await expect(textareaValue).toBe(sampleText);
    
        // Verify the character count updates correctly
        const expectedCount = sampleText.length;
        await expect(charCount).toHaveText(`${expectedCount}/250`);
    
        // Save the new value
        await saveButton.click();

        await expect(page.locator('.toast.toast--success')).toBeVisible();
    
        await page.goto('https://prod.buerokratt.ee'); // Replace with actual widget page URL
        const logoImage = page.locator('img[alt="Buerokratt logo"]');
        await logoImage.click();
    
        await page.waitForTimeout(2000); // Wait for changes to reflect
    
        // Verify the sample text is present in the widget
        const messageDisplay = page.locator(`text=${sampleText}`);
        await expect(messageDisplay).toHaveText(sampleText);
    
      } catch (error) {
        
        if (initialSwitchState === 'unchecked') {
          await masterSwitch.click();
          await expect(masterSwitch).toHaveAttribute('data-state', 'unchecked');
        }
    
        // Revert the textarea back to its original value in case of failure
        await page.goto('https://admin.prod.buerokratt.ee/chat/chatbot/welcome-message');
        await textarea.fill(originalText);
        await saveButton.click();
    
        // Re-throw the error so the test is marked as failed
        throw error;
      }
    
      // Revert the textarea back to its original value if everything succeeded
      await page.goto('https://admin.prod.buerokratt.ee/chat/chatbot/welcome-message');
      await textarea.fill(originalText);
      await saveButton.click();
    
      const checkerTextareaValue = await textarea.inputValue();
      await expect(checkerTextareaValue).toBe(originalText);
    });
    

});
