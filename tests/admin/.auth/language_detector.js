import fs from 'fs';
import path from 'path';
import { translations } from '../landingPage/mainPage/sideBar/administration/chatbot/appearance_and_behavior/translations.js';

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

export function getTranslationsForLocale(targetOrigin, targetName) {
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
    if (!translations[locale]) {
        console.warn(`No translations found for locale: ${locale}`);
        return null;
    }

    return translations[locale];
}