import { test, expect, type Page, type Route } from "@playwright/test";
import { AUTHENTICATION_COOKIE_NAME } from "@/lib/auth/cookie-config";
import { getTestUrl } from "./helpers/getTestUrl";
import { createMockUser } from "../mocks/user";

test.describe("Authentication Flows", () => {
  function handleOptionsRequest(route: Route) {
    if (route.request().method() === "OPTIONS") {
      void route.fulfill({
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
          "Access-Control-Allow-Credentials": "true",
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
          "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
          "Access-Control-Allow-Credentials": "true",
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
    return mockRequest(route, "/internal/me", 200, { user: createMockUser() });
  }

  function mockLogoutRequest(route: Route) {
    if (route.request().url().includes("/auth/logout")) {
      // Clear cookies via Playwright API (more reliable than Set-Cookie header in mocks)
      const page = route.request().frame().page();
      void page.context().clearCookies({ name: AUTHENTICATION_COOKIE_NAME });
      void route.fulfill({
        status: 200,
        contentType: "application/json",
        headers: {
          "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        },
        body: JSON.stringify({})
      });
      return true;
    }
    return false;
  }

  async function setup(page: Page, cookie: "absent" | "invalid" | "valid") {
    // Clear all auth state and cookies
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.context().clearCookies();

    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    if (cookie === "valid") {
      // Set a valid session cookie (actual value doesn't matter - server validates)
      await page.context().addCookies([
        {
          name: AUTHENTICATION_COOKIE_NAME,
          value: "valid-session-cookie-for-testing",
          domain: ".local.jiki.io",
          path: "/",
          httpOnly: true,
          secure: false,
          sameSite: "Lax"
        }
      ]);
    } else if (cookie === "invalid") {
      await page.context().addCookies([
        {
          name: AUTHENTICATION_COOKIE_NAME,
          value: "invalid-session-cookie",
          domain: ".local.jiki.io",
          path: "/",
          httpOnly: true,
          secure: false,
          sameSite: "Lax"
        }
      ]);
    }
  }

  async function visitDashboard(page: Page, waitForLoad: boolean = true) {
    if (waitForLoad) {
      await page.goto("/dashboard", { waitUntil: "domcontentloaded" });
    } else {
      void page.goto("/dashboard");
    }
  }

  async function visitSettingsPage(page: Page) {
    await page.goto("/settings", { waitUntil: "domcontentloaded" });
  }

  async function visitLandingPath(page: Page, waitForLoad: boolean = true) {
    if (waitForLoad) {
      await page.goto("/", { waitUntil: "domcontentloaded" });
    } else {
      void page.goto("/");
    }
  }

  async function visitBlogPage(page: Page, waitForLoad: boolean = true) {
    if (waitForLoad) {
      await page.goto("/blog", { waitUntil: "domcontentloaded" });
    } else {
      void page.goto("/blog");
    }
  }

  async function awaitRedirectToLogin(page: Page) {
    await page.waitForFunction((expectedUrl) => {
      const url = window.location.href;
      return url === expectedUrl;
    }, getTestUrl("/auth/login"));
  }

  async function assertLoginPage(page: Page) {
    // Wait for login page to load
    await page.waitForTimeout(50);

    const url = page.url();
    expect(url).toBe(getTestUrl("/auth/login"));
  }

  async function assertDashboardPage(page: Page) {
    // Wait for dashboard to load
    await page.waitForTimeout(50);

    const url = new URL(page.url());
    expect(url.pathname).toBe("/dashboard");
  }

  async function assertBlogPage(page: Page) {
    // Wait for blog to load
    await page.waitForTimeout(50);

    const url = page.url();
    expect(url).toBe(getTestUrl("/blog"));

    // Verify blog content is present
    await expect(page.getByRole("heading", { name: "Blog" })).toBeVisible();
  }

  async function assertSettingsPage(page: Page) {
    // Wait for settings page to load
    await page.waitForTimeout(50);

    const url = page.url();
    expect(url).toBe(getTestUrl("/settings"));

    // Verify authenticated content is present
    await expect(page.getByText("Danger Zone")).toBeVisible();
  }

  async function assertLandingPage(page: Page) {
    await page.locator("h1").waitFor();
    const heading = await page.locator("h1").textContent();
    expect(heading).toBe("Welcome to Jiki");
  }

  async function assertSignUpButton(page: Page) {
    await page.locator(".ui-btn-primary").waitFor();
    const button = await page.locator(".ui-btn-primary").textContent();
    expect(button).toBe("Sign Up");
  }

  async function assertReturnToJikiButton(page: Page) {
    await page.locator(".ui-btn-primary", { hasText: "Back to Jiki →" }).waitFor();
    const button = await page.locator(".ui-btn-primary").textContent();
    expect(button).toBe("Back to Jiki →");
  }

  async function awaitRedirectToDashboard(page: Page) {
    await page.waitForFunction(() => {
      return window.location.pathname === "/dashboard";
    });
  }

  async function awaitRedirectToLandingPage(page: Page) {
    await page.waitForFunction(() => {
      return window.location.pathname === "/";
    });
  }

  test.describe("Visiting /settings", () => {
    test("should redirect to /auth/login without session cookie", async ({ page }) => {
      await setup(page, "absent");
      await visitSettingsPage(page);
      await awaitRedirectToLogin(page);
      await assertLoginPage(page);
    });

    test("should redirect to /auth/login with invalid session cookie", async ({ page }) => {
      await setup(page, "invalid");

      // Stub 401 responses for invalid session and mock logout to clear cookie
      await page.route("**/*", (route) => {
        void (
          handleOptionsRequest(route) ||
          mockRequest(route, "/internal/me", 401, { error: "Unauthorized" }) ||
          mockLogoutRequest(route) ||
          route.continue()
        );
      });

      await visitSettingsPage(page);
      await awaitRedirectToLogin(page);
      await assertLoginPage(page);
    });

    test("should redirect to /auth/login with session cookie that the server rejects", async ({ page }) => {
      await setup(page, "valid");

      // Stub 401 responses from auth endpoints and mock logout to clear cookie
      await page.route("**/*", (route) => {
        void (
          handleOptionsRequest(route) ||
          mockRequest(route, "/internal/me", 401, { error: "Unauthorized" }) ||
          mockLogoutRequest(route) ||
          route.continue()
        );
      });

      await visitSettingsPage(page);
      await awaitRedirectToLogin(page);
      await assertLoginPage(page);
    });

    test("should render with valid session cookie", async ({ page }) => {
      await setup(page, "valid");

      // Stub successful auth responses
      await page.route("**/*", (route) => {
        void (handleOptionsRequest(route) || mockValidInternalMeApiCall(route) || route.continue());
      });

      await visitSettingsPage(page);
      await assertSettingsPage(page);
    });
  });

  test.describe("Visiting /dashboard", () => {
    test("should redirect to / without session cookie", async ({ page }) => {
      await setup(page, "absent");
      await visitDashboard(page, false);
      await awaitRedirectToLandingPage(page);
      await assertLandingPage(page);
    });

    test("should redirect to / with invalid session cookie", async ({ page }) => {
      await setup(page, "invalid");

      await page.route("**/*", (route) => {
        void (
          handleOptionsRequest(route) ||
          mockRequest(route, "/internal/me", 401, { error: "Unauthorized" }) ||
          mockLogoutRequest(route) ||
          route.continue()
        );
      });

      await visitDashboard(page, false);
      await awaitRedirectToLandingPage(page);
      await assertLandingPage(page);
    });

    test("should redirect to / with session cookie that the server rejects", async ({ page }) => {
      await setup(page, "valid");

      // Stub 401 responses from auth endpoints and mock logout to clear cookie
      await page.route("**/*", (route) => {
        void (
          handleOptionsRequest(route) ||
          mockRequest(route, "/internal/me", 401, { error: "Unauthorized" }) ||
          mockLogoutRequest(route) ||
          route.continue()
        );
      });

      await visitDashboard(page);
      await awaitRedirectToLandingPage(page);
      await assertLandingPage(page);
    });

    test("should render with valid session cookie", async ({ page }) => {
      await setup(page, "valid");

      // Stub successful auth responses
      await page.route("**/*", (route) => {
        void (handleOptionsRequest(route) || mockValidInternalMeApiCall(route) || route.continue());
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
          mockLogoutRequest(route) ||
          route.continue()
        );
      });

      await visitLandingPath(page, false);
      await awaitRedirectToDashboard(page);
      await awaitRedirectToLandingPage(page);
      await assertLandingPage(page);
    });

    test("should render with invalid cookie (duplicate)", async ({ page }) => {
      await setup(page, "invalid");

      await page.route("**/*", (route) => {
        void (
          handleOptionsRequest(route) ||
          mockRequest(route, "/internal/me", 401, { error: "Unauthorized" }) ||
          mockLogoutRequest(route) ||
          route.continue()
        );
      });

      await visitLandingPath(page);
      await awaitRedirectToDashboard(page);
      await awaitRedirectToLandingPage(page);
      await assertLandingPage(page);
    });

    test("should redirect to /dashboard with valid session cookie", async ({ page }) => {
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
          mockLogoutRequest(route) ||
          route.continue()
        );
      });

      await visitBlogPage(page);
      await assertBlogPage(page);
      await assertSignUpButton(page);
    });

    test("should render with valid session cookie", async ({ page }) => {
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
