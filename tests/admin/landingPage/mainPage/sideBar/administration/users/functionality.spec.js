const { test, expect } = require('@playwright/test');
const { getTranslations } = require('../../../../../../translations/languageDetector');

test.describe('User Management Functionality Tests', () => {
    let translation;
    const pageUrl = 'https://admin.prod.buerokratt.ee/chat/users';

    test.beforeEach(async ({ page }) => {
        await page.goto(pageUrl);
        translation = await getTranslations(page);
        await page.waitForLoadState('networkidle');
    });

    async function testSorting({ page }, translationKey) {
        const columnName = translation[translationKey];

        const headers = await page.locator('//table//thead//th').allTextContents();
        const columnIndex = headers.indexOf(columnName) + 1;

        const columnXpath = `xpath=//table//tr/td[${columnIndex}]`;

        const columnCells = await page.locator(columnXpath);
        const unsortedValues = (await columnCells.allTextContents()).map(val => val.trim());

        await page.getByRole('cell', { name: columnName, exact: true }).getByRole('button').first().click();
        await page.waitForTimeout(2000);

        const sortedValuesAsc = (await columnCells.allTextContents()).map(val => val.trim());
        const manuallySortedValuesAsc = [...unsortedValues].sort((a, b) => a.localeCompare(b));

        expect(sortedValuesAsc).toEqual(manuallySortedValuesAsc);

        await page.getByRole('cell', { name: columnName, exact: true }).getByRole('button').first().click();
        await page.waitForTimeout(2000);

        const sortedValuesDesc = (await columnCells.allTextContents()).map(val => val.trim());
        const manuallySortedValuesDesc = [...unsortedValues].sort((a, b) => b.localeCompare(a));
        expect(sortedValuesDesc).toEqual(manuallySortedValuesDesc);
    }

    async function testSearching({ page }, translationKey) {
        const columnName = translation[translationKey];
        const searchName = translation['search...'];

        const headers = await page.locator('//table//thead//th').allTextContents();
        const columnIndex = headers.indexOf(columnName) + 1;

        const columnXpath = `xpath=//table//tr/td[${columnIndex}]`;

        const columnCells = await page.locator(columnXpath);
        const unsortedValues = (await columnCells.allTextContents()).map(val => val.trim());

        const randomValue = unsortedValues[Math.floor(Math.random() * unsortedValues.length)];

        await page.getByRole('cell', { name: columnName, exact: true }).getByRole('button').nth(1).click();
        await page.waitForTimeout(500);

        const searchInput = await page.locator(`input[placeholder="${searchName}"]`);
        await searchInput.fill(randomValue);
        await page.waitForTimeout(500);

        const filteredValues = (await columnCells.allTextContents()).map(val => val.trim());

        for (const value of filteredValues) {
            expect(value.toLowerCase()).toContain(randomValue.toLowerCase());
        }
    }

    // Test cases for all columns
    test('Sort and Search by Nimi', async ({ page }) => {
        await testSorting({ page }, 'name');
        await testSearching({ page }, 'name');
    });

    test('Sort and Search by Isikukood', async ({ page }) => {
        await testSorting({ page }, 'idCode');
        await testSearching({ page }, 'idCode');
    });

    test('Sort and Search by Roll', async ({ page }) => {
        test.info().annotations.push({
            type: 'Known bug',
            description: 'The sorting is random? All administrator roles should be first, but some are after other roles.',
        });
        await testSorting({ page }, 'role');
        await testSearching({ page }, 'role');
    });

    test('Sort and Search by Kuvatav nimi', async ({ page }) => {
        await testSorting({ page }, 'displayName');
        await testSearching({ page }, 'displayName');
    });

    test('Sort and Search by Tiitel', async ({ page }) => {
        await testSorting({ page }, 'userTitle');
        await testSearching({ page }, 'userTitle');
    });

    test('Sort and Search by E-post', async ({ page }) => {
        await testSorting({ page }, 'e-mail');
        await testSearching({ page }, 'e-mail');
    });

    test('Add a new user', async ({ page }) => {
        test.info().annotations.push({
            type: 'Known bug',
            description: 'The test doesn’t run due to some internal failure, making the creation of a user impossible.',
        });

        await page.locator(`button.btn--primary:has-text("${translation["addUser"]}")`).click();

        await page.fill('input[name="fullName"]', 'Test User');
        await page.fill('input[name="idCode"]', 'EE12345678910');

        await page.locator('div').filter({ hasText: translation["choose"] }).nth(2).click();
        await page.getByRole('option', { name: translation["administrator"] }).click();

        await page.fill('input[name="displayName"]', 'TUser');
        await page.fill('input[name="csaTitle"]', 'Developer');
        await page.fill('input[name="csaEmail"]', 'test.user@example.com');

        await page.locator(`button.btn.btn--primary.btn--m:has-text("${translation["addUser"]}")`).nth(1).click();

        const columnName = translation["name"];
        const headers = await page.locator('//table//thead//th').allTextContents();

        const columnIndex = headers.indexOf(columnName) + 1;
        const columnXpath = `xpath=//table//tr/td[${columnIndex}]`;

        const columnCells = await page.locator(columnXpath);
        const allValues = (await columnCells.allTextContents()).map(val => val.trim());

        expect(allValues).toContain('Test User');

        const newUserRow = await page.locator(`table.data-table tbody tr:has-text("Test User")`);
        await expect(newUserRow).toBeVisible();
    });

    test('Edit user details', async ({ page }) => {
        // TODO: Implement edit user details test
    });

    test.skip('Delete user', async ({ page }) => {
        test.info().annotations.push({
            type: 'Note',
            description: 'This test is skipped due to it actually working. This is currently skipped due to the inability to create a new user due to internal failures.',
        });

        // TODO: Implement delete user test
    });
});
