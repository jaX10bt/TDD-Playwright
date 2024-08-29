import { test, expect } from '@playwright/test';

const adminPage = 'https://admin.prod.buerokratt.ee/'
let response;

test.beforeEach(async ({ page }) => {
    response = await page.goto(adminPage)
});


test.describe('basic connectivity', () => {
    test('should have a page response 200', async () => {   
        expect(response.status()).toBe(200);    
    })

    test('should have correct page URL', async ({ page }) => { 
        await expect(page).toHaveURL(adminPage + 'et/log-in');
    })
})

