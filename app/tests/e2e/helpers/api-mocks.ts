import type { Page } from "@playwright/test";
import type { User } from "@/types/auth";
import { AUTHENTICATION_COOKIE_NAME } from "@/lib/auth/cookie-config";

export const API_BASE = "http://local.jiki.io:3060";

/**
 * Blocks every request to the API by fulfilling with a synthetic 404.
 * Register this FIRST so that any specific mocks registered afterwards
 * take precedence (Playwright route handlers are matched in
 * reverse-registration order).
 *
 * Fulfilling with 404 (rather than aborting) is important: aborts throw
 * a TypeError inside fetch, which `apiFetch` in `lib/api/client.ts`
 * retries indefinitely. A 404 response is a successful fetch that
 * callers can handle normally.
 */
export async function blockUnmockedAPI(page: Page) {
  await page.route(`${API_BASE}/**`, (route) =>
    route.fulfill({ status: 404, contentType: "application/json", body: "{}" })
  );
}

export async function mockAPILogin(page: Page, status: "success" | "unauthorized" | "unconfirmed", user: User) {
  await page.route(`${API_BASE}/auth/login`, (route) => {
    if (status === "success") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ status: "success", user })
      });
    }
    if (status === "unauthorized") {
      return route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ error: { type: "unauthorized", message: "Invalid email or password" } })
      });
    }
    return route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ error: { type: "unconfirmed", email: user.email } })
    });
  });
}

export type SignupMockStatus = "success" | "already_registered" | "validation_error";

export async function mockAPISignup(page: Page, status: SignupMockStatus, user: User) {
  await page.route(`${API_BASE}/auth/signup`, (route) => {
    if (status === "success") {
      return route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({ user })
      });
    }
    if (status === "already_registered") {
      return route.fulfill({
        status: 422,
        contentType: "application/json",
        body: JSON.stringify({
          error: {
            type: "validation_error",
            message: "Validation failed",
            errors: { email: ["has already been taken"] }
          }
        })
      });
    }
    return route.fulfill({
      status: 422,
      contentType: "application/json",
      body: JSON.stringify({ error: { type: status, message: status } })
    });
  });
}

export async function mockAPIInternalMe(page: Page, user: User) {
  await page.route(`${API_BASE}/internal/me`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ user })
    })
  );
}

export async function mockAPIInternalMeUnauthorized(page: Page) {
  await page.route(`${API_BASE}/internal/me`, (route) =>
    route.fulfill({
      status: 401,
      contentType: "application/json",
      body: JSON.stringify({ error: "Unauthorized" })
    })
  );
}

export async function mockAPILogout(page: Page) {
  await page.route(`${API_BASE}/auth/logout`, async (route) => {
    await route.request().frame().page().context().clearCookies({ name: AUTHENTICATION_COOKIE_NAME });
    await route.fulfill({ status: 200, contentType: "application/json", body: "{}" });
  });
}

export async function mockAPIFlag(page: Page, key: string, flagged: boolean) {
  await page.route(`${API_BASE}/internal/settings/flags/${key}`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ flagged })
    })
  );
}

export async function mockAPIBadges(page: Page, body: { badges: unknown[]; num_locked_secret_badges?: number }) {
  await page.route(`${API_BASE}/internal/badges`, (route) =>
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(body)
    })
  );
}

export async function mockAPIBadgeReveal(page: Page, badgeId: number, badge: unknown) {
  await page.route(`${API_BASE}/internal/badges/${badgeId}/reveal`, (route) => {
    if (route.request().method() !== "PATCH") {
      return route.fallback();
    }
    return route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ badge })
    });
  });
}

export async function mockAPIConfirmEmail(page: Page, status: "success" | "invalid", user?: User) {
  await page.route(/\/auth\/confirmation(\?|$)/, (route) => {
    if (status === "success") {
      return route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ user })
      });
    }
    return route.fulfill({
      status: 422,
      contentType: "application/json",
      body: JSON.stringify({ error: { type: "invalid_token", message: "Invalid or expired token" } })
    });
  });
}
