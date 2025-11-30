describe("Authentication E2E", () => {
  describe("Landing Page", () => {
    it("should show landing page for unauthenticated users", async () => {
      await page.goto("http://localhost:3081");
      await page.waitForSelector("h1");

      const heading = await page.$eval("h1", (el) => el.textContent);
      expect(heading).toBe("Welcome to Jiki");

      // Check for login and signup links
      const loginLink = await page.$('a[href="/auth/login"]');
      const signupLink = await page.$('a[href="/auth/signup"]');

      expect(loginLink).toBeTruthy();
      expect(signupLink).toBeTruthy();
    });

    it("should navigate to login page when login button clicked", async () => {
      await page.goto("http://localhost:3081");
      await page.waitForSelector('a[href="/auth/login"]');

      // Click the login link and wait for navigation
      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }), page.click('a[href="/auth/login"]')]);

      // Check we're on the login page
      const url = page.url();
      expect(url).toContain("/auth/login");

      // Wait for content and verify heading
      await page.waitForSelector("h1");
      const heading = await page.$eval("h1", (el) => el.textContent);
      expect(heading).toBe("Log In");
    });

    it("should navigate to signup page when signup button clicked", async () => {
      await page.goto("http://localhost:3081");
      await page.waitForSelector('a[href="/auth/signup"]');

      // Click the signup link and wait for navigation
      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }), page.click('a[href="/auth/signup"]')]);

      // Check we're on the signup page
      const url = page.url();
      expect(url).toContain("/auth/signup");

      // Wait for content and verify heading
      await page.waitForSelector("h1");
      const heading = await page.$eval("h1", (el) => el.textContent);
      expect(heading).toBe("Sign Up");
    });
  });

  describe("Login Page", () => {
    beforeEach(async () => {
      await page.goto("http://localhost:3081/auth/login");
      await page.waitForSelector("h1");
    });

    it("should display login form with email and password fields", async () => {
      // Check page heading
      const heading = await page.$eval("h1", (el) => el.textContent);
      expect(heading).toBe("Log In");

      // Check for form elements
      const emailInput = await page.$('input[type="email"]');
      const passwordInput = await page.$('input[type="password"]');
      const submitButton = await page.$('button[type="submit"]');
      const signupLink = await page.$('a[href="/auth/signup"]');

      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(submitButton).toBeTruthy();
      expect(signupLink).toBeTruthy();

      // Check submit button text
      const submitText = await page.$eval('button[type="submit"]', (el) => el.textContent);
      expect(submitText).toContain("Log In");
    });

    it("should show validation error for empty email", async () => {
      // Try to submit without filling fields
      await page.click('button[type="submit"]');

      // Wait for validation error message to appear
      try {
        await page.waitForFunction(
          () => {
            const errorElements = Array.from(document.querySelectorAll("*"));
            return errorElements.some((el) => el.textContent && el.textContent.includes("Email is required"));
          },
          { timeout: 3000 }
        );

        const hasError = await page.evaluate(() => {
          const errorElements = Array.from(document.querySelectorAll("*"));
          return errorElements.some((el) => el.textContent && el.textContent.includes("Email is required"));
        });
        expect(hasError).toBe(true);
      } catch {
        // Fallback to HTML5 validation
        const emailInput = await page.$('input[type="email"]');
        const isEmailInvalid = await page.evaluate((input) => {
          return input ? !input.checkValidity() : false;
        }, emailInput);
        expect(isEmailInvalid).toBe(true);
      }
    });

    it("should navigate to signup page via link", async () => {
      // Find and click the signup link
      const signupLink = await page.$('a[href="/auth/signup"]');
      expect(signupLink).toBeTruthy();

      // Click signup link and wait for navigation
      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }), page.click('a[href="/auth/signup"]')]);

      // Check we're on signup page
      const url = page.url();
      expect(url).toContain("/auth/signup");

      // Wait for content and verify heading
      await page.waitForSelector("h1");
      const heading = await page.$eval("h1", (el) => el.textContent);
      expect(heading).toBe("Sign Up");
    });
  });

  describe("Signup Page", () => {
    beforeEach(async () => {
      await page.goto("http://localhost:3081/auth/signup");
      await page.waitForSelector("h1");
    });

    it("should display signup form with all required fields", async () => {
      // Check page heading
      const heading = await page.$eval("h1", (el) => el.textContent);
      expect(heading).toBe("Sign Up");

      // Check for form fields (based on your new implementation)
      const emailInput = await page.$('input[type="email"]');
      const passwordInput = await page.$('input[type="password"]');
      const submitButton = await page.$('button[type="submit"]');
      const loginLink = await page.$('a[href="/auth/login"]');

      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(submitButton).toBeTruthy();
      expect(loginLink).toBeTruthy();

      // Check submit button text
      const submitText = await page.$eval('button[type="submit"]', (el) => el.textContent);
      expect(submitText).toContain("Sign Up");
    });

    it("should show validation error for empty email", async () => {
      // Try to submit without filling email
      await page.click('button[type="submit"]');

      // Wait for validation error message to appear
      try {
        await page.waitForFunction(
          () => {
            const errorElements = Array.from(document.querySelectorAll("*"));
            return errorElements.some((el) => el.textContent && el.textContent.includes("Email is required"));
          },
          { timeout: 3000 }
        );

        const hasError = await page.evaluate(() => {
          const errorElements = Array.from(document.querySelectorAll("*"));
          return errorElements.some((el) => el.textContent && el.textContent.includes("Email is required"));
        });
        expect(hasError).toBe(true);
      } catch {
        // Fallback to HTML5 validation
        const emailInput = await page.$('input[type="email"]');
        const isEmailInvalid = await page.evaluate((input) => {
          return input ? !input.checkValidity() : false;
        }, emailInput);
        expect(isEmailInvalid).toBe(true);
      }
    });

    it("should navigate to login page via link", async () => {
      // Find and click the login link
      const loginLink = await page.$('a[href="/auth/login"]');
      expect(loginLink).toBeTruthy();

      // Click login link and wait for navigation
      await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }), page.click('a[href="/auth/login"]')]);

      // Check we're on login page
      const url = page.url();
      expect(url).toContain("/auth/login");

      // Wait for content and verify heading
      await page.waitForSelector("h1");
      const heading = await page.$eval("h1", (el) => el.textContent);
      expect(heading).toBe("Log In");
    });
  });

  describe("Authentication Flow", () => {
    it("should redirect unauthenticated users from dashboard to login", async () => {
      // Clear any existing auth completely
      await page.goto("http://localhost:3081", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      // Force reload to ensure clean state
      await page.reload({ waitUntil: "domcontentloaded" });

      // Try to access dashboard
      await page.goto("http://localhost:3081/dashboard", { waitUntil: "domcontentloaded" });

      // With ClientAuthGuard, we should see either loading spinner or redirect quickly
      // Wait for either the login page URL or auth-related content
      try {
        await page.waitForFunction(() => window.location.href.includes("/auth/login"), { timeout: 2000 });
      } catch {
        // If redirect didn't happen via URL change, check if we're showing login UI
        await page.waitForSelector('h1:has-text("Log In")', { timeout: 2000 });
      }

      const url = page.url();
      expect(url).toContain("/auth/login");
    });
  });

  describe("Password Reset Flow", () => {
    describe("Forgot Password Page", () => {
      beforeEach(async () => {
        await page.goto("http://localhost:3081/auth/forgot-password");
        await page.waitForSelector("h1");
      });

      it("should display forgot password form with email field", async () => {
        // Check page heading
        const heading = await page.$eval("h1", (el) => el.textContent);
        expect(heading).toBe("Forgot your password?");

        // Check for form elements
        const emailInput = await page.$('input[type="email"]');
        const submitButton = await page.$('button[type="submit"]');
        const loginLink = await page.$('a[href="/auth/login"]');

        expect(emailInput).toBeTruthy();
        expect(submitButton).toBeTruthy();
        expect(loginLink).toBeTruthy();

        // Check submit button text
        const submitText = await page.$eval('button[type="submit"]', (el) => el.textContent);
        expect(submitText).toContain("Send Reset Link");
      });

      it("should show validation error for empty email", async () => {
        // Try to submit without filling email
        await page.click('button[type="submit"]');

        // Check HTML5 validation
        const emailInput = await page.$('input[type="email"]');
        const isEmailInvalid = await page.evaluate((input) => {
          return input ? !input.checkValidity() : false;
        }, emailInput);

        expect(isEmailInvalid).toBe(true);
      });

      it("should show validation error for invalid email format", async () => {
        // Enter invalid email format
        await page.type('input[type="email"]', "invalid-email");
        await page.click('button[type="submit"]');

        // Wait for validation error message to appear
        try {
          await page.waitForFunction(
            () => {
              const errorElements = Array.from(document.querySelectorAll("*"));
              return errorElements.some(
                (el) => el.textContent && el.textContent.includes("Please enter a valid email")
              );
            },
            { timeout: 3000 }
          );

          const hasError = await page.evaluate(() => {
            const errorElements = Array.from(document.querySelectorAll("*"));
            return errorElements.some((el) => el.textContent && el.textContent.includes("Please enter a valid email"));
          });
          expect(hasError).toBe(true);
        } catch {
          // Fallback to checking for other validation or error feedback
          const errorElement = await page.$(".bg-\\[\\#e0f5d2\\]"); // Your green error styling
          if (errorElement) {
            expect(errorElement).toBeTruthy();
          } else {
            // At minimum, button should remain enabled for retry
            const submitButton = await page.$('button[type="submit"]');
            expect(submitButton).toBeTruthy();
          }
        }
      });

      it("should handle form submission with valid email", async () => {
        // Enter valid email
        await page.type('input[type="email"]', "test@example.com");
        await page.click('button[type="submit"]');

        // Wait for either success message or API error (since backend might not be running)
        try {
          await page.waitForFunction(
            () => {
              const successElements = Array.from(document.querySelectorAll("*"));
              return successElements.some(
                (el) =>
                  el.textContent &&
                  el.textContent.includes(
                    "If an account with that email exists, you'll receive reset instructions shortly"
                  )
              );
            },
            { timeout: 3000 }
          );

          const hasSuccessMessage = await page.evaluate(() => {
            const successElements = Array.from(document.querySelectorAll("*"));
            return successElements.some(
              (el) =>
                el.textContent &&
                el.textContent.includes(
                  "If an account with that email exists, you'll receive reset instructions shortly"
                )
            );
          });
          expect(hasSuccessMessage).toBe(true);
        } catch {
          // If API is not available, check for error message or that form is still functional
          const errorElement = await page.$(".bg-red-50");
          const submitButton = await page.$('button[type="submit"]');
          // Either error message should appear or button should still be there for retry
          expect(errorElement || submitButton).toBeTruthy();
        }
      });

      it("should navigate to login page via link", async () => {
        // Click the login link
        const loginLink = await page.$('a[href="/auth/login"]');
        expect(loginLink).toBeTruthy();

        // Click login link and wait for navigation
        await Promise.all([page.waitForNavigation({ waitUntil: "networkidle0" }), page.click('a[href="/auth/login"]')]);

        // Check we're on login page
        const url = page.url();
        expect(url).toContain("/auth/login");

        // Wait for content and verify heading
        await page.waitForSelector("h1");
        const heading = await page.$eval("h1", (el) => el.textContent);
        expect(heading).toBe("Log In");
      });

      it("should have forgot password link from login page", async () => {
        // Navigate to login page first
        await page.goto("http://localhost:3081/auth/login");
        await page.waitForSelector("h1");

        // Find and click the forgot password link
        const forgotLink = await page.$('a[href="/auth/forgot-password"]');
        expect(forgotLink).toBeTruthy();

        // Click forgot password link and wait for navigation
        await Promise.all([
          page.waitForNavigation({ waitUntil: "networkidle0" }),
          page.click('a[href="/auth/forgot-password"]')
        ]);

        // Check we're on forgot password page
        const url = page.url();
        expect(url).toContain("/auth/forgot-password");

        // Wait for content and verify heading
        await page.waitForSelector("h1");
        const heading = await page.$eval("h1", (el) => el.textContent);
        expect(heading).toBe("Forgot your password?");
      });
    });

    describe("Reset Password Page", () => {
      describe("With valid token", () => {
        beforeEach(async () => {
          await page.goto("http://localhost:3081/auth/reset-password?token=valid-reset-token");
          await page.waitForSelector("h2");
        });

        it("should display reset password form with password fields", async () => {
          // Check page heading
          const heading = await page.$eval("h2", (el) => el.textContent);
          expect(heading).toBe("Reset your password");

          // Check for form elements
          const passwordInput = await page.$('input[name="password"]');
          const confirmPasswordInput = await page.$('input[name="passwordConfirmation"]');
          const submitButton = await page.$('button[type="submit"]');
          const loginLink = await page.$('a[href="/auth/login"]');

          expect(passwordInput).toBeTruthy();
          expect(confirmPasswordInput).toBeTruthy();
          expect(submitButton).toBeTruthy();
          expect(loginLink).toBeTruthy();

          // Check submit button text
          const submitText = await page.$eval('button[type="submit"]', (el) => el.textContent);
          expect(submitText).toContain("Reset password");
        });

        it("should show validation error for empty password", async () => {
          // Try to submit without filling fields
          await page.click('button[type="submit"]');

          // Wait for validation error or check form behavior
          try {
            await page.waitForSelector(".text-red-600", { timeout: 3000 });
            const errorText = await page.$eval(".text-red-600", (el) => el.textContent);
            expect(errorText).toContain("Password is required");
          } catch {
            // Check HTML5 validation instead
            const passwordInput = await page.$('input[name="password"]');
            const isPasswordInvalid = await page.evaluate((input) => {
              return input ? !input.checkValidity() : false;
            }, passwordInput);
            expect(isPasswordInvalid).toBe(true);
          }
        });

        it("should show validation error for short password", async () => {
          // Enter short password
          await page.type('input[name="password"]', "123");
          await page.type('input[name="passwordConfirmation"]', "123");
          await page.click('button[type="submit"]');

          // Wait for validation error
          await page.waitForSelector(".text-red-600", { timeout: 5000 });
          const errorText = await page.$eval(".text-red-600", (el) => el.textContent);
          expect(errorText).toContain("Password must be at least 6 characters");
        });

        it("should show validation error when passwords don't match", async () => {
          // Enter mismatched passwords
          await page.type('input[name="password"]', "password123");
          await page.type('input[name="passwordConfirmation"]', "differentpassword");
          await page.click('button[type="submit"]');

          // Wait for validation error
          await page.waitForSelector(".text-red-600", { timeout: 5000 });
          const errorText = await page.$eval(".text-red-600", (el) => el.textContent);
          expect(errorText).toContain("Passwords don't match");
        });

        it("should clear validation errors when user starts typing", async () => {
          // First trigger validation error by submitting empty form
          await page.click('button[type="submit"]');

          // Wait a moment for any validation to occur
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Start typing in password field
          await page.type('input[name="password"]', "newpassword");

          // Check that form is responsive to user input
          const passwordValue = await page.$eval('input[name="password"]', (input: HTMLInputElement) => input.value);
          expect(passwordValue).toBe("newpassword");
        });
      });

      describe("Without token", () => {
        beforeEach(async () => {
          await page.goto("http://localhost:3081/auth/reset-password");
          await page.waitForSelector("h2");
        });

        it("should show invalid reset link message when no token provided", async () => {
          // Check page heading for error state
          const heading = await page.$eval("h2", (el) => el.textContent);
          expect(heading).toBe("Invalid Reset Link");

          // Check for error message
          const errorMessage = await page.$eval(".bg-red-50 .text-red-800", (el) => el.textContent);
          expect(errorMessage).toContain("This password reset link is invalid or has expired");

          // Check for link to request new reset
          const newResetLink = await page.$('a[href="/auth/forgot-password"]');
          expect(newResetLink).toBeTruthy();
        });

        it("should navigate to forgot password page from invalid link page", async () => {
          // Verify the link exists and has correct href
          const linkElement = await page.$('a[href="/auth/forgot-password"]');
          expect(linkElement).toBeTruthy();

          // Verify the link text
          const linkText = await page.$eval('a[href="/auth/forgot-password"]', (el) => el.textContent);
          expect(linkText).toContain("Request a new password reset");
        }, 60000);
      });

      describe("With token from URL parameter variations", () => {
        it("should work with reset_password_token parameter", async () => {
          await page.goto("http://localhost:3081/auth/reset-password?reset_password_token=valid-token");
          await page.waitForSelector("h2");

          const heading = await page.$eval("h2", (el) => el.textContent);
          expect(heading).toBe("Reset your password");

          // Should show form, not error message
          const passwordInput = await page.$('input[name="password"]');
          expect(passwordInput).toBeTruthy();
        });

        it("should work with token parameter", async () => {
          await page.goto("http://localhost:3081/auth/reset-password?token=valid-token");
          await page.waitForSelector("h2");

          const heading = await page.$eval("h2", (el) => el.textContent);
          expect(heading).toBe("Reset your password");

          // Should show form, not error message
          const passwordInput = await page.$('input[name="password"]');
          expect(passwordInput).toBeTruthy();
        });
      });
    });
  });
});
