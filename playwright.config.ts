import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 4 : undefined,
  timeout: 30_000,
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      threshold: 0.2,
    },
  },

  // CI uses blob reporter so shards can be merged into one HTML report.
  // Local runs default to the rich HTML + list combo.
  reporter: process.env.PW_REPORTER === 'blob'
    ? [['blob']]
    : [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: process.env.BASE_URL ?? 'https://www.volygroup.com',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    // Trace every test in CI so the published report includes time-travel debugging
    trace: process.env.CI ? 'on' : 'on-first-retry',
  },

  projects: [
    // Cross-browser projects: run all e2e tests, exclude visual
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: ['**/visual/**'],
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      testIgnore: ['**/visual/**'],
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
      testIgnore: ['**/visual/**'],
    },

    // Responsive projects: chromium engine, different viewports
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 7'] },
      testIgnore: ['**/visual/**'],
    },
    {
      name: 'tablet',
      use: { ...devices['iPad (gen 7)'] },
      testIgnore: ['**/visual/**'],
    },

    // Focused stakeholder visual checks: opt-in because diffs need review
    {
      name: 'visual-chromium',
      testMatch: ['**/visual/**/*.spec.ts'],
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1366, height: 768 },
        deviceScaleFactor: 1,
      },
    },
  ],
});
