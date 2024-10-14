// @ts-check
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: false,

  retries: process.env.CI ? 2 : 1,
  /* Opt out of parallel tests on CI. */
  //workers: process.env.CI ? 4 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [
    ['html', { open: 'always' }], // Generates the HTML report
    ['list', { printSteps: true }], // Generates the line-based report
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    //storageState: 'tests/admin/.auth/user.json',
    video: 'on',
    screenshot: 'only-on-failure',
    trace: 'on',
    baseURL: 'https://prod.buerokratt.ee/'
  },
  /* Configure projects for major browsers */
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.js/ },
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'],
              storageState: 'tests/admin/.auth/user.json',
      },
      dependencies: ['setup'],
      workers: 1,
    },
  ],
});
