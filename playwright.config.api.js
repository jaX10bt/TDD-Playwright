import { defineConfig } from '@playwright/test';
export default defineConfig({
    testDir: './tests',
    forbidOnly: !!process.env.CI,
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 1,
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    use: {
        baseURL: 'https://ruuter.test.buerokratt.ee/v2/private/backoffice/agents/',
        headless: true,
    },

    reporter: [
        ['html', { open: 'always' }], // Generates the HTML report
        ['list', { printSteps: true }], // Generates the line-based report
    ],
});