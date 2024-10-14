import { test, expect } from '@playwright/test';
import { getTranslations } from '@translation/languageDetector.js';
let translation;


test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.prod.buerokratt.ee/chat/history');

    // Fetch translations for the test
    translation = await getTranslations(page);

    // Ensure the page is loaded and authenticated
    await expect(page).toHaveURL('https://admin.prod.buerokratt.ee/chat/history');
});

test.describe('Visibility Tests for "Ajalugu" / "History" Page', () => {

    test('should have History header', async ({ page }) => {
        const header = page.locator(`h1:has-text("${translation.history}")`);
        await expect(header).toBeVisible();
    });


    test('header card should include all necessary parts like search field, filtering from, to fields, and dropdown menu', async ({ page }) => {
        const card = page.locator('.card').first();
        await expect(card).toBeVisible();

        const searchField = await page.getByPlaceholder(`${translation.searchChats}`);
        await expect(searchField).toBeVisible();
        await expect(searchField).toHaveAttribute('placeholder', `${translation.searchChats}`);

        const filterTrack = card.locator('div.track').first();
        await expect(filterTrack).toBeVisible();

        const pElementFrom = card.locator(`p:has-text("${translation.from}")`);
        await expect(pElementFrom).toHaveText(`${translation.from}`);

        const datePickerFrom = card.locator('div.datepicker').nth(0);
        await expect(datePickerFrom).toBeVisible();

        const pElementTo = card.locator(`p:has-text("${translation.to}")`);
        await expect(pElementTo).toHaveText(`${translation.to}`);

        const datePickerTo = card.locator('div.datepicker').nth(1);
        await expect(datePickerTo).toBeVisible();

        const selectElement = card.locator('div.select');
        await expect(selectElement).toBeVisible();

        const selectElementText = card.locator(`div.select__trigger:has-text("${translation.choose}")`);
        await expect(selectElementText).toBeVisible();
    });

    test('results card should include all filtering fields and result data', async ({ page }) => {
        const card = page.locator('.card').nth(1);
        await expect(card).toBeVisible();

        const table = page.locator('table.data-table').first();
        await expect(table).toBeVisible();
    });
});



test.describe('Data Table Tests', () => {
    let headers;
    test.beforeEach(() => {
        // Define headers dynamically in each test case after translations are fetched
        headers = [
            new RegExp(translation.startTime), new RegExp(translation.endTime),
            new RegExp(translation.supportName), new RegExp(translation.name),
            new RegExp(translation.idCode)
        ];
    });

    test('Check if the table and all headers are rendered', async ({ page }) => {
        const table = page.locator('table.data-table');
        await expect(table).toBeVisible();

        for (const header of headers) {
            const headerElement = table.locator('th').filter({ hasText: header });
            await expect(headerElement).toBeVisible();
        }
    });


    test('Check if sorting buttons are present in each column', async ({ page }) => {
        for (const header of headers) {
            const sortingButton = page.locator('th').filter({ hasText: header }).locator('button');
            await expect(sortingButton).toBeVisible();
        }
    });

    test('Check if pagination controls are present and functioning', async ({ page }) => {
        const pageSizeSelector = page.locator('.data-table__page-size select');
        await expect(pageSizeSelector).toBeVisible();

        const options = ['10', '20', '30', '40', '50'];
        for (const option of options) {
            await pageSizeSelector.selectOption(option);
            await expect(pageSizeSelector).toHaveValue(option);
        }
    });

});



