import {getTranslations} from '../../../../../../translations/languageDetector'

// Function to open dialog
export async function openDialog(page, buttonText) {
    console.log(buttonText)
    const button = page.locator(`button:has-text("${buttonText}")`);
    await button.click();

    const dialog = page.locator('.dialog--default');
    return await dialog.isVisible();
}

// Function to ensure chat is selected
export async function selectFirstChat(page) {
    const buttons = page.locator('button.vertical-tabs__trigger').first();
    const buttonCount = await buttons.count();

    if (buttonCount === 0) {
        console.log('No unanswered chats available');
        return false;
    }

    await buttons.first().click();
    return true;
}


export async function takeOverFirstChat(page) {
    // Select the first chat and return early if none is found
    const translations = await getTranslations(page);
    const chatOpened = await selectFirstChat(page);
    if (!chatOpened) return;

    // Click the "Võta üle" button
    const takeOverButton = page.locator(`button:has-text("${translations.takeOver}")`);
    await takeOverButton.click();
}

