import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Test directory
  testDir: "./tests/e2e",

  // Optionally ignore auth tests (used by main CI, auth tests run in separate workflow)
  ...(process.env.EXCLUDE_AUTH_TESTS ? { testIgnore: /auth.*\.test\.ts/ } : {}),

  // Parallel execution (default: all CPU cores)
  fullyParallel: true,

  // Fail fast on CI
  forbidOnly: !!process.env.CI,

  // Retry failed tests on CI
  retries: process.env.CI ? 2 : 0,

  // Parallel workers: unbounded locally (matches Giki), serialized in CI
  workers: process.env.CI ? 1 : undefined,

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

    // Trace on first retry
    trace: "on-first-retry"
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
    command: "pnpm next dev --turbo --port 3081",
    url: "http://local.jiki.io:3081",
    reuseExistingServer: !process.env.CI,
    timeout: process.env.CI ? 60000 : 30000,
    stdout: "pipe",
    stderr: "pipe"
  }
});
