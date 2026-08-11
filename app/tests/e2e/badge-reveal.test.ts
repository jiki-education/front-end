import type { Page } from "@playwright/test";
import { test, expect } from "./helpers/test";
import { mockAPIBadgeReveal, mockAPIBadges, mockAPIInternalMe, mockAPIFlag } from "./helpers/api-mocks";
import { AUTHENTICATION_COOKIE_NAME } from "@/lib/auth/cookie-config";
import { createMockUser } from "../mocks/user";

// Real curriculum badge slugs, and no name/description/fun_fact.
//
// The API's badge payload is wider than this, but the front-end deliberately
// models only identity and per-user state (see BadgeData in lib/api/badges.ts):
// a badge's NAME comes from the curriculum badge catalog, keyed by slug. So a
// fixture carrying invented names and invented slugs asserts nothing about what
// a user sees, and a fixture whose slugs are absent from the catalog renders
// each badge as its own raw slug.
//
// Using real slugs is what makes this test exercise the path it is named for:
// the assertions below pass only if the badge copy catalog is actually fetched
// and resolved.
const BADGES_FIXTURE = {
  badges: [
    {
      id: 1,
      slug: "first_lesson",
      icon: "test-icon-1",
      state: "revealed",
      num_awardees: 100,
      unlocked_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      slug: "maze_navigator",
      icon: "test-icon-2",
      state: "unrevealed",
      num_awardees: 50,
      unlocked_at: "2024-01-02T00:00:00Z"
    },
    {
      id: 3,
      slug: "night_owl",
      icon: "test-icon-3",
      state: "locked",
      num_awardees: 25
    }
  ],
  num_locked_secret_badges: 5
};

async function setupAuthentication(page: Page) {
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await page.context().clearCookies();

  await page.evaluate(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  await page.context().addCookies([
    {
      name: AUTHENTICATION_COOKIE_NAME,
      value: "valid-session-cookie-for-testing",
      domain: ".local.jiki.io",
      path: "/",
      httpOnly: true,
      secure: false,
      sameSite: "Lax"
    }
  ]);
}

test.describe("Badge Reveal E2E", () => {
  test("reveals an unrevealed badge when clicked", async ({ page }) => {
    await setupAuthentication(page);
    await mockAPIInternalMe(page, createMockUser());
    await mockAPIFlag(page, "welcome_modal", true);
    await mockAPIBadges(page, BADGES_FIXTURE);
    await mockAPIBadgeReveal(page, 2, {
      id: 2,
      slug: "maze_navigator",
      icon: "test-icon-2",
      revealed: true,
      unlocked_at: "2024-01-02T00:00:00Z"
    });

    await page.goto("/achievements");

    await page.locator('[data-type="achievement"]').first().waitFor();

    const allBadges = page.locator('[data-type="achievement"]');
    await expect(allBadges).toHaveCount(3);

    const mazeNavigatorBadge = page.locator('[data-type="achievement"]:has-text("Maze Navigator")').first();
    await mazeNavigatorBadge.waitFor();
    await expect(mazeNavigatorBadge).toContainText("Maze Navigator");

    const badgeClasses = await mazeNavigatorBadge.getAttribute("class");
    expect(badgeClasses).toContain("new");

    await mazeNavigatorBadge.click();

    const modal = page.locator('[class*="modal"], [data-modal], [class*="Modal"], [class*="BadgeModal"]').first();
    await modal.waitFor({ state: "visible", timeout: 5000 });

    const modalElements = await page
      .locator('[class*="modal"], [data-modal], [class*="Modal"], [class*="BadgeModal"]')
      .count();
    expect(modalElements).toBeGreaterThan(0);

    const closeButton = page.locator('button:has-text("Keep Going!")').first();
    await closeButton.waitFor({ state: "visible", timeout: 5000 });
    await closeButton.click({ force: true });

    await modal.waitFor({ state: "hidden", timeout: 5000 });
    await page.waitForTimeout(1600);

    const mazeNavigatorAfterClick = page.locator('[data-type="achievement"]:has-text("Maze Navigator")').first();

    const mazeNavigatorHasNew = await mazeNavigatorAfterClick.locator(':text("NEW")').count();
    expect(mazeNavigatorHasNew).toBe(1);

    await expect(mazeNavigatorAfterClick).toBeVisible();
    await expect(mazeNavigatorAfterClick).toContainText("NEW");
  });
});
