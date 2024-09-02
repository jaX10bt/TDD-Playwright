import { test, expect } from '@playwright/test';

test.beforeEach('test', async ({ page }) => {
    await page.goto('https://admin.test.buerokratt.ee/chat/active');
    // page is authenticated
    await expect(page).toHaveURL('https://admin.test.buerokratt.ee/chat/active');
    await page.getByRole('button', { name: 'Treening' }).click();
});

test("should have all subtabs visible", async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Treening' }).nth(1)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ajaloolised vestlused' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mudelipank ja analüütika' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Treeni uus mudel' })).toBeVisible();
})