import { test, expect } from "@playwright/test";

test.describe("Blog Page E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog");
    await page.locator("h1").waitFor();
  });

  test("should load the blog index page", async ({ page }) => {
    const heading = await page.locator("h1").textContent();
    expect(heading).toBe("News, insights and witterings");
  });

  test("should display blog posts", async ({ page }) => {
    // Check for at least one blog post (h2 titles)
    const postTitles = await page.locator("h2").count();
    expect(postTitles).toBeGreaterThan(0);
  });

  test("should display the first blog post with title and excerpt", async ({ page }) => {
    // Check first post has title
    const firstPostTitle = await page.locator("h2").first().textContent();
    expect(firstPostTitle).toBeTruthy();

    // Check first post has excerpt (p tag near the title)
    const firstPostExcerpt = await page.locator("p").nth(1).textContent(); // Skip subtitle
    expect(firstPostExcerpt).toBeTruthy();
  });

  test("should display post metadata (author)", async ({ page }) => {
    // Check for author text
    const pageText = await page.evaluate(() => document.body.textContent);
    expect(pageText).toContain("by ");
  });

  test("should have links to individual blog posts", async ({ page }) => {
    const postLink = page.locator('a[href^="/blog/"]').first();
    await expect(postLink).toBeVisible();
  });
});

test.describe("Blog Post Page E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the first blog post
    await page.goto("/blog");
    await page.locator('a[href^="/blog/"]').first().waitFor();
    await page.locator('a[href^="/blog/"]').first().click();
    await page.locator("h1").waitFor();
  });

  test("should load an individual blog post", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("should display post title", async ({ page }) => {
    const title = await page.locator("h1").textContent();
    expect(title).toBeTruthy();
  });

  test("should display post metadata", async ({ page }) => {
    // Check for author - in the purple header for unauthenticated users
    const pageText = await page.evaluate(() => document.body.textContent);
    expect(pageText).toContain("by ");
  });

  test("should display rendered markdown content", async ({ page }) => {
    // Check that page has substantial content beyond the header
    const pageText = await page.evaluate(() => document.body.textContent);
    expect(pageText).toBeTruthy();
    expect(pageText.length).toBeGreaterThan(100); // Should have substantial content
  });
});
