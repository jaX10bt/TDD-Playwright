import { test, expect } from '@playwright/test';
import { getTranslations } from '../../../../translations/languageDetector';
let translations;

test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.prod.buerokratt.ee/chat/active');
    translations = await getTranslations(page);
})

test.describe("top banner visibility", () => {
    test("should display the top banner", async ({ page }) => {
        await expect(page.getByRole('banner')).toBeVisible();
    })

    test("should contain bürokratt logo", async ({ page }) => {
        await expect(page.getByRole('img')).toBeVisible();
    })

    test("should contain unanswered / forwarded text in top banner", async ({ page }) => {
        const regexPattern = `\\d+ ${translations.unanswered} \\d+ ${translations.forwarded}`;

        const p = page.locator('.track p');
        
        await expect(p).toBeVisible();

        await expect(p).toHaveText(new RegExp(regexPattern));


    })

    test("should contain profile settings and info button", async ({ page }) => {
        const button = page.locator('button.btn.btn--text.btn--m').first();

        await expect(button).toBeVisible();

    })

    test("should contain logout button", async ({ page }) => {
        await expect(page.getByRole('button', { name: translations.logout })).toBeVisible();
    })
})

test.describe("active status-switch button visibility", () => {
    test("should contain switch button", async ({ page }) => {
        const switchButton = await page.locator('.switch .switch__button');
        await expect(switchButton).toBeVisible();
    })

    test("should contain text in switch button", async ({ page }) =>  {
        await expect(page.locator('.switch__on')).toHaveText(translations.present);
        await expect(page.locator('.switch__off')).toHaveText(translations.away);
    })
})