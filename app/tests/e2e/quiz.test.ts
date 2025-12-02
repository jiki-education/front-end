 
// ESLint doesn't understand that textContent can be null and Array.find() can return undefined
// These optional chains are defensive programming for DOM queries

 
// Type assertions to HTMLButtonElement are necessary to access the disabled property
// which doesn't exist on the generic Element type returned by querySelectorAll

import { test, expect } from "@playwright/test";

test.describe("Quiz Page E2E", () => {
  // Warm up the page compilation before running tests in parallel
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/test/quiz");
    await page.locator("h1").waitFor();
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/test/quiz");
    await page.locator("h1").waitFor();
  });

  test.describe("Page Layout", () => {
    test("should load the quiz test page", async ({ page }) => {
      const title = await page.locator("h1").textContent();
      expect(title).toBe("Quiz Test Page");

      // Check that all quiz type buttons are present
      const buttons = await page.locator("button").allTextContents();
      expect(buttons.map((b) => b.trim()).filter((t) => t)).toContain("Multiple Choice");
      expect(buttons.map((b) => b.trim()).filter((t) => t)).toContain("Coding Quiz");
      expect(buttons.map((b) => b.trim()).filter((t) => t)).toContain("Fill in the Blanks");
    });

    test("should display the current question counter", async ({ page }) => {
      const counter = await page.locator("p.text-gray-600").first().textContent();
      expect(counter).toContain("Question 1 of");
    });
  });

  test.describe("Quiz Type Switching", () => {
    test("should switch between quiz types", async ({ page }) => {
      // Start with multiple choice
      const counter = await page.locator("p.text-gray-600").first().textContent();
      expect(counter).toContain("Multiple Choice");

      // Switch to coding quiz
      await page.getByRole("button", { name: "Coding Quiz" }).click();
      await expect(page.locator("p.text-gray-600").first()).toContainText("Coding:");

      // Switch to fill-in quiz
      await page.getByRole("button", { name: "Fill in the Blanks" }).click();
      await expect(page.locator("p.text-gray-600").first()).toContainText("Fill in the Blanks:");
    });

    test("should highlight the active quiz type button", async ({ page }) => {
      // Check initial state - Multiple Choice should be active (blue)
      let button = page.getByRole("button", { name: "Multiple Choice" });
      await expect(button).toHaveClass(/bg-blue-600/);

      // Click Coding Quiz
      await page.getByRole("button", { name: "Coding Quiz" }).click();

      // Check Coding Quiz is now active
      button = page.getByRole("button", { name: "Coding Quiz" });
      await expect(button).toHaveClass(/bg-blue-600/);

      // Multiple Choice should no longer be active
      button = page.getByRole("button", { name: "Multiple Choice" });
      await expect(button).toHaveClass(/bg-white/);
    });
  });

  test.describe("Multiple Choice Quiz", () => {
    test("should display quiz question and options", async ({ page }) => {
      // Quiz card should be visible
      const quizCard = page.locator(".bg-white.rounded-xl");
      await expect(quizCard.first()).toBeVisible();

      // Look for quiz option buttons (they have letter prefixes like A., B., etc.)
      const optionCount = await page.locator("button").evaluateAll((buttons) => {
        return buttons.filter((btn) => {
          const text = btn.textContent || "";
          return /^[A-Z]\./.test(text);
        }).length;
      });
      expect(optionCount).toBeGreaterThan(0);
    });

    test("should allow selecting an option", async ({ page }) => {
      // Get all buttons and filter for quiz options
      const options = await page.locator("button").all();
      const quizOptions = [];
      for (const option of options) {
        const text = await option.textContent();
        if (text && /^[A-Z]\./.test(text)) {
          quizOptions.push(option);
        }
      }
      expect(quizOptions.length).toBeGreaterThan(0);

      // Click first option
      await quizOptions[0].click();

      // Check that submit button is enabled
      const submitBtn = page.getByRole("button", { name: "Submit" });
      await expect(submitBtn).toBeEnabled();
    });

    test("should submit answer and show feedback", async ({ page }) => {
      // Get quiz option buttons
      const options = await page.locator("button").all();
      const quizOptions = [];
      for (const option of options) {
        const text = await option.textContent();
        if (text && /^[A-Z]\./.test(text)) {
          quizOptions.push(option);
        }
      }
      expect(quizOptions.length).toBeGreaterThan(0);

      // Select first option
      await quizOptions[0].click();

      // Submit answer
      await page.getByRole("button", { name: "Submit" }).click();

      // Button should change to "Next Question"
      await expect(page.getByRole("button", { name: "Next Question" })).toBeVisible();

      // Feedback should be visible (look for info box)
      const feedback = page.locator("div.rounded-lg.p-4");
      await expect(feedback.first()).toBeVisible();
    });

    test("should navigate to next question", async ({ page }) => {
      // Select and submit first question
      const options = await page.locator("button").all();
      const quizOptions = [];
      for (const option of options) {
        const text = await option.textContent();
        if (text && /^[A-Z]\./.test(text)) {
          quizOptions.push(option);
        }
      }
      expect(quizOptions.length).toBeGreaterThan(0);
      await quizOptions[0].click();

      await page.getByRole("button", { name: "Submit" }).click();
      await page.getByRole("button", { name: "Next Question" }).click();

      // Check question counter updated
      await expect(page.locator("p.text-gray-600").first()).toContainText("Question 2");

      // Submit button should be back
      await expect(page.getByRole("button", { name: "Submit" })).toBeVisible();
    });
  });

  test.describe("Coding Quiz", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole("button", { name: "Coding Quiz" }).click();
      await page.locator("textarea").waitFor();
    });

    test("should display code input area", async ({ page }) => {
      const codeInput = page.locator("textarea");
      await expect(codeInput).toBeVisible();
    });

    test("should enable submit when code is entered", async ({ page }) => {
      // Submit should be disabled initially
      const submitBtn = page.getByRole("button", { name: "Submit" });
      await expect(submitBtn).toBeDisabled();

      // Type code
      await page.locator("textarea").fill("console.log('test')");

      // Submit should be enabled
      await expect(submitBtn).toBeEnabled();
    });

    test("should submit code and show feedback", async ({ page }) => {
      // Enter code
      await page.locator("textarea").fill("console.log('test')");

      // Submit
      await page.getByRole("button", { name: "Submit" }).click();

      // Should show feedback
      const feedback = page.locator("div.rounded-lg.p-4");
      await expect(feedback.first()).toBeVisible();

      // Button should change to "Next Question"
      await expect(page.getByRole("button", { name: "Next Question" })).toBeVisible();
    });
  });

  test.describe("Fill in the Blanks Quiz", () => {
    test.beforeEach(async ({ page }) => {
      await page.getByRole("button", { name: "Fill in the Blanks" }).click();
      await page.locator("input[type='text']").first().waitFor();
    });

    test("should display code with blank inputs", async ({ page }) => {
      const inputs = await page.locator("input[type='text']").count();
      expect(inputs).toBeGreaterThan(0);
    });

    test("should enable submit when all blanks are filled", async ({ page }) => {
      const inputs = await page.locator("input[type='text']").all();

      // Submit should be disabled initially
      const submitBtn = page.getByRole("button", { name: "Submit" });
      await expect(submitBtn).toBeDisabled();

      // Fill all inputs
      for (const input of inputs) {
        await input.fill("test");
      }

      // Submit should be enabled
      await expect(submitBtn).toBeEnabled();
    });

    test("should submit answers and show feedback", async ({ page }) => {
      const inputs = await page.locator("input[type='text']").all();

      // Fill all blanks
      for (const input of inputs) {
        await input.fill("answer");
      }

      // Submit
      await page.getByRole("button", { name: "Submit" }).click();

      // Should show feedback
      const feedback = page.locator("div.rounded-lg.p-4");
      await expect(feedback.first()).toBeVisible();

      // Button should change to "Next Question"
      await expect(page.getByRole("button", { name: "Next Question" })).toBeVisible();
    });
  });
});
