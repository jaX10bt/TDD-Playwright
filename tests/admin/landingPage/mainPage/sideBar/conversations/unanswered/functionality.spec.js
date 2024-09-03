import { test, expect } from '@playwright/test';
test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.test.buerokratt.ee/chat/unanswered');

    // before each test should turn switch on.
    page.locator('.switch__button').click();
})

test('Check if clicking unanswered chat opens it ### Look issue inside',

    async ({ page }) => {

        test.info().annotations.push({
            type: 'Known bug',
            description: 'This test has a bug: after clicking to open the chat, it only works if you mark it as "Present", switch to another tab, return to the original tab, and then attempt to open the chat again.',
        })

        // await page.getByRole('switch', { name: 'Kohal Eemal' }).click();


        // Get all chats
        const buttons = page.locator('button.vertical-tabs__trigger').first();


        // Count chats
        const buttonCount = await buttons.count();
        if (buttonCount === 0) {
            console.log('No unanswered chats available');
            return;
        }
        await buttons.first().click();


        // Check that all chat parts exist
        const chat = page.locator('div.active-chat__body');
        await expect(chat).toBeVisible();

        const chatHeader = page.locator('div.active-chat__header')
        await expect(chatHeader).toBeVisible();

        const chatWrapper = page.locator('div.active-chat__group-wrapper')
        await expect(chatWrapper).toBeVisible();

        const chatToolbar = page.locator('div.active-chat__toolbar')
        await expect(chatToolbar).toBeVisible();

        const chatSide = page.locator('div.active-chat__side')
        await expect(chatSide).toBeVisible();

        const chatSideActions = page.locator('div.active-chat__side-actions')
        await expect(chatSideActions).toBeVisible();

        const chatSideMeta = page.locator('div.active-chat__side-meta')
        await expect(chatSideMeta).toBeVisible();

        const chatHeaderText = page.locator('div.track.h3')
        await expect(chatHeaderText).toBeVisible();

        // Ensure that the chat header text is not empty
        await expect(chatHeaderText).not.toHaveText('');
    });


test('Should open dialog, when "Lõpeta vestlus" button is clicked', async ({ page }) => {
    // await page.waitForLoadState('networkidle');
    // Get all chats
    const buttons = page.locator('button.vertical-tabs__trigger');

    // Count chats
    const buttonCount = await buttons.count();
    if (buttonCount === 0) {
        console.log('No unanswered chats available');
        return;
    }
    await buttons.first().click();

    const endChatButtonSelector = page.locator('button.btn.btn--success.btn--m:has-text("Lõpeta vestlus")');

    await endChatButtonSelector.click();

    expect(page.locator('.dialog--default')).toBeVisible();
    
})


