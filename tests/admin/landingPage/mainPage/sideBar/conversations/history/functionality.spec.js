import { test, expect } from '@playwright/test';
import { getTranslations } from '../../../../../../translations/languageDetector'

let translation;
test.beforeEach('test', async ({ page }) => {
    await page.goto('https://admin.prod.buerokratt.ee/chat/history');

    // page is authenticated
    await expect(page).toHaveURL('https://admin.prod.buerokratt.ee/chat/history');
});


test('Check if the table is horizontally scrollable', async ({ page }) => {
    // Locate the scroll wrapper
    const scrollWrapper = page.locator('.data-table__scrollWrapper');

    // Verify that the scroll wrapper is scrollable (by checking overflow)
    const overflowX = await scrollWrapper.evaluate(node => window.getComputedStyle(node).overflowX);
    expect(overflowX).toBe('auto' || 'scroll');
});



test('Check if date inputs can be changed', async ({ page }) => {

    await page.waitForTimeout(2000)

    const container = page.locator('.card__body');

    const dateInputs = container.locator('input');

    // Access the first two inputs which are assumed to be the date inputs
    const startDateInput = dateInputs.nth(1);
    const endDateInput = dateInputs.nth(2);

    // Clear and set the start date
    await startDateInput.click({ clickCount: 3 }); // Select all text
    await startDateInput.fill('01.09.2023');
    await expect(startDateInput).toHaveValue('01.09.2023');

    // Clear and set the end date
    await endDateInput.click({ clickCount: 3 });
    await endDateInput.fill('31.12.2024');
    await expect(endDateInput).toHaveValue('31.12.2024');
});


test.skip('Date FROM input field should reject invalid date formats ### Check issue inside', async ({ page }) => {
    test.info().annotations.push({
        type: 'Error',
        description: 'Should throw an error. Currently it has not any data validation.',
    })
    await page.waitForTimeout(2000);

    const container = page.locator('.card__body');

    const dateInputs = container.locator('input');

    // Access the first two inputs which are assumed to be the date inputs
    const startDateInput = dateInputs.nth(1);

    // Clear and set the start date
    await startDateInput.click({ clickCount: 3 }); // Select all text
    await startDateInput.fill('01.09.12345');

    // Trigger any validation mechanism if necessary (e.g., blur event)
    await startDateInput.blur();

    // This could be a message or some form of UI feedback
    const validationMessage = page.locator('.validation-error-message'); // Adjust selector as needed
    await validationMessage.waitFor({ state: 'visible', timeout: 5000 }); // Adjust timeout as needed

    // Verify that the validation message is displayed
    const isValidationMessageVisible = await validationMessage.isVisible();
    expect(isValidationMessageVisible).toBe(true);

    // Optionally, check the content of the validation message
    const validationMessageText = await validationMessage.textContent();
    expect(validationMessageText).toContain('Invalid date format'); // Adjust text as needed

    // Optionally, you may also verify the input field's value remains unchanged or cleared
    const inputValue = await datepickerInput.inputValue();
    expect(inputValue).toBe(''); // Assuming invalid input should clear the field or leave it unchanged
});


test.skip('Date TO input field should reject invalid date formats ### Check issue inside', async ({ page }) => {
    test.info().annotations.push({
        type: 'Error',
        description: 'Should throw an error. Currently it has not any data validation.',
    })
    await page.waitForTimeout(2000);
    const container = page.locator('.card__body');

    const dateInputs = container.locator('input');

    // Access the first two inputs which are assumed to be the date inputs
    const endDateInput = dateInputs.nth(2);

    // Clear and set the start date
    await endDateInput.click({ clickCount: 3 }); // Select all text
    await endDateInput.fill('01.09.12345');

    // Trigger any validation mechanism if necessary (e.g., blur event)
    await endDateInput.blur();

    // This could be a message or some form of UI feedback
    const validationMessage = page.locator('.validation-error-message'); // Adjust selector as needed
    await validationMessage.waitFor({ state: 'visible', timeout: 5000 }); // Adjust timeout as needed

    // Verify that the validation message is displayed
    const isValidationMessageVisible = await validationMessage.isVisible();
    expect(isValidationMessageVisible).toBe(true);

    // Optionally, check the content of the validation message
    const validationMessageText = await validationMessage.textContent();
    expect(validationMessageText).toContain('Invalid date format'); // Adjust text as needed

    // Optionally, you may also verify the input field's value remains unchanged or cleared
    const inputValue = await datepickerInput.inputValue();
    expect(inputValue).toBe(''); // Assuming invalid input should clear the field or leave it unchanged
});


test('Check if "Ajalugu" date inputs accept only valid date formats', async ({ page }) => {

    await page.waitForLoadState('networkidle');

    const container = page.locator('.card__body');

    const dateInputs = container.locator('input');

    // Access the first two inputs which are assumed to be the date inputs
    const startDateInput = dateInputs.nth(0);
    const endDateInput = dateInputs.nth(1);

    // Clear and set the start date
    await startDateInput.click({ clickCount: 3 }); // Select all text
    await startDateInput.fill('01.09.2023');
    await expect(startDateInput).toHaveValue('01.09.2023');

    // Clear and set the end date
    await endDateInput.click({ clickCount: 3 });
    await endDateInput.fill('31.12.2024');
    await expect(endDateInput).toHaveValue('31.12.2024');
});


test('Dropdown menu should expand, displaying the available options, and allow the user to select a different option.', async ({ page }) => {
    translation = await getTranslations(page)
    // Locate the table rows to check if there is any data
    await page.waitForTimeout(2000);
    const card = page.locator('.card').first();

    const dropdown = await card.locator(`div.select__trigger:has-text("${translation.choose}")`)

    dropdown.click();

    const dropdownMenu = card.locator('.select__menu');
    await expect(dropdownMenu).toBeVisible();

    await dropdownMenu.waitFor({ state: 'visible', timeout: 5000 }); // Adjust timeout as needed

    const optionToSelect = dropdownMenu.locator(`li.select__option:has-text("${translation.startTime}") input[type="checkbox"]`);

    await optionToSelect.check();

    const isChecked = await optionToSelect.isChecked();

    expect(isChecked).toBe(true);
});


test('Dropdown menu should expand, displaying the available options, and allow the user to select a different option. Should show corresponding columns in table.', async ({ page }) => {
    // Locate the table rows to check if there is any data
    translation = await getTranslations(page);

    const card = page.locator('.card').first();

    const dropdown = card.locator(`div.select__trigger:has-text("${translation.choose}")`)

    await dropdown.click();

    const dropdownMenu = card.locator('.select__menu');
    await expect(dropdownMenu).toBeVisible();

    await dropdownMenu.waitFor({ state: 'visible', timeout: 5000 }); // Adjust timeout as needed

    // select algusaeg from dropdown
    const optionToSelect = dropdownMenu.locator(`li.select__option:has-text("${translation.startTime}") input[type="checkbox"]`);

    await optionToSelect.check()

    const isChecked = await optionToSelect.isChecked();

    expect(isChecked).toBe(true);

    const table = page.locator('table.data-table');
    const columns = table.locator('th')

    // Check for the count of headers
    const headerCount = await columns.count()
    // 2 because second table head is to see the details of each row.
    expect(headerCount).toBe(2)

    // Verify that the single column header is "Algusaeg"
    const columnHeader = columns.first();
    const columnText = await columnHeader.innerText();
    expect(columnText).toBe(translation.startTime);


});



test('Search input field accepts text input and triggers search', async ({ page }) => {
    // Locate the table rows to check if there is any data
    translation = await getTranslations(page);
    await page.waitForTimeout(2000);
    const initialRows = page.locator('table.data-table tbody tr');

    const initialRowCount = await initialRows.count();

    if (initialRowCount > 0) {
        // Locate the search input field using the placeholder text
        const searchInput = page.locator(`input[placeholder="${translation.searchChats}"]`);

        // Type random input value into the search input field to expect 0 matching and ensure that input field is working as expected
        await searchInput.fill('abcdefgh12345jklmnop678999001122ghdsa');

        await expect(searchInput).toHaveValue('abcdefgh12345jklmnop678999001122ghdsa');

        // Wait for search results to be updated
        await page.waitForTimeout(2000);

        const searchResultsRows = page.locator('table.data-table tbody tr');

        const resultsCount = await searchResultsRows.count();

        expect(resultsCount).toBe(0);

    } else {
        return;
    }
});


test('Table columns should be sortable by clicking on the column headers. Sort by From date', async ({ page }) => {
    await page.waitForTimeout(2000);
    translation = await getTranslations(page);
    // Locate the card element and the table inside it
    const table = page.locator('table.data-table');

    // Ensure the table is visible
    await expect(table).toBeVisible();

    // Locate the "Algusaeg" column header
    const algusaegSortingButton = table.locator(`th:has-text("${translation.startTime}")`).locator('button');

    // Click on the "Algusaeg" column header to sort the table
    await algusaegSortingButton.click();

    // Wait for the table to sort (adjust timeout if necessary)
    await page.waitForTimeout(1000); // or use a more specific wait if you know what triggers the sort

    // Get the sorted values from the column "Algusaeg"
    const sortedValuesAsc = await table.locator('tbody tr').evaluateAll(rows => {
        return rows.map(row => row.querySelector('td:nth-of-type(1)').textContent.trim());
    });

    // Click again to sort in descending order
    await algusaegSortingButton.click();

    // Log the sorted values to the terminal
    //console.log('Sorted Values Ascending:', sortedValuesAsc);

    // Wait for the table to sort again
    await page.waitForTimeout(1000);

    // Get the sorted values from the column "Algusaeg" after descending sort
    const sortedValuesDesc = await table.locator('tbody tr').evaluateAll(rows => {
        return rows.map(row => row.querySelector('td:nth-of-type(1)').textContent.trim());
    });


    // Verify that the values are sorted in ascending or descending order
    const isSortedAsc = sortedValuesAsc.every((val, i, arr) => !i || arr[i - 1] <= val);
    const isSortedDesc = sortedValuesDesc.every((val, i, arr) => !i || arr[i - 1] >= val);

    expect(isSortedAsc || isSortedDesc).toBe(true);
});


test('Table columns should be sortable by clicking on the column headers. Sort by To date', async ({ page }) => {
    await page.waitForTimeout(2000);
    translation = await getTranslations(page);
    // Locate the card element and the table inside it
    const table = page.locator('table.data-table');

    // Ensure the table is visible
    await expect(table).toBeVisible();

    // Locate the "Algusaeg" column header
    const algusaegSortingButton = table.locator(`th:has-text("${translation.endTime}")`).locator('button');

    // Click on the "Algusaeg" column header to sort the table
    await algusaegSortingButton.click();

    // Wait for the table to sort (adjust timeout if necessary)
    await page.waitForTimeout(1000); // or use a more specific wait if you know what triggers the sort

    // Get the sorted values from the column "Algusaeg"
    const sortedValuesAsc = await table.locator('tbody tr').evaluateAll(rows => {
        return rows.map(row => row.querySelector('td:nth-of-type(2)').textContent.trim());
    });

    // Click again to sort in descending order
    await algusaegSortingButton.click();

    // Log the sorted values to the terminal
    //console.log('Sorted Values Ascending:', sortedValuesAsc);

    // Wait for the table to sort again
    await page.waitForTimeout(1000);

    // Get the sorted values from the column "Algusaeg" after descending sort
    const sortedValuesDesc = await table.locator('tbody tr').evaluateAll(rows => {
        return rows.map(row => row.querySelector('td:nth-of-type(2)').textContent.trim());
    });


    // Verify that the values are sorted in ascending or descending order
    const isSortedAsc = sortedValuesAsc.every((val, i, arr) => !i || arr[i - 1] <= val);
    const isSortedDesc = sortedValuesDesc.every((val, i, arr) => !i || arr[i - 1] >= val);

    expect(isSortedAsc || isSortedDesc).toBe(true);
});