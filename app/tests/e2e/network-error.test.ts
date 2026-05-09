/**
 * E2E tests for network error handling
 * Tests real user scenarios with network failures, auth errors, and recovery
 */

/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import type { Page } from "@playwright/test";
import { test, expect } from "./helpers/test";
import { API_BASE } from "./helpers/api-mocks";
import { getTestUrl } from "./helpers/getTestUrl";

const helpers = {
  async goToTestPage(page: Page) {
    await page.goto("/test/network");
    await page.locator('[data-testid="load-levels-button"]').waitFor();
  },

  /**
   * Simulate network failure by aborting all API requests.
   * Aborts (not 404 fulfills) are required here because the test exercises
   * the API client's TypeError-retry logic.
   */
  async setupNetworkFailure(page: Page) {
    await page.route(`${API_BASE}/**`, (route) => route.abort("failed"));
  },

  async setupSuccessfulResponses(page: Page) {
    await page.unroute(`${API_BASE}/**`);
    await page.route(`${API_BASE}/internal/levels**`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          levels: [{ id: 1, slug: "level-1", name: "Level 1", description: "Test level", lessons: [] }]
        })
      })
    );
    await page.route(`${API_BASE}/external/concepts**`, (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          results: [{ id: 1, slug: "concept-1", title: "Test Concept" }],
          meta: { current_page: 1, total_count: 1, total_pages: 1 }
        })
      })
    );
  },

  async setupAuthError(page: Page) {
    await page.route(`${API_BASE}/**`, (route) =>
      route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: "Unauthorized" })
      })
    );
  },

  async setupRateLimitError(page: Page, retryAfterSeconds: number = 3) {
    await page.route(`${API_BASE}/**`, (route) =>
      route.fulfill({
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": retryAfterSeconds.toString(),
          "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Access-Control-Expose-Headers": "Retry-After"
        },
        body: JSON.stringify({ error: "Rate limit exceeded" })
      })
    );
  },

  async setupRateLimitWithRetry(page: Page, retryAfterSeconds: number = 2) {
    let requestCount = 0;

    await page.route(`${API_BASE}/internal/levels**`, (route) => {
      requestCount++;
      if (requestCount === 1) {
        return route.fulfill({
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": retryAfterSeconds.toString(),
            "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Expose-Headers": "Retry-After"
          },
          body: JSON.stringify({ error: "Rate limit exceeded" })
        });
      }
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          levels: [{ id: 1, slug: "level-1", name: "Level 1", description: "Test level", lessons: [] }]
        })
      });
    });

    return { getRequestCount: () => requestCount };
  },

  async waitForModal(page: Page) {
    await page.locator('[role="dialog"]').waitFor();
  },

  async waitForModalToClose(page: Page, timeout = 10000) {
    await page.waitForFunction(() => !document.querySelector('[role="dialog"]'), undefined, { timeout });
  },

  async getModalText(page: Page) {
    return await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      return modal?.textContent;
    });
  },

  async countModals(page: Page) {
    return await page.evaluate(() => {
      return document.querySelectorAll('[role="dialog"]').length;
    });
  }
};

test.describe("Network Error Handling E2E", () => {
  test.describe("Network Failure and Recovery", () => {
    test("should show loading then modal on network failure, and recover when network returns", async ({ page }) => {
      await helpers.goToTestPage(page);

      await helpers.setupNetworkFailure(page);

      await page.locator('[data-testid="load-levels-button"]').click();

      await helpers.waitForModal(page);

      const modalText = await helpers.getModalText(page);
      expect(modalText).toContain("Whoops! Lost connection");
      expect(modalText).toContain("Jiki got a little tangled up and dropped the connection");

      await helpers.setupSuccessfulResponses(page);

      await helpers.waitForModalToClose(page);

      await page.locator('[data-testid="success-message"]').waitFor();
      const successText = await page.locator('[data-testid="success-message"]').textContent();
      expect(successText).toContain("Successfully loaded");
    });

    test("should handle multiple simultaneous API calls with single modal", async ({ page }) => {
      await helpers.goToTestPage(page);

      let apiCallCount = 0;

      await page.route(`${API_BASE}/**`, (route) => {
        apiCallCount++;
        return route.abort("failed");
      });

      await page.locator('[data-testid="load-multiple-button"]').click();

      await helpers.waitForModal(page);

      const modalCount = await helpers.countModals(page);
      expect(modalCount).toBe(1);

      expect(apiCallCount).toBeGreaterThanOrEqual(2);

      await helpers.setupSuccessfulResponses(page);

      await helpers.waitForModalToClose(page);

      await page.locator('[data-testid="success-message"]').waitFor();
      const successText = await page.locator('[data-testid="success-message"]').textContent();
      expect(successText).toContain("Successfully loaded");
      expect(successText).toContain("concepts");
    });
  });

  test.describe("Authentication Error Flow", () => {
    test("should show session expired modal on auth error", async ({ page }) => {
      await helpers.goToTestPage(page);

      await helpers.setupAuthError(page);

      await page.locator('[data-testid="load-levels-button"]').click();

      await page.locator('[role="dialog"]').waitFor({ timeout: 2000 });

      const modalText = await helpers.getModalText(page);
      expect(modalText).toContain("You've been Logged out");
      expect(modalText).toContain("Reload Page");

      const reloadButton = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        return buttons.some((btn) => btn.textContent?.includes("Reload Page"));
      });
      expect(reloadButton).toBe(true);
    });

    test("should reload page when clicking Reload Page button", async ({ page }) => {
      await helpers.goToTestPage(page);

      await helpers.setupAuthError(page);

      await page.locator('[data-testid="load-levels-button"]').click();

      await helpers.waitForModal(page);

      const navigationPromise = page.waitForNavigation();

      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const reloadButton = buttons.find((btn) => btn.textContent?.includes("Reload Page"));
        if (reloadButton) {
          reloadButton.click();
        }
      });

      await navigationPromise;

      const currentUrl = page.url();
      expect(currentUrl).toBe(getTestUrl("/test/network"));
    });
  });

  test.describe("Rate Limit Error Flow", () => {
    test("should show rate limit modal with countdown", async ({ page }) => {
      await helpers.goToTestPage(page);

      await helpers.setupRateLimitError(page, 3);

      await page.locator('[data-testid="load-levels-button"]').click();

      await helpers.waitForModal(page);

      const modalText = await helpers.getModalText(page);
      expect(modalText).toContain("You've moved too fast");
      expect(modalText).toContain("s");

      const countdownExists = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"]');
        const modalText = modal?.textContent || "";
        return /\d+\s*second/.test(modalText);
      });
      expect(countdownExists).toBe(true);
    });

    test("should retry after rate limit wait time and close modal", async ({ page }) => {
      await helpers.goToTestPage(page);

      const tracker = await helpers.setupRateLimitWithRetry(page, 2);

      await page.locator('[data-testid="load-levels-button"]').click();

      await helpers.waitForModal(page);

      await helpers.waitForModalToClose(page);

      expect(tracker.getRequestCount()).toBe(2);

      await page.locator('[data-testid="success-message"]').waitFor();
      const successText = await page.locator('[data-testid="success-message"]').textContent();
      expect(successText).toContain("Successfully loaded");
    });
  });

  test.describe("Modal Non-Dismissibility", () => {
    // TODO: Implement non-dismissible modal feature
    // Currently error modals CAN be dismissed (have close button and clickable overlay)
    // These tests document the desired behavior that error modals should NOT be dismissible
    test.skip("should not show close button on error modals", async ({ page }) => {
      await helpers.goToTestPage(page);

      await helpers.setupNetworkFailure(page);

      await page.locator('[data-testid="load-levels-button"]').click();

      await helpers.waitForModal(page);

      const hasCloseButton = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"]');
        const closeButton = modal?.querySelector('button[aria-label="Close modal"]');
        return closeButton !== null;
      });

      expect(hasCloseButton).toBe(false);
    });

    // TODO: Implement non-dismissible modal feature
    test.skip("should not close modal when clicking overlay for network errors", async ({ page }) => {
      await helpers.goToTestPage(page);

      await helpers.setupNetworkFailure(page);

      await page.locator('[data-testid="load-levels-button"]').click();

      await helpers.waitForModal(page);

      await page.evaluate(() => {
        const overlay = document.querySelector(".bg-black");
        if (overlay) {
          (overlay as HTMLElement).click();
        }
      });

      await page.waitForTimeout(500);

      const modalStillVisible = page.locator('[role="dialog"]');
      await expect(modalStillVisible).toBeVisible();
    });
  });
});
