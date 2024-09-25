import { test, expect } from '@playwright/test';
import { getTranslations } from '../../../../../../translations/languageDetector';
import { openDialog, selectFirstChat, takeOverFirstChat } from '../unanswered/helper';

let translation;

test.describe('Visibility Tests for "Ootel" / "Pending" Page', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('https://admin.prod.buerokratt.ee/chat/pending');
        translation = await getTranslations(page)
    });

    test('should have the correct URL', async ({ page }) => {
        await expect(page).toHaveURL('https://admin.prod.buerokratt.ee/chat/pending');
    });

    test('should have titles', async ({ page }) => {
        const divElement = page.locator('.vertical-tabs__group-header');

        const pText1 = divElement.locator('p').nth(0);
        await expect(pText1).toHaveText(new RegExp(translation.new));

        const pText2 = divElement.locator('p').nth(1);
        await expect(pText2).toHaveText(new RegExp(translation.inProcess));  
    });

    test('should have section, where all "uued" and "töös" conversations are listed', async ({ page }) => {
        const unansweredConversationsSection = page.locator('div.vertical-tabs__list');
        await expect(unansweredConversationsSection).toBeVisible();
    })


    // test('should have "kustutamiseks" title', async ({ page }) => {
    //     // Should mark active status, after that chat becomes visible.
    //     const button = page.locator('.switch__button');
    //     button.click();

    //     const divElement = page.locator('.vertical-tabs__sub-group-header');

    //     const pText = divElement.locator('p').nth(0);
    //     await expect(pText).toHaveText(new RegExp(`${translation.toDelete}\\s*\\(\\d+\\)`, 'i'));
    // });

    test('should have unanswered conversations main chat window', async ({ page }) => {
        const divElement = page.locator('div.vertical-tabs__body-placeholder');

        await expect(divElement).toBeVisible();
    });


    test('should have start conversation text', async ({ page }) => {
        const divElement = page.locator('div.vertical-tabs__body-placeholder');

        const pText = divElement.locator('p');

        await expect(pText).toHaveText(translation.chooseChatToBegin);
    });
});

test.describe('"Pending" tab body visibility', () => {

    test.beforeEach('test', async ({ page }) => {
        await selectFirstChat(page);
        translation = await getTranslations(page);
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
        await expect(pElement.filter({ hasText: translation.id })).toBeVisible();
        await expect(pElement.filter({ hasText: translation.endUserName })).toBeVisible();
        await expect(pElement.filter({ hasText: translation.chatStartedAt })).toBeVisible();

        await expect(pElement.filter({ hasText: translation.device })).toBeVisible();
        await expect(pElement.filter({ hasText: translation.location })).toBeVisible();

    });
});

