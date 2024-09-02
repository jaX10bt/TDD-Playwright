import { test, expect } from '@playwright/test';
import { translations } from './translations';

const language = 'et';

test.beforeEach('test', async ({ page }) => {
    await page.goto('https://admin.test.buerokratt.ee/chat/active');
    await expect(page).toHaveURL('https://admin.test.buerokratt.ee/chat/active');
    await page.getByRole('button', { name: translations[language]['Treening'] }).click();
    await page.getByRole('button', { name: translations[language]['Treening'] }).nth(1).click();
});

// needs fixing
test.describe('sidebar submenu visibility', () => {
    const submenuItems = [
        translations[language]['Teemad'],
        translations[language]['Avalikud teemad'],
        translations[language]['Teemade järeltreenimine'],
        translations[language]['Vastused'],
        translations[language]['Kasutuslood'],
        translations[language]['Konfiguratsioon'],
        translations[language]['Vormid'],
        translations[language]['Mälukohad']
    ];

    submenuItems.forEach((text) => {
        test(`should be visible "${text}" `, async ({ page }) => {
            const linkLocator = page.locator(`text=${text}`);
            await expect(linkLocator).toBeVisible();
        });
    });

    // submenu item "Automaatne teenused" is visible in two places
    test.fixme(`should be visible 'Automatic Services'`, async ({ page }) => {
        expect(page.locator(`a[href="/training/auto-services"]`)).toBeVisible();
    });
});
