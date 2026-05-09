import { test, expect } from "./helpers/test";
import { mockAPIConfirmEmail, mockAPIInternalMe, mockAPILogin, mockAPISignup } from "./helpers/api-mocks";
import { createMockUser } from "../mocks/user";

test.describe("Auth Signup and Login Flows", () => {
  test.describe("Sign Up Flow", () => {
    test.beforeEach(async ({ page }) => {
      await page.context().clearCookies();
    });

    test("should show check inbox message on successful signup with unconfirmed email", async ({ page }) => {
      const user = createMockUser({ email: "newuser@example.com", email_confirmed: false });
      await mockAPISignup(page, "success", user);

      await page.goto("/auth/signup");
      await page.getByRole("heading", { name: "Sign Up" }).waitFor();

      await page.locator("#signup-email").fill(user.email);
      await page.locator("#signup-password").fill("password123");
      await page.locator('button[type="submit"]').click();

      await expect(page.getByRole("heading", { name: "Check your inbox" })).toBeVisible();
      await expect(page.getByText(user.email)).toBeVisible();
      await expect(page.getByText("We've sent a confirmation email to")).toBeVisible();
      await expect(
        page.locator(`a[href*="/auth/resend-confirmation?email=${encodeURIComponent(user.email)}"]`)
      ).toBeVisible();
    });

    test("should redirect to dashboard on signup with confirmed email (e.g., Google OAuth)", async ({ page }) => {
      const user = createMockUser({ email: "confirmed@example.com", email_confirmed: true });
      await mockAPISignup(page, "success", user);
      await mockAPIInternalMe(page, user);

      await page.goto("/auth/signup");
      await page.getByRole("heading", { name: "Sign Up" }).waitFor();

      await page.locator("#signup-email").fill(user.email);
      await page.locator("#signup-password").fill("password123");
      await page.locator('button[type="submit"]').click();

      await page.waitForURL("**/dashboard");
      expect(page.url()).toContain("/dashboard");
    });

    test("should show error for duplicate email", async ({ page }) => {
      const user = createMockUser({ email: "existing@example.com" });
      await mockAPISignup(page, "already_registered", user);

      await page.goto("/auth/signup");
      await page.getByRole("heading", { name: "Sign Up" }).waitFor();

      await page.locator("#signup-email").fill(user.email);
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
      const user = createMockUser();
      await mockAPILogin(page, "success", user);
      await mockAPIInternalMe(page, user);

      await page.goto("/auth/login");
      await page.getByRole("heading", { name: "Log In" }).waitFor();

      await page.locator("#login-email").fill(user.email);
      await page.locator("#login-password").fill("password123");
      await page.locator('button[type="submit"]').click();

      await page.waitForURL("**/dashboard");
      expect(page.url()).toContain("/dashboard");
    });

    test("should show 'Invalid email or password' for wrong credentials", async ({ page }) => {
      const user = createMockUser({ email: "wrong@example.com" });
      await mockAPILogin(page, "unauthorized", user);

      await page.goto("/auth/login");
      await page.getByRole("heading", { name: "Log In" }).waitFor();

      await page.locator("#login-email").fill(user.email);
      await page.locator("#login-password").fill("wrongpassword");
      await page.locator('button[type="submit"]').click();

      await expect(page.getByText("Invalid email or password")).toBeVisible();
    });

    test("should show 'Please confirm your email' for unconfirmed account", async ({ page }) => {
      const user = createMockUser({ email: "unconfirmed@example.com", email_confirmed: false });
      await mockAPILogin(page, "unconfirmed", user);

      await page.goto("/auth/login");
      await page.getByRole("heading", { name: "Log In" }).waitFor();

      await page.locator("#login-email").fill(user.email);
      await page.locator("#login-password").fill("password123");
      await page.locator('button[type="submit"]').click();

      await expect(page.getByText("Please confirm your email before logging in")).toBeVisible();
      await expect(
        page.locator(`a[href*="/auth/resend-confirmation?email=${encodeURIComponent(user.email)}"]`)
      ).toBeVisible();
    });
  });

  test.describe("Email Confirmation Flow", () => {
    test.beforeEach(async ({ page }) => {
      await page.context().clearCookies();
    });

    test("should auto-login and redirect to dashboard on valid token", async ({ page }) => {
      const user = createMockUser({ email_confirmed: true });
      await mockAPIConfirmEmail(page, "success", user);
      await mockAPIInternalMe(page, user);

      await page.goto("/auth/confirm-email?token=valid-token");

      await expect(page.getByText("Email Confirmed!")).toBeVisible();
      await page.waitForURL("**/dashboard", { timeout: 5000 });
      expect(page.url()).toContain("/dashboard");
    });

    test("should show error page for invalid token", async ({ page }) => {
      await mockAPIConfirmEmail(page, "invalid");

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
