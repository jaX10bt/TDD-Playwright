const { test, expect } = require('@playwright/test');
const { getTranslations } = require('@translation/languageDetector');

test.describe('Table Sorting and Searching Automation', () => {
  let translation;

  test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.prod.buerokratt.ee/training/history/history');
    translation = await getTranslations(page);
  });

  async function testSorting({ page }, translationKey) {
    const columnName = translation[translationKey];

    // Get the column index based on the translated column name
    const headers = await page.locator('//table//thead//th').allTextContents();
    const columnIndex = headers.indexOf(columnName) + 1;

    // Get all values in the column before sorting
    const columnCells = await page.locator(`xpath=//table//tr/td[${columnIndex}]`);
    const unsortedValues = (await columnCells.allTextContents()).map(val => val.trim());

    // Click to sort ascending
    await page.getByRole('cell', { name: columnName, exact: true }).getByRole('button').first().click();
    await page.waitForTimeout(2000); // Adjust timeout based on actual need

    // Verify ascending sort
    const sortedValuesAsc = (await columnCells.allTextContents()).map(val => val.trim());
    const manuallySortedAsc = [...unsortedValues].sort((a, b) => a.localeCompare(b));
    expect(sortedValuesAsc).toEqual(manuallySortedAsc);

    // Click to sort descending
    await page.getByRole('cell', { name: columnName, exact: true }).getByRole('button').first().click();
    await page.waitForTimeout(2000); // Adjust timeout based on actual need

    // Verify descending sort
    const sortedValuesDesc = (await columnCells.allTextContents()).map(val => val.trim());
    const manuallySortedDesc = [...unsortedValues].sort((a, b) => b.localeCompare(a));
    expect(sortedValuesDesc).toEqual(manuallySortedDesc);
  }

  async function searchInTableWithDropdown({ page }, column) {
    const columnName = translation[column]; // Get the translated column name

    await page.waitForTimeout(2000);
    // Select the dropdown menu and choose the option
    const dropdown = page.locator(`.select`);

    // Check if the dropdown exists
    const dropdownCount = await dropdown.count();
    if (dropdownCount === 0) {
      throw new Error(`Dropdown with name "${columnName}" not found`);
    }

    await dropdown.click();
    await page.getByRole('option', { name: columnName, exact: true }).click();

    const headers = await page.locator('//table//thead//th').allTextContents();
    const columnIndex = headers.indexOf(columnName) + 1; // Calculate column index

    // Get all rows in the table
    const rows = await page.locator('table tbody tr');
    const rowCount = await rows.count();

    if (rowCount === 0) {
      throw new Error(`No rows found in the table for column "${columnName}"`);
    }

    // Generate a random index to select a row
    const randomIndex = Math.floor(Math.random() * rowCount);
    const randomRow = rows.nth(randomIndex);

    // Get the cell value from the selected column
    const cellValue = await randomRow.locator(`td:nth-child(${columnIndex})`).innerText();

    // Use the selected cell value to fill the input field
    await page.locator('input[name="searchChats"]').fill(cellValue);
    await page.waitForTimeout(500); // Wait for search results to load

    // Verify that all visible rows show only the selected value in the specified column
    const filteredRows = await page.locator('table tbody tr'); // Get all rows after search

    const filteredRowCount = await filteredRows.count();
    // Verify if all visible rows display only the selected value in the searched column
    for (let i = 0; i < filteredRowCount; i++) {
      const row = filteredRows.nth(i);
      const rowValue = await row.locator(`td:nth-child(${columnIndex})`).innerText(); // Use column index

      // Assert that each visible row shows the selected value in the correct column
      expect(rowValue.toLowerCase()).toEqual(cellValue.toLowerCase()); // Ensure it matches the selected value
    }
  }

  test.describe('Sorting Tests', () => {
    test('Sort by startTime', async ({ page }) => {
      await testSorting({ page }, 'startTime');
    });

    test('Sort by endTime', async ({ page }) => {
      await testSorting({ page }, 'endTime');
    });

    test('Sort by supportName', async ({ page }) => {
      await testSorting({ page }, 'supportName');
    });

    test('Sort by name', async ({ page }) => {
      await testSorting({ page }, 'name');
    });

    test('Sort by idCode', async ({ page }) => {
      await testSorting({ page }, 'idCode');
    });

    test('Sort by contact', async ({ page }) => {
      await testSorting({ page }, 'contact');
    });

    test('Sort by comment', async ({ page }) => {
      await testSorting({ page }, 'comment');
    });

    test('Sort by label', async ({ page }) => {
      await testSorting({ page }, 'label');
    });

    test('Sort by status', async ({ page }) => {
      await testSorting({ page }, 'status');
    });

    test('Sort by id', async ({ page }) => {
      await testSorting({ page }, 'id');
    });
  });

  test.describe.fixme('Searching Tests', () => {
    test('Search by supportName', async ({ page }) => {
      await searchInTableWithDropdown({ page }, 'supportName');
    });

    test('Search by name', async ({ page }) => {
      await searchInTableWithDropdown({ page }, 'name');
    });

    test('Search by idCode', async ({ page }) => {
      await searchInTableWithDropdown({ page }, 'idCode');
    });

    test('Search by contact', async ({ page }) => {
      await searchInTableWithDropdown({ page }, 'contact');
    });

    test('Search by comment', async ({ page }) => {
      await searchInTableWithDropdown({ page }, 'comment');
    });

    test('Search by label', async ({ page }) => {
      await searchInTableWithDropdown({ page }, 'label');
    });

    test('Search by status', async ({ page }) => {
      await searchInTableWithDropdown({ page }, 'status');
    });

    test('Search by id', async ({ page }) => {
      await searchInTableWithDropdown({ page }, 'id');
    });
  });
});
