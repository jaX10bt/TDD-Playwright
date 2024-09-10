const { test, expect } = require('@playwright/test');
import { getTranslations } from '../../../../../../../translations/languageDetector.js'

test.describe('Erakorralised Teated/Emergency notices Page Visibility', () => {

  // TODO make translations match

  const translation = getTranslations('https://admin.test.buerokratt.ee/chat/chatbot/emergency-notices')

  test.beforeEach(async ({ page }) => {
    // Visit the page (replace 'your-url' with the actual URL)
    await page.goto('https://admin.test.buerokratt.ee/chat/chatbot/emergency-notices');
  });

  test('Check if "Erakorralised teated" header is present', async ({ page }) => {
    const header = await page.locator('h1:has-text("Erakorralised teated")');
    await expect(header).toBeVisible();
  });

  test('Check if "Teade aktiivne" switch button is present', async ({ page }) => {
    const switchButton = await page.locator(`.switch:has(.switch__label:has-text("${translation["NotificationActive"]}")) button[role="switch"]`);
    await expect(switchButton).toBeVisible();
  });

  test('Check if "Teade" input field is present', async ({ page }) => {
    const teadeInput = await page.locator(`.textarea:has(.textarea__label:has-text("translation["${translation["Notification"]}"]")) textarea`);
    await expect(teadeInput).toBeVisible();
    await expect(teadeInput).toHaveValue('We are out of service at the moment');
  });
  

  test('Check if "Kuvamisperiood" date inputs are present', async ({ page }) => {
    const kuvamisperioodLabel = await page.locator('p:has-text("Kuvamisperiood")');
    await expect(kuvamisperioodLabel).toBeVisible();


    // TODO Change this to appear universal
    const startDateInput = await page.locator('input[value="23.10.2023"]');
    await expect(startDateInput).toBeVisible();

    const endDateInput = await page.locator('input[value="25.10.2024"]');
    await expect(endDateInput).toBeVisible();
  });

  test('Check if "Salvesta" button is present', async ({ page }) => {
    const saveButton = await page.locator(`button.btn--primary:has-text("${translation["Save"]}")`);
    await expect(saveButton).toBeVisible();
  });

});
