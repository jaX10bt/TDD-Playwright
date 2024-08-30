import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.test.buerokratt.ee/chat/active');
})

test.describe("top banner visibility", () => {
    test("should display the top banner", async ({ page }) => {
        await expect(page.getByRole('banner')).toBeVisible();
    })

    test("should contain bürokratt logo", async ({ page }) => {
        await expect(page.getByRole('img')).toBeVisible();
    })

    test("should contain unanswered / directed / on hold notice board ", async ({ page }) => {
        await expect(page.getByText(/Vastamata \(\d+\)/)).toBeVisible();
    })

    test("should contain profile settings and info button", async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Kustutamiseks' })).toBeVisible();
    })

    test("should contain logout button", async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Logi välja' })).toBeVisible();
    })
})

test.describe("active status-switch button visibility", () => {
    test("should contain switch button", async ({ page }) => {
        await expect(page.getByRole('switch', { name: 'Kohal' })).toBeVisible();
    })

    test("should contain text in switch button", async ({ page }) =>  {
        await expect(page.locator('.switch__on')).toHaveText('Kohal');
        await expect(page.locator('.switch__off')).toHaveText('Eemal');
    })
})


