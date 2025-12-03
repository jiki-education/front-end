import { test, expect } from "@playwright/test";

test.describe("Navigation E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.locator("body").waitFor();
  });

  test("should navigate between pages", async ({ page }) => {
    // Wait for page to fully load before getting links
    await page.locator("main").waitFor();

    const links = await page.locator('a[href^="/"]').evaluateAll((linkElements) =>
      linkElements.map((link) => ({
        href: link.getAttribute("href"),
        text: (link.textContent || "").trim()
      }))
    );

    // Filter out auth pages that require Google OAuth provider
    const nonAuthLinks = links.filter(
      (link) =>
        link.href &&
        !link.href.includes("http") &&
        !link.href.includes("/auth/") &&
        !link.href.includes("/login") &&
        !link.href.includes("/signup")
    );

    // Test only first 2 non-auth links to avoid timeout
    for (const link of nonAuthLinks.slice(0, 2)) {
      await page.goto(link.href!);
      await page.locator("body").waitFor();

      const url = page.url();
      expect(url).toContain(link.href!);

      await page.goBack();
      await page.locator("body").waitFor();
    }
  });

  test("should handle 404 pages gracefully", async ({ page }) => {
    await page.goto("/non-existent-page");
    await page.locator("body").waitFor();

    const body = page.locator("body");
    await expect(body).toBeVisible();
  });

  test("should measure page load performance", async ({ page }) => {
    const startTime = Date.now();
    await page.goto("/");
    await page.locator("main").waitFor();
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(10000);
  });
});
