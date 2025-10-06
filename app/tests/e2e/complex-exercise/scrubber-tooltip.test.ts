describe("Scrubber Tooltip E2E", () => {
  beforeEach(async () => {
    await page.goto("http://localhost:3070/test/complex-exercise/scrubber-tooltip");
    await page.waitForSelector('[data-testid="scrubber"]', { timeout: 5000 });
  });

  describe("Tooltip on code edit", () => {
    it("should show tooltip when code is edited", async () => {
      // Initially, no tooltip should be visible
      const tooltipCount = await page.$$eval('[role="tooltip"]', (els) => els.length);
      expect(tooltipCount).toBe(0);

      // Click button to toggle code edited state
      await page.click('[data-testid="toggle-code-edited"]');

      // Wait for state to update
      await page.waitForFunction(
        () => {
          const element = document.querySelector('[data-testid="code-edited-status"]');
          if (!element || !element.textContent) {
            return false;
          }
          return element.textContent.includes("Yes");
        },
        { timeout: 1000 }
      );

      // Hover over the scrubber
      const scrubber = await page.$('[data-testid="scrubber"]');
      await scrubber?.hover();

      // Wait for tooltip to appear
      await page.waitForSelector('[role="tooltip"]', { timeout: 1000 });

      // Check tooltip content
      const tooltipText = await page.$eval('[role="tooltip"]', (el) => el.textContent);
      expect(tooltipText).toContain("Code has been edited");
      expect(tooltipText).toContain("Run tests to re-enable");
    });
  });

  describe("Tooltip for insufficient frames", () => {
    it("should show tooltip when there are not enough frames", async () => {
      // Click button to set single frame
      await page.click('[data-testid="set-single-frame"]');

      // Wait for frame count to update
      await page.waitForFunction(
        () => {
          const element = document.querySelector('[data-testid="frames-count"]');
          if (!element || !element.textContent) {
            return false;
          }
          return element.textContent.includes("1");
        },
        { timeout: 1000 }
      );

      // Hover over the scrubber
      const scrubber = await page.$('[data-testid="scrubber"]');
      await scrubber?.hover();

      // Wait for tooltip to appear
      await page.waitForSelector('[role="tooltip"]', { timeout: 1000 });

      // Check tooltip content
      const tooltipText = await page.$eval('[role="tooltip"]', (el) => el.textContent);
      expect(tooltipText).toContain("Not enough frames to scrub through");
    });
  });

  describe("Tooltip interaction", () => {
    it("should hide tooltip when mouse leaves scrubber", async () => {
      // Click to set code as edited
      await page.click('[data-testid="toggle-code-edited"]');
      await page.waitForFunction(
        () => {
          const element = document.querySelector('[data-testid="code-edited-status"]');
          if (!element || !element.textContent) {
            return false;
          }
          return element.textContent.includes("Yes");
        },
        { timeout: 1000 }
      );

      // Hover to show tooltip
      const scrubber = await page.$('[data-testid="scrubber"]');
      await scrubber?.hover();
      await page.waitForSelector('[role="tooltip"]', { timeout: 1000 });

      // Move mouse away
      await page.mouse.move(0, 0);

      // Wait for tooltip to disappear
      await new Promise((resolve) => setTimeout(resolve, 100));
      const tooltipCount = await page.$$eval('[role="tooltip"]', (els) => els.length);
      expect(tooltipCount).toBe(0);
    });
  });
});
