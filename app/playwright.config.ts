import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  // Test directory
  testDir: "./tests/e2e",

  // Parallel execution (default: all CPU cores)
  fullyParallel: true,

  // Fail fast on CI
  forbidOnly: !!process.env.CI,

  // Retry failed tests on CI
  retries: process.env.CI ? 2 : 0,

  // Parallel workers
  workers: process.env.CI ? 4 : undefined, // CI: 4 workers, Local: max cores

  // Test reporter
  reporter: [
    ["html", { outputFolder: "playwright-report" }],
    ["list"], // Console output
    ...(process.env.CI ? [["github" as const]] : []), // GitHub annotations
  ],

  // Global test settings
  use: {
    // Base URL for navigation
    baseURL: "http://localhost:3081",

    // Screenshot on failure
    screenshot: "only-on-failure",

    // Trace on first retry
    trace: "on-first-retry",

    // Video on failure
    video: "retain-on-failure",
  },

  // Browser projects
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  // Dev server configuration
  webServer: {
    command: "pnpm next dev --port 3081",
    url: "http://localhost:3081",
    reuseExistingServer: !process.env.CI,
    timeout: 30000,
    stdout: "pipe",
    stderr: "pipe",
  },
});
