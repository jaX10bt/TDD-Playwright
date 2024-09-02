import { test, expect } from '@playwright/test';

test.describe('Visibility Tests for Settings Page', () => {

    test.beforeEach(async ({ page }) => {
        // Navigate to the page before each test
        await page.goto('https://admin.test.buerokratt.ee/chat/chatbot/settings'); // Replace with your actual page URL
    });

    test('Check visibility of main elements on the Settings page', async ({ page }) => {
        // Verify the main heading is visible
        const mainHeading = page.locator('main.layout__main h1');
        await expect(mainHeading).toBeVisible();
        await expect(mainHeading).toHaveText('Seaded');

        // Verify the first switch ("Vestlusrobot aktiivne") is visible
        const robotActiveSwitch = page.locator('label:has-text("Vestlusrobot aktiivne") + button.switch__button');
        await expect(robotActiveSwitch).toBeVisible();
        await expect(robotActiveSwitch).toHaveAttribute('data-state', 'checked'); // Verify default state

        // Verify the second switch ("Kuva nõustaja nimi") is visible
        const showAdvisorNameSwitch = page.locator('label:has-text("Kuva nõustaja nimi") + button.switch__button');
        await expect(showAdvisorNameSwitch).toBeVisible();
        await expect(showAdvisorNameSwitch).toHaveAttribute('data-state', 'checked'); // Verify default state

        // Verify the third switch ("Kuva nõustaja tiitel") is visible
        const showAdvisorTitleSwitch = page.locator('label:has-text("Kuva nõustaja tiitel") + button.switch__button');
        await expect(showAdvisorTitleSwitch).toBeVisible();
        await expect(showAdvisorTitleSwitch).toHaveAttribute('data-state', 'checked'); // Verify default state

        // Verify the "Salvesta" button is visible
        const saveButton = page.locator('button:has-text("Salvesta")');
        await expect(saveButton).toBeVisible();
    });

});
