const { test, expect } = require('@playwright/test');
const { getTranslationsForLocale } = require('../../../../../.auth/language_detector');

test.describe('Table Sorting and Search Functionality', () => {
    // URL of the page where the table is located

    const translation = getTranslationsForLocale('https://admin.test.buerokratt.ee', 'i18nextLng', __dirname);

    const pageUrl = 'https://admin.test.buerokratt.ee/chat/users';
    test.beforeEach(async ({ page }) => {
        await page.goto(pageUrl);
        await page.waitForLoadState('networkidle');
    });

    test('Sort by Nimi', async ({ page }) => {
        await page.getByRole('cell', { name: `${translation["Nimi"]}`, exact: true }).getByRole('button').first().click();
    });

    test('Sort by Nimi search', async ({ page }) => {
        await page.getByRole('cell', { name: `${translation["Nimi"]}`, exact: true }).getByRole('button').nth(1).click();
    });

    test('Sort by Isikukood', async ({ page }) => {
        await page.getByRole('cell', { name: `${translation["Isikukood"]}`, exact: true }).getByRole('button').first().click();
    });

    test('Sort by Isikukood search', async ({ page }) => {
        await page.getByRole('cell', { name: `${translation["Isikukood"]}`, exact: true }).getByRole('button').nth(1).click();
    });

    test('Sort by Roll', async ({ page }) => {
        await page.getByRole('cell', { name: `${translation["Roll"]}`, exact: true }).getByRole('button').first().click();
    });

    test('Sort by Roll search', async ({ page }) => {
        await page.getByRole('cell', { name: `${translation["Roll"]}`, exact: true }).getByRole('button').nth(1).click();
    });

    test('Sort by Kuvatav nimi', async ({ page }) => {
        await page.getByRole('cell', { name: `${translation["Kuvatav nimi"]}`, exact: true }).getByRole('button').first().click();
    });

    test('Sort by Kuvatav nimi search', async ({ page }) => {
        await page.getByRole('cell', { name: `${translation["Kuvatav nimi"]}`, exact: true }).getByRole('button').nth(1).click();
    });

    test('Sort by Tiitel', async ({ page }) => {
        await page.getByRole('cell', { name: `${translation["Tiitel"]}`, exact: true }).getByRole('button').first().click();
    });

    test('Sort by Tiitel search', async ({ page }) => {
        await page.getByRole('cell', { name: `${translation["Tiitel"]}`, exact: true }).getByRole('button').nth(1).click();
    });

    test('Sort by E-post', async ({ page }) => {
        await page.getByRole('cell', { name: `${translation["E-post"]}`, exact: true }).getByRole('button').first().click();
    });

    test('Sort by E-post search', async ({ page }) => {
        await page.getByRole('cell', { name: `${translation["E-post"]}`, exact: true }).getByRole('button').nth(1).click();
    });

});
