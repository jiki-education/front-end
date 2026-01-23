/**
 * E2E tests for network error handling
 * Tests real user scenarios with network failures, auth errors, and recovery
 */

/* eslint-disable @typescript-eslint/no-unnecessary-condition */

import { test, expect, type Page } from "@playwright/test";
import { getTestUrl } from "./helpers/getTestUrl";

// Helper functions for DRYing up common test patterns
const helpers = {
  /**
   * Navigate to test page and wait for it to load
   */
  async goToTestPage(page: Page) {
    await page.goto("/test/network");
    await page.locator('[data-testid="load-levels-button"]').waitFor();
  },

  /**
   * Simulate network failure by aborting all API requests
   */
  setupNetworkFailure(page: Page) {
    void page.route("**/*", (route) => {
      const url = route.request().url();
      if (url.includes("/api/") || url.includes("/internal/") || url.includes("/external/")) {
        void route.abort("failed");
      } else {
        void route.continue();
      }
    });
  },

  /**
   * Restore network and mock successful API responses
   */
  async setupSuccessfulResponses(page: Page) {
    await page.unroute("**/*");
    await page.route("**/*", (route) => {
      const url = route.request().url();

      if (url.includes("/internal/levels")) {
        void route.fulfill({
          status: 200,
          contentType: "application/json",
          headers: {
            "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
          },
          body: JSON.stringify({
            levels: [
              {
                id: 1,
                slug: "level-1",
                name: "Level 1",
                description: "Test level",
                lessons: []
              }
            ]
          })
        });
      } else if (url.includes("/external/concepts")) {
        void route.fulfill({
          status: 200,
          contentType: "application/json",
          headers: {
            "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
          },
          body: JSON.stringify({
            results: [
              {
                id: 1,
                slug: "concept-1",
                title: "Test Concept"
              }
            ],
            meta: {
              current_page: 1,
              total_count: 1,
              total_pages: 1
            }
          })
        });
      } else {
        void route.continue();
      }
    });
  },

  /**
   * Simulate authentication error (401) responses
   */
  setupAuthError(page: Page) {
    void page.route("**/*", (route) => {
      const url = route.request().url();

      // Intercept internal, external API calls and refresh token endpoint
      if (url.includes("/internal/") || url.includes("/external/") || url.includes("/auth/refresh")) {
        void route.fulfill({
          status: 401,
          contentType: "application/json",
          headers: {
            "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
          },
          body: JSON.stringify({ error: "Unauthorized" })
        });
      } else {
        void route.continue();
      }
    });
  },

  /**
   * Simulate rate limit error (429) with Retry-After header
   */
  setupRateLimitError(page: Page, retryAfterSeconds: number = 3) {
    void page.route("**/*", (route) => {
      const url = route.request().url();

      // Handle CORS preflight requests
      if (route.request().method() === "OPTIONS" && (url.includes("/internal/") || url.includes("/external/"))) {
        void route.fulfill({
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
          },
          body: ""
        });
      } else if (url.includes("/internal/") || url.includes("/external/")) {
        void route.fulfill({
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
        });
      } else {
        void route.continue();
      }
    });
  },

  /**
   * Simulate rate limit error that succeeds on retry
   * Returns 429 on first request, then 200 on subsequent requests
   */
  setupRateLimitWithRetry(page: Page, retryAfterSeconds: number = 2) {
    let requestCount = 0;

    void page.route("**/*", (route) => {
      const url = route.request().url();

      // Handle CORS preflight requests
      if (route.request().method() === "OPTIONS" && (url.includes("/internal/") || url.includes("/external/"))) {
        void route.fulfill({
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
          },
          body: ""
        });
      } else if (url.includes("/internal/levels")) {
        requestCount++;
        if (requestCount === 1) {
          void route.fulfill({
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
          });
        } else {
          void route.fulfill({
            status: 200,
            contentType: "application/json",
            headers: {
              "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
              "Access-Control-Allow-Credentials": "true",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization"
            },
            body: JSON.stringify({
              levels: [
                {
                  id: 1,
                  slug: "level-1",
                  name: "Level 1",
                  description: "Test level",
                  lessons: []
                }
              ]
            })
          });
        }
      } else {
        void route.continue();
      }
    });

    return { getRequestCount: () => requestCount };
  },

  /**
   * Wait for modal to appear
   */
  async waitForModal(page: Page) {
    await page.locator('[role="dialog"]').waitFor();
  },

  /**
   * Wait for modal to disappear
   */
  async waitForModalToClose(page: Page, timeout = 10000) {
    await page.waitForFunction(() => !document.querySelector('[role="dialog"]'), { timeout });
  },

  /**
   * Get modal text content
   */
  async getModalText(page: Page) {
    return await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      return modal?.textContent;
    });
  },

  /**
   * Count number of modals shown
   */
  async countModals(page: Page) {
    return await page.evaluate(() => {
      return document.querySelectorAll('[role="dialog"]').length;
    });
  }
};

test.describe("Network Error Handling E2E", () => {
  test.describe("Network Failure and Recovery", () => {
    test("should show loading then modal on network failure, and recover when network returns", async ({ page }) => {
      // Navigate to test page
      await helpers.goToTestPage(page);

      // Simulate network failure
      helpers.setupNetworkFailure(page);

      // Click the button to trigger API call
      await page.locator('[data-testid="load-levels-button"]').click();

      // Wait for modal to appear after ~1s of retrying
      await helpers.waitForModal(page);

      // Verify modal has the new connection error message
      const modalText = await helpers.getModalText(page);
      expect(modalText).toContain("Whoops! Lost connection");
      expect(modalText).toContain("Jiki got a little tangled up and dropped the connection");

      // Restore network
      await helpers.setupSuccessfulResponses(page);

      // Modal should auto-close when network recovers
      await helpers.waitForModalToClose(page);

      // Success message should appear
      await page.locator('[data-testid="success-message"]').waitFor();
      const successText = await page.locator('[data-testid="success-message"]').textContent();
      expect(successText).toContain("Successfully loaded");
    });

    test("should handle multiple simultaneous API calls with single modal", async ({ page }) => {
      // Navigate to test page
      await helpers.goToTestPage(page);

      let apiCallCount = 0;

      // Track API calls and simulate network failure
      void page.route("**/*", (route) => {
        const url = route.request().url();
        if (url.includes("/internal/") || url.includes("/external/")) {
          apiCallCount++;
          void route.abort("failed");
        } else {
          void route.continue();
        }
      });

      // Click button to trigger multiple simultaneous API calls
      await page.locator('[data-testid="load-multiple-button"]').click();

      // Wait for modal to appear
      await helpers.waitForModal(page);

      // Count how many modals are shown (should be only 1)
      const modalCount = await helpers.countModals(page);
      expect(modalCount).toBe(1);

      // Verify multiple API calls were attempted (2: levels + concepts)
      expect(apiCallCount).toBeGreaterThanOrEqual(2);

      // Restore network with successful responses
      await helpers.setupSuccessfulResponses(page);

      // Single modal should close
      await helpers.waitForModalToClose(page);

      // Success message should appear
      await page.locator('[data-testid="success-message"]').waitFor();
      const successText = await page.locator('[data-testid="success-message"]').textContent();
      expect(successText).toContain("Successfully loaded");
      expect(successText).toContain("concepts"); // Should show both levels and concepts
    });
  });

  test.describe("Authentication Error Flow", () => {
    test("should show session expired modal on auth error", async ({ page }) => {
      // Navigate to test page
      await helpers.goToTestPage(page);

      // Set up 401 auth error responses
      helpers.setupAuthError(page);

      // Click button to trigger API call
      await page.locator('[data-testid="load-levels-button"]').click();

      // Modal should appear immediately (auth errors don't wait, no retry)
      await page.locator('[role="dialog"]').waitFor({ timeout: 2000 });

      // Verify modal content
      const modalText = await helpers.getModalText(page);
      expect(modalText).toContain("You've been Logged out");
      expect(modalText).toContain("Reload Page");

      // Verify "Reload Page" button exists
      const reloadButton = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        return buttons.some((btn) => btn.textContent?.includes("Reload Page"));
      });
      expect(reloadButton).toBe(true);
    });

    test("should reload page when clicking Reload Page button", async ({ page }) => {
      // Navigate to test page
      await helpers.goToTestPage(page);

      // Set up 401 auth error responses
      helpers.setupAuthError(page);

      // Click button to trigger API call
      await page.locator('[data-testid="load-levels-button"]').click();

      // Wait for session expired modal
      await helpers.waitForModal(page);

      // Listen for navigation (page reload)
      const navigationPromise = page.waitForNavigation();

      // Click "Reload Page" button
      await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        const reloadButton = buttons.find((btn) => btn.textContent?.includes("Reload Page"));
        if (reloadButton) {
          reloadButton.click();
        }
      });

      // Wait for navigation to complete
      await navigationPromise;

      // Page should reload (URL should be the same)
      const currentUrl = page.url();
      expect(currentUrl).toBe(getTestUrl("/test/network"));
    });
  });

  test.describe("Rate Limit Error Flow", () => {
    test("should show rate limit modal with countdown", async ({ page }) => {
      // Navigate to test page
      await helpers.goToTestPage(page);

      // Set up rate limit error with 3 second retry-after
      helpers.setupRateLimitError(page, 3);

      // Click button to trigger API call
      await page.locator('[data-testid="load-levels-button"]').click();

      // Modal should appear immediately for rate limit
      await helpers.waitForModal(page);

      // Verify modal content
      const modalText = await helpers.getModalText(page);
      expect(modalText).toContain("You've moved too fast");
      expect(modalText).toContain("s"); // Countdown should show seconds

      // Verify countdown timer exists (should show 3s or 2s depending on timing)
      const countdownExists = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"]');
        // Look for the countdown number in the modal text
        const modalText = modal?.textContent || "";
        return /\d+\s*second/.test(modalText);
      });
      expect(countdownExists).toBe(true);
    });

    test("should retry after rate limit wait time and close modal", async ({ page }) => {
      // Navigate to test page
      await helpers.goToTestPage(page);

      // Set up rate limit error that succeeds on retry
      const tracker = helpers.setupRateLimitWithRetry(page, 2);

      // Click button to trigger API call
      await page.locator('[data-testid="load-levels-button"]').click();

      // Modal should appear
      await helpers.waitForModal(page);

      // Modal should auto-close after retry succeeds (give at least 2s + 1s buffer)
      await helpers.waitForModalToClose(page, 5000);

      // Verify second request was made
      expect(tracker.getRequestCount()).toBe(2);

      // Success message should appear
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
      // Navigate to test page
      await helpers.goToTestPage(page);

      // Simulate network failure
      helpers.setupNetworkFailure(page);

      // Click button to trigger API call
      await page.locator('[data-testid="load-levels-button"]').click();

      // Wait for modal to appear
      await helpers.waitForModal(page);

      // Check for close button (X button in top right)
      const hasCloseButton = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"]');
        const closeButton = modal?.querySelector('button[aria-label="Close modal"]');
        return closeButton !== null;
      });

      // Error modals should not have a close button
      expect(hasCloseButton).toBe(false);
    });

    // TODO: Implement non-dismissible modal feature
    test.skip("should not close modal when clicking overlay for network errors", async ({ page }) => {
      // Navigate to test page
      await helpers.goToTestPage(page);

      // Simulate network failure
      helpers.setupNetworkFailure(page);

      // Click button to trigger API call
      await page.locator('[data-testid="load-levels-button"]').click();

      // Wait for modal to appear
      await helpers.waitForModal(page);

      // Try clicking overlay (outside modal)
      await page.evaluate(() => {
        const overlay = document.querySelector(".bg-black");
        if (overlay) {
          (overlay as HTMLElement).click();
        }
      });

      // Wait a bit
      await page.waitForTimeout(500);

      // Modal should still be visible
      const modalStillVisible = page.locator('[role="dialog"]');
      await expect(modalStillVisible).toBeVisible();
    });
  });
});
