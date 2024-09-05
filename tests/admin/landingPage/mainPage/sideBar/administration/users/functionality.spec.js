const { test, expect } = require('@playwright/test');
const { getTranslationsForLocale } = require('../../../../../.auth/language_detector');



test.describe('Table Sorting and Search Functionality', () => {
    const translation = getTranslationsForLocale('https://admin.test.buerokratt.ee', 'i18nextLng', __dirname);
    const pageUrl = 'https://admin.test.buerokratt.ee/chat/users';

    //

    // WRITE A SINGLE TEST OR SEQUENTIAL TESTS THAT TEST THE CREATION, EDITING AND DELETION OF AN USER.

    //

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

    async function testSearching({ page }, translationKey) {
        const columnName = translation[translationKey];
        const searchName = translation['Otsi...']; // Assuming 'Otsi...' is the placeholder for the search input
    
        const headers = await page.locator('//table//thead//th').allTextContents();
        const columnIndex = headers.indexOf(columnName) + 1;
    
        // Construct XPath using the static index for debugging
        const columnXpath = `xpath=//table//tr/td[${columnIndex}]`;
    
        // Locate the cells in the target column before searching
        const columnCells = await page.locator(columnXpath);
        const unsortedValues = (await columnCells.allTextContents()).map(val => val.trim());
    
        //Select a random value from the unsortedValues array
        const randomValue = unsortedValues[Math.floor(Math.random() * unsortedValues.length)];
    
        // Click to open the search input (assuming it's the button after the column name)
        await page.getByRole('cell', { name: columnName, exact: true }).getByRole('button').nth(1).click();
    
        await page.waitForTimeout(500); // Wait for the search input to appear
    
        // Interact with the search input (e.g., typing a search query)
        const searchInput = await page.locator(`input[placeholder="${searchName}"]`); // Adjust the selector if needed
        await searchInput.fill(randomValue); // Use the randomly selected value as the search query
        await page.waitForTimeout(500); // Wait for results to filter (adjust timing as needed)
    
        // Retrieve the column cells again after filtering
        const filteredValues = (await columnCells.allTextContents()).map(val => val.trim());
    
        // Verify that all filtered values match the random value (i.e., search query)
        for (const value of filteredValues) {
            expect(value.toLowerCase()).toContain(randomValue.toLowerCase());
        }
    }

    // Test cases for all columns
    test('Sort by Nimi', async ({ page }) => {
        await testSorting({ page }, 'Nimi');
        await testSearching({ page }, 'Nimi');
    });

    test('Sort by Isikukood', async ({ page }) => {
        await testSorting({ page }, 'Isikukood');
        await testSearching({ page }, 'Isikukood');
    });

    test('Sort by Roll', async ({ page }) => {
        test.info().annotations.push({
            type: 'Known bug',
            description: 'The sorting is random? All administrator roles should be first, but some are after other roles. ',
        })
        await testSorting({ page }, 'Roll');
        await testSearching({ page }, 'Roll');
    });

    test('Sort by Kuvatav nimi', async ({ page }) => {
        await testSorting({ page }, 'Kuvatav nimi');
        await testSearching({ page }, 'Kuvatav nimi');
    });

    test('Sort by Tiitel', async ({ page }) => {
        await testSorting({ page }, 'Tiitel');
        await testSearching({ page }, 'Tiitel');
    });

    test('Sort by E-post', async ({ page }) => {
        await testSorting({ page }, 'E-post');
        await testSearching({ page }, 'E-post');
    });
});
