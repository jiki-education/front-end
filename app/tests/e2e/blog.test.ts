import { test, expect } from "@playwright/test";

test.describe("Blog Page E2E", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/blog");
    await page.locator("h1").waitFor();
  });

  test("should load the blog index page", async ({ page }) => {
    const heading = await page.locator("h1").textContent();
    expect(heading).toBe("Blog");
  });

  test("should display blog posts", async ({ page }) => {
    // Check for at least one blog post
    const articles = await page.locator("article").count();
    expect(articles).toBeGreaterThan(0);
  });

  test("should display the first blog post with title and excerpt", async ({ page }) => {
    // Check first post has title
    const firstPostTitle = await page.locator("article h2").first().textContent();
    expect(firstPostTitle).toBeTruthy();

    // Check first post has excerpt
    const firstPostExcerpt = await page.locator("article p").first().textContent();
    expect(firstPostExcerpt).toBeTruthy();
  });

  test("should display post metadata (date and author)", async ({ page }) => {
    // Check for date
    const date = page.locator("article time").first();
    await expect(date).toBeVisible();

    // Check for author
    const authorText = await page.locator("article").first().textContent();
    expect(authorText).toContain("By ");
  });

  test("should display tags for the post", async ({ page }) => {
    // Check for at least one tag
    const tags = await page.locator("article span").count();
    expect(tags).toBeGreaterThan(0);
  });

  test("should have links to individual blog posts", async ({ page }) => {
    const postLink = page.locator('article a[href^="/blog/"]').first();
    await expect(postLink).toBeVisible();
  });
});

test.describe("Blog Post Page E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the first blog post
    await page.goto("/blog");
    await page.locator("article a").first().waitFor();
    await page.locator("article a").first().click();
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
    // Check for date
    const date = page.locator("time").first();
    await expect(date).toBeVisible();

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
