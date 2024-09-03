import { test, expect } from '@playwright/test';

test.describe('"Vastamata" page visibility', () => {

    
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

test.describe('Selected conversation open chat visibility tests', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://admin.test.buerokratt.ee/chat/unanswered');

      
        //***************this two lines should be removed later */
        await page.getByRole('link', { name: /Aktiivsed/ }).click();
        await page.getByRole('link', { name: /Vastamata/ }).click();

        const switchButton =  page.locator('.switch__button');
        if (switchButton.getAttribute('aria-expanded', 'true') !== 'true') {
            await switchButton.click();
        }
        const buttons = page.locator('button.vertical-tabs__trigger').first();

        await buttons.first().click();

    });


    test('Should have individual meta information fields', async ({ page }) => {

        test.info().annotations.push({
            type: 'Known bug',
            description: 'There is a bug regarding this test as it does not let to open the chat before you go to any other tab and come back.',
        })

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


    test('Should have active chat side actions', async ({ page }) => {
        // Get all chats

        const chatSideActions = page.locator('div.active-chat__side-actions')
        await expect(chatSideActions).toBeVisible();

        // Verify side action buttons
        const buttonElement = page.locator('div.active-chat__side-actions button')
        await expect(buttonElement.filter({ hasText: /Lõpeta vestlus/ })).toBeVisible();
        await expect(buttonElement.filter({ hasText: /Küsi autentimist/ })).toBeVisible();
        await expect(buttonElement.filter({ hasText: /Küsi kontaktandmeid/ })).toBeVisible();
        await expect(buttonElement.filter({ hasText: /Küsi nõusolekut/ })).toBeVisible();
        await expect(buttonElement.filter({ hasText: /Suuna kolleegile/ })).toBeVisible();
        await expect(buttonElement.filter({ hasText: /Suuna asutusele/ })).toBeVisible();
        await expect(buttonElement.filter({ hasText: /Saada e-posti/ })).toBeVisible();
        await expect(buttonElement.filter({ hasText: /Alusta teenust/ })).toBeVisible();
    });


    test('Should have "Võta üle" button', async ({ page }) => {
        // Verify side action buttons
        const buttonElement = page.locator('div.active-chat__toolbar-actions button')
        await expect(buttonElement.filter({ hasText: /Võta üle/ })).toBeVisible();
    });

    test('Should have active chat header', async ({ page }) => {
        // Verify chat header
        const header = page.locator('div.active-chat__header');
        const pElement = header.locator('p');
        const h3 = header.locator('h3');

        await expect(pElement).toBeVisible();
        await expect(h3).toBeVisible();
    });



});