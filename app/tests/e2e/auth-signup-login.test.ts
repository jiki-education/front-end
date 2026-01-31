import { test, expect, type Route } from "@playwright/test";
import { createMockUser } from "../mocks/user";

test.describe("Auth Signup and Login Flows", () => {
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

  test.describe("Sign Up Flow", () => {
    test.beforeEach(async ({ page }) => {
      await page.context().clearCookies();
    });

    test("should show check inbox message on successful signup with unconfirmed email", async ({ page }) => {
      const testEmail = "newuser@example.com";

      await page.route("**/*", (route) => {
        if (handleOptionsRequest(route)) {
          return;
        }

        if (route.request().url().includes("/auth/signup") && route.request().method() === "POST") {
          void route.fulfill({
            status: 201,
            contentType: "application/json",
            headers: {
              "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
              "Access-Control-Allow-Credentials": "true"
            },
            body: JSON.stringify({
              user: { email: testEmail, email_confirmed: false }
            })
          });
          return;
        }
        void route.continue();
      });

      await page.goto("/auth/signup");
      await page.getByRole("heading", { name: "Sign Up" }).waitFor();

      await page.locator("#signup-email").fill(testEmail);
      await page.locator("#signup-password").fill("password123");
      await page.locator('button[type="submit"]').click();

      // Should show inline confirmation message instead of redirecting
      await expect(page.getByRole("heading", { name: "Check your inbox" })).toBeVisible();
      await expect(page.getByText(testEmail)).toBeVisible();
      await expect(page.getByText("We've sent a confirmation email to")).toBeVisible();
      // Should have resend link with email parameter
      await expect(
        page.locator(`a[href*="/auth/resend-confirmation?email=${encodeURIComponent(testEmail)}"]`)
      ).toBeVisible();
    });

    test("should redirect to dashboard on signup with confirmed email (e.g., Google OAuth)", async ({ page }) => {
      await page.route("**/*", (route) => {
        if (handleOptionsRequest(route)) {
          return;
        }

        if (route.request().url().includes("/auth/signup") && route.request().method() === "POST") {
          void route.fulfill({
            status: 201,
            contentType: "application/json",
            headers: {
              "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
              "Access-Control-Allow-Credentials": "true"
            },
            body: JSON.stringify({
              user: createMockUser({ email_confirmed: true })
            })
          });
          return;
        }

        if (route.request().url().includes("/internal/me")) {
          void route.fulfill({
            status: 200,
            contentType: "application/json",
            headers: {
              "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
              "Access-Control-Allow-Credentials": "true"
            },
            body: JSON.stringify({ user: createMockUser() })
          });
          return;
        }

        void route.continue();
      });

      await page.goto("/auth/signup");
      await page.getByRole("heading", { name: "Sign Up" }).waitFor();

      await page.locator("#signup-email").fill("confirmed@example.com");
      await page.locator("#signup-password").fill("password123");
      await page.locator('button[type="submit"]').click();

      await page.waitForURL("**/dashboard");
      expect(page.url()).toContain("/dashboard");
    });

    test("should show error for duplicate email", async ({ page }) => {
      await page.route("**/*", (route) => {
        if (handleOptionsRequest(route)) {
          return;
        }

        if (route.request().url().includes("/auth/signup") && route.request().method() === "POST") {
          void route.fulfill({
            status: 422,
            contentType: "application/json",
            headers: {
              "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
              "Access-Control-Allow-Credentials": "true"
            },
            body: JSON.stringify({
              error: {
                type: "validation_error",
                message: "Validation failed",
                errors: { email: ["has already been taken"] }
              }
            })
          });
          return;
        }
        void route.continue();
      });

      await page.goto("/auth/signup");
      await page.getByRole("heading", { name: "Sign Up" }).waitFor();

      await page.locator("#signup-email").fill("existing@example.com");
      await page.locator("#signup-password").fill("password123");
      await page.locator('button[type="submit"]').click();

      await expect(page.getByText("This email is already registered")).toBeVisible();
    });
  });

  test.describe("Login Flow", () => {
    test.beforeEach(async ({ page }) => {
      await page.context().clearCookies();
    });

    test("should redirect to dashboard on successful login", async ({ page }) => {
      await page.route("**/*", (route) => {
        if (handleOptionsRequest(route)) {
          return;
        }

        if (route.request().url().includes("/auth/login") && route.request().method() === "POST") {
          void route.fulfill({
            status: 200,
            contentType: "application/json",
            headers: {
              "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
              "Access-Control-Allow-Credentials": "true"
            },
            body: JSON.stringify({ status: "success", user: createMockUser() })
          });
          return;
        }

        if (route.request().url().includes("/internal/me")) {
          void route.fulfill({
            status: 200,
            contentType: "application/json",
            headers: {
              "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
              "Access-Control-Allow-Credentials": "true"
            },
            body: JSON.stringify({ user: createMockUser() })
          });
          return;
        }

        void route.continue();
      });

      await page.goto("/auth/login");
      await page.getByRole("heading", { name: "Log In" }).waitFor();

      await page.locator("#login-email").fill("test@example.com");
      await page.locator("#login-password").fill("password123");
      await page.locator('button[type="submit"]').click();

      await page.waitForURL("**/dashboard");
      expect(page.url()).toContain("/dashboard");
    });

    test("should show 'Invalid email or password' for wrong credentials", async ({ page }) => {
      await page.route("**/*", (route) => {
        if (handleOptionsRequest(route)) {
          return;
        }

        if (route.request().url().includes("/auth/login") && route.request().method() === "POST") {
          void route.fulfill({
            status: 401,
            contentType: "application/json",
            headers: {
              "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
              "Access-Control-Allow-Credentials": "true"
            },
            body: JSON.stringify({
              error: { type: "unauthorized", message: "Invalid email or password" }
            })
          });
          return;
        }
        void route.continue();
      });

      await page.goto("/auth/login");
      await page.getByRole("heading", { name: "Log In" }).waitFor();

      await page.locator("#login-email").fill("wrong@example.com");
      await page.locator("#login-password").fill("wrongpassword");
      await page.locator('button[type="submit"]').click();

      await expect(page.getByText("Invalid email or password")).toBeVisible();
    });

    test("should show 'Please confirm your email' for unconfirmed account", async ({ page }) => {
      const testEmail = "unconfirmed@example.com";

      await page.route("**/*", (route) => {
        if (handleOptionsRequest(route)) {
          return;
        }

        if (route.request().url().includes("/auth/login") && route.request().method() === "POST") {
          void route.fulfill({
            status: 401,
            contentType: "application/json",
            headers: {
              "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
              "Access-Control-Allow-Credentials": "true"
            },
            body: JSON.stringify({
              error: { type: "unconfirmed", email: testEmail }
            })
          });
          return;
        }
        void route.continue();
      });

      await page.goto("/auth/login");
      await page.getByRole("heading", { name: "Log In" }).waitFor();

      await page.locator("#login-email").fill(testEmail);
      await page.locator("#login-password").fill("password123");
      await page.locator('button[type="submit"]').click();

      await expect(page.getByText("Please confirm your email before logging in")).toBeVisible();
      // Check for the resend link with the email parameter
      await expect(
        page.locator(`a[href*="/auth/resend-confirmation?email=${encodeURIComponent(testEmail)}"]`)
      ).toBeVisible();
    });
  });

  test.describe("Email Confirmation Flow", () => {
    test.beforeEach(async ({ page }) => {
      await page.context().clearCookies();
    });

    test("should auto-login and redirect to dashboard on valid token", async ({ page }) => {
      await page.route("**/*", (route) => {
        if (handleOptionsRequest(route)) {
          return;
        }

        if (route.request().url().includes("/auth/confirmation") && route.request().method() === "GET") {
          void route.fulfill({
            status: 200,
            contentType: "application/json",
            headers: {
              "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
              "Access-Control-Allow-Credentials": "true"
            },
            body: JSON.stringify({ user: createMockUser({ email_confirmed: true }) })
          });
          return;
        }

        if (route.request().url().includes("/internal/me")) {
          void route.fulfill({
            status: 200,
            contentType: "application/json",
            headers: {
              "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
              "Access-Control-Allow-Credentials": "true"
            },
            body: JSON.stringify({ user: createMockUser() })
          });
          return;
        }

        void route.continue();
      });

      await page.goto("/auth/confirm-email?token=valid-token");

      await expect(page.getByText("Email Confirmed!")).toBeVisible();
      await page.waitForURL("**/dashboard", { timeout: 5000 });
      expect(page.url()).toContain("/dashboard");
    });

    test("should show error page for invalid token", async ({ page }) => {
      await page.route("**/*", (route) => {
        if (handleOptionsRequest(route)) {
          return;
        }

        if (route.request().url().includes("/auth/confirmation") && route.request().method() === "GET") {
          void route.fulfill({
            status: 422,
            contentType: "application/json",
            headers: {
              "Access-Control-Allow-Origin": "http://local.jiki.io:3081",
              "Access-Control-Allow-Credentials": "true"
            },
            body: JSON.stringify({
              error: { type: "invalid_token", message: "Invalid or expired token" }
            })
          });
          return;
        }
        void route.continue();
      });

      await page.goto("/auth/confirm-email?token=invalid-token");

      await expect(page.getByRole("heading", { name: "Link expired" })).toBeVisible();
      await expect(page.getByText(/no longer valid/i)).toBeVisible();
    });

    test("should show error when no token provided", async ({ page }) => {
      await page.goto("/auth/confirm-email");

      await expect(page.getByRole("heading", { name: "Link expired" })).toBeVisible();
    });
  });
});
