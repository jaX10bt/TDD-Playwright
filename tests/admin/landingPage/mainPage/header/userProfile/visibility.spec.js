import { test, expect } from '@playwright/test';
import { getTranslations } from '../../../../../translations/languageDetector';


let translation;

test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.prod.buerokratt.ee/chat/active');
    await page.getByRole('button', { name: 'Kustutamiseks' }).click();
    await expect(page.locator('.drawer')).toBeVisible({ timeout: 5000 });
    translation = await getTranslations(page)
});

test.describe("user profile/drawer visibility", () => {
    test("should display user profile/drawer", async ({ page }) => {
        const drawer = page.locator('.drawer');
        await expect(drawer).toBeVisible();
    });

    test("should display user details in the drawer", async ({ page }) => {
        const drawerBody = page.locator('.drawer__body');
        await expect(drawerBody).toBeVisible();


        // This takes the Kusutamiseks kasutaja as the testable user
        const userInfo = [
            { label: translation.displayName, value: 'Kustutamiseks' },
            { label: translation.userRoles, value: 'Administraator' },
            { label: translation.userTitle, value: 'sir' },
            { label: translation.email, value: 'kustutamind@mail.ee' }
        ];

        for (const { label, value } of userInfo) {
            await expect(drawerBody.locator(`text=${label}`)).toBeVisible();
            // await expect(drawerBody.locator(`text=${value}`)).toBeVisible();
        }
    });

    test("should display switch elements", async ({ page }) => {
        const drawerBody = page.locator('.drawer__body');
        await expect(drawerBody).toBeVisible();

        const switchSections = [
            // { title: 'Autokorrektor', labels: ['Teksti autokorrektor'] },
            // { title: 'Märguanded e-postile', labels: ['Uus suunatud vestlus', 'Uus vastamata vestlus'] },
            { title: translation.soundNotifications, labels: [translation.newForwardedChat, translation.newUnansweredChat]  },
            { title: translation.popUpNotifications, labels: [translation.newForwardedChat, translation.newUnansweredChat] }
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
