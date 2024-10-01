async function SidebarTests(page, translation) {
    const masterTabs = [
        translation.conversations,
        translation.training,
        translation.analytics,
        translation.administration
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
                    throw new Error(`Failed to open tab: ${tab}`); // Throw an error if the tab isn't open
                }
            }
        }
    };

    // Function to check that subtabs are not visible when the conversations tab is closed
    const checkSubtabsVisibilityWhenClosed = async () => {
        const unansweredVisible = await page.getByRole('link', { name: translation.unanswered, exact: true }).isVisible();
        const activeVisible = await page.getByRole('link', { name: translation.active, exact: true }).isVisible();
        const historyVisible = await page.getByRole('link', { name: translation.history, exact: true }).isVisible();
        const pendingVisible = await page.getByRole('link', { name: translation.pending, exact: true }).isVisible();

        if (!unansweredVisible || !activeVisible || !historyVisible || !pendingVisible) {
            throw new Error('Subtabs are not visible when the conversations tab is closed.');
        }

        await page.getByRole('button', { name: translation.conversations, exact: true }).click();

        const isUnansweredVisible = await page.getByRole('link', { name: translation.unanswered, exact: true }).isVisible();
        const isActiveVisible = await page.getByRole('link', { name: translation.active, exact: true }).isVisible();
        const isHistoryVisible = await page.getByRole('link', { name: translation.history, exact: true }).isVisible();
        const isPendingVisible = await page.getByRole('link', { name: translation.pending, exact: true }).isVisible();

        if (isUnansweredVisible || isActiveVisible || isHistoryVisible || isPendingVisible) {
            throw new Error('Subtabs are visible when the conversations tab is closed.');
        }
    };

    // Function to check tab and subtabs after refresh
    const checkTabAndSubtabsAfterRefresh = async () => {
        // Check if the training tab is already active before clicking
        const trainingButton = page.getByRole('button', { name: translation.training, exact: true }).nth(1);
        let ariaExpanded = await trainingButton.getAttribute('aria-expanded');

        if (ariaExpanded === 'false' || ariaExpanded === null) {
            await trainingButton.click();  // Click only if inactive
        } else {
            console.log('Training tab is already active, no need to click.');
        }

        // Check if historical conversations tab is already active before clicking
        const historicalConversationsButton = page.getByRole('button', { name: translation.historicalConversations, exact: true });
        ariaExpanded = await historicalConversationsButton.getAttribute('aria-expanded');

        if (ariaExpanded === 'false' || ariaExpanded === null) {
            await historicalConversationsButton.click();  // Click only if inactive
        } else {
            console.log('Historical Conversations tab is already active, no need to click.');
        }

        // Check if modelbank and analysis tab is already active before clicking
        const modelbankAndAnalysisButton = page.getByRole('button', { name: translation.modelbankAndAnalysis, exact: true });
        ariaExpanded = await modelbankAndAnalysisButton.getAttribute('aria-expanded');

        if (ariaExpanded === 'false' || ariaExpanded === null) {
            await modelbankAndAnalysisButton.click();  // Click only if inactive
        } else {
            console.log('Modelbank and Analysis tab is already active, no need to click.');
        }



        const isThemesVisible = await page.getByRole('link', { name: translation.themes, exact: true }).isVisible();
        const isAnswersVisible = await page.getByRole('link', { name: translation.answers, exact: true }).isVisible();
        const isUserStoriesVisible = await page.getByRole('link', { name: translation.userStories, exact: true }).isVisible();
        const isHistoryVisible = await page.getByRole('link', { name: translation.history, exact: true }).isVisible();
        const isOverviewVisible = await page.getByRole('link', { name: translation.overviewOfTopics, exact: true }).isVisible();
        const isComparisonVisible = await page.getByRole('link', { name: translation.comparisonOfModels, exact: true }).isVisible();
        const isTrainNewModelVisible = await page.getByRole('link', { name: translation.trainNewModel, exact: true }).isVisible();

        if (!isThemesVisible || !isAnswersVisible || !isUserStoriesVisible || !isHistoryVisible || !isOverviewVisible || !isComparisonVisible || !isTrainNewModelVisible) {
            throw new Error('Not all subtabs are visible after refresh.');
        }
    };

    // Function to check visibility of training section links
    const checkTrainingSectionLinksVisibility = async () => {
        const overviewVisible = await page.getByRole('link', { name: translation.sidebarOverview, exact: true }).isVisible();
        const chatsVisible = await page.getByRole('link', { name: translation.chats, exact: true }).isVisible();
        const feedbackVisible = await page.getByRole('link', { name: translation.feedback, exact: true }).isVisible();
        const advisorsVisible = await page.getByRole('link', { name: translation.advisors, exact: true }).isVisible();

        if (!overviewVisible || !chatsVisible || !feedbackVisible || !advisorsVisible) {
            throw new Error('Not all training section links are visible.');
        }
    };

    // Function to activate the "Aktiivsed" tab
    const activateAktiivsedTab = async () => {
        const chatbotButton = page.getByRole('button', { name: translation.chatbot, exact: true });

        // Get the aria-expanded attribute to check if it's already active
        const ariaExpanded = await chatbotButton.getAttribute('aria-expanded');

        // Only click the chatbot button if it's not expanded (inactive)
        if (ariaExpanded === 'false' || ariaExpanded === null) {
            await chatbotButton.click();
        } else {
            console.log('Chatbot tab is already active, no need to click.');
        }

        const isUsersVisible = await page.getByRole('link', { name: translation.users, exact: true }).isVisible();
        const isSettingsVisible = await page.getByRole('link', { name: translation.settings, exact: true }).isVisible();
        const isWelcomeMessageVisible = await page.getByRole('link', { name: translation.sidebarWelcomeMessage, exact: true }).isVisible();
        const isAppearanceVisible = await page.getByRole('link', { name: translation.appearanceAndBehaviour, exact: true }).isVisible();
        const isEmergencyNoticesVisible = await page.getByRole('link', { name: translation.emergencyNotices, exact: true }).isVisible();
        const isWorkingTimeVisible = await page.getByRole('link', { name: translation.sidebarWorkingTime, exact: true }).isVisible();
        const isSessionLengthVisible = await page.getByRole('link', { name: translation.sessionLength, exact: true }).isVisible();

        if (!isUsersVisible || !isSettingsVisible || !isWelcomeMessageVisible || !isAppearanceVisible || !isEmergencyNoticesVisible || !isWorkingTimeVisible || !isSessionLengthVisible) {
            throw new Error('Not all links are visible in the "Aktiivsed" tab.');
        }
    };

    // Function to run all tests in sequence
    const runAllTests = async () => {
        await checkAllTabsVisibility();
        await checkSubtabsVisibilityWhenClosed();
        await checkTabAndSubtabsAfterRefresh();
        await checkTrainingSectionLinksVisibility();
        await activateAktiivsedTab();
    };

    // Return an object with the runAllTests method
    return { runAllTests };
}

export default SidebarTests;
