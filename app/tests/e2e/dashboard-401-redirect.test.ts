/**
 * E2E Test: Dashboard 401 Authentication Error Redirect
 *
 * Tests that when a user visits the dashboard with an invalid token,
 * they are automatically redirected to the login page instead of
 * seeing an "API Error: 401 Unauthorized" message.
 */

describe("Dashboard 401 Redirect", () => {
  it("should redirect to login when dashboard API returns 401", async () => {
    // Simulate having an invalid token in localStorage
    await page.goto("http://localhost:3081");

    // Set an invalid auth token in localStorage to simulate an expired/invalid session
    await page.evaluate(() => {
      localStorage.setItem(
        "auth-storage",
        JSON.stringify({
          state: {
            user: { id: "test-user", email: "test@test.com" },
            isAuthenticated: true
          }
        })
      );

      // Set an invalid access token that will cause 401 errors
      document.cookie = "access_token=invalid-token; path=/; SameSite=Strict";
    });

    // Now visit the dashboard - this should trigger the 401 error
    await page.goto("http://localhost:3081/dashboard");

    // Wait for the redirect to happen
    await page.waitForFunction(() => window.location.pathname.includes("/auth/login"), { timeout: 10000 });

    // Verify we're on the login page
    const url = page.url();
    expect(url).toContain("/auth/login");

    // Verify we see the login page content, not an error message
    await page.waitForSelector("h1");
    const heading = await page.$eval("h1", (el) => el.textContent);
    expect(heading).toBe("Log In");

    // Verify we don't see the 401 error message
    const errorMessage = await page.$("text=API Error: 401 Unauthorized");
    expect(errorMessage).toBeFalsy();

    // Verify auth storage was cleared (user should be logged out)
    const authStorage = await page.evaluate(() => {
      const storage = localStorage.getItem("auth-storage");
      return storage ? JSON.parse(storage) : null;
    });
    expect(authStorage?.state?.isAuthenticated).toBe(false);
    expect(authStorage?.state?.user).toBeNull();
  });
});
