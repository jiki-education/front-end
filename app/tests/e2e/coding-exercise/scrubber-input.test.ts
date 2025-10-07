describe("ScrubberInput E2E", () => {
  beforeEach(async () => {
    await page.goto("http://localhost:3070/test/coding-exercise/scrubber-input");
    await page.waitForSelector('[data-testid="scrubber-input-container"]', { timeout: 5000 });
  });

  describe("Initial State", () => {
    it("should render with correct initial state", async () => {
      // Check initial timeline time is 0
      const time = await page.$eval('[data-testid="timeline-time"]', (el) => el.textContent);
      expect(time).toContain("Timeline Time: 0");

      // Check initial frame
      const currentFrame = await page.$eval('[data-testid="current-frame"]', (el) => el.textContent);
      expect(currentFrame).toContain("Frame 1");

      // Check scrubber input exists and has correct initial value
      const scrubberValue = await page.$eval(
        '[data-testid="scrubber-range-input"]',
        (el) => (el as HTMLInputElement).value
      );
      expect(scrubberValue).toBe("0");

      // Check scrubber is enabled
      const isDisabled = await page.$eval(
        '[data-testid="scrubber-range-input"]',
        (el) => (el as HTMLInputElement).disabled
      );
      expect(isDisabled).toBe(false);
    });
  });

  describe("Frame Snapping on MouseUp", () => {
    it("should snap to nearest frame when releasing mouse", async () => {
      // Set the timeline to 110000 microseconds (just 10ms past frame 2 at 100ms, far from frame 3 at 250ms)
      await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        orchestrator.setCurrentTestTime(110000);
      });

      // Verify initial position
      let time = await page.$eval('[data-testid="timeline-time"]', (el) => el.textContent);
      expect(time).toContain("110000");

      // Now get the scrubber and trigger mouseup to snap
      const scrubberInput = await page.$('[data-testid="scrubber-range-input"]');
      await scrubberInput?.evaluate((el) => {
        const event = new MouseEvent("mouseup", { bubbles: true });
        el.dispatchEvent(event);
      });

      // Should snap to frame 2 (time 100000) since 110000 is much closer to 100000 than 250000
      time = await page.$eval('[data-testid="timeline-time"]', (el) => el.textContent);
      expect(time).toContain("100000");

      const currentFrame = await page.$eval('[data-testid="current-frame"]', (el) => el.textContent);
      expect(currentFrame).toContain("Frame 2");
    });

    it("should snap to the nearest frame when closer to next frame", async () => {
      const scrubberInput = await page.$('[data-testid="scrubber-range-input"]');

      // Simulate dragging to position 240000 (just before frame 3 at 250000)
      await scrubberInput?.evaluate((el) => {
        const input = el as HTMLInputElement;
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        nativeInputValueSetter?.call(input, "240000");
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });

      // Simulate mouseup
      await scrubberInput?.evaluate((el) => {
        el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      });

      // Should snap to frame 3 (time 250000) since 240000 is very close to 250000
      const time = await page.$eval('[data-testid="timeline-time"]', (el) => el.textContent);
      expect(time).toContain("250000");

      const currentFrame = await page.$eval('[data-testid="current-frame"]', (el) => el.textContent);
      expect(currentFrame).toContain("Frame 3");
    });

    it("should handle snapping at boundaries", async () => {
      const scrubberInput = await page.$('[data-testid="scrubber-range-input"]');

      // Test snapping just past frame 7 (910000 is just past frame 7 at 900000)
      await scrubberInput?.evaluate((el) => {
        const input = el as HTMLInputElement;
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        nativeInputValueSetter?.call(input, "910000");
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });

      await scrubberInput?.evaluate((el) => {
        el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      });

      // Should snap to frame 7 (time 900000) since 910000 is very close to 900000
      const time = await page.$eval('[data-testid="timeline-time"]', (el) => el.textContent);
      expect(time).toContain("900000");

      const currentFrame = await page.$eval('[data-testid="current-frame"]', (el) => el.textContent);
      expect(currentFrame).toContain("Frame 7");
    });
  });

  describe("Scrubbing Behavior", () => {
    it("should update timeline time without snapping during drag", async () => {
      const scrubberInput = await page.$('[data-testid="scrubber-range-input"]');

      // Simulate dragging to various positions without releasing
      const testPositions = [110000, 260000, 410000, 610000, 760000, 910000];

      for (const position of testPositions) {
        // Set value and trigger input/change events (simulating drag)
        await scrubberInput?.evaluate((el, pos: number) => {
          const input = el as HTMLInputElement;
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          )?.set;
          nativeInputValueSetter?.call(input, String(pos));
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }, position);

        // Verify the timeline time updates to exact value (no snapping)
        const time = await page.$eval('[data-testid="timeline-time"]', (el) => el.textContent);
        expect(time).toContain(String(position));
      }
    });

    it("should update current frame when landing exactly on frame positions", async () => {
      // Start at frame 1 (time 0)
      await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        orchestrator.setCurrentTestTime(0);
      });

      let currentFrame = await page.$eval('[data-testid="current-frame"]', (el) => el.textContent);
      expect(currentFrame).toContain("Frame 1");

      // Move to exactly frame 2 position (100000)
      await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        orchestrator.setCurrentTestTime(100000);
      });

      currentFrame = await page.$eval('[data-testid="current-frame"]', (el) => el.textContent);
      expect(currentFrame).toContain("Frame 2");

      // Move to exactly frame 4 position (400000)
      await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        orchestrator.setCurrentTestTime(400000);
      });

      currentFrame = await page.$eval('[data-testid="current-frame"]', (el) => el.textContent);
      expect(currentFrame).toContain("Frame 4");
    });

    it("should maintain position between frames during scrub", async () => {
      // Set to position 110000 (just past frame 2 at 100000)
      await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        orchestrator.setCurrentTestTime(110000);
      });

      // Check timeline time is exactly what we set (not snapped)
      const time = await page.$eval('[data-testid="timeline-time"]', (el) => el.textContent);
      expect(time).toContain("110000");

      // Current frame stays at Frame 1 since we haven't landed exactly on a new frame
      const currentFrame = await page.$eval('[data-testid="current-frame"]', (el) => el.textContent);
      expect(currentFrame).toContain("Frame 1");

      // Nearest frame should be frame 2 (110000 is very close to 100000)
      const nearestFrame = await page.$eval('[data-testid="nearest-frame"]', (el) => el.textContent);
      expect(nearestFrame).toContain("Frame 2");
      expect(nearestFrame).toContain("Time: 100000");
    });
  });

  describe("Scrubber Range", () => {
    it("should have correct min and max values", async () => {
      const scrubberInput = await page.$('[data-testid="scrubber-range-input"]');

      const min = await scrubberInput?.evaluate((el) => (el as HTMLInputElement).min);
      expect(min).toBe("0");

      const max = await scrubberInput?.evaluate((el) => (el as HTMLInputElement).max);
      expect(max).toBe("1000000"); // duration (1000ms) * 1000 (TIME_SCALE_FACTOR)
    });

    it("should accept values across entire range", async () => {
      const scrubberInput = await page.$('[data-testid="scrubber-range-input"]');

      // Test minimum value
      await scrubberInput?.evaluate((el) => {
        const input = el as HTMLInputElement;
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        nativeInputValueSetter?.call(input, "0");
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });

      let time = await page.$eval('[data-testid="timeline-time"]', (el) => el.textContent);
      expect(time).toContain("0");

      // Test maximum value
      await scrubberInput?.evaluate((el) => {
        const input = el as HTMLInputElement;
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        nativeInputValueSetter?.call(input, "1000000");
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });

      time = await page.$eval('[data-testid="timeline-time"]', (el) => el.textContent);
      expect(time).toContain("1000000");
    });
  });

  describe("Integration with Manual Controls", () => {
    it("should update scrubber value when timeline time changes programmatically", async () => {
      // Click button to set time to 175
      await page.click('[data-testid="set-time-175"]');

      // Check scrubber value updated
      const scrubberValue = await page.$eval(
        '[data-testid="scrubber-range-input"]',
        (el) => (el as HTMLInputElement).value
      );
      expect(scrubberValue).toBe("175000");

      // Check timeline time
      const time = await page.$eval('[data-testid="timeline-time"]', (el) => el.textContent);
      expect(time).toContain("175000");
    });

    it("should update to exact frame positions when using frame buttons", async () => {
      // Click to go to frame 5
      await page.click('[data-testid="goto-frame-5"]');

      const scrubberValue = await page.$eval(
        '[data-testid="scrubber-range-input"]',
        (el) => (el as HTMLInputElement).value
      );
      expect(scrubberValue).toBe("600000"); // Frame 5's timeline time in microseconds

      const currentFrame = await page.$eval('[data-testid="current-frame"]', (el) => el.textContent);
      expect(currentFrame).toContain("Frame 5");
    });
  });

  describe("Complex Interaction Scenarios", () => {
    it("should handle rapid scrubbing with proper frame updates", async () => {
      const scrubberInput = await page.$('[data-testid="scrubber-range-input"]');

      // Simulate rapid scrubbing across multiple positions
      const positions = [50000, 110000, 260000, 410000, 610000, 760000, 910000, 610000, 410000, 110000];

      for (const position of positions) {
        await scrubberInput?.evaluate((el, pos: number) => {
          const input = el as HTMLInputElement;
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
          )?.set;
          nativeInputValueSetter?.call(input, String(pos));
          input.dispatchEvent(new Event("input", { bubbles: true }));
          input.dispatchEvent(new Event("change", { bubbles: true }));
        }, position);
      }

      // Final position should be 110
      const time = await page.$eval('[data-testid="timeline-time"]', (el) => el.textContent);
      expect(time).toContain("110");

      // Trigger mouseup to snap
      await scrubberInput?.evaluate((el) => {
        el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      });

      // Should snap to 100 (frame 2) since 110 is very close to 100
      const finalTime = await page.$eval('[data-testid="timeline-time"]', (el) => el.textContent);
      expect(finalTime).toContain("100000");
    });

    it("should handle scrub-release-scrub sequence correctly", async () => {
      const scrubberInput = await page.$('[data-testid="scrubber-range-input"]');

      // First scrub to 110000 (just past frame 2 at 100000)
      await scrubberInput?.evaluate((el) => {
        const input = el as HTMLInputElement;
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        nativeInputValueSetter?.call(input, "110000");
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });

      // Release (should snap)
      await scrubberInput?.evaluate((el) => {
        el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      });

      let time = await page.$eval('[data-testid="timeline-time"]', (el) => el.textContent);
      expect(time).toContain("100000"); // Snapped to frame 2

      // Scrub again to 610000 (just past frame 5 at 600000)
      await scrubberInput?.evaluate((el) => {
        const input = el as HTMLInputElement;
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")?.set;
        nativeInputValueSetter?.call(input, "610000");
        input.dispatchEvent(new Event("input", { bubbles: true }));
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });

      time = await page.$eval('[data-testid="timeline-time"]', (el) => el.textContent);
      expect(time).toContain("610");

      // Release again (should snap)
      await scrubberInput?.evaluate((el) => {
        el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true }));
      });

      time = await page.$eval('[data-testid="timeline-time"]', (el) => el.textContent);
      expect(time).toContain("600000"); // Snapped to frame 5 (610 is very close to 600)
    });
  });
});
