import { test, expect } from "@playwright/test";

test.describe("Articles Page E2E", () => {
  // Warm up the page compilation before running tests in parallel
  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    await page.goto("/articles");
    await page.locator("h1").waitFor();
    await page.close();
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("/articles");
    // Wait for articles content to load - look for the h1
    await page.locator("h1").waitFor();
  });

  test("should load the articles index page", async ({ page }) => {
    // Look for the h1 heading
    const heading = await page.locator("h1").textContent();
    expect(heading).toBe("Help and resources");
  });

  test("should display articles", async ({ page }) => {
    // Check for at least one article (h2 titles)
    const articleTitles = await page.locator("h2").count();
    expect(articleTitles).toBeGreaterThan(0);
  });

  test("should display the first article with title and excerpt", async ({ page }) => {
    // Check first article has title
    const firstArticleTitle = await page.locator("h2").first().textContent();
    expect(firstArticleTitle).toBeTruthy();

    // Check first article has excerpt
    const firstArticleExcerpt = await page.locator('a[href^="/articles/"] p').first().textContent();
    expect(firstArticleExcerpt).toBeTruthy();
  });

  test("should display tags for the article", async ({ page }) => {
    // Check for at least one tag span in article cards
    const tags = await page.locator('a[href^="/articles/"] span').count();
    expect(tags).toBeGreaterThan(0);
  });

  test("should have links to individual articles", async ({ page }) => {
    const articleLink = page.locator('a[href^="/articles/"]').first();
    await expect(articleLink).toBeVisible();
  });

  test("should display filter sidebar", async ({ page }) => {
    // Check for filter tags
    const filterLabel = page.getByText("Filter by");
    await expect(filterLabel).toBeVisible();

    // Check for "All" filter tag (use exact match to avoid matching other links)
    const allFilter = page.getByRole("link", { name: "All", exact: true });
    await expect(allFilter).toBeVisible();
  });
});

test.describe("Article Page E2E", () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the first article
    await page.goto("/articles");
    await page.locator('a[href^="/articles/"]').first().waitFor();
    await page.locator('a[href^="/articles/"]').first().click();
    await page.locator("h1").waitFor();
  });

  test("should load an individual article", async ({ page }) => {
    const heading = page.locator("h1");
    await expect(heading).toBeVisible();
  });

  test("should display article title", async ({ page }) => {
    const title = await page.locator("h1").textContent();
    expect(title).toBeTruthy();
  });

  test("should display rendered markdown content", async ({ page }) => {
    // Check that page has substantial content
    const pageText = await page.evaluate(() => document.body.textContent);
    expect(pageText).toBeTruthy();
    expect(pageText.length).toBeGreaterThan(100); // Should have substantial content
  });
});
