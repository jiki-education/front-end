import { localePath, makeRoutes } from "@/lib/i18n/routes";

describe("localePath", () => {
  describe("default locale (naked)", () => {
    it("leaves localizable paths naked", () => {
      expect(localePath("/blog", "en")).toBe("/blog");
      expect(localePath("/auth/login", "en")).toBe("/auth/login");
      expect(localePath("/", "en")).toBe("/");
    });

    it("normalizes an unsupported locale to the default", () => {
      expect(localePath("/blog", "de")).toBe("/blog");
    });
  });

  describe("non-default locale (prefixed for localizable bases)", () => {
    it("prefixes localizable sections and pages", () => {
      expect(localePath("/blog", "hu")).toBe("/hu/blog");
      expect(localePath("/blog/my-post", "hu")).toBe("/hu/blog/my-post");
      expect(localePath("/auth/login", "hu")).toBe("/hu/auth/login");
      expect(localePath("/premium", "hu")).toBe("/hu/premium");
    });

    it("prefixes the home path", () => {
      expect(localePath("/", "hu")).toBe("/hu");
    });
  });

  describe("non-localizable app routes stay naked in every locale", () => {
    it("does not prefix auth-gated routes even for a non-default locale", () => {
      expect(localePath("/dashboard", "hu")).toBe("/dashboard");
      expect(localePath("/settings", "hu")).toBe("/settings");
    });
  });

  describe("idempotency", () => {
    it("does not double-prefix an already localized path", () => {
      expect(localePath("/hu/blog", "hu")).toBe("/hu/blog");
    });

    it("re-targets a path already carrying a different locale", () => {
      expect(localePath("/hu/blog", "en")).toBe("/blog");
    });
  });

  describe("query and hash preservation", () => {
    it("keeps the query string", () => {
      expect(localePath("/auth/resend-confirmation?email=a%40b.com", "hu")).toBe(
        "/hu/auth/resend-confirmation?email=a%40b.com"
      );
      expect(localePath("/auth/signup?returnTo=/dashboard", "en")).toBe("/auth/signup?returnTo=/dashboard");
    });

    it("keeps the hash", () => {
      expect(localePath("/premium#pricing", "hu")).toBe("/hu/premium#pricing");
    });
  });
});

describe("makeRoutes", () => {
  it("builds naked helpers for the default locale", () => {
    const routes = makeRoutes("en");
    expect(routes.authLogin()).toBe("/auth/login");
    expect(routes.blogPost("hello")).toBe("/blog/hello");
    expect(routes.home()).toBe("/");
    expect(routes.dashboard()).toBe("/dashboard");
  });

  it("builds prefixed helpers for a non-default locale", () => {
    const routes = makeRoutes("hu");
    expect(routes.authLogin()).toBe("/hu/auth/login");
    expect(routes.blogPost("hello")).toBe("/hu/blog/hello");
    expect(routes.article("intro")).toBe("/hu/help/intro");
    expect(routes.home()).toBe("/hu");
    // App route has no [locale] tree -> naked even in a non-default locale.
    expect(routes.dashboard()).toBe("/dashboard");
  });
});
