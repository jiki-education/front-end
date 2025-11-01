describe("Articles Page E2E", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:3081/articles");
    await page.waitForSelector("h1");
  });

  it("should load the articles index page", async () => {
    const heading = await page.$eval("h1", (el) => el.textContent);
    expect(heading).toBe("Articles");
  });

  it("should display articles", async () => {
    // Check for at least one article
    const articles = await page.$$("article");
    expect(articles.length).toBeGreaterThan(0);
  });

  it("should display the first article with title and excerpt", async () => {
    // Check first article has title
    const firstArticleTitle = await page.$eval("article h2", (el) => el.textContent);
    expect(firstArticleTitle).toBeTruthy();

    // Check first article has excerpt
    const firstArticleExcerpt = await page.$eval("article p", (el) => el.textContent);
    expect(firstArticleExcerpt).toBeTruthy();
  });

  it("should display tags for the article", async () => {
    // Check for at least one tag
    const tags = await page.$$("article span");
    expect(tags.length).toBeGreaterThan(0);
  });

  it("should have links to individual articles", async () => {
    const articleLink = await page.$('article a[href^="/articles/"]');
    expect(articleLink).toBeTruthy();
  });

  it("should display articles in a grid layout", async () => {
    const container = await page.$(".grid");
    expect(container).toBeTruthy();
  });
});

describe("Article Page E2E", () => {
  beforeAll(async () => {
    // Navigate to the first article
    await page.goto("http://localhost:3081/articles");
    await page.waitForSelector("article a");
    const firstArticleLink = await page.$("article a");
    if (firstArticleLink) {
      await firstArticleLink.click();
      await page.waitForSelector("article h1");
    }
  });

  it("should load an individual article", async () => {
    const heading = await page.$("article h1");
    expect(heading).toBeTruthy();
  });

  it("should display article title", async () => {
    const title = await page.$eval("article h1", (el) => el.textContent);
    expect(title).toBeTruthy();
  });

  it("should display rendered markdown content", async () => {
    // Check that article has content
    const article = await page.$("article");
    const articleText = await article?.evaluate((el) => el.textContent);
    expect(articleText).toBeTruthy();
    expect(articleText!.length).toBeGreaterThan(100); // Should have substantial content
  });
});
