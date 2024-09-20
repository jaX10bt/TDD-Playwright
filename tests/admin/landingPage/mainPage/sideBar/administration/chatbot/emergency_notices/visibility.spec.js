const { test, expect } = require('@playwright/test');
import { getTranslations } from '../../../../../../../translations/languageDetector.js'

test.describe('Erakorralised Teated/Emergency notices Page Visibility', () => {
  let translation

  test.beforeEach(async ({ page }) => {
    // Visit the page (replace 'your-url' with the actual URL)
    await page.goto('https://admin.prod.buerokratt.ee/chat/chatbot/emergency-notices');
    translation = await getTranslations(page)
  });

  test('Check if "Erakorralised teated" header is present', async ({ page }) => {
    const header = await page.locator(`h1:has-text("${translation["emergencyNotices"]}")`);
    await expect(header).toBeVisible();
  });

  test('Check if "Teade aktiivne" switch button is present', async ({ page }) => {
    const switchButton = await page.locator(`.switch:has(.switch__label:has-text("${translation["noticeActive"]}")) button[role="switch"]`);
    await expect(switchButton).toBeVisible();
  });

  test('Check if "Teade" input field is present', async ({ page }) => {
    const teadeInput = await page.locator(`.textarea:has(.textarea__label:has-text("${translation["notice"]}")) textarea`);
    await expect(teadeInput).toBeVisible();
  });
  

  test('Check if "Kuvamisperiood" date inputs are present', async ({ page }) => {
    const kuvamisperioodLabel = await page.locator(`p:has-text("${translation["displayPeriod"]}")`);
    await expect(kuvamisperioodLabel).toBeVisible();


    // TODO Change this to appear universal
    const startDateInput = await page.locator('.datepicker').first();
    await expect(startDateInput).toBeVisible();

    const endDateInput = await page.locator('.datepicker').nth(1);
    await expect(endDateInput).toBeVisible();
  });

  test('Check if "Salvesta" button is present', async ({ page }) => {
    const saveButton = await page.locator(`button.btn--primary:has-text("${translation["save"]}")`);
    await expect(saveButton).toBeVisible();
  });

});
