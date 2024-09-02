import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('https://admin.test.buerokratt.ee/chat/active');
    await page.getByRole('button', { name: 'Kustutamiseks' }).click();
    await expect(page.locator('.drawer')).toBeVisible({ timeout: 5000 });
});

test.describe("switch button functionality", () => {
    test('toggle switches and verify state changes', async ({ page }) => {
        const autoCorrectorSwitch = page.locator('button#\\:r2\\:');
        await autoCorrectorSwitch.click();
        await expect(autoCorrectorSwitch).toHaveAttribute('aria-checked', 'true');
        await autoCorrectorSwitch.click();
        await expect(autoCorrectorSwitch).toHaveAttribute('aria-checked', 'false');

        const emailNotificationSwitch1 = page.locator('button#\\:r3\\:');
        await emailNotificationSwitch1.click();
        await expect(emailNotificationSwitch1).toHaveAttribute('aria-checked', 'true');
        await emailNotificationSwitch1.click();
        await expect(emailNotificationSwitch1).toHaveAttribute('aria-checked', 'false');

        const emailNotificationSwitch2 = page.locator('button#\\:r4\\:');
        await emailNotificationSwitch2.click();
        await expect(emailNotificationSwitch2).toHaveAttribute('aria-checked', 'true');
        await emailNotificationSwitch2.click();
        await expect(emailNotificationSwitch2).toHaveAttribute('aria-checked', 'false');

        const voiceNotificationSwitch1 = page.locator('button#\\:r5\\:');
        await voiceNotificationSwitch1.click();
        await expect(voiceNotificationSwitch1).toHaveAttribute('aria-checked', 'false');
        await voiceNotificationSwitch1.click();
        await expect(voiceNotificationSwitch1).toHaveAttribute('aria-checked', 'true');

        const voiceNotificationSwitch2 = page.locator('button#\\:r6\\:');
        await voiceNotificationSwitch2.click();
        await expect(voiceNotificationSwitch2).toHaveAttribute('aria-checked', 'false');
        await voiceNotificationSwitch2.click();
        await expect(voiceNotificationSwitch2).toHaveAttribute('aria-checked', 'true');

        const popupNotificationSwitch1 = page.locator('button#\\:r7\\:');
        await popupNotificationSwitch1.click();
        await expect(popupNotificationSwitch1).toHaveAttribute('aria-checked', 'false');
        await popupNotificationSwitch1.click();
        await expect(popupNotificationSwitch1).toHaveAttribute('aria-checked', 'true');

        const popupNotificationSwitch2 = page.locator('button#\\:r8\\:');
        await popupNotificationSwitch2.click();
        await expect(popupNotificationSwitch2).toHaveAttribute('aria-checked', 'false');
        await popupNotificationSwitch2.click();
        await expect(popupNotificationSwitch2).toHaveAttribute('aria-checked', 'true');
    });
})