import { test, expect } from '@playwright/test';
import { getTranslations } from '../../../../../../../translations/languageDetector';

test.describe('Visibility Tests for "Erakorralised Teated"/"Emergency Notices" Page', () => {
  let translations;

  test.beforeEach(async ({ page }) => {
    // Navigate to the Emergency Notices page
    await page.goto('https://admin.prod.buerokratt.ee/chat/users');
    // Fetch translations
    translations = await getTranslations(page);
  });

  test('Check Visibility of "Erakorralised teated" Header', async ({ page }) => {
    const headers = [
      new RegExp(`^${translations.name}$`), // Exact match for Name
      new RegExp(`^${translations.idCode}$`),
      new RegExp(`^${translations.role}$`),
      new RegExp(`^${translations.displayName}$`),
      new RegExp(`^${translations.userTitle}$`),
      new RegExp(`^${translations.email}$`),
    ];
    // Verify that the table is located inside the card
    const tableCardLocator = page.locator('.card .data-table');
    await expect(tableCardLocator).toBeVisible();

    // Verify the visibility of Table Headers with dynamic translations
    for (const header of headers) {
      const headerLocator = page.locator(`.data-table th >> text=${header}`);
      await expect(headerLocator).toBeVisible();
    }

  });
});
