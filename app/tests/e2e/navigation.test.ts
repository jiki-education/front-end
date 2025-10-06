describe("Navigation E2E", () => {
  beforeEach(async () => {
    await page.goto("http://localhost:3070");
    await page.waitForSelector("h1");
  });

  it("should navigate between pages", async () => {
    const links = await page.$$eval('a[href^="/"]', (links) =>
      links.map((link) => ({
        href: link.getAttribute("href"),
        text: link.textContent
      }))
    );

    for (const link of links.slice(0, 3)) {
      if (link.href && !link.href.includes("http")) {
        await page.goto(`http://localhost:3070${link.href}`);
        await page.waitForSelector("body");

        const url = page.url();
        expect(url).toContain(link.href);

        await page.goBack();
        await page.waitForSelector("h1");
      }
    }
  });

  it("should handle 404 pages gracefully", async () => {
    await page.goto("http://localhost:3070/non-existent-page");
    await page.waitForSelector("body");

    const body = await page.$("body");
    expect(body).toBeTruthy();
  });

  it("should measure page load performance", async () => {
    const startTime = Date.now();
    await page.goto("http://localhost:3070");
    await page.waitForSelector("h1");
    const loadTime = Date.now() - startTime;

    expect(loadTime).toBeLessThan(5000);
  });
});
