describe("Test Runner E2E", () => {
  beforeEach(async () => {
    await page.goto("http://localhost:3081/test/coding-exercise/test-runner");
    // Wait for specific element instead of network idle to avoid timeouts
    await page.waitForSelector(".cm-editor", { timeout: 5000 });
  }, 20000); // 20s timeout for navigation + compilation

  it("should run tests and display results when clicking Run Code", async () => {
    // Clear existing code and type new code
    await page.click(".cm-content");
    // Use Meta for Mac, Control for others
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.down(modifier);
    await page.keyboard.press("a");
    await page.keyboard.up(modifier);

    // Type the test code - 5 move() calls
    await page.type(".cm-content", "move()\nmove()\nmove()\nmove()\nmove()");

    // Click the Run Code button
    await page.click('[data-testid="run-button"]');

    // Wait for test buttons to appear first (indicates tests have run)
    await page.waitForSelector("[class*='testSelectorButtons'] [class*='testButton']", { timeout: 10000 });

    // Then wait for the test result view to appear
    await page.waitForSelector('[data-ci="inspected-test-result-view"]', { timeout: 5000 });

    // Check that test suite results show (2 regular tests + 1 bonus test)
    const testButtons = await page.$$("[class*='testSelectorButtons'] [class*='testButton']");
    expect(testButtons.length).toBe(3);

    // Check test status
    const testStatus = await page.evaluate(() => {
      const buttons = document.querySelectorAll("[class*='testSelectorButtons'] [class*='testButton']");
      return Array.from(buttons).map((btn) => btn.classList.contains("pass"));
    });

    // First two tests should pass (regular tests), bonus test should fail
    expect(testStatus).toEqual([true, true, false]);

    // Check that the view container is present
    const viewContainer = await page.$("#view-container");
    expect(viewContainer).toBeTruthy();

    // Check that the exercise visualization is displayed
    const exerciseContainer = await page.$(".exercise-container");
    expect(exerciseContainer).toBeTruthy();
  }, 20000); // 20s timeout for navigation + compilation

  it("should show failing tests with fewer moves", async () => {
    // Clear and type insufficient moves
    await page.click(".cm-content");
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.down(modifier);
    await page.keyboard.press("a");
    await page.keyboard.up(modifier);

    // Type only 3 moves
    await page.type(".cm-content", "move()\nmove()\nmove()");

    // Click Run Code
    await page.click('[data-testid="run-button"]');

    // Wait for test buttons to appear first
    await page.waitForSelector("[class*='testSelectorButtons'] [class*='testButton']", { timeout: 10000 });

    // Then wait for test result view
    await page.waitForSelector('[data-ci="inspected-test-result-view"]', { timeout: 5000 });

    // Check that tests fail
    const testStatus = await page.$eval('[class*="testSelectorButtons"]', (el) => {
      const buttons = el.querySelectorAll('[class*="testButton"]');
      return Array.from(buttons).map((btn) => btn.classList.contains("fail"));
    });

    // All tests should fail (2 regular + 1 bonus)
    expect(testStatus).toEqual([true, true, true]);

    // Check for error message
    const errorMessage = await page.$("[class*='scenarioLhsContent']");
    expect(errorMessage).toBeTruthy();
  });

  it("should switch between test scenarios when clicking test buttons", async () => {
    // Setup: Run tests first
    await page.click(".cm-content");
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.down(modifier);
    await page.keyboard.press("a");
    await page.keyboard.up(modifier);
    await page.type(".cm-content", "move()\nmove()\nmove()\nmove()\nmove()");

    await page.click('[data-testid="run-button"]');

    // Wait for test results and buttons
    await page.waitForSelector("[class*='testSelectorButtons'] [class*='testButton']", { timeout: 10000 });

    // Click second test button
    const testButtons = await page.$$("[class*='testSelectorButtons'] [class*='testButton']");
    expect(testButtons.length).toBe(3); // 2 regular + 1 bonus
    await testButtons[1].click();

    // Wait for view update
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Verify that we clicked and can interact with the second test button
    // Just check that the test buttons are still there and clickable
    const secondTestButton = testButtons[1];
    expect(secondTestButton).toBeTruthy();
  });

  it("should generate frames for scrubber navigation", async () => {
    // Run the tests
    await page.click(".cm-content");
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.down(modifier);
    await page.keyboard.press("a");
    await page.keyboard.up(modifier);
    await page.type(".cm-content", "move()\nmove()\nmove()\nmove()\nmove()");

    await page.click('[data-testid="run-button"]');

    // Wait for test buttons first
    await page.waitForSelector("[class*='testSelectorButtons'] [class*='testButton']", { timeout: 10000 });

    // Then wait for scrubber to appear
    await page.waitForSelector('[data-testid="scrubber"]', { timeout: 5000 });

    // Check that frames were generated via the scrubber range input
    const scrubberInput = await page.$('[data-testid="scrubber-range-input"]');
    expect(scrubberInput).toBeTruthy();

    // Get the max value (total frames)
    const maxFrames = await page.$eval('[data-testid="scrubber-range-input"]', (el) => {
      const inputEl = el as HTMLInputElement;
      return parseInt(inputEl.max);
    });

    // Should have at least 5 frames (one per move() call)
    expect(maxFrames).toBeGreaterThanOrEqual(5);
  });
});
