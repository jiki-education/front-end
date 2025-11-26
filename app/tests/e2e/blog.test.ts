describe("Blog Page E2E", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:3081/blog");
    await page.waitForSelector("h1");
  });

  it("should load the blog index page", async () => {
    const heading = await page.$eval("h1", (el) => el.textContent);
    expect(heading).toBe("Blog - Guest User");
  });

  it("should display blog posts", async () => {
    // Check for at least one blog post
    const articles = await page.$$("article");
    expect(articles.length).toBeGreaterThan(0);
  });

  it("should display the first blog post with title and excerpt", async () => {
    // Check first post has title
    const firstPostTitle = await page.$eval("article h2", (el) => el.textContent);
    expect(firstPostTitle).toBeTruthy();

    // Check first post has excerpt
    const firstPostExcerpt = await page.$eval("article p", (el) => el.textContent);
    expect(firstPostExcerpt).toBeTruthy();
  });

  it("should display post metadata (date and author)", async () => {
    // Check for date
    const date = await page.$("article time");
    expect(date).toBeTruthy();

    // Check for author
    const authorText = await page.$eval("article", (el) => el.textContent);
    expect(authorText).toContain("By ");
  });

  it("should display tags for the post", async () => {
    // Check for at least one tag
    const tags = await page.$$("article span");
    expect(tags.length).toBeGreaterThan(0);
  });

  it("should have links to individual blog posts", async () => {
    const postLink = await page.$('article a[href^="/blog/"]');
    expect(postLink).toBeTruthy();
  });
});

describe("Blog Post Page E2E", () => {
  beforeAll(async () => {
    // Navigate to the first blog post
    await page.goto("http://localhost:3081/blog", { waitUntil: "networkidle0" });
    await page.waitForSelector("article a", { timeout: 10000 });
    const firstPostLink = await page.$("article a");
    if (firstPostLink) {
      await firstPostLink.click();
      await page.waitForSelector("h1", { timeout: 10000 });
    }
  }, 60000);

  it("should load an individual blog post", async () => {
    const heading = await page.$("h1");
    expect(heading).toBeTruthy();
  });

  it("should display post title", async () => {
    const title = await page.$eval("h1", (el) => el.textContent);
    expect(title).toBeTruthy();
  });

  it("should display post metadata", async () => {
    // Check for date
    const date = await page.$("time");
    expect(date).toBeTruthy();

    // Check for author - in the purple header for unauthenticated users
    const pageText = await page.evaluate(() => document.body.textContent);
    expect(pageText).toContain("by ");
  });

  it("should display rendered markdown content", async () => {
    // Check that page has substantial content beyond the header
    const pageText = await page.evaluate(() => document.body.textContent);
    expect(pageText).toBeTruthy();
    expect(pageText.length).toBeGreaterThan(100); // Should have substantial content
  });
});
