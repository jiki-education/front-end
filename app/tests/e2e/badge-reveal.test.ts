import type { Page } from "@playwright/test";
import { test, expect } from "./helpers/test";
import { mockAPIBadgeReveal, mockAPIBadges, mockAPIInternalMe, mockAPIFlag } from "./helpers/api-mocks";
import { AUTHENTICATION_COOKIE_NAME } from "@/lib/auth/cookie-config";
import { createMockUser } from "../mocks/user";

// Badge display copy is resolved from the curriculum badge catalog by slug (the
// API's `name` is not rendered), so these slugs MUST exist in
// curriculum/src/badges/locales/*/translation.json — an unknown slug renders as
// the slug itself and every name assertion below fails.
const BADGES_FIXTURE = {
  badges: [
    {
      id: 1,
      name: "First Steps",
      slug: "first_lesson",
      icon: "test-icon-1",
      description: "Completed your first exercise",
      fun_fact: "This is the most common first badge earned",
      state: "revealed",
      num_awardees: 100,
      unlocked_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      name: "Maze Navigator",
      slug: "maze_navigator",
      icon: "test-icon-2",
      description: "Completed 10 exercises",
      fun_fact: "Only 10% of users reach this milestone",
      state: "unrevealed",
      num_awardees: 50,
      unlocked_at: "2024-01-02T00:00:00Z"
    },
    {
      id: 3,
      name: "Night Owl",
      slug: "night_owl",
      icon: "test-icon-3",
      description: "Spent 5 hours learning",
      fun_fact: "The average time to earn this is 2 weeks",
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
      name: "Maze Navigator",
      icon: "test-icon-2",
      description: "Completed 10 exercises",
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
