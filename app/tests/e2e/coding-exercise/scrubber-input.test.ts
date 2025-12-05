import { test, expect } from "@playwright/test";

test.describe("ScrubberInput E2E", () => {
  // Warm up the page compilation before running tests in parallel
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/test/coding-exercise/scrubber-input");
    await page.locator('[data-testid="scrubber-input-container"]').waitFor();
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/test/coding-exercise/scrubber-input");
    await page.locator('[data-testid="scrubber-input-container"]').waitFor();
  });

  test.describe("Initial State", () => {
    test("should render with correct initial state", async ({ page }) => {
      // Check initial timeline time is 0
      const time = await page.locator('[data-testid="timeline-time"]').textContent();
      expect(time).toContain("Timeline Time: 0");

      // Check initial frame
      const currentFrame = await page.locator('[data-testid="current-frame"]').textContent();
      expect(currentFrame).toContain("Frame 1");

      // Check scrubber input exists and is accessible
      const scrubberExists = await page.locator('[data-testid="scrubber-range-input"]').count();
      expect(scrubberExists).toBeGreaterThan(0);

      // Check scrubber has correct aria attributes
      const ariaValueNow = await page.locator('[data-testid="scrubber-range-input"]').getAttribute("aria-valuenow");
      expect(ariaValueNow).toBe("0");

      // Check scrubber is enabled (tabIndex should be 0)
      const tabIndex = await page.locator('[data-testid="scrubber-range-input"]').getAttribute("tabIndex");
      expect(tabIndex).toBe("0");
    });
  });

  test.describe("Frame Snapping on MouseUp", () => {
    test("should snap to nearest frame when releasing mouse", async ({ page }) => {
      // Set the timeline to 110000 microseconds (just 10ms past frame 2 at 100ms, far from frame 3 at 250ms)
      await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        orchestrator.setCurrentTestTime(110000);
      });

      // Verify initial position
      let time = await page.locator('[data-testid="timeline-time"]').textContent();
      expect(time).toContain("110000");

      // Now get the scrubber and simulate a complete drag sequence to trigger snapping
      await page.locator('[data-testid="scrubber-range-input"]').evaluate((el) => {
        // Simulate complete drag sequence
        el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, clientX: 100 }));
        // Add a small delay to ensure mousedown is processed
        setTimeout(() => {
          el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        }, 10);
      });

      // Wait for snapping to complete
      await page.waitForTimeout(50);

      // Should snap to frame 2 (time 100000) since 110000 is much closer to 100000 than 250000
      time = await page.locator('[data-testid="timeline-time"]').textContent();
      expect(time).toContain("100000");

      const currentFrame = await page.locator('[data-testid="current-frame"]').textContent();
      expect(currentFrame).toContain("Frame 2");
    });

    test("should snap to the nearest frame when closer to next frame", async ({ page }) => {
      // Simulate dragging to position 240000 by calculating the correct mouse position
      await page.locator('[data-testid="scrubber-range-input"]').evaluate((el) => {
        const rect = el.getBoundingClientRect();
        // Calculate clientX for 240000 position (240000/1000000 = 24% of the way)
        const targetPercentage = 240000 / 1000000;
        const targetClientX = rect.left + rect.width * targetPercentage;

        // Start the drag at the calculated position
        el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, clientX: targetClientX }));
        // End the drag immediately, which should trigger snapping
        setTimeout(() => {
          el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        }, 10);
      });

      // Wait for snapping to complete
      await page.waitForTimeout(50);

      // Should snap to frame 3 (time 250000) since 240000 is very close to 250000
      const time = await page.locator('[data-testid="timeline-time"]').textContent();
      expect(time).toContain("250000");

      const currentFrame = await page.locator('[data-testid="current-frame"]').textContent();
      expect(currentFrame).toContain("Frame 3");
    });

    test("should handle snapping at boundaries", async ({ page }) => {
      // Test snapping just past frame 7 (910000 is just past frame 7 at 900000)
      await page.locator('[data-testid="scrubber-range-input"]').evaluate((el) => {
        const rect = el.getBoundingClientRect();
        // Calculate clientX for 910000 position (910000/1000000 = 91% of the way)
        const targetPercentage = 910000 / 1000000;
        const targetClientX = rect.left + rect.width * targetPercentage;

        // Start the drag at the calculated position
        el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, clientX: targetClientX }));
        // End the drag, which should trigger snapping
        setTimeout(() => {
          el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        }, 10);
      });

      // Wait for snapping to complete
      await page.waitForTimeout(50);

      // Should snap to frame 7 (time 900000) since 910000 is very close to 900000
      const time = await page.locator('[data-testid="timeline-time"]').textContent();
      expect(time).toContain("900000");

      const currentFrame = await page.locator('[data-testid="current-frame"]').textContent();
      expect(currentFrame).toContain("Frame 7");
    });
  });

  test.describe("Scrubbing Behavior", () => {
    test("should update timeline time without snapping during drag", async ({ page }) => {
      // Simulate dragging to various positions without releasing
      const testPositions = [110000, 260000, 410000, 610000, 760000, 910000];

      for (const position of testPositions) {
        // Set timeline position directly using orchestrator (simulating drag)
        await page.evaluate((pos: number) => {
          const orchestrator = (window as any).testOrchestrator;
          orchestrator.setCurrentTestTime(pos);
        }, position);

        // Verify the timeline time updates to exact value (no snapping)
        const time = await page.locator('[data-testid="timeline-time"]').textContent();
        expect(time).toContain(String(position));
      }
    });

    test("should update current frame when landing exactly on frame positions", async ({ page }) => {
      // Start at frame 1 (time 0)
      await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        orchestrator.setCurrentTestTime(0);
      });

      let currentFrame = await page.locator('[data-testid="current-frame"]').textContent();
      expect(currentFrame).toContain("Frame 1");

      // Move to exactly frame 2 position (100000)
      await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        orchestrator.setCurrentTestTime(100000);
      });

      currentFrame = await page.locator('[data-testid="current-frame"]').textContent();
      expect(currentFrame).toContain("Frame 2");

      // Move to exactly frame 4 position (400000)
      await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        orchestrator.setCurrentTestTime(400000);
      });

      currentFrame = await page.locator('[data-testid="current-frame"]').textContent();
      expect(currentFrame).toContain("Frame 4");
    });

    test("should maintain position between frames during scrub", async ({ page }) => {
      // Set to position 110000 (just past frame 2 at 100000)
      await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        orchestrator.setCurrentTestTime(110000);
      });

      // Check timeline time is exactly what we set (not snapped)
      const time = await page.locator('[data-testid="timeline-time"]').textContent();
      expect(time).toContain("110000");

      // Current frame stays at Frame 1 since we haven't landed exactly on a new frame
      const currentFrame = await page.locator('[data-testid="current-frame"]').textContent();
      expect(currentFrame).toContain("Frame 1");

      // Nearest frame should be frame 2 (110000 is very close to 100000)
      const nearestFrame = await page.locator('[data-testid="nearest-frame"]').textContent();
      expect(nearestFrame).toContain("Frame 2");
      expect(nearestFrame).toContain("Time: 100000");
    });
  });

  test.describe("Scrubber Range", () => {
    test("should have correct min and max values", async ({ page }) => {
      const min = await page.locator('[data-testid="scrubber-range-input"]').getAttribute("aria-valuemin");
      expect(min).toBe("0");

      const max = await page.locator('[data-testid="scrubber-range-input"]').getAttribute("aria-valuemax");
      expect(max).toBe("1000000"); // duration (1000ms) * 1000 (TIME_SCALE_FACTOR)
    });

    test("should accept values across entire range", async ({ page }) => {
      // Test minimum value
      await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        orchestrator.setCurrentTestTime(0);
      });

      let time = await page.locator('[data-testid="timeline-time"]').textContent();
      expect(time).toContain("0");

      // Test maximum value
      await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        orchestrator.setCurrentTestTime(1000000);
      });

      time = await page.locator('[data-testid="timeline-time"]').textContent();
      expect(time).toContain("1000000");
    });
  });

  test.describe("Integration with Manual Controls", () => {
    test("should update scrubber value when timeline time changes programmatically", async ({ page }) => {
      // Click button to set time to 175
      await page.locator('[data-testid="set-time-175"]').click();

      // Check scrubber aria-valuenow updated
      const scrubberValue = await page.locator('[data-testid="scrubber-range-input"]').getAttribute("aria-valuenow");
      expect(scrubberValue).toBe("175000");

      // Check timeline time
      const time = await page.locator('[data-testid="timeline-time"]').textContent();
      expect(time).toContain("175000");
    });

    test("should update to exact frame positions when using frame buttons", async ({ page }) => {
      // Click to go to frame 5
      await page.locator('[data-testid="goto-frame-5"]').click();

      const scrubberValue = await page.locator('[data-testid="scrubber-range-input"]').getAttribute("aria-valuenow");
      expect(scrubberValue).toBe("600000"); // Frame 5's timeline time in microseconds

      const currentFrame = await page.locator('[data-testid="current-frame"]').textContent();
      expect(currentFrame).toContain("Frame 5");
    });
  });

  test.describe("Complex Interaction Scenarios", () => {
    test("should handle rapid scrubbing with proper frame updates", async ({ page }) => {
      // Simulate rapid scrubbing across multiple positions
      const positions = [50000, 110000, 260000, 410000, 610000, 760000, 910000, 610000, 410000, 110000];

      for (const position of positions) {
        await page.evaluate((pos: number) => {
          const orchestrator = (window as any).testOrchestrator;
          orchestrator.setCurrentTestTime(pos);
        }, position);
      }

      // Final position should be 110
      const time = await page.locator('[data-testid="timeline-time"]').textContent();
      expect(time).toContain("110");

      // Trigger mouseup to snap
      await page.locator('[data-testid="scrubber-range-input"]').evaluate((el) => {
        // Start drag, then end it to trigger snapping
        el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, clientX: 100 }));
        setTimeout(() => {
          el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        }, 10);
      });

      // Wait for snapping to complete
      await page.waitForTimeout(50);

      // Should snap to 100 (frame 2) since 110 is very close to 100
      const finalTime = await page.locator('[data-testid="timeline-time"]').textContent();
      expect(finalTime).toContain("100000");
    });

    test("should handle scrub-release-scrub sequence correctly", async ({ page }) => {
      // First scrub to 110000 (just past frame 2 at 100000)
      await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        orchestrator.setCurrentTestTime(110000);
      });

      // Release (should snap)
      await page.locator('[data-testid="scrubber-range-input"]').evaluate((el) => {
        // Start drag, then end it to trigger snapping
        el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, clientX: 100 }));
        setTimeout(() => {
          el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        }, 10);
      });

      // Wait for snapping to complete
      await page.waitForTimeout(50);

      let time = await page.locator('[data-testid="timeline-time"]').textContent();
      expect(time).toContain("100000"); // Snapped to frame 2

      // Scrub again to 610000 (just past frame 5 at 600000) using mouse position
      await page.locator('[data-testid="scrubber-range-input"]').evaluate((el) => {
        const rect = el.getBoundingClientRect();
        // Calculate clientX for 610000 position (610000/1000000 = 61% of the way)
        const targetPercentage = 610000 / 1000000;
        const targetClientX = rect.left + rect.width * targetPercentage;

        // Start the drag at the calculated position
        el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, clientX: targetClientX }));
        // Don't end the drag yet - this is the "scrub" part
      });

      time = await page.locator('[data-testid="timeline-time"]').textContent();
      // Should be close to 610000 (allowing for mouse position calculation variance)
      expect(time).toBeTruthy();
      const timeValue = parseFloat(time!.replace("Timeline Time: ", ""));
      expect(timeValue).toBeCloseTo(610000, -3.1); // within ~500 ms

      // Release again (should snap) - trigger snapping from current position
      await page.locator('[data-testid="scrubber-range-input"]').evaluate((el) => {
        const rect = el.getBoundingClientRect();
        // Use the current position (around 610000) for the mousedown
        const targetPercentage = 610000 / 1000000;
        const targetClientX = rect.left + rect.width * targetPercentage;

        // Start drag, then end it to trigger snapping
        el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, clientX: targetClientX }));
        setTimeout(() => {
          el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
        }, 10);
      });

      // Wait for snapping to complete
      await page.waitForTimeout(50);

      time = await page.locator('[data-testid="timeline-time"]').textContent();
      expect(time).toContain("600000"); // Snapped to frame 5 (610 is very close to 600)
    });
  });
});
