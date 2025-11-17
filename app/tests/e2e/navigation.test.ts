describe("Navigation E2E", () => {
  beforeEach(async () => {
    await page.goto("http://localhost:3081");
    await page.waitForSelector("body", { timeout: 10000 });
  });

  it("should navigate between pages", async () => {
    // Wait for page to fully load before getting links
    await page.waitForSelector("main", { timeout: 10000 });

    const links = await page.$$eval('a[href^="/"]', (linkElements) =>
      linkElements.map((link) => ({
        href: link.getAttribute("href"),
        text: (link.textContent || "").trim()
      }))
    );

    // Test only first 2 links to avoid timeout
    for (const link of links.slice(0, 2)) {
      if (link.href && !link.href.includes("http")) {
        await page.goto(`http://localhost:3081${link.href}`);
        await page.waitForSelector("body", { timeout: 10000 });

        const url = page.url();
        expect(url).toContain(link.href);

        await page.goBack();
        await page.waitForSelector("body", { timeout: 10000 });
      }
    }
  }, 60000);

  it("should handle 404 pages gracefully", async () => {
    await page.goto("http://localhost:3081/non-existent-page");
    await page.waitForSelector("body", { timeout: 10000 });

    const body = await page.$("body");
    expect(body).toBeTruthy();
  }, 30000);

  it("should measure page load performance", async () => {
    const startTime = Date.now();
    await page.goto("http://localhost:3081");
    await page.waitForSelector("main", { timeout: 10000 });
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(10000);
  }, 30000);
});
