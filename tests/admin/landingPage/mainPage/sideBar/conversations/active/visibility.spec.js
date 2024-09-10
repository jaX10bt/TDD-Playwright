import { test, expect } from '@playwright/test';
import { openDialog, selectFirstChat, takeOverFirstChat } from '../unanswered/helper';
// todo: cleaner path
import { getTranslations } from '../../../../../../translations/languageDetector'

test.beforeEach('test', async ({ page }) => {
    await page.goto('https://admin.test.buerokratt.ee/chat/active');
    // page is authenticated
    await expect(page).toHaveURL('https://admin.test.buerokratt.ee/chat/active');

    const translation = await getTranslations(page);
});


test.describe('"Aktiivsed" tab visibility', () => {

    test('should have the correct URL', async ({ page }) => {
        await expect(page).toHaveURL('https://admin.test.buerokratt.ee/chat/active');
    });

    test('should have "Minu vestlused" header', async ({ page }) => {
        const header = page.locator('div.vertical-tabs__group-header');
        await expect(verticalTabs).toBeVisible();
    })

    test('should have "Minu vestlused" vertical tabs', async ({ page }) => {
        const verticalTabs = page.locator('div.vertical-tabs__list');
        await expect(verticalTabs).toBeVisible();
    })

});

test.describe('"Aktiivsed" tab body visibility', () => {

    test.beforeEach('test', async ({ page }) => {
        await selectFirstChat(page);
    });

    test('should have body', async ({ page }) => {
        const body = page.locator('div.active-chat__body');
        await expect(body).toBeVisible();
    })

    test('should have header', async ({ page }) => {
        const header = page.locator('div.active-chat__header');
        await expect(header).toBeVisible();
    })

    test('should have chat wrapper', async ({ page }) => {
        const wrapper = page.locator('div.active-chat__group-wrapper');
        await expect(header).toBeVisible();
    })

    test('should have chat toolbar', async ({ page }) => {
        const toolbar = page.locator('div.active-chat__toolbar');
        await expect(toolbar).toBeVisible();
    })

    test('should have toolbar button', async ({ page }) => {
        const button = page.locator('div.active-chat__toolbar-actions button');
        await expect(button).toBeVisible();
    })

    test('should have chat side', async ({ page }) => {
        const button = page.locator('div.active-chat__side');
        await expect(button).toBeVisible();
    })


    test('Should have individual meta information fields', async ({ page }) => {
        const chatSideMeta = page.locator('div.active-chat__side-meta')
        await expect(chatSideMeta).toBeVisible();

        // Verify individual meta information fields
        const pElement = page.locator('p strong')
        await expect(pElement.filter({ hasText: /ID/ })).toBeVisible();
        await expect(pElement.filter({ hasText: /Vestleja nimi/ })).toBeVisible();
        await expect(pElement.filter({ hasText: /Vestlus alustatud/ })).toBeVisible();

        await expect(pElement.filter({ hasText: /Seade/ })).toBeVisible();
        await expect(pElement.filter({ hasText: /Lähtekoht/ })).toBeVisible();


    });
});