import fs from 'fs';
import path from 'path';

// Function to safely load user data
function loadUserData() {
    const userDataPath = path.join(process.cwd(), 'tests', 'admin', '.auth', 'user.json');

    if (fs.existsSync(userDataPath)) {
        try {
            const rawData = fs.readFileSync(userDataPath, 'utf8');
            return JSON.parse(rawData);
        } catch (error) {
            console.error(`Error reading or parsing user.json: ${error.message}`);
            return null;
        }
    } else {
        console.error('user.json file not found');
        return null;
    }
}

const userData = loadUserData();


export function getTranslationsForLocale(targetOrigin, targetName, importingDir) {
    if (!userData) {
        console.error('User data could not be loaded. Unable to get translations.');
        return null;
    }

    const originEntry = userData.origins.find(entry => entry.origin === targetOrigin);
    if (!originEntry) {
        console.warn(`No entry found for origin: ${targetOrigin}`);
        return null;
    }

    const localStorageEntry = originEntry.localStorage.find(item => item.name === targetName);
    if (!localStorageEntry) {
        console.warn(`No localStorage entry found for name: ${targetName}`);
        return null;
    }

    const locale = localStorageEntry.value;

    // Determine the appropriate folder and file based on the locale
    const localeFolder = locale === 'et' ? 'et' : 'en';
    const translationsFileName = 'common.js';

    // Dynamically resolve the path to the correct translations file
    const translationsPath = path.join(importingDir, 'TDD-Playwright', 'tests', 'translations', localeFolder, translationsFileName);

    if (!fs.existsSync(translationsPath)) {
        console.warn(`No ${translationsFileName} file found in directory: ${translationsPath}`);
        return null;
    }

    let translations;
    try {
        translations = require(translationsPath).translations;
    } catch (error) {
        console.error(`Error loading translations from ${translationsPath}: ${error.message}`);
        return null;
    }

    return translations;
}