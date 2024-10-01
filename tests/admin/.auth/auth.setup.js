const fs = require('fs'); // Import Node.js file system module
const path = require('path'); // Import Node.js path module
import { test as setup } from '@playwright/test';
import { getTranslations } from '../../translations/languageDetector';

const authFile = 'tests/admin/.auth/user.json';

    let translation 

setup('authenticate', async ({ page }) => {
    // Ensure the .auth directory exists
    if (!fs.existsSync(path.dirname(authFile))) {
        fs.mkdirSync(path.dirname(authFile), { recursive: true });
    }

    translation = await getTranslations(page)

    // Navigate to the login page
    await page.goto('https://admin.prod.buerokratt.ee/en/log-in');

    // Perform login steps
    await page.getByRole('button', { name: `${translation.enterViaTara}`}).click();
    await page.getByRole('link', { name: 'Smart-ID', exact: true }).click();
    await page.locator('.c-tab-login__nav-item').nth(2).click()
    await page.getByRole('textbox', { name: `${translation.idCode}` }).click();
    await page.getByRole('textbox', { name: `${translation.idCode}` }).fill('30303039914');
    await page.getByRole('button', { name: `${translation.continue}` }).click();

    // Wait for the navigation to the authenticated page
    await page.waitForURL('https://admin.prod.buerokratt.ee/chat/active');

    // Save the authentication state
    await page.context().storageState({ path: authFile });
});
