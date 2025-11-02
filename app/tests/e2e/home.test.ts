describe("Home Page E2E", () => {
  beforeAll(async () => {
    await page.goto("http://localhost:3081");
    await page.waitForSelector("h1");
  });

  it("should load the landing page", async () => {
    const title = await page.title();
    expect(title).toBeTruthy();

    // Check for main heading
    const heading = await page.$("h1");
    expect(heading).toBeTruthy();
  });

  it("should display welcome text", async () => {
    const headingText = await page.$eval("h1", (el) => el.textContent);
    expect(headingText).toContain("Welcome to Jiki");
  });

  it("should have login and signup links", async () => {
    const loginLink = await page.$('a[href="/auth/login"]');
    const signupLink = await page.$('a[href="/auth/signup"]');

    expect(loginLink).toBeTruthy();
    expect(signupLink).toBeTruthy();
  });

  it("should be responsive", async () => {
    const viewport = page.viewport();
    expect(viewport).toBeTruthy();

    await page.setViewport({ width: 375, height: 667 });
    const mobileHeading = await page.$("h1");
    expect(mobileHeading).toBeTruthy();

    await page.setViewport({ width: 1920, height: 1080 });
    const desktopHeading = await page.$("h1");
    expect(desktopHeading).toBeTruthy();
  });
});
