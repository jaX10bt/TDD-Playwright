import { test, expect } from '@playwright/test';
import { getTranslations } from '../../../../../../../translations/languageDetector';

test.describe('Visibility Tests for "Erakorralised Teated"/"Emergency Notices" Page', () => {
  let translations;

  test.beforeEach(async ({ page }) => {
    // Navigate to the Emergency Notices page
    await page.goto('https://admin.prod.buerokratt.ee/chat/session-length');
    // Fetch translations
    translations = await getTranslations(page);
  });

  test('Check Visibility of "Erakorralised teated" Header', async ({ page }) => {
    // Check if the header with text from translations is visible
    const label1Locator = page.locator('label').filter({ hasText: translations.sessionLength });
    await expect(label1Locator.first()).toBeVisible();
  });

  // Test to check visibility of Input
  test('Input should be visible', async ({ page }) => {
    const inputLocator = page.locator('input[name="session-length"][type="number"]');
  
  // Check if the input is visible
  await expect(inputLocator).toBeVisible();

  // Additionally, check if it has the correct default value
  await expect(inputLocator).toHaveValue('120');
  });

  // Test to check visibility of Label2
  test('Label2 should be visible with correct text', async ({ page }) => {
    // Use page.locator to find the second label with the same text
    const label2Locator = page.locator('label').filter({ hasText: translations.minutes });
    await expect(label2Locator.last()).toBeVisible();
  });
});
