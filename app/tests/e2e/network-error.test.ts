/**
 * E2E tests for network error handling
 * Tests real user scenarios with network failures, auth errors, and recovery
 */

/* eslint-disable @typescript-eslint/no-unnecessary-condition */

// Helper functions for DRYing up common test patterns
const helpers = {
  /**
   * Navigate to test page and wait for it to load
   */
  async goToTestPage() {
    await page.goto("http://localhost:3081/test/network");
    await page.waitForSelector('[data-testid="load-levels-button"]');
  },

  /**
   * Simulate network failure by aborting all API requests
   */
  setupNetworkFailure() {
    page.on("request", (request) => {
      if (request.url().includes("/api/") || request.url().includes("/internal/")) {
        void request.abort("failed");
      } else {
        void request.continue();
      }
    });
  },

  /**
   * Restore network and mock successful API responses
   */
  setupSuccessfulResponses() {
    page.removeAllListeners("request");
    page.on("request", (request) => {
      const url = request.url();

      if (url.includes("/internal/levels")) {
        void request.respond({
          status: 200,
          contentType: "application/json",
          headers: {
            "Access-Control-Allow-Origin": "*",
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
      } else if (url.includes("/internal/concepts")) {
        void request.respond({
          status: 200,
          contentType: "application/json",
          headers: {
            "Access-Control-Allow-Origin": "*",
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
        void request.continue();
      }
    });
  },

  /**
   * Simulate authentication error (401) responses
   */
  setupAuthError() {
    page.on("request", (request) => {
      if (request.url().includes("/internal/")) {
        void request.respond({
          status: 401,
          contentType: "application/json",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
          },
          body: JSON.stringify({ error: "Unauthorized" })
        });
      } else {
        void request.continue();
      }
    });
  },

  /**
   * Simulate rate limit error (429) with Retry-After header
   */
  setupRateLimitError(retryAfterSeconds: number = 3) {
    page.on("request", (request) => {
      const url = request.url();

      // Handle CORS preflight requests
      if (request.method() === "OPTIONS" && url.includes("/internal/")) {
        void request.respond({
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
          },
          body: ""
        });
      } else if (url.includes("/internal/")) {
        void request.respond({
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": retryAfterSeconds.toString(),
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization",
            "Access-Control-Expose-Headers": "Retry-After"
          },
          body: JSON.stringify({ error: "Rate limit exceeded" })
        });
      } else {
        void request.continue();
      }
    });
  },

  /**
   * Simulate rate limit error that succeeds on retry
   * Returns 429 on first request, then 200 on subsequent requests
   */
  setupRateLimitWithRetry(retryAfterSeconds: number = 2) {
    let requestCount = 0;

    page.on("request", (request) => {
      const url = request.url();

      // Handle CORS preflight requests
      if (request.method() === "OPTIONS" && url.includes("/internal/")) {
        void request.respond({
          status: 200,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization"
          },
          body: ""
        });
      } else if (url.includes("/internal/levels")) {
        requestCount++;
        if (requestCount === 1) {
          void request.respond({
            status: 429,
            headers: {
              "Content-Type": "application/json",
              "Retry-After": retryAfterSeconds.toString(),
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
              "Access-Control-Allow-Headers": "Content-Type, Authorization",
              "Access-Control-Expose-Headers": "Retry-After"
            },
            body: JSON.stringify({ error: "Rate limit exceeded" })
          });
        } else {
          void request.respond({
            status: 200,
            contentType: "application/json",
            headers: {
              "Access-Control-Allow-Origin": "*",
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
        void request.continue();
      }
    });

    return { getRequestCount: () => requestCount };
  },

  /**
   * Wait for modal to appear
   */
  async waitForModal(timeout = 3000) {
    await page.waitForSelector('[role="dialog"]', { timeout });
  },

  /**
   * Wait for modal to disappear
   */
  async waitForModalToClose(timeout = 10000) {
    await page.waitForFunction(() => !document.querySelector('[role="dialog"]'), { timeout });
  },

  /**
   * Get modal text content
   */
  async getModalText() {
    return await page.evaluate(() => {
      const modal = document.querySelector('[role="dialog"]');
      return modal?.textContent;
    });
  },

  /**
   * Count number of modals shown
   */
  async countModals() {
    return await page.evaluate(() => {
      return document.querySelectorAll('[role="dialog"]').length;
    });
  }
};

describe("Network Error Handling E2E", () => {
  beforeEach(async () => {
    // Tests run here
  });

  afterEach(async () => {
    // Clean up: remove all listeners and disable request interception
    page.removeAllListeners("request");
    page.removeAllListeners("console");
    try {
      await page.setRequestInterception(false);
    } catch {
      // Ignore errors if interception wasn't enabled
    }
  });

  describe("Network Failure and Recovery", () => {
    it("should show loading then modal on network failure, and recover when network returns", async () => {
      // Navigate to test page
      await helpers.goToTestPage();

      // Enable request interception
      await page.setRequestInterception(true);

      // Simulate network failure
      helpers.setupNetworkFailure();

      // Click the button to trigger API call
      await page.click('[data-testid="load-levels-button"]');

      // Wait for modal to appear after ~1s of retrying
      await helpers.waitForModal();

      // Verify modal has "Connection Error" message
      const modalText = await helpers.getModalText();
      expect(modalText).toContain("Connection Error");
      expect(modalText).toContain("retrying automatically");

      // Restore network
      helpers.setupSuccessfulResponses();

      // Modal should auto-close when network recovers
      await helpers.waitForModalToClose();

      // Success message should appear
      await page.waitForSelector('[data-testid="success-message"]', { timeout: 5000 });
      const successText = await page.$eval('[data-testid="success-message"]', (el) => el.textContent);
      expect(successText).toContain("Successfully loaded");
    }, 30000);

    it("should handle multiple simultaneous API calls with single modal", async () => {
      // Navigate to test page
      await helpers.goToTestPage();

      // Enable request interception
      await page.setRequestInterception(true);

      let apiCallCount = 0;

      // Track API calls and simulate network failure
      page.on("request", (request) => {
        if (request.url().includes("/internal/")) {
          apiCallCount++;
          void request.abort("failed");
        } else {
          void request.continue();
        }
      });

      // Click button to trigger multiple simultaneous API calls
      await page.click('[data-testid="load-multiple-button"]');

      // Wait for modal to appear
      await helpers.waitForModal();

      // Count how many modals are shown (should be only 1)
      const modalCount = await helpers.countModals();
      expect(modalCount).toBe(1);

      // Verify multiple API calls were attempted (2: levels + concepts)
      expect(apiCallCount).toBeGreaterThanOrEqual(2);

      // Restore network with successful responses
      helpers.setupSuccessfulResponses();

      // Single modal should close
      await helpers.waitForModalToClose();

      // Success message should appear
      await page.waitForSelector('[data-testid="success-message"]', { timeout: 5000 });
      const successText = await page.$eval('[data-testid="success-message"]', (el) => el.textContent);
      expect(successText).toContain("Successfully loaded");
      expect(successText).toContain("concepts"); // Should show both levels and concepts
    }, 30000);
  });

  describe("Authentication Error Flow", () => {
    it("should show session expired modal on auth error", async () => {
      // Navigate to test page
      await helpers.goToTestPage();

      // Enable request interception
      await page.setRequestInterception(true);

      // Set up 401 auth error responses
      helpers.setupAuthError();

      // Click button to trigger API call
      await page.click('[data-testid="load-levels-button"]');

      // Modal should appear immediately (auth errors don't wait, no retry)
      await page.waitForSelector('[role="dialog"]', { timeout: 2000 });

      // Verify modal content
      const modalText = await helpers.getModalText();
      expect(modalText).toContain("Session Expired");
      expect(modalText).toContain("Reload Page");

      // Verify "Reload Page" button exists
      const reloadButton = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        return buttons.some((btn) => btn.textContent?.includes("Reload Page"));
      });
      expect(reloadButton).toBe(true);
    }, 15000);

    it("should reload page when clicking Reload Page button", async () => {
      // Navigate to test page
      await helpers.goToTestPage();

      // Enable request interception
      await page.setRequestInterception(true);

      // Set up 401 auth error responses
      helpers.setupAuthError();

      // Click button to trigger API call
      await page.click('[data-testid="load-levels-button"]');

      // Wait for session expired modal
      await helpers.waitForModal(2000);

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
      expect(currentUrl).toBe("http://localhost:3081/test/network");
    }, 15000);
  });

  describe("Rate Limit Error Flow", () => {
    it("should show rate limit modal with countdown", async () => {
      // Navigate to test page
      await helpers.goToTestPage();

      // Enable request interception
      await page.setRequestInterception(true);

      // Set up rate limit error with 3 second retry-after
      helpers.setupRateLimitError(3);

      // Click button to trigger API call
      await page.click('[data-testid="load-levels-button"]');

      // Modal should appear immediately for rate limit
      await helpers.waitForModal(2000);

      // Verify modal content
      const modalText = await helpers.getModalText();
      expect(modalText).toContain("Too Many Requests");
      expect(modalText).toContain("s"); // Countdown should show seconds

      // Verify countdown timer exists (should show 3s or 2s depending on timing)
      const countdownExists = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"]');
        // Look for tabular-nums class which is used for countdown
        const countdown = modal?.querySelector(".tabular-nums");
        return countdown !== null;
      });
      expect(countdownExists).toBe(true);
    }, 15000);

    it("should retry after rate limit wait time and close modal", async () => {
      // Navigate to test page
      await helpers.goToTestPage();

      // Enable request interception
      await page.setRequestInterception(true);

      // Set up rate limit error that succeeds on retry
      const tracker = helpers.setupRateLimitWithRetry(2);

      // Click button to trigger API call
      await page.click('[data-testid="load-levels-button"]');

      // Modal should appear
      await helpers.waitForModal(1000);

      // Modal should auto-close after retry succeeds (give at least 2s + 1s buffer)
      await helpers.waitForModalToClose(5000);

      // Verify second request was made
      expect(tracker.getRequestCount()).toBe(2);

      // Success message should appear
      await page.waitForSelector('[data-testid="success-message"]', { timeout: 5000 });
      const successText = await page.$eval('[data-testid="success-message"]', (el) => el.textContent);
      expect(successText).toContain("Successfully loaded");
    }, 15000);
  });

  describe("Modal Non-Dismissibility", () => {
    // TODO: Implement non-dismissible modal feature
    // Currently error modals CAN be dismissed (have close button and clickable overlay)
    // These tests document the desired behavior that error modals should NOT be dismissible
    it.skip("should not show close button on error modals", async () => {
      // Navigate to test page
      await helpers.goToTestPage();

      // Enable request interception
      await page.setRequestInterception(true);

      // Simulate network failure
      helpers.setupNetworkFailure();

      // Click button to trigger API call
      await page.click('[data-testid="load-levels-button"]');

      // Wait for modal to appear
      await helpers.waitForModal();

      // Check for close button (X button in top right)
      const hasCloseButton = await page.evaluate(() => {
        const modal = document.querySelector('[role="dialog"]');
        const closeButton = modal?.querySelector('button[aria-label="Close modal"]');
        return closeButton !== null;
      });

      // Error modals should not have a close button
      expect(hasCloseButton).toBe(false);
    }, 15000);

    // TODO: Implement non-dismissible modal feature
    it.skip("should not close modal when clicking overlay for network errors", async () => {
      // Navigate to test page
      await helpers.goToTestPage();

      // Enable request interception
      await page.setRequestInterception(true);

      // Simulate network failure
      helpers.setupNetworkFailure();

      // Click button to trigger API call
      await page.click('[data-testid="load-levels-button"]');

      // Wait for modal to appear
      await helpers.waitForModal();

      // Try clicking overlay (outside modal)
      await page.evaluate(() => {
        const overlay = document.querySelector(".bg-black");
        if (overlay) {
          (overlay as HTMLElement).click();
        }
      });

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Modal should still be visible
      const modalStillVisible = await page.$('[role="dialog"]');
      expect(modalStillVisible).not.toBeNull();
    }, 15000);
  });
});
