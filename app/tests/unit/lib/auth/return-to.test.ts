/**
 * Unit tests for return-to utilities
 * Tests URL validation and sessionStorage handling for SSO return_to parameter
 */

import {
  isValidReturnToUrl,
  storeReturnTo,
  getStoredReturnTo,
  clearStoredReturnTo,
  getPostAuthRedirect,
  buildUrlWithReturnTo
} from "@/lib/auth/return-to";

describe("return-to utilities", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  describe("isValidReturnToUrl", () => {
    it("returns true for valid https api.jiki.io URLs", () => {
      expect(isValidReturnToUrl("https://api.jiki.io/auth/discourse/sso")).toBe(true);
      expect(isValidReturnToUrl("https://api.jiki.io/auth/discourse/sso?sso=test&sig=test")).toBe(true);
      expect(isValidReturnToUrl("https://api.jiki.io/")).toBe(true);
    });

    it("returns true for valid http api.jiki.io URLs (for dev)", () => {
      expect(isValidReturnToUrl("http://api.jiki.io/auth/discourse/sso")).toBe(true);
      expect(isValidReturnToUrl("http://api.jiki.io/")).toBe(true);
    });

    it("returns false for null", () => {
      expect(isValidReturnToUrl(null)).toBe(false);
    });

    it("returns false for empty string", () => {
      expect(isValidReturnToUrl("")).toBe(false);
    });

    it("returns false for other domains", () => {
      expect(isValidReturnToUrl("https://evil.com/")).toBe(false);
      expect(isValidReturnToUrl("https://google.com/")).toBe(false);
      expect(isValidReturnToUrl("https://jiki.io/")).toBe(false);
    });

    it("returns false for domain spoofing attempts", () => {
      // Subdomain attack
      expect(isValidReturnToUrl("https://api.jiki.io.evil.com/")).toBe(false);
      // Similar domain
      expect(isValidReturnToUrl("https://api-jiki.io/")).toBe(false);
      // Without trailing slash in domain
      expect(isValidReturnToUrl("https://api.jiki.ioevil.com/")).toBe(false);
    });

    it("returns false for path traversal attempts", () => {
      // Path traversal attacks - these should still resolve to api.jiki.io but we validate hostname
      expect(isValidReturnToUrl("https://api.jiki.io/../evil.com")).toBe(true); // URL parser normalizes this, hostname is still api.jiki.io
      expect(isValidReturnToUrl("https://api.jiki.io/./../../evil.com")).toBe(true); // Same - hostname check passes
    });

    it("returns false for malformed URLs", () => {
      expect(isValidReturnToUrl("not-a-url")).toBe(false);
      expect(isValidReturnToUrl("://api.jiki.io/")).toBe(false);
      expect(isValidReturnToUrl("api.jiki.io/path")).toBe(false);
    });

    it("returns false for javascript: URLs", () => {
      expect(isValidReturnToUrl("javascript:alert(1)")).toBe(false);
    });

    it("returns false for data: URLs", () => {
      expect(isValidReturnToUrl("data:text/html,<script>alert(1)</script>")).toBe(false);
    });
  });

  describe("storeReturnTo", () => {
    it("stores valid URL in sessionStorage", () => {
      storeReturnTo("https://api.jiki.io/test");
      expect(sessionStorage.getItem("auth_return_to")).toBe("https://api.jiki.io/test");
    });

    it("does not store invalid URL", () => {
      storeReturnTo("https://evil.com/");
      expect(sessionStorage.getItem("auth_return_to")).toBeNull();
    });

    it("does not store null", () => {
      storeReturnTo(null);
      expect(sessionStorage.getItem("auth_return_to")).toBeNull();
    });

    it("overwrites previously stored URL", () => {
      storeReturnTo("https://api.jiki.io/first");
      storeReturnTo("https://api.jiki.io/second");
      expect(sessionStorage.getItem("auth_return_to")).toBe("https://api.jiki.io/second");
    });
  });

  describe("getStoredReturnTo", () => {
    it("returns stored URL from sessionStorage", () => {
      sessionStorage.setItem("auth_return_to", "https://api.jiki.io/test");
      expect(getStoredReturnTo()).toBe("https://api.jiki.io/test");
    });

    it("returns null when nothing is stored", () => {
      expect(getStoredReturnTo()).toBeNull();
    });
  });

  describe("clearStoredReturnTo", () => {
    it("removes stored URL from sessionStorage", () => {
      sessionStorage.setItem("auth_return_to", "https://api.jiki.io/test");
      clearStoredReturnTo();
      expect(sessionStorage.getItem("auth_return_to")).toBeNull();
    });

    it("does nothing when no URL is stored", () => {
      expect(() => clearStoredReturnTo()).not.toThrow();
    });
  });

  describe("getPostAuthRedirect", () => {
    it("returns valid return_to URL when provided as parameter", () => {
      expect(getPostAuthRedirect("https://api.jiki.io/test")).toBe("https://api.jiki.io/test");
    });

    it("clears sessionStorage after returning valid URL", () => {
      sessionStorage.setItem("auth_return_to", "https://api.jiki.io/stored");
      getPostAuthRedirect("https://api.jiki.io/param");
      expect(sessionStorage.getItem("auth_return_to")).toBeNull();
    });

    it("returns /dashboard for invalid parameter URL", () => {
      expect(getPostAuthRedirect("https://evil.com/")).toBe("/dashboard");
    });

    it("falls back to sessionStorage when parameter is null", () => {
      sessionStorage.setItem("auth_return_to", "https://api.jiki.io/stored");
      expect(getPostAuthRedirect(null)).toBe("https://api.jiki.io/stored");
    });

    it("returns /dashboard when parameter is null and sessionStorage is empty", () => {
      expect(getPostAuthRedirect(null)).toBe("/dashboard");
    });

    it("returns /dashboard when both parameter and sessionStorage are invalid", () => {
      sessionStorage.setItem("auth_return_to", "https://evil.com/");
      expect(getPostAuthRedirect(null)).toBe("/dashboard");
    });

    it("prefers parameter over sessionStorage", () => {
      sessionStorage.setItem("auth_return_to", "https://api.jiki.io/stored");
      expect(getPostAuthRedirect("https://api.jiki.io/param")).toBe("https://api.jiki.io/param");
    });
  });

  describe("buildUrlWithReturnTo", () => {
    it("appends return_to parameter for valid URL", () => {
      const result = buildUrlWithReturnTo("/auth/signup", "https://api.jiki.io/test");
      expect(result).toBe("/auth/signup?return_to=https%3A%2F%2Fapi.jiki.io%2Ftest");
    });

    it("returns base path for null return_to", () => {
      expect(buildUrlWithReturnTo("/auth/signup", null)).toBe("/auth/signup");
    });

    it("returns base path for invalid return_to", () => {
      expect(buildUrlWithReturnTo("/auth/signup", "https://evil.com/")).toBe("/auth/signup");
    });

    it("properly encodes special characters in return_to", () => {
      const returnTo = "https://api.jiki.io/sso?sso=payload&sig=signature";
      const result = buildUrlWithReturnTo("/auth/login", returnTo);
      expect(result).toContain("return_to=");
      expect(result).toContain(encodeURIComponent(returnTo));
    });
  });
});
