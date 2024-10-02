async function SidebarTests(page, translations) {
    const masterTabs = [
        translations.conversations,
        translations.training,
        translations.analytics,
        translations.administration
    ];

    // Function to check visibility of all master tabs
    const checkAllTabsVisibility = async () => {
        for (const tab of masterTabs) {
            const button = page.getByRole('button', { name: tab, exact: true }).first();
            const isVisible = await button.isVisible();
            const ariaExpanded = await button.getAttribute('aria-expanded');

            if (isVisible && ariaExpanded === 'false') {
                await button.click(); // Click to open the tab
                const newAriaExpanded = await button.getAttribute('aria-expanded');
                if (newAriaExpanded !== 'true') {
                    throw new Error(`Failed to open tab: ${tab}`);
                }
            }
        }
    };

    // Function to check subtabs visibility when conversations tab is closed
    const checkSubtabsVisibilityWhenClosed = async () => {
        const subtabs = [
            translations.unanswered,
            translations.active,
            translations.history,
            translations.pending
        ];
        const areSubtabsVisible = await Promise.all(
            subtabs.map(tab => page.getByRole('link', { name: tab, exact: true }).isVisible())
        );

        if (areSubtabsVisible.includes(false)) {
            throw new Error('Some subtabs are not visible when the conversations tab is closed.');
        }

        await page.getByRole('button', { name: translations.conversations, exact: true }).click();

        const areSubtabsInvisible = await Promise.all(
            subtabs.map(tab => page.getByRole('link', { name: tab, exact: true }).isVisible())
        );

        if (areSubtabsInvisible.includes(true)) {
            throw new Error('Subtabs are visible when the conversations tab is closed.');
        }
    };

    // Function to check tab and subtabs after refresh
    const checkTabAndSubtabsAfterRefresh = async () => {
        const trainingTab = page.getByRole('button', { name: translations.training, exact: true }).nth(1);
        const historicalConversationsTab = page.getByRole('button', { name: translations.historicalConversations, exact: true });
        const modelbankAndAnalysisTab = page.getByRole('button', { name: translations.modelbankAndAnalysis, exact: true });

        for (const tab of [trainingTab, historicalConversationsTab, modelbankAndAnalysisTab]) {
            let ariaExpanded = await tab.getAttribute('aria-expanded');
            if (ariaExpanded === 'false' || ariaExpanded === null) {
                await tab.click();
            }
        }

        const subTabs = [
            translations.themes,
            translations.answers,
            translations.userStories,
            translations.history,
            translations.overviewOfTopics,
            translations.comparisonOfModels,
            translations.trainNewModel
        ];

        const allVisible = await Promise.all(subTabs.map(tab => page.getByRole('link', { name: tab, exact: true }).isVisible()));

        if (allVisible.includes(false)) {
            throw new Error('Not all subtabs are visible after refresh.');
        }
    };

    // Function to activate "Aktiivsed" tab
    const activateAktiivsedTab = async () => {
        const chatbotButton = page.getByRole('button', { name: translations.chatbot, exact: true });
        const ariaExpanded = await chatbotButton.getAttribute('aria-expanded');

        if (ariaExpanded === 'false' || ariaExpanded === null) {
            await chatbotButton.click();
        }

        const requiredLinks = [
            translations.users,
            translations.settings,
            translations.sidebarWelcomeMessage,
            translations.appearanceAndBehaviour,
            translations.emergencyNotices,
            translations.sidebarWorkingTime,
            translations.sessionLength
        ];

        const allLinksVisible = await Promise.all(requiredLinks.map(link => page.getByRole('link', { name: link, exact: true }).isVisible()));

        if (allLinksVisible.includes(false)) {
            throw new Error('Not all links are visible in the "Aktiivsed" tab.');
        }
    };

    // Function to run all tests in sequence
    const runAllTests = async () => {
        await checkAllTabsVisibility();
        await checkSubtabsVisibilityWhenClosed();
        await checkTabAndSubtabsAfterRefresh();
        await activateAktiivsedTab();
    };

    // Expose runAllTests function for execution
    return { runAllTests };
}

export default SidebarTests;
