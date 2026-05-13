import type { Page } from "@playwright/test";
import { test, expect } from "./helpers/test";
import { mockAPIInternalMe, mockAPIInternalMeUnauthorized, mockAPILogout } from "./helpers/api-mocks";
import { AUTHENTICATION_COOKIE_NAME } from "@/lib/auth/cookie-config";
import { getTestUrl } from "./helpers/getTestUrl";
import { createMockUser } from "../mocks/user";

test.describe("Authentication Flows", () => {
  async function setup(page: Page, cookie: "absent" | "invalid" | "valid") {
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.context().clearCookies();

    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });

    if (cookie === "valid" || cookie === "invalid") {
      await page.context().addCookies([
        {
          name: AUTHENTICATION_COOKIE_NAME,
          value: cookie === "valid" ? "valid-session-cookie-for-testing" : "invalid-session-cookie",
          domain: ".local.jiki.io",
          path: "/",
          httpOnly: true,
          secure: false,
          sameSite: "Lax"
        }
      ]);
    }
  }

  async function mockUnauthorized(page: Page) {
    await mockAPIInternalMeUnauthorized(page);
    await mockAPILogout(page);
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

  async function waitForLoadingToComplete(page: Page) {
    await page.waitForFunction(() => {
      const headings = document.querySelectorAll("h1");
      return Array.from(headings).every((h) => !h.textContent.includes("Waking up Jiki"));
    });
  }

  async function awaitRedirectToLogin(page: Page) {
    await page.waitForFunction((expectedUrl) => {
      const url = window.location.href;
      return url === expectedUrl;
    }, getTestUrl("/auth/login"));
  }

  async function assertLoginPage(page: Page) {
    await page.waitForTimeout(50);
    expect(page.url()).toBe(getTestUrl("/auth/login"));
  }

  async function assertDashboardPage(page: Page) {
    await page.waitForTimeout(50);
    const url = new URL(page.url());
    expect(url.pathname).toBe("/dashboard");
  }

  async function assertBlogPage(page: Page) {
    await page.waitForTimeout(50);
    expect(page.url()).toBe(getTestUrl("/blog"));
    await expect(page.getByRole("heading", { name: "News, insights and witterings" })).toBeVisible();
  }

  async function assertSettingsPage(page: Page) {
    await page.getByText("Danger Zone").waitFor();
    expect(page.url()).toBe(getTestUrl("/settings"));
    await expect(page.getByText("Danger Zone")).toBeVisible();
  }

  async function assertLandingPage(page: Page) {
    await waitForLoadingToComplete(page);
    await page.locator("h1").waitFor();
    const heading = await page.locator("h1").textContent();
    expect(heading).toContain("get into tech in 2026");
  }

  async function assertSignUpButton(page: Page) {
    const signupLink = page.locator('a[href="/auth/signup"]').first();
    await signupLink.waitFor();
    await expect(signupLink).toBeVisible();
  }

  async function assertReturnToJikiButton(page: Page) {
    await page.locator(".ui-btn-primary", { hasText: "Back to Jiki →" }).waitFor();
    const button = await page.locator(".ui-btn-primary").textContent();
    expect(button).toBe("Back to Jiki →");
  }

  async function awaitRedirectToDashboard(page: Page) {
    await page.waitForFunction(() => window.location.pathname === "/dashboard");
  }

  async function awaitRedirectToLandingPage(page: Page) {
    await page.waitForFunction(() => window.location.pathname === "/");
  }

  test.describe("Visiting /settings", () => {
    test("should redirect to /auth/login without session cookie", async ({ page }) => {
      await setup(page, "absent");
      await visitSettingsPage(page);
      await waitForLoadingToComplete(page);
      await awaitRedirectToLogin(page);
      await assertLoginPage(page);
    });

    test("should redirect to /auth/login with invalid session cookie", async ({ page }) => {
      await setup(page, "invalid");
      await mockUnauthorized(page);

      await visitSettingsPage(page);
      await waitForLoadingToComplete(page);
      await awaitRedirectToLogin(page);
      await assertLoginPage(page);
    });

    test("should redirect to /auth/login with session cookie that the server rejects", async ({ page }) => {
      await setup(page, "valid");
      await mockUnauthorized(page);

      await visitSettingsPage(page);
      await waitForLoadingToComplete(page);
      await awaitRedirectToLogin(page);
      await assertLoginPage(page);
    });

    test("should render with valid session cookie", async ({ page }) => {
      await setup(page, "valid");
      await mockAPIInternalMe(page, createMockUser());

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
      await mockUnauthorized(page);

      await visitDashboard(page, false);
      await awaitRedirectToLandingPage(page);
      await assertLandingPage(page);
    });

    test("should redirect to / with session cookie that the server rejects", async ({ page }) => {
      await setup(page, "valid");
      await mockUnauthorized(page);

      await visitDashboard(page);
      await awaitRedirectToLandingPage(page);
      await assertLandingPage(page);
    });

    test("should render with valid session cookie", async ({ page }) => {
      await setup(page, "valid");
      await mockAPIInternalMe(page, createMockUser());

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
      await mockUnauthorized(page);

      await visitLandingPath(page, false);
      await awaitRedirectToDashboard(page);
      await awaitRedirectToLandingPage(page);
      await assertLandingPage(page);
    });

    test("should render with invalid cookie (duplicate)", async ({ page }) => {
      await setup(page, "invalid");
      await mockUnauthorized(page);

      await visitLandingPath(page);
      await awaitRedirectToDashboard(page);
      await awaitRedirectToLandingPage(page);
      await assertLandingPage(page);
    });

    test("should redirect to /dashboard with valid session cookie", async ({ page }) => {
      await setup(page, "valid");
      await mockAPIInternalMe(page, createMockUser());

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
      await mockUnauthorized(page);

      await visitBlogPage(page);
      await assertBlogPage(page);
      await assertSignUpButton(page);
    });

    test("should render with valid session cookie", async ({ page }) => {
      await setup(page, "valid");
      await mockAPIInternalMe(page, createMockUser());

      await visitBlogPage(page);
      await assertBlogPage(page);
      await assertReturnToJikiButton(page);
    });
  });
});
