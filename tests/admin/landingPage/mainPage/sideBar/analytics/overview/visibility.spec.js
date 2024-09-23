const { test, expect } = require('@playwright/test');
const { getTranslations } = require('../../../../../../translations/languageDetector');

test.describe.only('Metrics Cards Visibility Test', () => {
  let translation;
  let checkboxStates = {};
  let checkboxStatesInitialized = false;

  test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.prod.buerokratt.ee/analytics/overview');
    translation = await getTranslations(page);
    await page.getByRole('button', { name: `${translation["edit"]}` }).click();

    if (!checkboxStatesInitialized) {
      const drawerBody = page.locator('.drawer__body');
      const sections = drawerBody.locator('.section');
      const sectionCount = await sections.count();

      for (let i = 0; i < sectionCount; i++) {
        const section = sections.nth(i);
        const label = await section.locator('label').innerText();
        const checkbox = section.locator('input[type="checkbox"]');
        const isChecked = await checkbox.isChecked();
        checkboxStates[label.trim()] = isChecked ? 'checked' : 'unchecked';
      }

      checkboxStatesInitialized = true;
    }
  });

  async function checkCardVisibility(cardSelector, translatedLabel, page) {
    const card = page.locator(cardSelector);
    if (checkboxStates[translatedLabel] === 'checked') {
      await expect(card).toBeVisible();
    } else {
      await expect(card).not.toBeVisible();
    }
  }

  test('Check h1 header visibility', async ({ page }) => {
    await expect(page.locator('h1')).toBeVisible();
  });

  test('Check "Change" button visibility', async ({ page }) => {
    await expect(page.locator(`button:has-text("${translation["edit"]}")`)).toBeVisible();
  });

  const cardTests = [
    { key: "numberOfChatsToday", description: "Number of chats: today / previous" },
    { key: "forwardedChatsYesterday", description: "Forwarded chats yesterday: internal / external" },
    { key: "averageWaitingTimeToday", description: "Average waiting time: today / yesterday" },
    { key: "averageWaitingTimeWeek", description: "Average waiting time: week / previous" },
    { key: "averageChatsPerDayMonth", description: "Average chats per day: month / previous" },
    { key: "averageChatsPerDayWeek", description: "Average chats per day: week / previous" },
    { key: "numberOfChatsPerMonth", description: "Number of chats: month / previous" },
    { key: "averageNumberOfChatsAnsweredByBürokrattWeek", description: "Average chats answered by Bürokratt: week / previous" },
    { key: "averageNumberOfChatsAnsweredByBürokrattMonth", description: "Average chats answered by Bürokratt: month / previous" },
    { key: "answeredByBürokrattToday", description: "Answered by Bürokratt: today / yesterday" },
  ];

  for (const { key, description } of cardTests) {
    test(`Check card for "${description}" visibility`, async ({ page }) => {
      await checkCardVisibility(
        `.draggable-card:has(.title:text("${translation[key]}"))`, 
        translation[key], 
        page
      );
    });
  }
});
