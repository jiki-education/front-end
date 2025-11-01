describe("IO Test Updates E2E", () => {
  beforeEach(async () => {
    await page.goto("http://localhost:3070/test/coding-exercise/io-test-runner");
    await page.waitForSelector(".cm-editor", { timeout: 5000 });

    // Enter valid code to get test results
    await page.click(".cm-content");
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.down(modifier);
    await page.keyboard.press("a");
    await page.keyboard.up(modifier);
    await page.type(".cm-content", 'function acronym with phrase do\n  return "CAT"\nend');

    // Run tests
    await page.click('[data-testid="run-button"]');
    await page.waitForSelector('[data-ci="inspected-test-result-view"]', { timeout: 5000 });
  }, 20000);

  it("should update actual value when running code multiple times", async () => {
    // Wait a bit for initial results to render
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check first run - actual should be "CAT", expected should be "PNG"
    let firstExpect = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getFirstExpect();
    });

    expect(firstExpect.actual).toBe("CAT");
    expect(firstExpect.expected).toBe("PNG");
    expect(firstExpect.pass).toBe(false);

    // Change code to return "PNG" (correct answer)
    await page.click(".cm-content");
    const modifier = process.platform === "darwin" ? "Meta" : "Control";
    await page.keyboard.down(modifier);
    await page.keyboard.press("a");
    await page.keyboard.up(modifier);
    await page.type(".cm-content", 'function acronym with phrase do\n  return "PNG"\nend');

    // Run tests again
    await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      void orchestrator.runCode();
    });

    // Wait for tests to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check second run - actual should now be "PNG", expected still "PNG"
    firstExpect = await page.evaluate(() => {
      const orchestrator = (window as any).testOrchestrator;
      return orchestrator.getFirstExpect();
    });

    expect(firstExpect.actual).toBe("PNG");
    expect(firstExpect.expected).toBe("PNG");
    expect(firstExpect.pass).toBe(true);
  });
});
