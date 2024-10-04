import {getTranslations} from '../../../../../../translations/languageDetector'

// Function to open dialog
export async function openDialog(page, buttonText) {
    
    const button = await page.locator(`button:has-text("${buttonText}")`);
    await button.click();

    const dialog = await page.locator('.dialog--default');
    return await dialog.isVisible();
}

// Function to ensure chat is selected
export async function selectFirstChat(page) {
    const buttons = await page.locator('.vertical-tabs__trigger');
    const buttonCount = await buttons.count();
    if (buttonCount === 0) {
        //console.log('No unanswered chats available');
        return false;
    }

    await buttons.first().click();
    return true;
}


export async function takeOverFirstChat(page) {
    // Get translations for the buttons and labels
    const translations = await getTranslations(page);

    // Attempt to select the first chat
    const chatOpened = await selectFirstChat(page);
    if (!chatOpened) {
        console.log("No chat was opened.");
        return false;  // No chat found or opened
    }

    // Click the "Võta üle" (take over) button
    const takeOverButton = await page.locator(`button:has-text("${translations.takeOver}")`);

    // Check if the "Võta üle" button is visible and enabled before clicking
    if (await takeOverButton.isVisible() && await takeOverButton.isEnabled()) {
        await takeOverButton.click();
        //console.log("Chat taken over successfully.");
        return true;  // Chat taken over successfully
    } else {
        console.log("Take over button not visible or not enabled.");
        return false;  // Take over failed
    }
}

