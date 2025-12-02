import { test, expect, type Page, type Route } from "@playwright/test";

test.describe("Authentication Flows", () => {
  function handleOptionsRequest(route: Route) {
    if (route.request().method() === "OPTIONS") {
      void route.fulfill({
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
      return true;
    }
    return false;
  }

  function mockRequest(route: Route, url: string, status: number, body: any) {
    if (route.request().url().includes(url)) {
      void route.fulfill({
        status,
        contentType: "application/json",
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        body: JSON.stringify(body)
      });
      return true;
    }
    return false;
  }

  function mockValidInternalMeApiCall(route: Route) {
    return mockRequest(route, "/internal/me", 200, {
      user: {
        id: "test-user-id",
        email: "test@example.com",
        name: "Test User"
      }
    });
  }

  async function setup(page: Page, cookie: "absent" | "invalid" | "valid") {
    // Clear all auth state and cookies
    await page.goto("/", { waitUntil: "domcontentloaded" });

    // Clear browser storage
    await page.context().clearCookies();

    await page.evaluate((cookieType) => {
      localStorage.clear();
      sessionStorage.clear();

      // Set refresh token in localStorage for valid case (needed for refresh flow)
      if (cookieType === "valid") {
        const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const payload = btoa(JSON.stringify({ sub: "test-user-id", exp: 9999999999 }));
        const signature = "fake-signature";
        const refreshToken = `${header}.${payload}.${signature}`;
        localStorage.setItem("jiki_refresh_token", refreshToken);
      }
    }, cookie);

    // Set cookie based on type
    if (cookie === "invalid") {
      await page.context().addCookies([
        {
          name: "jiki_access_token",
          value: "invalid-nonsense-string",
          domain: "localhost",
          path: "/",
          httpOnly: false // Make it accessible to JavaScript
        }
      ]);
    } else if (cookie === "valid") {
      // Create a valid JWT with sub claim and future expiry
      const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
      const payload = Buffer.from(JSON.stringify({ sub: "test-user-id", exp: 9999999999 })).toString("base64");
      const signature = "fake-signature";
      const validToken = `${header}.${payload}.${signature}`;

      await page.context().addCookies([
        {
          name: "jiki_access_token",
          value: validToken,
          domain: "localhost",
          path: "/",
          httpOnly: false // Make it accessible to JavaScript
        }
      ]);
    }
    // If cookie is 'absent', don't set any cookie
  }

  async function visitDashboard(page: Page) {
    await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
  }

  async function visitSettingsPage(page: Page) {
    await page.goto("/settings", { waitUntil: "domcontentloaded" });
  }

  async function visitLandingPath(page: Page) {
    await page.goto("/", { waitUntil: "domcontentloaded" });
  }

  async function visitBlogPage(page: Page) {
    await page.goto("/blog", { waitUntil: "domcontentloaded" });
  }

  async function awaitRedirectToLogin(page: Page) {
    await page.waitForFunction(
      () => {
        const url = window.location.href;
        return url === "http://localhost:3081/auth/login";
      },
      { timeout: 5000 }
    );
  }

  async function assertLoginPage(page: Page) {
    // Wait for login page to load
    await page.waitForTimeout(50);

    const url = page.url();
    expect(url).toBe("http://localhost:3081/auth/login");
  }

  async function assertDashboardPage(page: Page) {
    // Wait for dashboard to load
    await page.waitForTimeout(50);

    const url = page.url();
    expect(url).toBe("http://localhost:3081/dashboard");
  }

  async function assertBlogPage(page: Page) {
    // Wait for blog to load
    await page.waitForTimeout(50);

    const url = page.url();
    expect(url).toBe("http://localhost:3081/blog");
  }

  async function assertSettingsPage(page: Page) {
    // Wait for settings page to load
    await page.waitForTimeout(50);

    const url = page.url();
    expect(url).toBe("http://localhost:3081/settings");
  }

  async function assertLandingPage(page: Page) {
    await page.locator("h1").waitFor({ timeout: 3000 });
    const heading = await page.locator("h1").textContent();
    expect(heading).toBe("Welcome to Jiki");
  }

  async function assertSignUpButton(page: Page) {
    await page.locator(".ui-btn-primary").waitFor({ timeout: 5000 });
    const button = await page.locator(".ui-btn-primary").textContent();
    expect(button).toBe("Sign Up");
  }

  async function assertReturnToJikiButton(page: Page) {
    await page.locator(".ui-btn-primary").waitFor({ timeout: 5000 });
    const button = await page.locator(".ui-btn-primary").textContent();
    expect(button).toBe("Back to Jiki →");
  }

  async function awaitRedirectToDashboard(page: Page) {
    await page.waitForFunction(
      () => {
        const url = window.location.href;
        return url === "http://localhost:3081/dashboard";
      },
      { timeout: 5000 }
    );
  }

  async function awaitRedirectToLandingPage(page: Page) {
    await page.waitForFunction(
      () => {
        const url = window.location.href;
        return url === "http://localhost:3081/";
      },
      { timeout: 5000 }
    );
  }

  test.describe("Visiting /settings", () => {
    test("should redirect to /auth/login without jiki_refresh_token", async ({ page }) => {
      await setup(page, "absent");
      await visitSettingsPage(page);
      await awaitRedirectToLogin(page);
      await assertLoginPage(page);
    });

    test("should redirect to /auth/login with invalid jiki_refresh_token", async ({ page }) => {
      await setup(page, "invalid");
      await visitSettingsPage(page);
      await awaitRedirectToLogin(page);
      await assertLoginPage(page);
    });

    test("should redirect to /auth/login with valid jiki_refresh_token that the server rejects", async ({ page }) => {
      await setup(page, "valid");

      // Stub 401 responses from auth endpoints
      await page.route("**/*", (route) => {
        void (
          handleOptionsRequest(route) ||
          mockRequest(route, "/internal/me", 401, { error: "Unauthorized" }) ||
          mockRequest(route, "/auth/refresh", 401, { error: "Invalid refresh token" }) ||
          route.continue()
        );
      });

      await visitSettingsPage(page);
      await awaitRedirectToLogin(page);
      await assertLoginPage(page);
    });

    test("should render with valid token", async ({ page }) => {
      await setup(page, "valid");

      // Stub successful auth responses
      await page.route("**/*", (route) => {
        void (handleOptionsRequest(route) || mockValidInternalMeApiCall(route) || route.continue());
      });

      await visitSettingsPage(page);
      await assertSettingsPage(page);
    });

    test("should render with valid expired token", async ({ page }) => {
      await setup(page, "valid");

      // Track /internal/me calls to simulate expired then refreshed token
      let internalMeCalls = 0;

      await page.route("**/*", (route) => {
        if (handleOptionsRequest(route)) {
          return;
        }

        // First call to /internal/me returns 401 (expired token)
        // After refresh, subsequent calls return 200
        if (route.request().url().includes("/internal/me")) {
          internalMeCalls++;
          if (internalMeCalls === 1) {
            void mockRequest(route, "/internal/me", 401, { error: "Unauthorized" });
          } else {
            void mockValidInternalMeApiCall(route);
          }
          return;
        }

        // Stub /auth/refresh with successful token refresh, or continue with other requests
        void (
          mockRequest(route, "/auth/refresh", 200, { access_token: "new-access-token-after-refresh" }) ||
          route.continue()
        );
      });

      await visitSettingsPage(page);
      await assertSettingsPage(page);
    });
  });

  test.describe("Visiting /dashboard", () => {
    test("should redirect to /auth/login without jiki_refresh_token", async ({ page }) => {
      await setup(page, "absent");
      await visitDashboard(page);
      await awaitRedirectToLandingPage(page);
      await assertLandingPage(page);
    });

    test("should redirect to /auth/login with invalid jiki_refresh_token", async ({ page }) => {
      await setup(page, "invalid");
      await visitDashboard(page);
      await awaitRedirectToLogin(page);
      await assertLoginPage(page);
    });

    test("should redirect to / with valid jiki_refresh_token that the server rejects", async ({ page }) => {
      await setup(page, "valid");

      // Stub 401 responses from auth endpoints
      await page.route("**/*", (route) => {
        void (
          handleOptionsRequest(route) ||
          mockRequest(route, "/internal/me", 401, { error: "Unauthorized" }) ||
          mockRequest(route, "/auth/refresh", 401, { error: "Invalid refresh token" }) ||
          route.continue()
        );
      });

      await visitDashboard(page);
      await awaitRedirectToLandingPage(page);
      await assertLandingPage(page);
    });

    test("should render with valid token", async ({ page }) => {
      await setup(page, "valid");

      // Stub successful auth responses
      await page.route("**/*", (route) => {
        void (handleOptionsRequest(route) || mockValidInternalMeApiCall(route) || route.continue());
      });

      await visitDashboard(page);
      await assertDashboardPage(page);
    });

    test("should render with valid expired token", async ({ page }) => {
      await setup(page, "valid");

      // Track /internal/me calls to simulate expired then refreshed token
      let internalMeCalls = 0;

      await page.route("**/*", (route) => {
        if (handleOptionsRequest(route)) {
          return;
        }

        // First call to /internal/me returns 401 (expired token)
        // After refresh, subsequent calls return 200
        if (route.request().url().includes("/internal/me")) {
          internalMeCalls++;
          if (internalMeCalls === 1) {
            void mockRequest(route, "/internal/me", 401, { error: "Unauthorized" });
          } else {
            void mockValidInternalMeApiCall(route);
          }
          return;
        }

        // Stub /auth/refresh with successful token refresh, or continue with other requests
        void (
          mockRequest(route, "/auth/refresh", 200, { access_token: "new-access-token-after-refresh" }) ||
          route.continue()
        );
      });

      await visitDashboard(page);
      await assertDashboardPage(page);
    });
  });

  test.describe("Visiting /", () => {
    test("should render with no cookie", async ({ page }) => {
      await setup(page, "absent");
      await visitLandingPath(page);
      await assertLandingPage(page);
    });

    test("should render with invalid cookie", async ({ page }) => {
      await setup(page, "invalid");

      await page.route("**/*", (route) => {
        void (
          handleOptionsRequest(route) ||
          mockRequest(route, "/internal/me", 401, { error: "Unauthorized" }) ||
          mockRequest(route, "/auth/refresh", 401, { error: "Invalid refresh token" }) ||
          route.continue()
        );
      });

      await visitLandingPath(page);
      await awaitRedirectToDashboard(page);
      await awaitRedirectToLandingPage(page);
      await assertLandingPage(page);
    });

    test("should redirect to /dashboard with valid expired token", async ({ page }) => {
      await setup(page, "valid");

      // Track /internal/me calls to simulate expired then refreshed token
      let internalMeCalls = 0;

      await page.route("**/*", (route) => {
        if (handleOptionsRequest(route)) {
          return;
        }

        // First call to /internal/me returns 401 (expired token)
        // After refresh, subsequent calls return 200
        if (route.request().url().includes("/internal/me")) {
          internalMeCalls++;
          if (internalMeCalls === 1) {
            void mockRequest(route, "/internal/me", 401, { error: "Unauthorized" });
          } else {
            void mockValidInternalMeApiCall(route);
          }
          return;
        }

        // Stub /auth/refresh with successful token refresh, or continue with other requests
        void (
          mockRequest(route, "/auth/refresh", 200, { access_token: "new-access-token-after-refresh" }) ||
          route.continue()
        );
      });

      await visitLandingPath(page);
      await awaitRedirectToDashboard(page);
      await assertDashboardPage(page);
    });

    test("should render with invalid cookie (duplicate)", async ({ page }) => {
      await setup(page, "invalid");

      await page.route("**/*", (route) => {
        void (
          handleOptionsRequest(route) ||
          mockRequest(route, "/internal/me", 401, { error: "Unauthorized" }) ||
          mockRequest(route, "/auth/refresh", 401, { error: "Invalid refresh token" }) ||
          route.continue()
        );
      });

      await visitLandingPath(page);
      await awaitRedirectToDashboard(page);
      await awaitRedirectToLandingPage(page);
      await assertLandingPage(page);
    });

    test("should redirect to /dashboard with valid cookie", async ({ page }) => {
      await setup(page, "valid");

      // Mock successful auth check
      await page.route("**/*", (route) => {
        void (handleOptionsRequest(route) || mockValidInternalMeApiCall(route) || route.continue());
      });

      await visitLandingPath(page);
      await awaitRedirectToDashboard(page);
      await assertDashboardPage(page);
    });
  });

  test.describe("Visiting /blog", () => {
    test("should render with no cookie", async ({ page }) => {
      await setup(page, "absent");
      await visitBlogPage(page);
      await assertBlogPage(page);
      await assertSignUpButton(page);
    });

    test("should render with absent cookie", async ({ page }) => {
      await setup(page, "absent");
      await visitBlogPage(page);
      await assertBlogPage(page);
      await assertSignUpButton(page);
    });

    test("should render with invalid cookie", async ({ page }) => {
      await setup(page, "invalid");

      await page.route("**/*", (route) => {
        void (
          handleOptionsRequest(route) ||
          mockRequest(route, "/internal/me", 401, { error: "Unauthorized" }) ||
          mockRequest(route, "/auth/refresh", 401, { error: "Invalid refresh token" }) ||
          route.continue()
        );
      });

      await visitBlogPage(page);
      await assertBlogPage(page);
      await assertSignUpButton(page);
    });

    test("should render with valid expired token", async ({ page }) => {
      await setup(page, "valid");

      // Track /internal/me calls to simulate expired then refreshed token
      let internalMeCalls = 0;

      await page.route("**/*", (route) => {
        if (handleOptionsRequest(route)) {
          return;
        }

        // First call to /internal/me returns 401 (expired token)
        // After refresh, subsequent calls return 200
        if (route.request().url().includes("/internal/me")) {
          internalMeCalls++;
          if (internalMeCalls === 1) {
            void mockRequest(route, "/internal/me", 401, { error: "Unauthorized" });
          } else {
            void mockValidInternalMeApiCall(route);
          }
          return;
        }

        // Stub /auth/refresh with successful token refresh, or continue with other requests
        void (
          mockRequest(route, "/auth/refresh", 200, { access_token: "new-access-token-after-refresh" }) ||
          route.continue()
        );
      });

      await visitBlogPage(page);
      await assertBlogPage(page);
      await assertReturnToJikiButton(page);
    });

    test("should render with valid cookie", async ({ page }) => {
      await setup(page, "valid");

      // Mock successful auth check
      await page.route("**/*", (route) => {
        void (handleOptionsRequest(route) || mockValidInternalMeApiCall(route) || route.continue());
      });

      await visitBlogPage(page);
      await assertBlogPage(page);
      await assertReturnToJikiButton(page);
    });
  });
});
