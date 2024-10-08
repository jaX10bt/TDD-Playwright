const { test, expect } = require('@playwright/test');

test.describe('Table Sorting Automation', () => {
  
  // Assume translations are provided from a translation file or context
  const translation = {
    startTime: 'Algusaeg',
    endTime: 'Lõppaeg',
    supportName: 'Nõustaja nimi',
    name: 'Nimi',
    idCode: 'Isikukood',
    contact: 'Kontaktandmed',
    comment: 'Kommentaar',
    label: 'Märksõna',
    status: 'Staatus',
    id: 'ID'
  };

  // Create regular expressions for each header
  const headers = [
    new RegExp(`^${translation.startTime}$`),
    new RegExp(`^${translation.endTime}$`),
    new RegExp(`^${translation.supportName}$`),
    new RegExp(`^${translation.name}$`),
    new RegExp(`^${translation.idCode}$`),
    new RegExp(`^${translation.contact}$`),
    new RegExp(`^${translation.comment}$`),
    new RegExp(`^${translation.label}$`),
    new RegExp(`^${translation.status}$`),
    new RegExp(`^${translation.id}$`) // Matches only "ID"
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto('YOUR_PAGE_URL'); // Replace with actual URL
  });

  headers.forEach((header) => {
    test(`should sort by header: ${header}`, async ({ page }) => {
      // Locate the header that matches the regex and click it
      const sortButton = page.locator(`text=${header.source} >> button`);
      await sortButton.click();

      // Assert that sorting worked as expected (customize based on actual sorting logic)
      const firstRowValue = await page.locator('tr:nth-child(1) td').nth(0).textContent();
      const secondRowValue = await page.locator('tr:nth-child(2) td').nth(0).textContent();

      // Simple comparison to check if the first row is sorted alphabetically
      expect(firstRowValue.localeCompare(secondRowValue)).toBeLessThanOrEqual(0);
    });
  });

});
