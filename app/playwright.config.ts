import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Test directory
  testDir: "./tests/e2e",

  // Global setup - runs once before all tests
  globalSetup: "./playwright-global-setup.ts",

  // Parallel execution (default: all CPU cores)
  fullyParallel: true,

  // Fail fast on CI
  forbidOnly: !!process.env.CI,

  // Retry failed tests on CI
  retries: process.env.CI ? 2 : 0,

  // Parallel workers (limited to 4 to prevent server overload)
  workers: 4,

  // Test reporter
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["list"], // Console output
    ...(process.env.CI ? [["github"]] : []) // GitHub annotations
  ] as Array<["html", { outputFolder: string }] | ["list"] | ["github"]>,

  // Global test settings
  use: {
    // Base URL for navigation
    baseURL: "http://local.jiki.io:3081",

    // Default timeout for actions and assertions
    // CI needs longer timeouts due to slower compilation
    actionTimeout: process.env.CI ? 30000 : 5000,
    navigationTimeout: process.env.CI ? 30000 : 5000,

    // Screenshot on failure
    screenshot: "only-on-failure",

    // Trace on first retry
    trace: "on-first-retry",

    // Video on failure
    video: "retain-on-failure"
  },

  // Default timeout for expect() assertions
  expect: {
    timeout: 5000
  },

  // Browser projects
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ],

  // Dev server configuration
  webServer: {
    command: "pnpm next dev --port 3081",
    url: "http://local.jiki.io:3081",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
    stdout: "pipe",
    stderr: "pipe"
  }
});
