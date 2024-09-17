const { test, expect } = require('@playwright/test');
const { getTranslations } = require('../../../../../../translations/languageDetector');

test.describe('Metrics Cards Visibility Test', () => {
  let translation;

  // Navigate to the page before each test
  test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.prod.buerokratt.ee/analytics/overview');  // Replace with the actual URL
    translation = await getTranslations(page);
  });

  // Test for visibility of the h1 header
  test('Check h1 header visibility', async ({ page }) => {
    const header = page.locator('h1');  // Locate the h1 element
    await expect(header).toBeVisible();
  });

  // Test for visibility of the card with dynamic text
  test('Check card with text "Keskmine vestluste arv päevas: kuu / eelmine" visibility', async ({ page }) => {
    const card = page.locator(`.draggable-card:has(.title:text("${translation["averageChatsPerDayMonth"]}"))`);
    await expect(card).toBeVisible({timeout: 2000});
  });

  // Test for visibility of the card with dynamic text
  test('Check card with text "Keskmine vestluste arv päevas: nädal / eelmine" visibility', async ({ page }) => {
    const card = page.locator(`.draggable-card:has(.title:text("${translation["averageChatsPerDayWeek"]}"))`);
    await expect(card).toBeVisible();
  });

  // Test for visibility of the card with dynamic text
  test('Check card with text "Vestluste arv: kuu / eelmine" visibility', async ({ page }) => {
    const card = page.locator(`.draggable-card:has(.title:text("${translation["numberOfChatsPerMonth"]}"))`);
    await expect(card).toBeVisible();
  });

  // Test for visibility of the card with dynamic text
  test('Check card with text "Keskmine Bürokrati vastatud: nädal / eelmine" visibility', async ({ page }) => {
    const card = page.locator(`.draggable-card:has(.title:text("${translation["averageNumberOfChatsAnsweredByBürokrattWeek"]}"))`);
    await expect(card).toBeVisible();
  });

  // Test for visibility of the card with dynamic text
  test('Check card with text "Keskmine Bürokrati vastatud: kuu / eelmine" visibility', async ({ page }) => {
    const card = page.locator(`.draggable-card:has(.title:text("${translation["averageNumberOfChatsAnsweredByBürokrattMonth"]}"))`);
    await expect(card).toBeVisible();
  });

  // Test for visibility of the card with dynamic text
  test('Check card with text "Bürokrati vastatud: täna / eile" visibility', async ({ page }) => {
    const card = page.locator(`.draggable-card:has(.title:text("${translation["answeredByBürokrattToday"]}"))`);
    await expect(card).toBeVisible();
  });
});
