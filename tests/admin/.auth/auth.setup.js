const fs = require('fs'); // Import Node.js file system module
const path = require('path'); // Import Node.js path module
import { test as setup } from '@playwright/test';

// Define the path to the auth file relative to the project root
const authFile = 'tests/.auth/user.json';

setup('authenticate', async ({ page }) => {
    // Ensure the .auth directory exists
    if (!fs.existsSync(path.dirname(authFile))) {
        fs.mkdirSync(path.dirname(authFile), { recursive: true });
    }

    // Navigate to the login page
    await page.goto('https://admin.test.buerokratt.ee/et/log-in');

    // Perform login steps
    await page.getByRole('button', { name: 'sisene TARA kaudu' }).click();
    await page.getByRole('link', { name: 'Smart-ID', exact: true }).click();
    await page.getByRole('textbox', { name: 'Isikukood' }).click();
    await page.getByRole('textbox', { name: 'Isikukood' }).fill('30303039914');
    await page.getByRole('button', { name: 'Jätka' }).click();

    // Wait for the navigation to the authenticated page
    await page.waitForURL('https://admin.test.buerokratt.ee/chat/active');

    // Save the authentication state
    await page.context().storageState({ path: authFile });
});