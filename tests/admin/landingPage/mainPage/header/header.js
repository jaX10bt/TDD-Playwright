// HeaderTests function that encapsulates header-related tests
async function headerTests(page, translations) {

    // Function to check banner visibility
    const checkTopBannerVisibility = async () => {
        const header = page.locator('header');
        const isVisible = await header.isVisible();
        if (!isVisible) throw new Error('Top banner is not visible');
    };

    // Function to check the bürokratt logo visibility
    const checkLogoVisibility = async () => {
        const header = page.locator('header');
        const logo = header.getByRole('img');
        const isVisible = await logo.isVisible();
        if (!isVisible) throw new Error('Bürokratt logo is not visible');
    };

    // Function to check unanswered/forwarded text in top banner
    const checkUnansweredForwardedText = async () => {
        const regexPattern = new RegExp(`\\d+ ${translations.unanswered} \\d+ ${translations.forwarded}`);
        const header = page.locator('header');
        const p = header.locator('.track p');
        const isVisible = await p.isVisible();
        if (!isVisible) throw new Error('Unanswered/Forwarded text is not visible');

        const text = await p.textContent();
        if (!regexPattern.test(text)) throw new Error('Text format does not match the expected unanswered/forwarded format');
    };

    // Function to check profile settings and info button visibility
    const checkProfileSettingsAndInfoButton = async () => {
        const header = page.locator('header');
        const button = header.locator('button.btn.btn--text.btn--m').first();
        const isVisible = await button.isVisible();
        if (!isVisible) throw new Error('Profile settings and info button is not visible');
    };

    // Function to check logout button visibility
    const checkLogoutButtonVisibility = async () => {
        const header = page.locator('header');
        const logoutButton = header.getByRole('button', { name: translations.logout });
        const isVisible = await logoutButton.isVisible();
        if (!isVisible) throw new Error('Logout button is not visible');
    };

    const checkStatusSwitchButtonColorChange = async () => {
        const header = page.locator('header');
        const button = header.locator('.switch__button');
        const initialColor = await button.evaluate(el => getComputedStyle(el).backgroundColor);


        const button2 = header.locator('.btn.btn--text.btn--m').first();
        const initialStatusColor = await button.evaluate(el => getComputedStyle(el).backgroundColor);

        await button.click();

        await page.waitForTimeout(400); // for animation time

        const newColor = await button.evaluate(el => getComputedStyle(el).backgroundColor);
        if (newColor === initialColor) throw new Error('Button background color did not change');

        const newStatusColor = await button2.evaluate(el => getComputedStyle(el).backgroundColor);
        if (newStatusColor === initialStatusColor) throw new Error('Active status dot color did not change');
    };

    const runAllTests = async () => {
        await Promise.all([
            checkTopBannerVisibility(),
            checkLogoVisibility(),
            checkUnansweredForwardedText(),
            checkProfileSettingsAndInfoButton(),
            checkLogoutButtonVisibility(),
            checkStatusSwitchButtonColorChange(),
        ]);
    };

    return { runAllTests };
}

export default headerTests;
