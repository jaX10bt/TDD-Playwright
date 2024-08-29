import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/cookies.json';

setup('authenticate', async ({ page }) => {
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

 // Save cookies
 await page.context().storageState({ path: authFile });
 
});