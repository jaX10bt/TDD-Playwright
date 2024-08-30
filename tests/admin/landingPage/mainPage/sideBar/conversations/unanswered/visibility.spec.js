import { test, expect } from '@playwright/test';

test.describe('"Vastamata" page visibility', () => {

    test.beforeEach(async ({ page }) => {
        // Visit the page (replace 'your-url' with the actual URL)
        await page.goto('https://admin.test.buerokratt.ee/chat/unanswered');
    });

    test('should have the correct URL', async ({ page }) => {
        await expect(page).toHaveURL('https://admin.test.buerokratt.ee/chat/unanswered');
    });

    test('should have "Vastamata vestlused" vertical tabs', async ({ page }) => {
        const verticalTabs = page.locator('div.vertical-tabs');
        await expect(verticalTabs).toBeVisible();
    })

    test('should have "Vastamata vestlused" section, where all unanswered conversations are listed', async ({ page }) => {
        const unansweredConversationsSection = page.locator('div.vertical-tabs__list');
        await expect(unansweredConversationsSection).toBeVisible();
    })

    test('should have "Vastamata vestlused" title', async ({ page }) => {
        const divElement = page.locator('.vertical-tabs__group-header');

        const pText = divElement.locator('p');

        await expect(pText).toHaveText(/Vastamata vestlused/);
    });


    test('should have "Vastamata vestlused" main chat window', async ({ page }) => {
        const divElement = page.locator('div.vertical-tabs__body-placeholder');

        await expect(divElement).toBeVisible();
    });


    test('should have "Alustamiseks vali vestlus" text', async ({ page }) => {
        const divElement = page.locator('div.vertical-tabs__body-placeholder');

        const pText = divElement.locator('p');

        await expect(pText).toHaveText('Alustamiseks vali vestlus');
    });




});