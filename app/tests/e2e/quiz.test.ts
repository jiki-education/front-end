/* eslint-disable @typescript-eslint/no-unnecessary-condition */
// ESLint doesn't understand that textContent can be null and Array.find() can return undefined
// These optional chains are defensive programming for DOM queries

/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
// Type assertions to HTMLButtonElement are necessary to access the disabled property
// which doesn't exist on the generic Element type returned by querySelectorAll

describe("Quiz Page E2E", () => {
  beforeEach(async () => {
    await page.goto("http://localhost:3081/test/quiz");
    await page.waitForSelector("h1", { timeout: 5000 });
  });

  describe("Page Layout", () => {
    it("should load the quiz test page", async () => {
      const title = await page.$eval("h1", (el) => el.textContent);
      expect(title).toBe("Quiz Test Page");

      // Check that all quiz type buttons are present
      const buttons = await page.$$eval("button", (els) =>
        els.map((el) => el.textContent?.trim()).filter((text) => text)
      );
      expect(buttons).toContain("Multiple Choice");
      expect(buttons).toContain("Coding Quiz");
      expect(buttons).toContain("Fill in the Blanks");
    });

    it("should display the current question counter", async () => {
      const counter = await page.$$eval("p", (els) => {
        const el = els.find((e) => e.className.includes("text-gray-600"));
        return el?.textContent || "";
      });
      expect(counter).toContain("Question 1 of");
    });
  });

  describe("Quiz Type Switching", () => {
    it("should switch between quiz types", async () => {
      // Start with multiple choice
      let counter = await page.$$eval("p", (els) => {
        const el = els.find((e) => e.className.includes("text-gray-600"));
        return el?.textContent || "";
      });
      expect(counter).toContain("Multiple Choice");

      // Switch to coding quiz
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const codingBtn = buttons.find((btn) => btn.textContent?.includes("Coding Quiz"));
        codingBtn?.click();
      });

      await new Promise((r) => setTimeout(r, 500)); // Wait for UI update
      counter = await page.$$eval("p", (els) => {
        const el = els.find((e) => e.className.includes("text-gray-600"));
        return el?.textContent || "";
      });
      expect(counter).toContain("Coding:");

      // Switch to fill-in quiz
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const fillBtn = buttons.find((btn) => btn.textContent?.includes("Fill in the Blanks"));
        fillBtn?.click();
      });

      await new Promise((r) => setTimeout(r, 500)); // Wait for UI update
      counter = await page.$$eval("p", (els) => {
        const el = els.find((e) => e.className.includes("text-gray-600"));
        return el?.textContent || "";
      });
      expect(counter).toContain("Fill in the Blanks:");
    });

    it("should highlight the active quiz type button", async () => {
      // Check initial state - Multiple Choice should be active (blue)
      let className = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const mcButton = buttons.find((btn) => btn.textContent?.includes("Multiple Choice"));
        return mcButton?.className || "";
      });
      expect(className).toContain("bg-blue-600");

      // Click Coding Quiz
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const codingBtn = buttons.find((btn) => btn.textContent?.includes("Coding Quiz"));
        codingBtn?.click();
      });

      await new Promise((r) => setTimeout(r, 500)); // Wait for UI update

      // Check Coding Quiz is now active
      className = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const codingButton = buttons.find((btn) => btn.textContent?.includes("Coding Quiz"));
        return codingButton?.className || "";
      });
      expect(className).toContain("bg-blue-600");

      // Multiple Choice should no longer be active
      className = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const mcButton = buttons.find((btn) => btn.textContent?.includes("Multiple Choice"));
        return mcButton?.className || "";
      });
      expect(className).toContain("bg-white");
    });
  });

  describe("Multiple Choice Quiz", () => {
    it("should display quiz question and options", async () => {
      // Quiz card should be visible
      const quizCard = await page.$(".bg-white.rounded-xl");
      expect(quizCard).toBeTruthy();

      // Look for quiz option buttons (they have letter prefixes like A., B., etc.)
      const optionCount = await page.$$eval("button", (buttons) => {
        return buttons.filter((btn) => {
          const text = btn.textContent || "";
          return /^[A-Z]\./.test(text);
        }).length;
      });
      expect(optionCount).toBeGreaterThan(0);
    });

    it("should allow selecting an option", async () => {
      // Get all buttons and filter for quiz options
      const options = await page.$$("button");
      const quizOptions = [];
      for (const option of options) {
        const text = await option.evaluate((el) => el.textContent || "");
        if (/^[A-Z]\./.test(text)) {
          quizOptions.push(option);
        }
      }
      expect(quizOptions.length).toBeGreaterThan(0);

      // Click first option
      await quizOptions[0].click();

      // Check that submit button is enabled
      const isDisabled = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const submitBtn = buttons.find((btn) => btn.textContent?.includes("Submit"));
        return submitBtn ? (submitBtn as HTMLButtonElement).disabled : true;
      });
      expect(isDisabled).toBe(false);
    });

    it("should submit answer and show feedback", async () => {
      // Get quiz option buttons
      const options = await page.$$("button");
      const quizOptions = [];
      for (const option of options) {
        const text = await option.evaluate((el) => el.textContent || "");
        if (/^[A-Z]\./.test(text)) {
          quizOptions.push(option);
        }
      }
      expect(quizOptions.length).toBeGreaterThan(0);

      // Select first option
      await quizOptions[0].click();

      // Submit answer
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const submitBtn = buttons.find((btn) => btn.textContent?.includes("Submit"));
        submitBtn?.click();
      });

      await new Promise((r) => setTimeout(r, 500)); // Wait for feedback to appear

      // Button should change to "Next Question"
      const hasNextButton = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        return buttons.some((btn) => btn.textContent?.includes("Next Question"));
      });
      expect(hasNextButton).toBe(true);

      // Feedback should be visible (look for info box)
      const feedback = await page.$("div.rounded-lg.p-4");
      expect(feedback).toBeTruthy();
    });

    it("should navigate to next question", async () => {
      // Select and submit first question
      const options = await page.$$("button");
      const quizOptions = [];
      for (const option of options) {
        const text = await option.evaluate((el) => el.textContent || "");
        if (/^[A-Z]\./.test(text)) {
          quizOptions.push(option);
        }
      }
      expect(quizOptions.length).toBeGreaterThan(0);
      await quizOptions[0].click();

      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const submitBtn = buttons.find((btn) => btn.textContent?.includes("Submit"));
        submitBtn?.click();
      });

      await new Promise((r) => setTimeout(r, 500));

      // Click next
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const nextBtn = buttons.find((btn) => btn.textContent?.includes("Next Question"));
        nextBtn?.click();
      });

      await new Promise((r) => setTimeout(r, 500));

      // Check question counter updated
      const counter = await page.$$eval("p", (els) => {
        const el = els.find((e) => e.className.includes("text-gray-600"));
        return el?.textContent || "";
      });
      expect(counter).toContain("Question 2");

      // Submit button should be back
      const hasSubmitButton = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        return buttons.some((btn) => btn.textContent?.includes("Submit"));
      });
      expect(hasSubmitButton).toBe(true);
    });
  });

  describe("Coding Quiz", () => {
    beforeEach(async () => {
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const codingBtn = buttons.find((btn) => btn.textContent?.includes("Coding Quiz"));
        codingBtn?.click();
      });
      await page.waitForSelector("textarea", { timeout: 5000 });
    });

    it("should display code input area", async () => {
      const codeInput = await page.$("textarea");
      expect(codeInput).toBeTruthy();
    });

    it("should enable submit when code is entered", async () => {
      // Submit should be disabled initially
      let isDisabled = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const submitBtn = buttons.find((btn) => btn.textContent?.includes("Submit"));
        return submitBtn ? (submitBtn as HTMLButtonElement).disabled : true;
      });
      expect(isDisabled).toBe(true);

      // Type code
      await page.type("textarea", "console.log('test')");

      // Submit should be enabled
      isDisabled = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const submitBtn = buttons.find((btn) => btn.textContent?.includes("Submit"));
        return submitBtn ? (submitBtn as HTMLButtonElement).disabled : true;
      });
      expect(isDisabled).toBe(false);
    });

    it("should submit code and show feedback", async () => {
      // Enter code
      await page.type("textarea", "console.log('test')");

      // Submit
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const submitBtn = buttons.find((btn) => btn.textContent?.includes("Submit"));
        submitBtn?.click();
      });

      await new Promise((r) => setTimeout(r, 500));

      // Should show feedback
      const feedback = await page.$("div.rounded-lg.p-4");
      expect(feedback).toBeTruthy();

      // Button should change to "Next Question"
      const hasNextButton = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        return buttons.some((btn) => btn.textContent?.includes("Next Question"));
      });
      expect(hasNextButton).toBe(true);
    });
  });

  describe("Fill in the Blanks Quiz", () => {
    beforeEach(async () => {
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const fillBtn = buttons.find((btn) => btn.textContent?.includes("Fill in the Blanks"));
        fillBtn?.click();
      });
      await page.waitForSelector("input[type='text']", { timeout: 5000 });
    });

    it("should display code with blank inputs", async () => {
      const inputs = await page.$$("input[type='text']");
      expect(inputs.length).toBeGreaterThan(0);
    });

    it("should enable submit when all blanks are filled", async () => {
      const inputs = await page.$$("input[type='text']");

      // Submit should be disabled initially
      let isDisabled = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const submitBtn = buttons.find((btn) => btn.textContent?.includes("Submit"));
        return submitBtn ? (submitBtn as HTMLButtonElement).disabled : true;
      });
      expect(isDisabled).toBe(true);

      // Fill all inputs
      for (const input of inputs) {
        await input.type("test");
      }

      // Submit should be enabled
      isDisabled = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const submitBtn = buttons.find((btn) => btn.textContent?.includes("Submit"));
        return submitBtn ? (submitBtn as HTMLButtonElement).disabled : true;
      });
      expect(isDisabled).toBe(false);
    });

    it("should submit answers and show feedback", async () => {
      const inputs = await page.$$("input[type='text']");

      // Fill all blanks
      for (const input of inputs) {
        await input.type("answer");
      }

      // Submit
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const submitBtn = buttons.find((btn) => btn.textContent?.includes("Submit"));
        submitBtn?.click();
      });

      await new Promise((r) => setTimeout(r, 500));

      // Should show feedback
      const feedback = await page.$("div.rounded-lg.p-4");
      expect(feedback).toBeTruthy();

      // Button should change to "Next Question"
      const hasNextButton = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        return buttons.some((btn) => btn.textContent?.includes("Next Question"));
      });
      expect(hasNextButton).toBe(true);
    });
  });
});
