import { test, expect } from '@playwright/test';
import { getTranslations } from '../../../../../../../translations/languageDetector';

test.describe('Visibility Tests for "Erakorralised Teated"/"Emergency Notices" Page', () => {
  let translations;

  test.beforeEach(async ({ page }) => {
    // Navigate to the Emergency Notices page
    await page.goto('https://admin.prod.buerokratt.ee/chat/chatbot/emergency-notices');
    // Fetch translations
    translations = await getTranslations(page);
  });

  test('Check Visibility of "Erakorralised teated" Header', async ({ page }) => {
    // Check if the header with text from translations is visible
    const header = page.locator(`h1:has-text('${translations.emergencyNotices}')`);
    await expect(header).toBeVisible();
  });

  test('Check Visibility of "Teade aktiivne" Switch Button', async ({ page }) => {
    // Check if the switch button associated with the label from translations is visible
    const switchButton = page.locator(`.switch:has(.switch__label:has-text('${translations.noticeActive}')) button[role='switch']`);
    await expect(switchButton).toBeVisible();
  });

});
