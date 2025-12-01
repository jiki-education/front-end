describe("Authentication Flows", () => {
  afterEach(async () => {
    // Clean up request interception listeners to prevent them from accumulating
    await page.setRequestInterception(false);
    page.removeAllListeners("request");
  });

  function handleOptionsRequest(request: any) {
    if (request.method() === "OPTIONS") {
      request.respond({
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

  function mockRequest(request: any, url: string, status: number, body: any) {
    if (request.url().includes(url)) {
      request.respond({
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

  function mockValidInternalMeApiCall(request: any) {
    return mockRequest(request, "/internal/me", 200, {
      user: {
        id: "test-user-id",
        email: "test@example.com",
        name: "Test User"
      }
    });
  }

  async function setup(cookie: "absent" | "invalid" | "valid") {
    // Clear all auth state and cookies
    await page.goto("http://localhost:3081", { waitUntil: "domcontentloaded" });

    // Delete all cookies using Puppeteer API first
    const existingCookies = await page.cookies();
    for (const c of existingCookies) {
      await page.deleteCookie(c);
    }

    await page.evaluate((cookieType) => {
      localStorage.clear();
      sessionStorage.clear();
      document.cookie.split(";").forEach((c) => {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // Set refresh token in localStorage for valid case (needed for refresh flow)
      if (cookieType === "valid") {
        const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
        const payload = btoa(JSON.stringify({ sub: "test-user-id", exp: 9999999999 }));
        const signature = "fake-signature";
        const refreshToken = `${header}.${payload}.${signature}`;
        localStorage.setItem("jiki_refresh_token", refreshToken);
      }
    }, cookie);

    // Set cookie based on type using Puppeteer API (ensures it's sent with HTTP requests)
    if (cookie === "invalid") {
      await page.setCookie({
        name: "jiki_access_token",
        value: "invalid-nonsense-string",
        domain: "localhost",
        path: "/",
        httpOnly: false // Make it accessible to JavaScript
      });
    } else if (cookie === "valid") {
      // Create a valid JWT with sub claim and future expiry
      const header = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64");
      const payload = Buffer.from(JSON.stringify({ sub: "test-user-id", exp: 9999999999 })).toString("base64");
      const signature = "fake-signature";
      const validToken = `${header}.${payload}.${signature}`;

      await page.setCookie({
        name: "jiki_access_token",
        value: validToken,
        domain: "localhost",
        path: "/",
        httpOnly: false // Make it accessible to JavaScript
      });
    }
    // If cookie is 'absent', don't set any cookie
  }

  async function visitDashboard() {
    await page.goto("http://localhost:3081/dashboard", { waitUntil: "domcontentloaded" });
  }

  async function visitSettingsPage() {
    await page.goto("http://localhost:3081/settings", { waitUntil: "domcontentloaded" });
  }
  async function visitLandingPath() {
    await page.goto("http://localhost:3081/", { waitUntil: "domcontentloaded" });
  }
  async function visitBlogPage() {
    await page.goto("http://localhost:3081/blog", { waitUntil: "domcontentloaded" });
  }

  async function awaitRedirectToLogin() {
    await page.waitForFunction(
      () => {
        const url = window.location.href;
        return url === "http://localhost:3081/auth/login";
      },
      { timeout: 5000 }
    );
  }

  async function assertLoginPage() {
    // Wait for login page to load
    await new Promise((resolve) => setTimeout(resolve, 50));

    const url = page.url();
    expect(url).toBe("http://localhost:3081/auth/login");
  }

  async function assertDashboardPage() {
    // Wait for dashboard to load
    await new Promise((resolve) => setTimeout(resolve, 50));

    const url = page.url();
    expect(url).toBe("http://localhost:3081/dashboard");
  }

  async function assertBlogPage() {
    // Wait for dashboard to load
    await new Promise((resolve) => setTimeout(resolve, 50));

    const url = page.url();
    expect(url).toBe("http://localhost:3081/blog");
  }

  async function assertSettingsPage() {
    // Wait for settings page to load
    await new Promise((resolve) => setTimeout(resolve, 50));

    const url = page.url();
    expect(url).toBe("http://localhost:3081/settings");
  }

  async function assertLandingPage() {
    await page.waitForSelector("h1", { timeout: 3000 });
    const heading = await page.$eval("h1", (el) => el.textContent);
    expect(heading).toBe("Welcome to Jiki");
  }

  async function assertSignUpButton() {
    await page.waitForSelector(".ui-btn-primary", { timeout: 1000 });
    const button = await page.$eval(".ui-btn-primary", (el) => el.textContent);
    expect(button).toBe("Sign Up");
  }

  async function assertReturnToJikiButton() {
    await page.waitForSelector(".ui-btn-primary", { timeout: 1000 });
    const button = await page.$eval(".ui-btn-primary", (el) => el.textContent);
    expect(button).toBe("Back to Jiki →");
  }

  async function awaitRedirectToDashboard() {
    await page.waitForFunction(
      () => {
        const url = window.location.href;
        return url === "http://localhost:3081/dashboard";
      },
      { timeout: 5000 }
    );
  }

  async function awaitRedirectToLandingPage() {
    await page.waitForFunction(
      () => {
        const url = window.location.href;
        return url === "http://localhost:3081/";
      },
      { timeout: 5000 }
    );
  }

  describe("Visiting /settings", () => {
    it("should redirect to /auth/login without jiki_refresh_token", async () => {
      await setup("absent");
      await visitSettingsPage();
      await awaitRedirectToLogin();
      await assertLoginPage();
    });

    it("should redirect to /auth/login with invalid jiki_refresh_token", async () => {
      await setup("invalid");
      await visitSettingsPage();
      await awaitRedirectToLogin();
      await assertLoginPage();
    });

    it("should redirect to /auth/login with valid jiki_refresh_token that the server rejects", async () => {
      await setup("valid");

      // Stub 401 responses from auth endpoints
      await page.setRequestInterception(true);
      page.on("request", (request) => {
        void (
          handleOptionsRequest(request) ||
          mockRequest(request, "/internal/me", 401, { error: "Unauthorized" }) ||
          mockRequest(request, "/auth/refresh", 401, { error: "Invalid refresh token" }) ||
          request.continue()
        );
      });

      await visitSettingsPage();
      await awaitRedirectToLogin();
      await assertLoginPage();
    });

    it("should render with valid token", async () => {
      await setup("valid");

      // Stub successful auth responses
      await page.setRequestInterception(true);
      page.on("request", (request) => {
        void (handleOptionsRequest(request) || mockValidInternalMeApiCall(request) || request.continue());
      });

      await visitSettingsPage();
      await assertSettingsPage();
    });

    it("should render with valid expired token", async () => {
      await setup("valid");

      // Track /internal/me calls to simulate expired then refreshed token
      let internalMeCalls = 0;

      await page.setRequestInterception(true);
      page.on("request", (request) => {
        if (handleOptionsRequest(request)) {
          return;
        }

        // First call to /internal/me returns 401 (expired token)
        // After refresh, subsequent calls return 200
        if (request.url().includes("/internal/me")) {
          internalMeCalls++;
          if (internalMeCalls === 1) {
            void mockRequest(request, "/internal/me", 401, { error: "Unauthorized" });
          } else {
            void mockValidInternalMeApiCall(request);
          }
          return;
        }

        // Stub /auth/refresh with successful token refresh, or continue with other requests
        void (
          mockRequest(request, "/auth/refresh", 200, { access_token: "new-access-token-after-refresh" }) ||
          request.continue()
        );
      });

      await visitSettingsPage();
      await assertSettingsPage();
    });
  });

  describe("Visiting /dashboard", () => {
    it("should redirect to /auth/login without jiki_refresh_token", async () => {
      await setup("absent");
      await visitDashboard();
      await awaitRedirectToLandingPage();
      await assertLandingPage();
    });

    it("should redirect to /auth/login with invalid jiki_refresh_token", async () => {
      await setup("invalid");
      await visitDashboard();
      await awaitRedirectToLogin();
      await assertLoginPage();
    });

    it("should redirect to / with valid jiki_refresh_token that the server rejects", async () => {
      await setup("valid");

      // Stub 401 responses from auth endpoints
      await page.setRequestInterception(true);
      page.on("request", (request) => {
        void (
          handleOptionsRequest(request) ||
          mockRequest(request, "/internal/me", 401, { error: "Unauthorized" }) ||
          mockRequest(request, "/auth/refresh", 401, { error: "Invalid refresh token" }) ||
          request.continue()
        );
      });

      await visitDashboard();
      await awaitRedirectToLandingPage();
      await assertLandingPage();
    });

    it("should render with valid token", async () => {
      await setup("valid");

      // Stub successful auth responses
      await page.setRequestInterception(true);
      page.on("request", (request) => {
        void (handleOptionsRequest(request) || mockValidInternalMeApiCall(request) || request.continue());
      });

      await visitDashboard();
      await assertDashboardPage();
    });

    it("should render with valid expired token", async () => {
      await setup("valid");

      // Track /internal/me calls to simulate expired then refreshed token
      let internalMeCalls = 0;

      await page.setRequestInterception(true);
      page.on("request", (request) => {
        if (handleOptionsRequest(request)) {
          return;
        }

        // First call to /internal/me returns 401 (expired token)
        // After refresh, subsequent calls return 200
        if (request.url().includes("/internal/me")) {
          internalMeCalls++;
          if (internalMeCalls === 1) {
            void mockRequest(request, "/internal/me", 401, { error: "Unauthorized" });
          } else {
            void mockValidInternalMeApiCall(request);
          }
          return;
        }

        // Stub /auth/refresh with successful token refresh, or continue with other requests
        void (
          mockRequest(request, "/auth/refresh", 200, { access_token: "new-access-token-after-refresh" }) ||
          request.continue()
        );
      });

      await visitDashboard();
      await assertDashboardPage();
    });
  });

  describe("Visiting /", () => {
    it("should render with no cookie", async () => {
      await setup("absent");
      await visitLandingPath();
      await assertLandingPage();
    });

    it("should render with invalid cookie", async () => {
      await setup("invalid");

      await page.setRequestInterception(true);
      page.on("request", (request) => {
        void (
          handleOptionsRequest(request) ||
          mockRequest(request, "/internal/me", 401, { error: "Unauthorized" }) ||
          mockRequest(request, "/auth/refresh", 401, { error: "Invalid refresh token" }) ||
          request.continue()
        );
      });

      await visitLandingPath();
      await awaitRedirectToDashboard();
      await awaitRedirectToLandingPage();
      await assertLandingPage();
    });

    it("should redirect to /dashboard with valid expired token", async () => {
      await setup("valid");

      // Track /internal/me calls to simulate expired then refreshed token
      let internalMeCalls = 0;

      await page.setRequestInterception(true);
      page.on("request", (request) => {
        if (handleOptionsRequest(request)) {
          return;
        }

        // First call to /internal/me returns 401 (expired token)
        // After refresh, subsequent calls return 200
        if (request.url().includes("/internal/me")) {
          internalMeCalls++;
          if (internalMeCalls === 1) {
            void mockRequest(request, "/internal/me", 401, { error: "Unauthorized" });
          } else {
            void mockValidInternalMeApiCall(request);
          }
          return;
        }

        // Stub /auth/refresh with successful token refresh, or continue with other requests
        void (
          mockRequest(request, "/auth/refresh", 200, { access_token: "new-access-token-after-refresh" }) ||
          request.continue()
        );
      });

      await visitLandingPath();
      await awaitRedirectToDashboard();
      await assertDashboardPage();
    });

    it("should render with invalid cookie", async () => {
      await setup("invalid");

      await page.setRequestInterception(true);
      page.on("request", (request) => {
        void (
          handleOptionsRequest(request) ||
          mockRequest(request, "/internal/me", 401, { error: "Unauthorized" }) ||
          mockRequest(request, "/auth/refresh", 401, { error: "Invalid refresh token" }) ||
          request.continue()
        );
      });

      await visitLandingPath();
      await awaitRedirectToDashboard();
      await awaitRedirectToLandingPage();
      await assertLandingPage();
    });

    it("should redirect to /dashboard with valid cookie", async () => {
      await setup("valid");

      // Mock successful auth check
      await page.setRequestInterception(true);
      page.on("request", (request) => {
        void (handleOptionsRequest(request) || mockValidInternalMeApiCall(request) || request.continue());
      });

      await visitLandingPath();
      await awaitRedirectToDashboard();
      await assertDashboardPage();
    });
  });

  describe("Visiting /blog", () => {
    it("should render with no cookie", async () => {
      await setup("absent");
      await visitBlogPage();
      await assertBlogPage();
      await assertSignUpButton();
    });

    it("should render with invalid cookie", async () => {
      await setup("absent");
      await visitBlogPage();
      await assertBlogPage();
      await assertSignUpButton();
    });

    it("should render with invalid cookie", async () => {
      await setup("invalid");

      await page.setRequestInterception(true);
      page.on("request", (request) => {
        void (
          handleOptionsRequest(request) ||
          mockRequest(request, "/internal/me", 401, { error: "Unauthorized" }) ||
          mockRequest(request, "/auth/refresh", 401, { error: "Invalid refresh token" }) ||
          request.continue()
        );
      });

      await visitBlogPage();
      await assertBlogPage();
      await assertSignUpButton();
    });

    it("should render with valid expired token", async () => {
      await setup("valid");

      // Track /internal/me calls to simulate expired then refreshed token
      let internalMeCalls = 0;

      await page.setRequestInterception(true);
      page.on("request", (request) => {
        if (handleOptionsRequest(request)) {
          return;
        }

        // First call to /internal/me returns 401 (expired token)
        // After refresh, subsequent calls return 200
        if (request.url().includes("/internal/me")) {
          internalMeCalls++;
          if (internalMeCalls === 1) {
            void mockRequest(request, "/internal/me", 401, { error: "Unauthorized" });
          } else {
            void mockValidInternalMeApiCall(request);
          }
          return;
        }

        // Stub /auth/refresh with successful token refresh, or continue with other requests
        void (
          mockRequest(request, "/auth/refresh", 200, { access_token: "new-access-token-after-refresh" }) ||
          request.continue()
        );
      });

      await visitBlogPage();
      await assertBlogPage();
      await assertReturnToJikiButton();
    });

    it("should render with valid cookie", async () => {
      await setup("valid");

      // Mock successful auth check
      await page.setRequestInterception(true);
      page.on("request", (request) => {
        void (handleOptionsRequest(request) || mockValidInternalMeApiCall(request) || request.continue());
      });

      await visitBlogPage();
      await assertBlogPage();
      await assertReturnToJikiButton();
    });
  });
});
