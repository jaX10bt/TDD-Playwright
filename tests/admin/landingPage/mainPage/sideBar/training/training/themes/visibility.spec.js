import { test, expect } from '@playwright/test';

test.beforeEach('test', async ({ page }) => {
    await page.goto('https://admin.test.buerokratt.ee/chat/active');
    await expect(page).toHaveURL('https://admin.test.buerokratt.ee/chat/active');
    await page.getByRole('button', { name: 'Treening' }).click();
    await page.getByRole('button', { name: 'Treening' }).nth(1).click();
});

test.describe('sidebar submenu visibility', () => {
    const submenuItems = [
        /Teemad/,
        /Avalikud teemad/,
        /Teemade järeltreenimine/,
        /Vastused/,
        /Kasutuslood/,
        /Konfiguratsioon/,
        /Vormid/,
        /Mälukohad/,
        /Automatic Teenused/
    ];

    submenuItems.forEach((text) => {
        test(`submenu item "${text}" should be visible`, async ({ page }) => {
            const linkLocator = page.locator(`text=${text}`);
            await expect(linkLocator).toBeVisible();
        });
    });
});
