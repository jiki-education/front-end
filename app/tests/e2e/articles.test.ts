describe("Articles Page E2E", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:3081/articles");
    await page.waitForSelector("body", { timeout: 15000 });
    // Wait for articles content to load - look for the container div or h1
    await page.waitForSelector(".container, main, h1", { timeout: 10000 });
  }, 30000);

  it("should load the articles index page", async () => {
    // Look for the h1 heading
    const heading = await page.$eval("h1", (el) => el.textContent);
    expect(heading).toBe("Articles");
  }, 30000);

  it("should display articles", async () => {
    // Check for at least one article
    const articles = await page.$$("article");
    expect(articles.length).toBeGreaterThan(0);
  }, 30000);

  it("should display the first article with title and excerpt", async () => {
    // Check first article has title
    const firstArticleTitle = await page.$eval("article h2", (el) => el.textContent);
    expect(firstArticleTitle).toBeTruthy();

    // Check first article has excerpt
    const firstArticleExcerpt = await page.$eval("article p", (el) => el.textContent);
    expect(firstArticleExcerpt).toBeTruthy();
  }, 30000);

  it("should display tags for the article", async () => {
    // Check for at least one tag span
    const tags = await page.$$("article span");
    expect(tags.length).toBeGreaterThan(0);
  }, 30000);

  it("should have links to individual articles", async () => {
    const articleLink = await page.$('article a[href^="/articles/"]');
    expect(articleLink).toBeTruthy();
  }, 30000);

  it("should display articles in a grid layout", async () => {
    // Check for grid layout class
    const container = await page.$(".grid");
    expect(container).toBeTruthy();
  }, 30000);
});

describe("Article Page E2E", () => {
  beforeAll(async () => {
    // Navigate to the first article
    await page.goto("http://localhost:3081/articles", { waitUntil: "networkidle0" });
    await page.waitForSelector("article a", { timeout: 10000 });
    const firstArticleLink = await page.$("article a");
    if (firstArticleLink) {
      await firstArticleLink.click();
      await page.waitForSelector("h1", { timeout: 10000 });
    }
  }, 60000);

  it("should load an individual article", async () => {
    const heading = await page.$("h1");
    expect(heading).toBeTruthy();
  }, 30000);

  it("should display article title", async () => {
    const title = await page.$eval("h1", (el) => el.textContent);
    expect(title).toBeTruthy();
  }, 30000);

  it("should display rendered markdown content", async () => {
    // Check that page has substantial content
    const pageText = await page.evaluate(() => document.body.textContent);
    expect(pageText).toBeTruthy();
    if (pageText) {
      expect(pageText.length).toBeGreaterThan(100); // Should have substantial content
    }
  }, 30000);
});
