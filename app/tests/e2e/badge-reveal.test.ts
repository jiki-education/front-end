import { test, expect, type Page, type Route } from "@playwright/test";
import { createMockUser } from "../mocks/user";

function mockRequest(route: Route, url: string, status: number, body: any) {
  if (route.request().url().includes(url)) {
    void route.fulfill({
      status,
      contentType: "application/json",
      headers: {
        "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
      },
      body: JSON.stringify(body)
    });
    return true;
  }
  return false;
}

async function setupAuthentication(page: Page) {
  // Clear all auth state first
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.context().clearCookies();

  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  // Create valid JWT tokens
  const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = btoa(JSON.stringify({ sub: "test-user-id", exp: 9999999999 }));
  const signature = "fake-signature";
  const refreshToken = `${header}.${payload}.${signature}`;

  const accessPayload = btoa(
    JSON.stringify({
      sub: "test-user-id",
      exp: Math.floor(Date.now() / 1000) + 300
    })
  );
  const accessToken = `${header}.${accessPayload}.${signature}`;

  // Set authentication cookies
  await page.context().addCookies([
    {
      name: "jiki_refresh_token",
      value: refreshToken,
      domain: ".local.jiki.io",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Strict"
    },
    {
      name: "jiki_access_token",
      value: accessToken,
      domain: ".local.jiki.io",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Strict"
    }
  ]);
}

async function setupBadgesMocks(page: Page) {
  await page.route("**/*", (route) => {
    // Handle OPTIONS requests
    if (route.request().method() === "OPTIONS") {
      void route.fulfill({
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
      return;
    }

    // Mock /internal/me for authentication check
    if (mockRequest(route, "/internal/me", 200, { user: createMockUser() })) {
      return;
    }

    // Mock badges API with test data including unrevealed badges
    if (
      mockRequest(route, "/internal/badges", 200, {
        badges: [
          {
            id: 1,
            name: "First Steps",
            icon: "test-icon-1",
            description: "Completed your first exercise",
            state: "revealed",
            num_awardees: 100,
            unlocked_at: "2024-01-01T00:00:00Z"
          },
          {
            id: 2,
            name: "Code Warrior",
            icon: "test-icon-2",
            description: "Completed 10 exercises",
            state: "unrevealed",
            num_awardees: 50,
            unlocked_at: "2024-01-02T00:00:00Z"
          },
          {
            id: 3,
            name: "Learning Journey",
            icon: "test-icon-3",
            description: "Spent 5 hours learning",
            state: "locked",
            num_awardees: 25
          }
        ],
        num_locked_secret_badges: 5
      })
    ) {
      return;
    }

    // Mock badge reveal API
    if (route.request().url().includes("/internal/badges/2/reveal") && route.request().method() === "PATCH") {
      void route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: {
          "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
          "Access-Control-Allow-Credentials": "true"
        },
        body: JSON.stringify({
          badge: {
            id: 2,
            name: "Code Warrior",
            icon: "test-icon-2",
            description: "Completed 10 exercises",
            revealed: true,
            unlocked_at: "2024-01-02T00:00:00Z"
          }
        })
      });
      return;
    }

    // Continue with other requests
    void route.continue();
  });
}

test.describe("Badge Reveal E2E", () => {
  test("reveals an unrevealed badge when clicked", async ({ page }) => {
    // Set up authentication and API mocks
    await setupAuthentication(page);
    await setupBadgesMocks(page);

    // Navigate to achievements page
    await page.goto("/achievements");

    // Wait for badges to load from API and be rendered
    await page.locator('[data-type="achievement"]').first().waitFor();

    // Verify we have 3 badges as expected from our mock
    const allBadges = page.locator('[data-type="achievement"]');
    await expect(allBadges).toHaveCount(3);

    // Find the Code Warrior badge specifically (we know from mock it should be unrevealed)
    const codeWarriorBadge = page.locator('[data-type="achievement"]:has-text("Code Warrior")').first();

    // Ensure the Code Warrior badge is visible
    await codeWarriorBadge.waitFor();

    // Verify the badge name is "Code Warrior" as per our mock data
    await expect(codeWarriorBadge).toContainText("Code Warrior");

    // The badge should have the "new" class styling (shimmer effect) but not the NEW ribbon yet
    // The NEW ribbon only appears after it's been revealed
    const badgeClasses = await codeWarriorBadge.getAttribute("class");
    expect(badgeClasses).toContain("new");

    // This is our unrevealed badge to click
    const unrevealedBadge = codeWarriorBadge;

    // Click the unrevealed badge to trigger the reveal
    await unrevealedBadge.click();

    // Wait for the modal to appear
    const modal = page.locator('[class*="modal"], [data-modal], [class*="Modal"], [class*="BadgeModal"]').first();
    await modal.waitFor({ state: "visible", timeout: 5000 });

    // Verify that a modal appeared
    const modalElements = await page
      .locator('[class*="modal"], [data-modal], [class*="Modal"], [class*="BadgeModal"]')
      .count();
    expect(modalElements).toBeGreaterThan(0);

    // Close the modal by clicking the "Keep Going!" button
    const closeButton = page.locator('button:has-text("Keep Going!")').first();
    await closeButton.waitFor({ state: "visible", timeout: 5000 });
    await closeButton.click({ force: true }); // Force click in case of overlay issues

    // Wait for modal to be hidden
    await modal.waitFor({ state: "hidden", timeout: 5000 });

    // Wait for animation to complete
    await page.waitForTimeout(1600); // 1500ms animation + small buffer

    // After revealing, the badge should now have the NEW ribbon
    const codeWarriorAfterClick = page.locator('[data-type="achievement"]:has-text("Code Warrior")').first();

    // Verify the badge now shows the NEW ribbon (it appears after reveal)
    const codeWarriorHasNew = await codeWarriorAfterClick.locator(':text("NEW")').count();
    expect(codeWarriorHasNew).toBe(1);

    // Verify the Code Warrior badge is still visible with the NEW ribbon
    await expect(codeWarriorAfterClick).toBeVisible();
    await expect(codeWarriorAfterClick).toContainText("NEW");
  });
});
