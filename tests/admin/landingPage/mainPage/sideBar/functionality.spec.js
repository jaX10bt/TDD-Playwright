import { test, expect } from '@playwright/test';

test.beforeEach('test', async ({ page }) => {
    await page.goto('https://admin.test.buerokratt.ee/chat/active');
    // page is authenticated
    await expect(page).toHaveURL('https://admin.test.buerokratt.ee/chat/active');

    // to be removed as by default should be closed ?!
    await page.getByRole('button', { name: 'Vestlused' }).click();
})

test.describe("general sideBar functionality", () => {
    const buttons = [
        { name: "Vestlused"},
        { name: "Treening"},
        { name: "Analüütika"},
        { name: "Teenused"},
        { name: "Haldus"},
        { name: "Seire"},
    ]

    test(`should be clickable, "Treening"`, async ({ page }) => {
        const treening = page.getByRole('button', { name: 'Treening' }).first()
        await treening.click();
        await expect(treening).toHaveAttribute('aria-expanded', 'true');
        await treening.click();
        await expect(treening).toHaveAttribute('aria-expanded', 'false');
    })

    buttons.forEach((button) => {
        test(`should be clickable, open and close, "${button.name}"`, async ({ page }) => {
            const currentButton = page.getByRole('button', { name: `${button.name}` }).first()
            await currentButton.click();
            await expect(currentButton).toHaveAttribute('aria-expanded', 'true');
            await currentButton.click();
            await expect(currentButton).toHaveAttribute('aria-expanded', 'false');
        });
    })

}) 

// test.describe("sideBar, toggle close-button-item", () => {
//     test('', async ({ page }) => {
//         pass
//     })
// }) 