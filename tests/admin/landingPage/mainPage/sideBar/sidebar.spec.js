import { test, expect } from '@playwright/test';
import { getTranslations } from '@translation/languageDetector.js';

test.describe('Sidebar Functionality Tests', () => {
    let translations;

    test.beforeEach(async ({ page }) => {
        // Load page and fetch translations
        await page.goto('https://admin.prod.buerokratt.ee/chat/active', {timeout: 40000});
        translations = await getTranslations(page);
    });

    const checkButtonVisibilityAndClick = async (page, tab) => {
        const button = page.getByRole('button', { name: tab, exact: true }).first();
        await expect(button).toBeVisible();

        const buttonValue = await button.getAttribute('aria-expanded');

        if (buttonValue === 'false') {
            await button.click();
            await expect(button).toHaveAttribute('aria-expanded', 'true');
        }
    };

    const checkSubtabsVisibility = async (page, subtabs) => {
        for (const subtab of subtabs) {
            const subtabLocator = page.getByRole('link', { name: subtab, exact: true });
            await expect(subtabLocator).toBeVisible();
        }
    };

    test('Open all tabs and check visibility', async ({ page }) => {
        const masterTabs = [
            translations.conversations,
            translations.training,
            translations.analytics,
            translations.administration
        ];

        for (const tab of masterTabs) {
            await checkButtonVisibilityAndClick(page, tab);
        }

        // Verify that all master tabs are visible after opening
        for (const tab of masterTabs) {
            await expect(page.getByRole('button', { name: tab, exact: true }).first()).toBeVisible();
        }
    });

    test('Check subtabs visibility for conversations', async ({ page }) => {
        const subtabs = [
            translations.unanswered,
            translations.active,
            translations.history,
            translations.pending
        ];
        await checkButtonVisibilityAndClick(page, translations.conversations);
        await checkSubtabsVisibility(page, subtabs);

        // Close the Conversations tab
        await page.getByRole('button', { name: translations.conversations, exact: true }).click();

        for (const subtab of subtabs) {
            const subtabLocator = page.getByRole('link', { name: subtab, exact: true });
            await expect(subtabLocator).not.toBeVisible();
        }
    });

    test('Check training tabs', async ({ page }) => {
        const subTabs = [
            translations.themes,
            translations.answers,
            translations.userStories,
            translations.overviewOfTopics,
            translations.comparisonOfModels,
            translations.trainNewModel
        ];

        // Check visibility and click for the Training tab
        await checkButtonVisibilityAndClick(page, translations.training);
        await page.getByRole('button', { name: translations.training, exact: true }).nth(1).click();
        await checkButtonVisibilityAndClick(page, translations.historicalConversations);
        await checkButtonVisibilityAndClick(page, translations.modelbankAndAnalysis);

        // Check visibility of subtabs under Training
        await checkSubtabsVisibility(page, subTabs);
        await page.getByRole('link', { name: translations.history, exact: true }).nth(1).click();
        // Close the Training tab
        await page.getByRole('button', { name: translations.training, exact: true }).nth(0).click();

        // Verify that all subtabs are not visible after closing the tab
        for (const subtab of subTabs) {
            const subtabLocator = page.getByRole('link', { name: subtab, exact: true });
            await expect(subtabLocator).not.toBeVisible();
        }
    });
    
    test('Check analytics tabs', async ({ page }) => {
        const subTabs = [
            translations.sidebarOverview,
            translations.chats,
            translations.feedback,
            translations.advisors
        ];

        // Check visibility and click for the Training tab
        await checkButtonVisibilityAndClick(page, translations.analytics);

        // Check visibility of subtabs under Training
        await checkSubtabsVisibility(page, subTabs);

        // Close the Training tab
        await page.getByRole('button', { name: translations.analytics, exact: true }).click();

        // Verify that all subtabs are not visible after closing the tab
        for (const subtab of subTabs) {
            const subtabLocator = page.getByRole('link', { name: subtab, exact: true });
            await expect(subtabLocator).not.toBeVisible();
        }
    });



    test('Check administration tabs', async ({ page }) => {
        const subtabs = [
            translations.users,
            translations.sidebarWorkingTime,
            translations.sessionLength,
            translations.sidebarWelcomeMessage,
            translations.appearanceAndBehaviour,
            translations.emergencyNotices,
            translations.settings
        ];
        await checkButtonVisibilityAndClick(page, translations.administration);
        await checkButtonVisibilityAndClick(page, translations.chatbot);
        await checkSubtabsVisibility(page, subtabs);

        // Close the Conversations tab
        await page.getByRole('button', { name: translations.administration, exact: true }).click();

        for (const subtab of subtabs) {
            const subtabLocator = page.getByRole('link', { name: subtab, exact: true });
            await expect(subtabLocator).not.toBeVisible();
        }
    });
});
