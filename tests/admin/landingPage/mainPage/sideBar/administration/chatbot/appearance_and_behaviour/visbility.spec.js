import { test, expect } from '@playwright/test';
import { translations } from './translations.js';
import userData from '../../../../../../../.auth/user.json';

test.describe('Visibility Tests for "Välimus ja käitumine"/"Appearance and Behaviour"  Page', () => {

    const cookies = userData.cookies;

    const getCookieValueByName = (cookieName) => {
        const cookie = cookies.find(cookie => cookie.name === cookieName);
        return cookie ? cookie.value : null;
    };

    test.beforeEach(async ({ page }) => {
        // Navigate to the page before each test
        await page.goto('https://admin.test.buerokratt.ee/chat/chatbot/appearance'); // Replace with your actual page URL
    });

    test('Check visibility of all elements', async ({ page }) => {
        // Check visibility of the header "Välimus ja käitumine"

        const locale = getCookieValueByName('__Host-LOCALE');

        // Use the locale to get translations
        const translation = translations[locale]

        // Check visibility of the header "Välimus ja käitumine"
        const header = page.locator(`h1:has-text("${translation['Välimus ja käitumine']}")`);
        await expect(header).toBeVisible();

        // Check visibility of the input for "Animatsiooni kestus sekundites"
        const animationDurationInput = page.locator(`label:has-text("${translation['Animatsiooni kestus sekundites']}") + div input`);
        await expect(animationDurationInput).toBeVisible();

        // Check visibility of the switch for "Märguandesõnum"
        const notificationSwitch = page.locator(`label:has-text("${translation['Märguandesõnum']}") + button.switch__button`);
        await expect(notificationSwitch).toBeVisible();

        // Check visibility of the input for "Aeg animatsiooni alguseni sekundites"
        const animationStartTimeInput = page.locator(`label:has-text("${translation['Aeg animatsiooni alguseni sekundites']}") + div input`);
        await expect(animationStartTimeInput).toBeVisible();

        // Check visibility of the input for "Märguandesõnum"
        const notificationMessageInput = page.locator(`label:has-text("${translation['Märguandesõnum']}") + div input`);
        await expect(notificationMessageInput).toBeVisible();

        // Check visibility of the color picker for "Põhivärv"
        const primaryColorPicker = page.locator(`label:has-text("${translation['Põhivärv']}") + div input`);
        await expect(primaryColorPicker).toBeVisible();

        // Check visibility of the button in the color picker
        const colorPickerButton = page.locator(`label:has-text("${translation['Põhivärv']}") + div input`);
        await expect(colorPickerButton).toBeVisible();

        // Check visibility of the dropdown for "Animatsioon"
        const animationDropdown = page.locator(`label:has-text("${translation['Animatsioon']}") + div div.select__trigger`);
        await expect(animationDropdown).toBeVisible();

        // Check visibility of the "Salvesta" button
        const saveButton = page.locator(`button:has-text("${translation['Salvesta']}")`);
        await expect(saveButton).toBeVisible();

        // Check visibility of the "Eelvaade" button
        const previewButton = page.locator(`button:has-text("${translation['Eelvaade']}")`);
        await expect(previewButton).toBeVisible();
    });

});
