import { test, expect, request } from '@playwright/test';
import { openDialog, selectFirstChat, takeOverFirstChat } from '../unanswered/helper';
// todo: cleaner path
import { getTranslations } from '../../../../../../translations/languageDetector'

test.beforeEach('test', async ({ page }) => {
    await page.goto('https://admin.prod.buerokratt.ee/chat/active');
    // page is authenticated
    const translation = await getTranslations(page);
});


test.describe('"Aktiivsed" tab visibility', async () => {

 
    test('should have the correct URL', async ({ page }) => {
        await expect(page).toHaveURL('https://admin.prod.buerokratt.ee/chat/active');
    });

    test('should have "Minu vestlused" header', async ({ page }) => {
        const header = page.locator('div.vertical-tabs__group-header');
        await expect(header).toBeVisible();
    })

    test('should have "Minu vestlused" vertical tabs', async ({ page }) => {
        const verticalTabs = page.locator('div.vertical-tabs__list');
        await expect(verticalTabs).toBeVisible();
    })

});

test.describe('"Aktiivsed" tab body visibility', () => {

    test.beforeEach('test2', async ({ page }) => {
        // This needs to be runned because 
        await page.goto('https://admin.prod.buerokratt.ee/chat/unanswered');
       
        
        const switchButton = page.locator('.switch__button');
        if (switchButton.getAttribute('aria-expanded', 'true') !== 'true') {
            await switchButton.click();
        }


        const isChatAvailable = await takeOverFirstChat(page);

        if (!isChatAvailable) {
            console.log("No unanswered chats, making API request...");
            await provideData(page);
        }
    
        await page.goto('https://admin.prod.buerokratt.ee/chat/active');
        await selectFirstChat(page);
        
    });

    test.only('should have body', async ({ page }) => {
        
        const body = await page.waitForSelector('div.active-chat__body');
        await expect(body).toBeVisible();
    })

    test('should have header', async ({ page }) => {
        const header = page.locator('div.active-chat__header');
        await expect(header).toBeVisible();
    })

    test('should have chat wrapper', async ({ page }) => {
        const wrapper = page.locator('div.active-chat__group-wrapper');
        await expect(header).toBeVisible();
    })

    test('should have chat toolbar', async ({ page }) => {
        const toolbar = page.locator('div.active-chat__toolbar');
        await expect(toolbar).toBeVisible();
    })

    test('should have toolbar button', async ({ page }) => {
        const button = page.locator('div.active-chat__toolbar-actions button');
        await expect(button).toBeVisible();
    })

    test('should have chat side', async ({ page }) => {
        const button = page.locator('div.active-chat__side');
        await expect(button).toBeVisible();
    })


    test('Should have individual meta information fields', async ({ page }) => {
        const chatSideMeta = page.locator('div.active-chat__side-meta')
        await expect(chatSideMeta).toBeVisible();

        // Verify individual meta information fields
        const pElement = page.locator('p strong')
        await expect(pElement.filter({ hasText: /ID/ })).toBeVisible();
        await expect(pElement.filter({ hasText: /Vestleja nimi/ })).toBeVisible();
        await expect(pElement.filter({ hasText: /Vestlus alustatud/ })).toBeVisible();

        await expect(pElement.filter({ hasText: /Seade/ })).toBeVisible();
        await expect(pElement.filter({ hasText: /Lähtekoht/ })).toBeVisible();


    });
});


async function provideData(page) {

        console.log("No unanswered chats, making API request...");

        // Prepare the JSON data
        const jsonData = {
            "message": {
                "chatId": "",
                "content": "suuna mind",
                "authorTimestamp": new Date().toISOString(),  // Using the current timestamp
                "authorRole": "end-user"
            },
            "endUserTechnicalData": {
                "endUserUrl": "https://prod.buerokratt.ee/",
                "endUserOs": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
            },
            "holidays": [
                "2024-01-01",
                "2024-02-24",
                "2024-03-29",
                "2024-03-31",
                "2024-05-01",
                "2024-05-19",
                "2024-06-23",
                "2024-06-24",
                "2024-08-20",
                "2024-12-24",
                "2024-12-25",
                "2024-12-26"
            ],
            "holidayNames": "2024-01-01-uusaasta,2024-02-24-iseseisvuspäev,2024-03-29-suur reede,2024-03-31-lihavõtted,2024-05-01-kevadpüha,2024-05-19-nelipühade 1. püha,2024-06-23-võidupüha,2024-06-24-jaanipäev,2024-08-20-taasiseseisvumispäev,2024-12-24-jõululaupäev,2024-12-25-esimene jõulupüha,2024-12-26-teine jõulupüha"
        };

        // Create a new API request context
        const apiRequestContext = await request.newContext();

        // Send the POST request
        const response = await apiRequestContext.post('https://ruuter.prod.buerokratt.ee/v2/public/backoffice/chats/init', {
            headers: {
                'Content-Type': 'application/json',
            },
            data: jsonData
        });

        // Check the response status and handle errors if necessary
        if (response.ok()) {
            console.log('API request was successful.');
        } else {
            console.error(`API request failed with status: ${response.status()}`);
        }

        // Close the request context to avoid memory leaks
        await apiRequestContext.dispose();
    } 
    
