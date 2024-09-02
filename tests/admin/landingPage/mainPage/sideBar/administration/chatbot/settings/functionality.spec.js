import { test, expect } from '@playwright/test';

test.describe('Functionality Tests with State Reset for Settings Page', () => {

    let originalRobotActiveState;
    let originalShowAdvisorNameState;
    let originalShowAdvisorTitleState;

    test.beforeEach(async ({ page }) => {
        // Navigate to the settings page before each test
        await page.goto('https://admin.test.buerokratt.ee/chat/chatbot/settings'); // Replace with your actual page URL

        // Capture the original states of the switches
        originalRobotActiveState = await page.locator('label:has-text("Vestlusrobot aktiivne") + button.switch__button').getAttribute('data-state');
        originalShowAdvisorNameState = await page.locator('label:has-text("Kuva nõustaja nimi") + button.switch__button').getAttribute('data-state');
        originalShowAdvisorTitleState = await page.locator('label:has-text("Kuva nõustaja tiitel") + button.switch__button').getAttribute('data-state');
    });

    test('Test toggling of all switches and saving their state', async ({ page }) => {
        // Locate all switches
        test.info().annotations.push({
            type: 'Known bug',
            description: 'There is a bug regarding this test as its supposed to turn the switches on after first press but its first state is checked while the UI remains as if its unchecked meaning the first press only makes the state unchecked and thus nothing changes for the user in regard to UI. This is the action sequence ==> Open page => Switch appears unchecked => Inspect the element => Element says its state is checked => Click the element => Switch doesnt change appearance but state changes to unchecked.',
        })
        test.info().annotations.push({
            type: 'TODO',
            description: 'Since this functionality is related to the widgets functionality, they should be tested together.',
        })

        const robotActiveSwitch = page.locator('label:has-text("Vestlusrobot aktiivne") + button.switch__button');
        const showAdvisorNameSwitch = page.locator('label:has-text("Kuva nõustaja nimi") + button.switch__button');
        const showAdvisorTitleSwitch = page.locator('label:has-text("Kuva nõustaja tiitel") + button.switch__button');

        // Function to toggle and verify a switch
        async function toggleSwitch(switchLocator) {
            const initialState = await switchLocator.getAttribute('data-state');
            const expectedState = initialState === 'checked' ? 'unchecked' : 'checked';

            // Toggle the switch
            await switchLocator.click();

            // Verify the state has changed
            await expect(switchLocator).toHaveAttribute('data-state', expectedState);
        }

        // Toggle each switch and verify functionality
        await toggleSwitch(robotActiveSwitch);
        await toggleSwitch(showAdvisorNameSwitch);
        await toggleSwitch(showAdvisorTitleSwitch);

        // Click the "Salvesta" button to save changes
        const saveButton = page.locator('button:has-text("Salvesta")');
        await saveButton.click();

        // Reload the page to verify changes persist
        await page.reload();

        // Verify the states are correctly saved and reloaded
        await expect(robotActiveSwitch).toHaveAttribute('data-state', 'unchecked');
        await expect(showAdvisorNameSwitch).toHaveAttribute('data-state', 'unchecked');
        await expect(showAdvisorTitleSwitch).toHaveAttribute('data-state', 'unchecked');

        // Toggle back the switches to their original state
        async function resetSwitch(switchLocator, originalState) {
            const currentState = await switchLocator.getAttribute('data-state');
            if (currentState !== originalState) {
                await switchLocator.click();
            }
            await expect(switchLocator).toHaveAttribute('data-state', originalState);
        }

        await resetSwitch(robotActiveSwitch, originalRobotActiveState);
        await resetSwitch(showAdvisorNameSwitch, originalShowAdvisorNameState);
        await resetSwitch(showAdvisorTitleSwitch, originalShowAdvisorTitleState);

        // Save the restored original states
        await saveButton.click();

        // Reload the page again to verify final state
        await page.reload();

        // Verify the states are correctly restored to their original values
        await expect(robotActiveSwitch).toHaveAttribute('data-state', originalRobotActiveState);
        await expect(showAdvisorNameSwitch).toHaveAttribute('data-state', originalShowAdvisorNameState);
        await expect(showAdvisorTitleSwitch).toHaveAttribute('data-state', originalShowAdvisorTitleState);
    });

});
