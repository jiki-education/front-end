describe("Test Buttons E2E", () => {
  beforeEach(async () => {
    await page.goto("http://localhost:3081/test/test-buttons");

    await page.waitForSelector('[data-testid="test-buttons-container"]', { timeout: 5000 });

    // Wait for tests to be ready
    await page.waitForFunction(() => (window as any).testsReady === true, { timeout: 5000 });

    // Wait for the buttons to appear
    await page.waitForSelector('[data-testid="regular-test-buttons"] button', { timeout: 5000 });
  });

  describe("Regular Test Buttons", () => {
    it("should display regular test buttons", async () => {
      const regularButtons = await page.$$('[data-testid="regular-test-buttons"] button');
      expect(regularButtons.length).toBeGreaterThan(0);
    });

    it("should show correct number of regular test buttons", async () => {
      const testsCount = await page.$eval('[data-testid="regular-tests-count"]', (el) => el.textContent);
      expect(testsCount).toContain("Regular tests:");

      const regularButtons = await page.$$('[data-testid="regular-test-buttons"] button');
      // ESLint thinks this is unnecessary but $eval can return null in edge cases
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const countMatch = testsCount?.match(/Regular tests: (\d+)/);
      const expectedCount = countMatch ? parseInt(countMatch[1], 10) : 0;

      expect(regularButtons.length).toBe(expectedCount);
    });

    it("should display buttons with correct labels (numbered)", async () => {
      const regularButtons = await page.$$('[data-testid="regular-test-buttons"] button');

      for (let i = 0; i < regularButtons.length; i++) {
        const buttonText = await regularButtons[i].evaluate((el) => el.textContent);
        expect(buttonText).toBe((i + 1).toString());
      }
    });

    it("should have buttons with correct CSS classes based on test status", async () => {
      const regularButtons = await page.$$('[data-testid="regular-test-buttons"] button');

      for (const button of regularButtons) {
        const classes = await button.evaluate((el) => el.className);
        expect(classes).toContain("test-button");
        // Should have either 'pass' or 'fail' class
        expect(classes.includes("pass") || classes.includes("fail")).toBe(true);
      }
    });

    it("should select test when button is clicked", async () => {
      const firstButton = await page.$('[data-testid="regular-test-buttons"] button:first-child');
      expect(firstButton).toBeTruthy();

      await firstButton!.click();

      // Wait for the inspected test result to update
      await page.waitForFunction(
        () => {
          const element = document.querySelector('[data-testid="inspected-test-name"]');
          return element && element.textContent && !element.textContent.includes("None");
        },
        { timeout: 5000 }
      );

      // Check that a test is now inspected
      const inspectedTestName = await page.$eval('[data-testid="inspected-test-name"]', (el) => el.textContent);
      expect(inspectedTestName).not.toContain("None");
    });

    it("should mark clicked button as selected", async () => {
      const firstButton = await page.$('[data-testid="regular-test-buttons"] button:first-child');
      expect(firstButton).toBeTruthy();

      await firstButton!.click();

      // Wait for the button to be marked as selected
      await page.waitForFunction(
        () => {
          const button = document.querySelector('[data-testid="regular-test-buttons"] button:first-child');
          return button && button.className.includes("selected");
        },
        { timeout: 5000 }
      );

      const buttonClasses = await firstButton!.evaluate((el) => el.className);
      expect(buttonClasses).toContain("selected");
    });

    it("should deselect previous button when selecting a new one", async () => {
      const buttons = await page.$$('[data-testid="regular-test-buttons"] button');

      if (buttons.length < 2) {
        // Skip test if there aren't enough buttons
        return;
      }

      // Click first button
      await buttons[0].click();
      await page.waitForFunction(
        () => {
          const button = document.querySelector('[data-testid="regular-test-buttons"] button:first-child');
          return button && button.className.includes("selected");
        },
        { timeout: 5000 }
      );

      // Click second button
      await buttons[1].click();
      await page.waitForFunction(
        () => {
          const button = document.querySelector('[data-testid="regular-test-buttons"] button:nth-child(2)');
          return button && button.className.includes("selected");
        },
        { timeout: 5000 }
      );

      // Check that first button is no longer selected
      const firstButtonClasses = await buttons[0].evaluate((el) => el.className);
      expect(firstButtonClasses).not.toContain("selected");

      // Check that second button is selected
      const secondButtonClasses = await buttons[1].evaluate((el) => el.className);
      expect(secondButtonClasses).toContain("selected");
    });

    it("should update inspected test result view when button is clicked", async () => {
      const firstButton = await page.$('[data-testid="regular-test-buttons"] button:first-child');
      expect(firstButton).toBeTruthy();

      await firstButton!.click();

      // Wait for inspected test result view to appear
      await page.waitForSelector('[data-testid="inspected-test-result"]', { timeout: 5000 });

      const inspectedTestResult = await page.$('[data-testid="inspected-test-result"]');
      expect(inspectedTestResult).toBeTruthy();
    });
  });

  describe("Bonus Test Buttons", () => {
    it("should display bonus test buttons when available", async () => {
      const bonusTestsCount = await page.$eval('[data-testid="bonus-tests-count"]', (el) => el.textContent);
      // ESLint thinks this is unnecessary but $eval can return null in edge cases
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      const countMatch = bonusTestsCount?.match(/Bonus tests: (\d+)/);
      const expectedCount = countMatch ? parseInt(countMatch[1], 10) : 0;

      if (expectedCount > 0) {
        const bonusButtons = await page.$$('[data-testid="bonus-test-buttons"] button');
        expect(bonusButtons.length).toBe(expectedCount);
      }
    });

    it("should display bonus buttons with star symbols", async () => {
      const bonusButtons = await page.$$('[data-testid="bonus-test-buttons"] button');

      if (bonusButtons.length > 0) {
        for (const button of bonusButtons) {
          const buttonText = await button.evaluate((el) => el.textContent);
          expect(buttonText).toBe("★");
        }
      }
    });

    it("should select bonus test when bonus button is clicked", async () => {
      const bonusButtons = await page.$$('[data-testid="bonus-test-buttons"] button');

      if (bonusButtons.length > 0) {
        await bonusButtons[0].click();

        // Wait for the inspected test result to update
        await page.waitForFunction(
          () => {
            const element = document.querySelector('[data-testid="inspected-test-name"]');
            return element && element.textContent && !element.textContent.includes("None");
          },
          { timeout: 5000 }
        );

        // Check that a bonus test is now inspected
        const inspectedTestName = await page.$eval('[data-testid="inspected-test-name"]', (el) => el.textContent);
        expect(inspectedTestName).not.toContain("None");
      }
    });

    it("should work independently from regular test buttons", async () => {
      const regularButtons = await page.$$('[data-testid="regular-test-buttons"] button');
      const bonusButtons = await page.$$('[data-testid="bonus-test-buttons"] button');

      if (regularButtons.length > 0 && bonusButtons.length > 0) {
        // Click regular button first
        await regularButtons[0].click();
        await page.waitForFunction(
          () => {
            const button = document.querySelector('[data-testid="regular-test-buttons"] button:first-child');
            return button && button.className.includes("selected");
          },
          { timeout: 5000 }
        );

        // Click bonus button
        await bonusButtons[0].click();
        await page.waitForFunction(
          () => {
            const button = document.querySelector('[data-testid="bonus-test-buttons"] button:first-child');
            return button && button.className.includes("selected");
          },
          { timeout: 5000 }
        );

        // Both should be deselected since they're in different groups
        const regularButtonClasses = await regularButtons[0].evaluate((el) => el.className);
        const bonusButtonClasses = await bonusButtons[0].evaluate((el) => el.className);

        expect(bonusButtonClasses).toContain("selected");
        // The regular button should be deselected since we selected a different test
        expect(regularButtonClasses).not.toContain("selected");
      }
    });
  });

  describe("Test Result Inspection", () => {
    it("should display test result details when a test is selected", async () => {
      const firstButton = await page.$('[data-testid="regular-test-buttons"] button:first-child');
      expect(firstButton).toBeTruthy();

      await firstButton!.click();

      // Wait for inspected test result view to appear
      await page.waitForSelector('[data-testid="inspected-test-result"]', { timeout: 5000 });

      // Check that test details are displayed
      const testName = await page.$eval('[data-testid="inspected-test-name"]', (el) => el.textContent);
      const testStatus = await page.$eval('[data-testid="inspected-test-status"]', (el) => el.textContent);

      expect(testName).not.toContain("None");
      expect(testStatus).toMatch(/pass|fail|idle/);
    });

    it("should update test result details when different test is selected", async () => {
      const buttons = await page.$$('[data-testid="regular-test-buttons"] button');

      if (buttons.length < 2) {
        return; // Skip if not enough buttons
      }

      // Click first button and get test name
      await buttons[0].click();
      await page.waitForFunction(
        () => {
          const element = document.querySelector('[data-testid="inspected-test-name"]');
          return element && element.textContent && !element.textContent.includes("None");
        },
        { timeout: 5000 }
      );

      const firstTestName = await page.$eval('[data-testid="inspected-test-name"]', (el) => el.textContent);

      // Click second button and get test name
      await buttons[1].click();
      await page.waitForFunction(
        (firstTestName) => {
          const element = document.querySelector('[data-testid="inspected-test-name"]');
          return element && element.textContent !== firstTestName;
        },
        { timeout: 5000 },
        firstTestName
      );

      const secondTestName = await page.$eval('[data-testid="inspected-test-name"]', (el) => el.textContent);

      // Test names should be different
      expect(secondTestName).not.toBe(firstTestName);
    });
  });

  describe("Orchestrator Integration", () => {
    it("should expose orchestrator on window for testing", async () => {
      const hasOrchestrator = await page.evaluate(() => {
        return typeof (window as any).testOrchestrator !== "undefined";
      });

      expect(hasOrchestrator).toBe(true);
    });

    it("should be able to programmatically set inspected test", async () => {
      // Wait for orchestrator to be fully available
      await page.waitForFunction(
        () => {
          const orchestrator = (window as any).testOrchestrator;
          return (
            orchestrator &&
            orchestrator.store &&
            orchestrator.store.getState().testSuiteResult &&
            orchestrator.store.getState().testSuiteResult.tests.length > 0
          );
        },
        { timeout: 10000 }
      );

      // Use orchestrator to set inspected test
      await page.evaluate(() => {
        const orchestrator = (window as any).testOrchestrator;
        const testSuiteResult = orchestrator.store.getState().testSuiteResult;
        if (testSuiteResult && testSuiteResult.tests.length > 0) {
          orchestrator.setCurrentTest(testSuiteResult.tests[0]);
        }
      });

      // Wait for UI to update
      await page.waitForFunction(
        () => {
          const element = document.querySelector('[data-testid="inspected-test-name"]');
          return element && element.textContent && !element.textContent.includes("None");
        },
        { timeout: 5000 }
      );

      // Check that test is inspected
      const inspectedTestName = await page.$eval('[data-testid="inspected-test-name"]', (el) => el.textContent);
      expect(inspectedTestName).not.toContain("None");

      // Check that corresponding button is selected
      const selectedButton = await page.$('[data-testid="regular-test-buttons"] button.selected');
      expect(selectedButton).toBeTruthy();
    });

    it("should maintain state consistency between UI and orchestrator", async () => {
      const firstButton = await page.$('[data-testid="regular-test-buttons"] button:first-child');
      expect(firstButton).toBeTruthy();

      await firstButton!.click();

      // Wait for state to update
      await page.waitForFunction(
        () => {
          const button = document.querySelector('[data-testid="regular-test-buttons"] button:first-child');
          return button && button.className.includes("selected");
        },
        { timeout: 5000 }
      );

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
      const uiTestName = await page.$eval('[data-testid="inspected-test-name"]', (el) => el.textContent);
      expect(uiTestName).toContain(orchestratorState.inspectedTestName);
    });
  });
});
