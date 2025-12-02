import { test, expect } from "@playwright/test";

test.describe("Test Buttons E2E", () => {
  // Warm up the page compilation before running tests in parallel
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/test/test-buttons");
    await page.locator('[data-testid="test-buttons-container"]').waitFor();
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/test/test-buttons");
    await page.locator('[data-testid="test-buttons-container"]').waitFor();

    // Wait for tests to be ready
    await page.waitForFunction(() => (window as any).testsReady === true);

    // Wait for the buttons to appear
    await page.locator('[data-testid="regular-test-buttons"] button').first().waitFor();
  });

  test.describe("Regular Test Buttons", () => {
    test("should display regular test buttons", async ({ page }) => {
      const regularButtons = await page.locator('[data-testid="regular-test-buttons"] button').count();
      expect(regularButtons).toBeGreaterThan(0);
    });

    test("should show correct number of regular test buttons", async ({ page }) => {
      const testsCount = await page.locator('[data-testid="regular-tests-count"]').textContent();
      expect(testsCount).toContain("Regular tests:");

      const regularButtons = await page.locator('[data-testid="regular-test-buttons"] button').count();
      const countMatch = testsCount?.match(/Regular tests: (\d+)/);
      const expectedCount = countMatch ? parseInt(countMatch[1], 10) : 0;

      expect(regularButtons).toBe(expectedCount);
    });

    test("should display buttons with correct labels (numbered)", async ({ page }) => {
      const regularButtons = await page.locator('[data-testid="regular-test-buttons"] button').all();

      for (let i = 0; i < regularButtons.length; i++) {
        const buttonText = await regularButtons[i].textContent();
        expect(buttonText).toBe((i + 1).toString());
      }
    });

    test("should have buttons with correct CSS classes based on test status", async ({ page }) => {
      const regularButtons = await page.locator('[data-testid="regular-test-buttons"] button').all();

      for (const button of regularButtons) {
        const classes = await button.getAttribute("class");
        expect(classes).toMatch(/testButton/);
        // Should have either 'pass' or 'fail' class
        expect(classes!.includes("pass") || classes!.includes("fail")).toBe(true);
      }
    });

    test("should select test when button is clicked", async ({ page }) => {
      const firstButton = page.locator('[data-testid="regular-test-buttons"] button').first();
      await firstButton.click();

      // Wait for the inspected test result to update
      await page.waitForFunction(() => {
        const element = document.querySelector('[data-testid="inspected-test-name"]');
        return element && element.textContent && !element.textContent.includes("None");
      });

      // Check that a test is now inspected
      const inspectedTestName = await page.locator('[data-testid="inspected-test-name"]').textContent();
      expect(inspectedTestName).not.toContain("None");
    });

    test("should mark clicked button as selected", async ({ page }) => {
      const firstButton = page.locator('[data-testid="regular-test-buttons"] button').first();
      await firstButton.click();

      // Wait for the button to be marked as selected
      await page.waitForFunction(() => {
        const button = document.querySelector('[data-testid="regular-test-buttons"] button:first-child');
        return button && button.className.includes("selected");
      });

      const buttonClasses = await firstButton.getAttribute("class");
      expect(buttonClasses).toContain("selected");
    });

    test("should deselect previous button when selecting a new one", async ({ page }) => {
      const buttons = await page.locator('[data-testid="regular-test-buttons"] button').all();

      if (buttons.length < 2) {
        // Skip test if there aren't enough buttons
        return;
      }

      // Click first button
      await buttons[0].click();
      await page.waitForFunction(() => {
        const button = document.querySelector('[data-testid="regular-test-buttons"] button:first-child');
        return button && button.className.includes("selected");
      });

      // Click second button
      await buttons[1].click();
      await page.waitForFunction(() => {
        const button = document.querySelector('[data-testid="regular-test-buttons"] button:nth-child(2)');
        return button && button.className.includes("selected");
      });

      // Check that first button is no longer selected
      const firstButtonClasses = await buttons[0].getAttribute("class");
      expect(firstButtonClasses).not.toContain("selected");

      // Check that second button is selected
      const secondButtonClasses = await buttons[1].getAttribute("class");
      expect(secondButtonClasses).toContain("selected");
    });

    test("should update inspected test result view when button is clicked", async ({ page }) => {
      const firstButton = page.locator('[data-testid="regular-test-buttons"] button').first();
      await firstButton.click();

      // Wait for inspected test result view to appear
      await page.locator('[data-testid="inspected-test-result"]').waitFor();

      const inspectedTestResult = page.locator('[data-testid="inspected-test-result"]');
      await expect(inspectedTestResult).toBeVisible();
    });
  });

  test.describe("Bonus Test Buttons", () => {
    test("should display bonus test buttons when available", async ({ page }) => {
      const bonusTestsCount = await page.locator('[data-testid="bonus-tests-count"]').textContent();
      const countMatch = bonusTestsCount?.match(/Bonus tests: (\d+)/);
      const expectedCount = countMatch ? parseInt(countMatch[1], 10) : 0;

      if (expectedCount > 0) {
        const bonusButtons = await page.locator('[data-testid="bonus-test-buttons"] button').count();
        expect(bonusButtons).toBe(expectedCount);
      }
    });

    test("should display bonus buttons with star symbols", async ({ page }) => {
      const bonusButtons = await page.locator('[data-testid="bonus-test-buttons"] button').all();

      if (bonusButtons.length > 0) {
        for (const button of bonusButtons) {
          const buttonText = await button.textContent();
          expect(buttonText).toBe("★");
        }
      }
    });

    test("should select bonus test when bonus button is clicked", async ({ page }) => {
      const bonusButtons = await page.locator('[data-testid="bonus-test-buttons"] button').all();

      if (bonusButtons.length > 0) {
        await bonusButtons[0].click();

        // Wait for the inspected test result to update
        await page.waitForFunction(() => {
          const element = document.querySelector('[data-testid="inspected-test-name"]');
          return element && element.textContent && !element.textContent.includes("None");
        });

        // Check that a bonus test is now inspected
        const inspectedTestName = await page.locator('[data-testid="inspected-test-name"]').textContent();
        expect(inspectedTestName).not.toContain("None");
      }
    });

    test("should work independently from regular test buttons", async ({ page }) => {
      const regularButtons = await page.locator('[data-testid="regular-test-buttons"] button').all();
      const bonusButtons = await page.locator('[data-testid="bonus-test-buttons"] button').all();

      if (regularButtons.length > 0 && bonusButtons.length > 0) {
        // Click regular button first
        await regularButtons[0].click();
        await page.waitForFunction(() => {
          const button = document.querySelector('[data-testid="regular-test-buttons"] button:first-child');
          return button && button.className.includes("selected");
        });

        // Click bonus button
        await bonusButtons[0].click();
        await page.waitForFunction(() => {
          const button = document.querySelector('[data-testid="bonus-test-buttons"] button:first-child');
          return button && button.className.includes("selected");
        });

        // Both should be deselected since they're in different groups
        const regularButtonClasses = await regularButtons[0].getAttribute("class");
        const bonusButtonClasses = await bonusButtons[0].getAttribute("class");

        expect(bonusButtonClasses).toContain("selected");
        // The regular button should be deselected since we selected a different test
        expect(regularButtonClasses).not.toContain("selected");
      }
    });
  });

  test.describe("Test Result Inspection", () => {
    test("should display test result details when a test is selected", async ({ page }) => {
      const firstButton = page.locator('[data-testid="regular-test-buttons"] button').first();
      await firstButton.click();

      // Wait for inspected test result view to appear
      await page.locator('[data-testid="inspected-test-result"]').waitFor();

      // Check that test details are displayed
      const testName = await page.locator('[data-testid="inspected-test-name"]').textContent();
      const testStatus = await page.locator('[data-testid="inspected-test-status"]').textContent();

      expect(testName).not.toContain("None");
      expect(testStatus).toMatch(/pass|fail|idle/);
    });

    test("should update test result details when different test is selected", async ({ page }) => {
      const buttons = await page.locator('[data-testid="regular-test-buttons"] button').all();

      if (buttons.length < 2) {
        return; // Skip if not enough buttons
      }

      // Click first button and get test name
      await buttons[0].click();
      await page.waitForFunction(() => {
        const element = document.querySelector('[data-testid="inspected-test-name"]');
        return element && element.textContent && !element.textContent.includes("None");
      });

      const firstTestName = await page.locator('[data-testid="inspected-test-name"]').textContent();

      // Click second button and get test name
      await buttons[1].click();
      await page.waitForFunction((firstTestName) => {
        const element = document.querySelector('[data-testid="inspected-test-name"]');
        return element && element.textContent !== firstTestName;
      }, firstTestName);

      const secondTestName = await page.locator('[data-testid="inspected-test-name"]').textContent();

      // Test names should be different
      expect(secondTestName).not.toBe(firstTestName);
    });
  });

  test.describe("Orchestrator Integration", () => {
    test("should expose orchestrator on window for testing", async ({ page }) => {
      const hasOrchestrator = await page.evaluate(() => {
        return typeof (window as any).testOrchestrator !== "undefined";
      });

      expect(hasOrchestrator).toBe(true);
    });

    test("should be able to programmatically set inspected test", async ({ page }) => {
      // Wait for orchestrator to be fully available
      await page.waitForFunction(() => {
        const orchestrator = (window as any).testOrchestrator;
        return (
          orchestrator &&
          orchestrator.store &&
          orchestrator.store.getState().testSuiteResult &&
          orchestrator.store.getState().testSuiteResult.tests.length > 0
        );
      });

      // Use orchestrator to set inspected test
      await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        const testSuiteResult = orchestrator.store.getState().testSuiteResult;
        if (testSuiteResult && testSuiteResult.tests.length > 0) {
          orchestrator.setCurrentTest(testSuiteResult.tests[0]);
        }
      });

      // Wait for UI to update
      await page.waitForFunction(() => {
        const element = document.querySelector('[data-testid="inspected-test-name"]');
        return element && element.textContent && !element.textContent.includes("None");
      });

      // Check that test is inspected
      const inspectedTestName = await page.locator('[data-testid="inspected-test-name"]').textContent();
      expect(inspectedTestName).not.toContain("None");

      // Check that corresponding button is selected
      const selectedButton = page.locator('[data-testid="regular-test-buttons"] button.selected');
      await expect(selectedButton).toBeVisible();
    });

    test("should maintain state consistency between UI and orchestrator", async ({ page }) => {
      const firstButton = page.locator('[data-testid="regular-test-buttons"] button').first();
      await firstButton.click();

      // Wait for state to update
      await page.waitForFunction(() => {
        const button = document.querySelector('[data-testid="regular-test-buttons"] button:first-child');
        return button && button.className.includes("selected");
      });

      // Check orchestrator state matches UI state
      const orchestratorState = await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        const state = orchestrator.store.getState();
        return {
          hasInspectedTest: !!state.currentTest,
          inspectedTestName: state.currentTest?.slug || null
        };
      });

      expect(orchestratorState.hasInspectedTest).toBe(true);
      expect(orchestratorState.inspectedTestName).toBeTruthy();

      // Check UI matches orchestrator state
      const uiTestName = await page.locator('[data-testid="inspected-test-name"]').textContent();
      expect(uiTestName).toContain(orchestratorState.inspectedTestName);
    });
  });
});
