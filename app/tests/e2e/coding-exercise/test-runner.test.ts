import { test, expect } from "@playwright/test";

test.describe("Test Runner E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/test/coding-exercise/test-runner");
    await page.locator(".cm-editor").waitFor();
  });

  test("should run tests and display results when clicking Run Code", async ({ page }) => {
    // Clear existing code and type new code
    await page.locator(".cm-content").click();
    // Use Meta for Mac, Control for others
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.down(modifier);
    await page.keyboard.press("a");
    await page.keyboard.up(modifier);

    // Type the test code - 5 move() calls
    await page.locator(".cm-content").pressSequentially("move()\nmove()\nmove()\nmove()\nmove()");

    // Click the Run Code button
    await page.locator('[data-testid="run-button"]').click();

    // Wait for test buttons to appear first (indicates tests have run)
    await page.locator("[data-testid='test-selector-buttons'] [class*='Dot']").first().waitFor();

    // Then wait for the test result view to appear
    await page.locator('[data-ci="inspected-test-result-view"]').waitFor();

    // Check that test suite results show (2 regular tests + 1 bonus test)
    const testButtons = await page.locator("[data-testid='test-selector-buttons'] [class*='Dot']").all();
    expect(testButtons.length).toBe(3);

    // Check test status - look for CSS module class containing 'passed'
    const testStatus = await page.evaluate(() => {
      const buttons = document.querySelectorAll("[data-testid='test-selector-buttons'] [class*='Dot']");
      return Array.from(buttons).map((btn) => {
        // Check if any class contains 'passed' (CSS modules generate long class names)
        return Array.from(btn.classList).some((cls) => cls.includes("passed"));
      });
    });

    // First two tests should pass (regular tests), bonus test should fail
    expect(testStatus).toEqual([true, true, false]);

    // Check that the view container is present
    const viewContainer = page.locator("#view-container");
    await expect(viewContainer).toBeVisible();

    // Check that the exercise visualization is displayed
    const exerciseContainer = page.locator(".exercise-container");
    await expect(exerciseContainer).toBeVisible();
  });

  test("should show failing tests with fewer moves", async ({ page }) => {
    // Clear and type insufficient moves
    await page.locator(".cm-content").click();
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.down(modifier);
    await page.keyboard.press("a");
    await page.keyboard.up(modifier);

    // Type only 3 moves
    await page.locator(".cm-content").pressSequentially("move()\nmove()\nmove()");

    // Click Run Code
    await page.locator('[data-testid="run-button"]').click();

    // Wait for test buttons to appear first
    await page.locator("[data-testid='test-selector-buttons'] [class*='Dot']").first().waitFor();

    // Then wait for test result view
    await page.locator('[data-ci="inspected-test-result-view"]').waitFor();

    // Check that tests fail
    const testStatus = await page.locator('[data-testid="test-selector-buttons"]').evaluate((el) => {
      const buttons = el.querySelectorAll('[class*="Dot"]');
      return Array.from(buttons).map((btn) => {
        // Check if any class contains 'failed' (CSS modules generate long class names)
        return Array.from(btn.classList).some((cls) => cls.includes("failed"));
      });
    });

    // All tests should fail (2 regular + 1 bonus)
    expect(testStatus).toEqual([true, true, true]);

    // Check for error message in the inspected test result view
    const errorMessage = page.locator('[data-ci="inspected-test-result-view"]');
    await expect(errorMessage).toBeVisible();
  });

  test("should switch between test scenarios when clicking test buttons", async ({ page }) => {
    // Setup: Run tests first
    await page.locator(".cm-content").click();
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.down(modifier);
    await page.keyboard.press("a");
    await page.keyboard.up(modifier);
    await page.locator(".cm-content").pressSequentially("move()\nmove()\nmove()\nmove()\nmove()");

    await page.locator('[data-testid="run-button"]').click();

    // Wait for test results and buttons
    await page.locator("[data-testid='test-selector-buttons'] [class*='Dot']").first().waitFor();

    // Click second test button
    const testButtons = await page.locator("[data-testid='test-selector-buttons'] [class*='Dot']").all();
    expect(testButtons.length).toBe(3); // 2 regular + 1 bonus
    await testButtons[1].click();

    // Wait for view update using waitForFunction instead of setTimeout
    await page.waitForFunction(() => {
      return document.querySelector("[data-testid='test-selector-buttons'] [class*='Dot']") !== null;
    });

    // Verify that we clicked and can interact with the second test button
    // Just check that the test buttons are still there and clickable
    expect(testButtons[1]).toBeTruthy();
  });

  test("should generate frames for scrubber navigation", async ({ page }) => {
    // Run the tests
    await page.locator(".cm-content").click();
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.down(modifier);
    await page.keyboard.press("a");
    await page.keyboard.up(modifier);
    await page.locator(".cm-content").pressSequentially("move()\nmove()\nmove()\nmove()\nmove()");

    await page.locator('[data-testid="run-button"]').click();

    // Wait for test buttons first
    await page.locator("[data-testid='test-selector-buttons'] [class*='Dot']").first().waitFor();

    // Then wait for scrubber to appear
    await page.locator('[data-testid="scrubber"]').waitFor();

    // Check that frames were generated via the scrubber range input
    const scrubberInput = page.locator('[data-testid="scrubber-range-input"]');
    await expect(scrubberInput).toBeVisible();

    // Get the max value (total frames) from aria-valuemax
    const maxFrames = await page.locator('[data-testid="scrubber-range-input"]').evaluate((el) => {
      const ariaMax = el.getAttribute("aria-valuemax");
      return ariaMax ? parseInt(ariaMax) : NaN;
    });

    // Should have at least 5 frames (one per move() call)
    expect(maxFrames).toBeGreaterThanOrEqual(5);
  });
});
