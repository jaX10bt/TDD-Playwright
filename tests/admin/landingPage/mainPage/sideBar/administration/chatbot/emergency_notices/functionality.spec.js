import { test, expect } from '@playwright/test';
import { getTranslations } from '../../../../../../../translations/languageDetector.js';

test.describe('Erakorralised Teated/Emergency notices Functionality Tests', () => {
  
  
  let translation

  test.beforeEach(async ({ page }) => {
    // Navigate to the page before each test
    await page.goto('https://admin.prod.buerokratt.ee/chat/chatbot/emergency-notices'); // Replace with your actual page URL
    translation = await getTranslations(page)
  });


  //
  // There is a bug regarding this test as it's supposed to turn the switch on after first press
  // but its first state is "checked" meaning the first press only makes the state "unchecked"
  // and thus nothing changes for the user in regard to UI
  // 
  //
  test.skip('Check if "Teade aktiivne"/"Notice active" switch button toggles ### Look issue inside', 

    async ({ page }) => {

      test.info().annotations.push({
        type: 'Known bug',
        description: 'There is a bug regarding this test as its supposed to turn the switches on after first press but its first state is checked while the UI remains as if its unchecked meaning the first press only makes the state unchecked and thus nothing changes for the user in regard to UI. This is the action sequence ==> Open page => Switch appears unchecked => Inspect the element => Element says its state is checked => Click the element => Switch doesnt change appearance but state changes to unchecked.',
      })
        

    // Locate the "Teade aktiivne" switch by its associated label
    const masterSwitch = await page.locator('button.switch__button').nth(1);

    // Check initial state (assumed to be 'Sees')
    await expect(masterSwitch).toHaveAttribute('data-state', 'unchecked');

    // Click to toggle the switch to "Väljas"
    await masterSwitch.click();

    // Verify the switch is now "Väljas"
    await expect(masterSwitch).toHaveAttribute('data-state', 'checked');
    await expect(masterSwitch.locator('span.switch__off')).toBeVisible();

    // Click again to toggle the switch back to "Sees"
    await masterSwitch.click();

    // Verify the switch is now "Sees" again
    await expect(masterSwitch).toHaveAttribute('data-state', 'unchecked');
    await expect(masterSwitch.locator('span.switch__on')).toBeVisible();
});


  test('Check if "Teade"/"Notice" input field can be edited with keyboard ', async ({ page }) => {
    const teadeInput = await page.locator(`.textarea:has(.textarea__label) textarea`);

    // Clear existing text and type new message
    await teadeInput.fill('');
    await teadeInput.fill('Service will resume shortly.');

    // Verify the text has been entered correctly
    await expect(teadeInput).toHaveValue('Service will resume shortly.');
  });

  test.skip('Check if "Kuvamisperiood" date inputs can be changed ### Look issues inside', async ({ page }) => {

    test.info().annotations.push({
        type: 'Known critical bug',
        description: 'When selecting the whole startDate or endDate input and pressing backspace(deleting it), it clears the whole sites HTML',
    })

    test.info().annotations.push({
        type: 'Known critical bug',
        description: 'When selecting the whole startDate or endDate input and typing 123456, it clears the whole HTML',
    })

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  
    // Locate the main container that holds the inputs
    const container = page.locator('.card__body');
  
    // Select all input fields inside the main container
    const dateInputs = container.locator('input');
  
    // Access the first two inputs which are assumed to be the date inputs
    const startDateInput = dateInputs.nth(0);
    const endDateInput = dateInputs.nth(1);
  
    // Clear and set the start date
    await startDateInput.click({ clickCount: 3 }); // Select all text
    await startDateInput.fill('01.09.2023'); // Set new date
    await expect(startDateInput).toHaveValue('01.09.2023'); // Assert new value
  
    // Clear and set the end date
    await endDateInput.click({ clickCount: 3 }); // Select all text
    await endDateInput.fill('31.12.2024'); // Set new date
    await expect(endDateInput).toHaveValue('31.12.2024'); // Assert new value
  });

  
  test('Check if "Kuvamisperiood"/"Display period" dates can be changed by choosing a date', async ({ page }) => {

    test.info().annotations.push({
      type: 'bug',
      description: 'Shouldnt be able to set either of the dates in the past or in bad relation (start date later than end date) to one another. Currently its possible on the frontend.',
  })
      

    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Locate the main container that holds the inputs
    const container = page.locator('.card__body');

    // Select all input fields inside the main container
    const dateInputs = container.locator('input');

    // Access the first two inputs which are assumed to be the date inputs
    const startDateInput = dateInputs.nth(0);
    const endDateInput = dateInputs.nth(1);

    // Function to select a date from the date picker
    async function selectDate(inputLocator, dateString) {
        // Click on the input to open the date picker
        await inputLocator.click();

        // Wait for the date picker to be visible
        const datePicker = page.locator('.react-datepicker');
        await datePicker.waitFor({ state: 'visible', timeout: 5000 });

        // Extract day, month, and year from the date string
        const [day, month, year] = dateString.split('.').map(Number);

        // Get the month name in Estonian for the date picker
        const monthName = new Date(year, month - 1).toLocaleString('et', { month: 'long' });

        // Function to navigate to the correct month/year
        async function navigateToMonthYear(targetMonth, targetYear) {
            while (true) {
                const monthYearLabel = page.locator('.react-datepicker__current-month');
                await monthYearLabel.waitFor({ state: 'visible', timeout: 3000 });
                const currentMonthYear = await monthYearLabel.innerText();

                if (currentMonthYear.includes(targetMonth) && currentMonthYear.includes(targetYear.toString())) {
                    break;
                }

                const navigationButton = (currentMonthYear.includes(targetYear.toString()) && currentMonthYear.includes(targetMonth))
                    ? null
                    : (targetYear < currentYear || (targetYear === currentYear && targetMonth < currentMonth)) 
                    ? page.locator('.react-datepicker__navigation--previous') 
                    : page.locator('.react-datepicker__navigation--next');

                if (navigationButton) {
                    await navigationButton.click();
                } else {
                    break;
                }
            }
        }

        // Get current month and year
        const currentMonthYearLabel = page.locator('.react-datepicker__current-month');
        const currentMonthYearText = await currentMonthYearLabel.innerText();
        const [currentMonth, currentYear] = currentMonthYearText.split(' ');

        // Navigate to the correct month/year
        await navigateToMonthYear(monthName, year);

        await page.locator('.react-datepicker').waitFor({ state: 'visible', timeout: 5000 });

        // Define the formatted day
        const formattedDay = day < 10 ? `00${day}` : day < 100 ? `0${day}` : `${day}`;
        const exactDaySelector = page.locator(`div.react-datepicker__day.react-datepicker__day--${formattedDay}:not(.react-datepicker__day--outside-month)`);

        // Wait for the first valid day element to be visible
        await exactDaySelector.first().waitFor({ state: 'visible', timeout: 5000 });

        // Click the first valid day element
        await exactDaySelector.first().click();

        // Verify the date has been set correctly
        await expect(inputLocator).toHaveValue(dateString);
    }

    // Test setting start date
    await selectDate(startDateInput, '01.09.2024');

    // Test setting end date
    await selectDate(endDateInput, '31.12.2024');
});

test('Check if "Salvesta"/"Save" button can be clicked', async ({ page }) => {
  // Locate the "Salvesta" button using its text

  const saveButton = await page.locator(`button:has-text("${translation["save"]}")`);

  // Click the "Salvesta" button
  await saveButton.click();

  // Verify that the success toast is visible after clicking the button
  await expect(page.locator('.toast.toast--success')).toBeVisible();
});

});
