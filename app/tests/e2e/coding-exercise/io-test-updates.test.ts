import { test, expect } from "@playwright/test";

test.describe("IO Test Updates E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/coding-exercise/io-test-runner");
    await page.locator(".cm-editor").waitFor();

    // Enter valid code to get test results
    await page.locator(".cm-content").click();
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.press(`${modifier}+a`);
    await page.locator(".cm-content").pressSequentially('function acronym with phrase do\n  return "CAT"\nend');

    // Run tests
    await page.locator('[data-testid="run-button"]').click();
    await page.locator('[data-ci="inspected-test-result-view"]').waitFor();
  });

  test("should update actual value when running code multiple times", async ({ page }) => {
    // Check first run - first scenario selected (first failing), actual "CAT", expected "PNG"
    let firstExpect = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getFirstExpect();
    });

    expect(firstExpect.actual).toBe("CAT");
    expect(firstExpect.expected).toBe("PNG");
    expect(firstExpect.pass).toBe(false);

    // Change code to return "PNG" (correct for first scenario, wrong for second)
    await page.locator(".cm-content").click();
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.press(`${modifier}+a`);
    await page.locator(".cm-content").pressSequentially('function acronym with phrase do\n  return "PNG"\nend');

    // Run tests again
    await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      void orchestrator.runCode();
    });

    // Wait for orchestrator state to update - smart selection picks first failing test ("ror")
    // since "png" now passes but "ror" still fails
    await page.waitForFunction(() => {
      const orchestrator = (window as any).testOrchestrator;
      const state = orchestrator.getStore().getState();
      return state.testSuiteResult !== null && state.currentTest?.slug === "ror";
    });

    // Check second run - smart selection moved to "ror" (first failing)
    // actual is "PNG" (what code returned), expected is "ROR"
    firstExpect = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getFirstExpect();
    });

    expect(firstExpect.actual).toBe("PNG");
    expect(firstExpect.expected).toBe("ROR");
    expect(firstExpect.pass).toBe(false);
  });
});
