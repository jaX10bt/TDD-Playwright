const { test, expect } = require('@playwright/test');
const { getTranslationsForLocale } = require('../../../../../.auth/language_detector');

test.describe('Table Sorting and Search Functionality', () => {
    const translation = getTranslationsForLocale('https://admin.test.buerokratt.ee', 'i18nextLng', __dirname);
    const pageUrl = 'https://admin.test.buerokratt.ee/chat/users';

    test.beforeEach(async ({ page }) => {
        await page.goto(pageUrl);
        await page.waitForLoadState('networkidle');
    });

    async function testSorting({ page }, translationKey) {
        const columnName = translation[translationKey];
        
        // Log headers and translation key for debugging
        const headers = await page.locator('//table//thead//th').allTextContents();
        
        // Verify column index
        const columnIndex = headers.indexOf(columnName) + 1;

        // Construct XPath using the static index for debugging
        const columnXpath = `xpath=//table//tr/td[${columnIndex}]`;
        
        // Locate the cells in the target column before sorting
        const columnCells = await page.locator(columnXpath);
        const unsortedValues = (await columnCells.allTextContents()).map(val => val.trim());

        // Click to sort in ascending order
        await page.getByRole('cell', { name: columnName, exact: true }).getByRole('button').first().click();
        await page.waitForTimeout(2000); // Wait for sorting to take effect

        // Locate the cells again after sorting
        const sortedValuesAsc = (await columnCells.allTextContents()).map(val => val.trim());
        const manuallySortedValuesAsc = [...unsortedValues].sort((a, b) => a.localeCompare(b));

        expect(sortedValuesAsc).toEqual(manuallySortedValuesAsc);

        // Click again to sort in descending order
        await page.getByRole('cell', { name: columnName, exact: true }).getByRole('button').first().click();
        await page.waitForTimeout(2000); // Wait for sorting to take effect

        // Locate the cells again after sorting
        const sortedValuesDesc = (await columnCells.allTextContents()).map(val => val.trim());
        const manuallySortedValuesDesc = [...unsortedValues].sort((a, b) => b.localeCompare(a));
        expect(sortedValuesDesc).toEqual(manuallySortedValuesDesc);
    }

    // Test cases for all columns
    test('Sort by Nimi', async ({ page }) => {
        await testSorting({ page }, 'Nimi');
    });

    test('Sort by Isikukood', async ({ page }) => {
        await testSorting({ page }, 'Isikukood');
    });

    test('Sort by Roll', async ({ page }) => {
        test.info().annotations.push({
            type: 'Known bug',
            description: 'The sorting is random? All administrator roles should be first, but some are after other roles. ',
        })
        await testSorting({ page }, 'Roll');
    });

    test('Sort by Kuvatav nimi', async ({ page }) => {
        await testSorting({ page }, 'Kuvatav nimi');
    });

    test('Sort by Tiitel', async ({ page }) => {
        await testSorting({ page }, 'Tiitel');
    });

    test('Sort by E-post', async ({ page }) => {
        await testSorting({ page }, 'E-post');
    });
});
