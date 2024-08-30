import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.test.buerokratt.ee/chat/active');
    await page.getByRole('button', { name: 'Kustutamiseks' }).click();
    await expect(page.locator('.drawer')).toBeVisible({ timeout: 5000 });
});

test.describe("user profile/drawer visibility", () => {
    test("should display user profile/drawer", async ({ page }) => {
        const drawer = page.locator('.drawer');
        await expect(drawer).toBeVisible();
    });

    test("should display user details in the drawer", async ({ page }) => {
        const drawerBody = page.locator('.drawer__body');
        await expect(drawerBody).toBeVisible();

        const userInfo = [
            { label: 'Kuvatav nimi:', value: 'Kustutamiseks' },
            { label: 'Kasutaja roll(id):', value: 'Administraator' },
            { label: 'Tiitel:', value: 'sir' },
            { label: 'E-post:', value: 'kustutamind@mail.ee' }
        ];

        for (const { label, value } of userInfo) {
            await expect(drawerBody.locator(`text=${label}`)).toBeVisible();
            await expect(drawerBody.locator(`text=${value}`)).toBeVisible();
        }
    });

    test("should display switch elements", async ({ page }) => {
        const drawerBody = page.locator('.drawer__body');
        await expect(drawerBody).toBeVisible();

        const switchSections = [
            { title: 'Autokorrektor', labels: ['Teksti autokorrektor'] },
            { title: 'Märguanded e-postile', labels: ['Uus suunatud vestlus', 'Uus vastamata vestlus'] },
            { title: 'Häälmärguanded', labels: ['Uus suunatud vestlus', 'Uus vastamata vestlus'] },
            { title: 'Pop-up märguanded', labels: ['Uus suunatud vestlus', 'Uus vastamata vestlus'] }
        ];

        
        for (const { title, labels } of switchSections) {
            const titleLocator = drawerBody.locator(`p.h6:has-text("${title}")`);
            await expect(titleLocator).toBeVisible();

            for (const label of labels) {
                // Use nth() to select the first occurrence if there are multiple elements
                const labelLocator = drawerBody.locator(`label.switch__label:has-text("${label}")`).first();
                await expect(labelLocator).toBeVisible();

                // Ensure the switch button for this label is visible
                const switchLocator = labelLocator.locator('..').locator('button');
                await expect(switchLocator).toBeVisible();
            }
        }
    });
});
