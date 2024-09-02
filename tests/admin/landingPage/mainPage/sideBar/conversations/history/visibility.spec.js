import { test, expect } from '@playwright/test';

test.beforeEach('test', async ({ page }) => {
    await page.goto('https://admin.test.buerokratt.ee/chat/history');

    // page is authenticated
    await expect(page).toHaveURL('https://admin.test.buerokratt.ee/chat/history');
});


test.describe('"Ajalugu" page visibility', () => {

    const headers = [
        /Algusaeg/, /Lõppaeg/, /Nõustaja nimi/, /Nimi/, /Isikukood/,
        /Kontaktandmed/, /Kommentaar/, /Hinnang/, /Tagasiside/, /Staatus/, /ID/
    ];

    test('should have "Ajalugu" header', async ({ page }) => {
        const header = page.locator('h1:has-text("Ajalugu")');
        await expect(header).toBeVisible();
    });


    test('header card should include all necessary parts like search field, filtering from, to fields and dropdown menu', async ({ page }) => {
        const card = page.locator('.card').first();
        await expect(card).toBeVisible();

        const searchField = card.locator('input.input')
        await expect(searchField).toBeVisible();

        await expect(searchField).toHaveAttribute('placeholder', 'Otsi üle vestluste...')

        const filterTrack = card.locator('div.track').first();
        await expect(filterTrack).toBeVisible();

        const pElementFrom = card.locator('p:has-text("Alates")');
        await expect(pElementFrom).toHaveText('Alates')

        const datePickerFrom = card.locator('div.datepicker').nth(0);
        await expect(datePickerFrom).toBeVisible();

        const pElementTo = card.locator('p:has-text("Kuni")');
        await expect(pElementTo).toHaveText('Kuni')

        const datePickerTo = card.locator('div.datepicker').nth(1);
        await expect(datePickerTo).toBeVisible();

        const selectElement = card.locator('div.select');
        await expect(selectElement).toBeVisible();

        const selectElementText = card.locator('div.select__trigger:has-text("Vali")')
        await expect(selectElementText).toBeVisible();
    });


    test('results card should include all filtering fields and result data', async ({ page }) => {
        const card = page.locator('.card').nth(1);
        await expect(card).toBeVisible();

        const table = page.locator('table.data-table').first();
        await expect(table).toBeVisible();

    });


    test.describe('Data Table Tests', () => {

        test('Check if the table and all headers are rendered', async ({ page }) => {
            // Check if the table is present
            const table = page.locator('table.data-table');
            await expect(table).toBeVisible();

            // Check if each column header is rendered
            for (const header of headers) {
                const headerElement = table.locator(`th`).filter({ hasText: header });
                await expect(headerElement).toBeVisible();
            }
        });

    });


    test('Check if sorting buttons are present in each column', async ({ page }) => {
        // Iterate over each header and check if the sorting button exists
        for (const header of headers) {
            const sortingButton = page.locator('th').filter({ hasText: header }).locator('button');
            await expect(sortingButton).toBeVisible();
        }
    });


    test('Check if pagination controls are present and functioning', async ({ page }) => {

        // Check if the page size selector is present
        const pageSizeSelector = page.locator('.data-table__page-size select');
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