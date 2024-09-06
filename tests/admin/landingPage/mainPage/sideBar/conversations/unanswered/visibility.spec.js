import { test, expect } from '@playwright/test';
import { openDialog, selectFirstChat, takeOverFirstChat } from '../unanswered/helper';

test.describe('"Vastamata" page visibility', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://admin.test.buerokratt.ee/chat/unanswered');
    })

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
        // await page.getByRole('link', { name: /Aktiivsed/ }).click();
        // await page.getByRole('link', { name: /Vastamata/ }).click();

        const switchButton = page.locator('.switch__button');
        if (switchButton.getAttribute('aria-expanded', 'true') !== 'true') {
            await switchButton.click();
        }

        await page.reload();
        await page.waitForTimeout(2000);


        const buttons = page.locator('button.vertical-tabs__trigger').first();
        await buttons.check();

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
    test('Should have all radio labels (Aktsepteeritud, Vihakone, Muud pohjused, Kliendile vastati tema jäetud kontaktile) visible', async ({ page }) => {
        const radioItems = page.locator('fieldset.radios .radios__item');

        // Expected labels and their corresponding texts
        const expectedLabels = [
            'Aktsepteeritud',
            'Vihakõne',
            'Muud põhjused',
            'Kliendile vastati tema jäetud kontaktile'
        ];

        // Check visibility and text of each label
        for (let i = 0; i < 4; i++) {
            const radioItem = radioItems.nth(i);
            const label = radioItem.locator('label');

            await expect(label).toBeVisible();
            await expect(label).toHaveText(expectedLabels[i]);
        }
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


test.describe('"Vali vestluse staatus" dialog visibility', () => {
    test.beforeEach(async ({ page }) => {

        test.info().annotations.push({
            type: 'Known bug',
            description: 'This test has a bug: after clicking to open the chat, it only works if you mark it as "Present", switch to another tab, return to the original tab, and then attempt to open the chat again.',
        })

        await page.goto('https://admin.test.buerokratt.ee/chat/unanswered');


        //***************this two lines should be removed later */
        // await page.getByRole('link', { name: /Aktiivsed/ }).click();
        // await page.getByRole('link', { name: /Vastamata/ }).click();

        const switchButton = page.locator('.switch__button');
        if (switchButton.getAttribute('aria-expanded', 'true') !== 'true') {
            await switchButton.click();
        }

        await page.reload();
        await page.waitForTimeout(2000);
        const buttons = page.locator('button.vertical-tabs__trigger').first();

        await buttons.first().click();

        const endChatButtonSelector = page.locator('button.btn.btn--success.btn--m:has-text("Lõpeta vestlus")');

        await endChatButtonSelector.click();


    })


    test('Should have dialog visible', async ({ page }) => {
        const dialog = page.locator('div.dialog')
        await expect(dialog).toBeVisible();
    });

    test('Should have dialog header visible', async ({ page }) => {
        const title = page.locator('div.dialog__header')
        await expect(title).toBeVisible();
    });

    test('Should have dialog body visible', async ({ page }) => {
        const body = page.locator('div.dialog__body')
        await expect(body).toBeVisible();
    });

    test('Should have all radio buttons visible', async ({ page }) => {
        const radios = page.locator('fieldset.radios .radios__item input[type="radio"]');
        await expect(radios).toHaveCount(4); // Check if there are 4 radio buttons
    });

    test('Should have all radio labels (Aktsepteeritud, Vihakone, Muud pohjused, Kliendile vastati tema jäetud kontaktile) visible', async ({ page }) => {
        const radioItems = page.locator('fieldset.radios .radios__item');

        // Expected labels and their corresponding texts
        const expectedLabels = [
            'Aktsepteeritud',
            'Vihakõne',
            'Muud põhjused',
            'Kliendile vastati tema jäetud kontaktile'
        ];

        // Check visibility and text of each label
        for (let i = 0; i < 4; i++) {
            const radioItem = radioItems.nth(i);
            const label = radioItem.locator('label');

            await expect(label).toBeVisible();
            await expect(label).toHaveText(expectedLabels[i]);
        }
    });




    // test('Should have dialog footer visible', async ({ page }) => {
    //     const body = page.locator('div.dialog__footer')
    //     await expect(body).toBeVisible();
    // });

})


test.describe('"Suuna kolleegile" active chat actions dialog visibility', () => {
    const headers = [
        /Nimi/, /Kuvatav nimi/, /Staatus/
    ];

    test.beforeEach(async ({ page }) => {

        await page.goto('https://admin.test.buerokratt.ee/chat/unanswered');

        // before each test should turn switch on.
        await page.locator('.switch__button').click();
        await page.reload();
        await page.waitForTimeout(2000);
        await selectFirstChat(page);
        await takeOverFirstChat(page);
        await openDialog(page, "Suuna kolleegile")

    })


    test('Should have "Kellele vastust suunata?" dialog header and body parts visible', async ({ page }) => {
        // header pars
        const dialogHeader = page.locator('.dialog__header');
        await expect(dialogHeader).toBeVisible();

        const dialogTitle = dialogHeader.locator('h2.dialog__title');
        await expect(dialogTitle).toHaveText('Kellele vestlus suunata?');

        const closeButton = dialogHeader.locator('button.dialog__close');
        await expect(closeButton).toBeVisible();

        // body parts
        const dialogBody = page.locator('.dialog__body');
        await expect(dialogBody).toBeVisible();

        // Check input field visibility and placeholder
        const inputField = dialogBody.locator('input[name="search"]');
        await expect(inputField).toBeVisible();
        await expect(inputField).toHaveAttribute('placeholder', 'Otsi nime või tiitli järgi...');

        // Check checkbox visibility
        const checkbox = page.getByText('Näita ainult kohal olevaid nõustajaid');
        await expect(checkbox).toBeVisible();

        const table = page.locator('.data-table');
        await expect(table).toBeVisible();

        // Check if each column header is rendered
        for (const header of headers) {
            const headerElement = table.locator(`th`).filter({ hasText: header });
            await expect(headerElement).toBeVisible();
        }


        // Iterate over each header and check if the sorting button exists
        for (const header of headers) {
            const sortingButton = page.locator('th').filter({ hasText: header }).locator('button');
            await expect(sortingButton).toBeVisible();
        }


        // Check if table pagination wrapper exist 
        const paginationWrapper = page.locator('.data-table__pagination-wrapper');
        await expect(paginationWrapper).toBeVisible();

        const pageSizeSelector = paginationWrapper.locator('select');
        await expect(pageSizeSelector).toBeVisible();


        // Change the number of rows per page
        await pageSizeSelector.selectOption('10');
        await expect(pageSizeSelector).toHaveValue('10');

        await pageSizeSelector.selectOption('20');
        await expect(pageSizeSelector).toHaveValue('20');

        await pageSizeSelector.selectOption('30');
        await expect(pageSizeSelector).toHaveValue('30');

        await pageSizeSelector.selectOption('40');
        await expect(pageSizeSelector).toHaveValue('40');

        await pageSizeSelector.selectOption('50');
        await expect(pageSizeSelector).toHaveValue('50');
    });

})