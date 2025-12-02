import { test, expect } from "@playwright/test";

test.describe("Home Page E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("h1").waitFor();
  });

  test("should load the landing page", async ({ page }) => {
    const title = await page.title();
    expect(title).toBeTruthy();

    // Check for main heading
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("should display welcome text", async ({ page }) => {
    const headingText = await page.locator("h1").textContent();
    expect(headingText).toContain("Welcome to Jiki");
  });

  test("should have login and signup links", async ({ page }) => {
    const loginLink = page.locator('a[href="/auth/login"]');
    const signupLink = page.locator('a[href="/auth/signup"]');

    await expect(loginLink).toBeVisible();
    await expect(signupLink).toBeVisible();
  });

  test("should be responsive", async ({ page }) => {
    const viewport = page.viewportSize();
    expect(viewport).toBeTruthy();

    await page.setViewportSize({ width: 375, height: 667 });
    const mobileHeading = page.locator("h1");
    await expect(mobileHeading).toBeVisible();

    await page.setViewportSize({ width: 1920, height: 1080 });
    const desktopHeading = page.locator("h1");
    await expect(desktopHeading).toBeVisible();
  });
});
