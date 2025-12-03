import type { FullConfig } from "@playwright/test";
import { chromium } from "@playwright/test";

async function globalSetup(_config: FullConfig) {
  // Only run warmup in CI or when explicitly requested (to avoid slow local dev iteration)
  const shouldWarmup = process.env.CI || process.env.WARMUP === "true";

  if (!shouldWarmup) {
    // eslint-disable-next-line no-console
    console.log("⏭️  Skipping global setup warmup (not in CI, set WARMUP=true to enable)");
    return;
  }

  // eslint-disable-next-line no-console
  console.log("🔧 Global setup: Warming up Next.js dev server...");

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Warm up critical routes to trigger Next.js compilation
    const routes = [
      "/test/test-buttons",
      "/test/quiz",
      "/test/coding-exercise/io-test-runner",
      "/test/coding-exercise/test-runner",
      "/test/coding-exercise/orchestrator-codemirror",
      "/test/coding-exercise/breakpoint-gutter",
      "/test/coding-exercise/code-folding",
      "/test/coding-exercise/scrubber-input",
      "/test/coding-exercise/breakpoint-stepper-buttons",
      "/test/coding-exercise/frame-stepper-buttons",
      "/auth/login",
      "/auth/signup",
      "/auth/forgot-password",
      "/auth/reset-password?token=test"
    ];

    for (const route of routes) {
      // eslint-disable-next-line no-console
      console.log(`  - Warming up ${route}...`);
      await page.goto(`http://localhost:3081${route}`);
      // Wait for the page to be fully loaded
      await page.waitForLoadState("networkidle");
    }

    // eslint-disable-next-line no-console
    console.log("✅ Global setup complete: All routes warmed up");
  } finally {
    await browser.close();
  }
}

export default globalSetup;
