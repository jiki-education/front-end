import type { Page } from "@playwright/test";
import { test, expect } from "./helpers/test";
import { mockAPIBadgeReveal, mockAPIBadges, mockAPIInternalMe, mockAPIFlag } from "./helpers/api-mocks";
import { AUTHENTICATION_COOKIE_NAME } from "@/lib/auth/cookie-config";
import { createMockUser } from "../mocks/user";

const BADGES_FIXTURE = {
  badges: [
    {
      id: 1,
      name: "First Steps",
      slug: "first-steps",
      icon: "test-icon-1",
      description: "Completed your first exercise",
      fun_fact: "This is the most common first badge earned",
      state: "revealed",
      num_awardees: 100,
      unlocked_at: "2024-01-01T00:00:00Z"
    },
    {
      id: 2,
      name: "Code Warrior",
      slug: "code-warrior",
      icon: "test-icon-2",
      description: "Completed 10 exercises",
      fun_fact: "Only 10% of users reach this milestone",
      state: "unrevealed",
      num_awardees: 50,
      unlocked_at: "2024-01-02T00:00:00Z"
    },
    {
      id: 3,
      name: "Learning Journey",
      slug: "learning-journey",
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
      name: "Code Warrior",
      icon: "test-icon-2",
      description: "Completed 10 exercises",
      revealed: true,
      unlocked_at: "2024-01-02T00:00:00Z"
    });

    await page.goto("/achievements");

    await page.locator('[data-type="achievement"]').first().waitFor();

    const allBadges = page.locator('[data-type="achievement"]');
    await expect(allBadges).toHaveCount(3);

    const codeWarriorBadge = page.locator('[data-type="achievement"]:has-text("Code Warrior")').first();
    await codeWarriorBadge.waitFor();
    await expect(codeWarriorBadge).toContainText("Code Warrior");

    const badgeClasses = await codeWarriorBadge.getAttribute("class");
    expect(badgeClasses).toContain("new");

    await codeWarriorBadge.click();

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

    const codeWarriorAfterClick = page.locator('[data-type="achievement"]:has-text("Code Warrior")').first();

    const codeWarriorHasNew = await codeWarriorAfterClick.locator(':text("NEW")').count();
    expect(codeWarriorHasNew).toBe(1);

    await expect(codeWarriorAfterClick).toBeVisible();
    await expect(codeWarriorAfterClick).toContainText("NEW");
  });
});
