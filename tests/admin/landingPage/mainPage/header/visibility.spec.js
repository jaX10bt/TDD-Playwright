import { test, expect } from '@playwright/test';

let adminPage; // replacae when jwt token functionality available

test.beforeEach(async ({ page }) => {
    await page.goto(adminPage);
})

test.describe("top banner visibility", () => {
    test("should display the top banner", async ({ page }) => {
        await expect(page.getByRole('banner')).toBeVisible();
    })

    test("should contain bürokratt logo", async ({ page }) => {
        await expect(page.getByRole('img')).toBeVisible();
    })

    test("should contain unanswered / directed notice board ", async ({ page }) => {
        await expect(page.getByText(/Vastamata/)).toBeVisible();
    })

    test("should contain presence switch buttont", async ({ page }) => {
        await expect(page.getByRole('switch', { name: 'Kohal Eemal' })).toBeVisible()
    })

    test("should contain profile settinf button", async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Kustutamiseks' })).toBeVisible();
    })

    test("should contain logout button", async ({ page }) => {
        await expect(page.getByRole('button', { name: 'Logi välja' })).toBeVisible();
    })
})


