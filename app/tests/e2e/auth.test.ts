describe("Authentication E2E", () => {
  describe("Landing Page", () => {
    it("should show landing page for unauthenticated users", async () => {
      await page.goto("http://localhost:3070");
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
      await page.goto("http://localhost:3070");
      await page.waitForSelector('a[href="/auth/login"]');

      // Click the login link
      await page.click('a[href="/auth/login"]');

      // Wait for login page heading to appear
      await page.waitForSelector("h2");

      // Check we're on the login page
      const url = page.url();
      expect(url).toContain("/auth/login");
      const heading = await page.$eval("h2", (el) => el.textContent);
      expect(heading).toBe("Sign in to your account");
    });

    it("should navigate to signup page when signup button clicked", async () => {
      await page.goto("http://localhost:3070");
      await page.waitForSelector('a[href="/auth/signup"]');

      // Click the signup link
      await page.click('a[href="/auth/signup"]');

      // Wait for signup page heading to appear
      await page.waitForSelector("h2");

      // Check we're on the signup page
      const url = page.url();
      expect(url).toContain("/auth/signup");
      const heading = await page.$eval("h2", (el) => el.textContent);
      expect(heading).toBe("Create your account");
    });
  });

  describe("Login Page", () => {
    beforeEach(async () => {
      await page.goto("http://localhost:3070/auth/login");
      await page.waitForSelector("h2");
    });

    it("should display login form with email and password fields", async () => {
      // Check for form elements
      const emailInput = await page.$('input[type="email"]');
      const passwordInput = await page.$('input[type="password"]');
      const submitButton = await page.$('button[type="submit"]');

      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(submitButton).toBeTruthy();

      // Check submit button text
      const submitText = await page.$eval('button[type="submit"]', (el) => el.textContent);
      expect(submitText).toContain("Sign in");
    });

    it("should show validation error for empty email", async () => {
      // Try to submit without filling fields
      await page.click('button[type="submit"]');

      // Check HTML5 validation
      const emailInput = await page.$('input[type="email"]');
      const isEmailInvalid = await page.evaluate((input) => {
        return input ? !input.checkValidity() : false;
      }, emailInput);

      expect(isEmailInvalid).toBe(true);
    });

    it("should navigate to signup page via link", async () => {
      // Find and click the signup link
      const signupLink = await page.$('a[href="/auth/signup"]');
      expect(signupLink).toBeTruthy();

      await page.click('a[href="/auth/signup"]');
      await page.waitForFunction(() => window.location.href.includes("/auth/signup"));

      // Check we're on signup page
      const url = page.url();
      expect(url).toContain("/auth/signup");
    });
  });

  describe("Signup Page", () => {
    beforeEach(async () => {
      await page.goto("http://localhost:3070/auth/signup");
      await page.waitForSelector("h2");
    });

    it("should display signup form with all required fields", async () => {
      // Check for all form fields
      const emailInput = await page.$('input[type="email"]');
      const passwordInput = await page.$('input[type="password"]');
      const confirmPasswordInput = await page.$('input[name="password_confirmation"]');
      const nameInput = await page.$('input[name="name"]');
      const submitButton = await page.$('button[type="submit"]');

      expect(emailInput).toBeTruthy();
      expect(passwordInput).toBeTruthy();
      expect(confirmPasswordInput).toBeTruthy();
      expect(nameInput).toBeTruthy();
      expect(submitButton).toBeTruthy();

      // Check submit button text
      const submitText = await page.$eval('button[type="submit"]', (el) => el.textContent);
      expect(submitText).toContain("Sign up");
    });

    it("should show error when passwords don't match", async () => {
      // Fill in the form with mismatched passwords
      await page.type('input[type="email"]', "test@example.com");
      await page.type('input[name="name"]', "Test User");
      await page.type('input[type="password"]', "password123");
      await page.type('input[name="password_confirmation"]', "differentpassword");

      // Check the terms checkbox
      await page.click('input[name="terms"]');

      // Submit the form
      await page.click('button[type="submit"]');

      // Wait for client-side validation error
      await page.waitForSelector(".text-red-600", { timeout: 5000 });
      const errorText = await page.$eval(".text-red-600", (el) => el.textContent);
      expect(errorText).toContain("Passwords don't match");
    });

    it("should navigate to login page via link", async () => {
      // Find and click the login link
      const loginLink = await page.$('a[href="/auth/login"]');
      expect(loginLink).toBeTruthy();

      await page.click('a[href="/auth/login"]');
      await page.waitForFunction(() => window.location.href.includes("/auth/login"));

      // Check we're on login page
      const url = page.url();
      expect(url).toContain("/auth/login");
    });
  });

  describe("Authentication Flow", () => {
    it("should redirect unauthenticated users from dashboard to login", async () => {
      // Clear any existing auth completely
      await page.goto("http://localhost:3070", { waitUntil: "domcontentloaded" });
      await page.evaluate(() => {
        localStorage.clear();
        sessionStorage.clear();
      });

      // Force reload to ensure clean state
      await page.reload({ waitUntil: "domcontentloaded" });

      // Try to access dashboard
      await page.goto("http://localhost:3070/dashboard", { waitUntil: "domcontentloaded" });

      // Wait for auth system to resolve and redirect
      await page.waitForFunction(() => window.location.href.includes("/auth/login"), { timeout: 5000 });

      const url = page.url();
      expect(url).toContain("/auth/login");
    });
  });
});
