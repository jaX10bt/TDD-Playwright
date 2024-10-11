import { test, expect } from '@playwright/test';
import { getTranslations } from '@translation/languageDetector.js';
import { selectFirstChat } from '../../../conversations/unanswered/helper';
let translations;
let headers;

test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.prod.buerokratt.ee/training/training/stories');

    await page.waitForTimeout(4000);

    await expect(page).toHaveURL('https://admin.prod.buerokratt.ee/training/training/stories');

    translations = await getTranslations(page);

    headers = [
        new RegExp(translations.rule)
    ];
});

test('Check visibility of the header', async ({ page }) => {
    const header = page.locator(`h1:has-text("${translations.rules}")`);
    await expect(header).toBeVisible();
});

test.describe('Visibility Tests for "Rules"/"Reeglid" left vertical tab', () => {
    test('should have rules vertical listing tab', async ({ page }) => {
        const verticalTabs = page.locator('div.vertical-tabs__list');
        await expect(verticalTabs).toBeVisible();
    })

    // test('should have content rules button', async ({ page }) => {
    //     const verticalTabs = page.locator(`.btn:has-text("${translations.rules}")`);
    //     await expect(verticalTabs).toBeVisible();
    // });
});

test.describe('Visibility Tests for "Rules"/"Reeglid" right vertical tab', () => {
    test('Check visibility of the content header elements which should include field and add button', async ({ page }) => {
        const searchField = page.getByPlaceholder(`${translations.dottedSearch}`);
        await expect(searchField).toBeVisible();
        await expect(searchField).toHaveAttribute('placeholder', `${translations.dottedSearch}`);

        const addButton = page.locator(`.track .btn:has-text("${translations.add}")`);
        await expect(addButton).toBeVisible();
    });

    test('Check if the table and all headers are rendered', async ({ page }) => {
        const table = page.locator('table.data-table');
        await expect(table).toBeVisible();

        for (const header of headers) {
            const headerElement = table.locator('th').filter({ hasText: header });
            await expect(headerElement).toBeVisible();
        }
    });


    // Minu arust pole üldse siin mingit sorteerimise võimalust.
    /* test.skip('Check if sorting buttons are present in each column', async ({ page }) => {
        for (const header of headers) {
            const sortingButton = page.locator('th').filter({ hasText: header }).locator('button');
            await expect(sortingButton).toBeVisible();
        }
    }); */

    test('Check if clicking on the "Add" button directs to new url', async ({ page }) => {
        const addButton = page.locator(`button:has-text("${translations.add}")`);
        addButton.click();
        await page.waitForURL('https://admin.prod.buerokratt.ee/training/training/rules/new')
    })

});




