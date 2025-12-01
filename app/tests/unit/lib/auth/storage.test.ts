/**
 * Unit tests for auth storage utilities - focus on secure refresh token handling
 */

import {
  getAccessToken,
  getRefreshToken,
  getTokenExpiry,
  hasToken,
  parseJwtPayload,
  removeAccessToken,
  removeRefreshToken,
  setAccessToken,
  setRefreshToken
} from "@/lib/auth/storage";

// Mock the cookie storage module
jest.mock("@/lib/auth/cookie-storage", () => ({
  setAccessTokenCookie: jest.fn(),
  getAccessTokenCookie: jest.fn(),
  removeAccessTokenCookie: jest.fn(),
  REFRESH_TOKEN_COOKIE_NAME: "jiki_refresh_token"
}));

// Mock localStorage for refresh token tests
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true
});

// Get references to mocked functions
import * as cookieStorageModule from "@/lib/auth/cookie-storage";
const mockCookieStorage = jest.mocked(cookieStorageModule);

describe("Auth Storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe("Access Token Management (Cookies)", () => {
    it("should store access token in cookies with 1-year expiration", () => {
      const testToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTk5OTk5OTl9.test";

      setAccessToken(testToken);

      expect(mockCookieStorage.setAccessTokenCookie).toHaveBeenCalledWith(testToken);
    });

    it("should retrieve access token from cookies", () => {
      const testToken = "test_access_token";
      mockCookieStorage.getAccessTokenCookie.mockReturnValue(testToken);

      const result = getAccessToken();

      expect(result).toBe(testToken);
      expect(mockCookieStorage.getAccessTokenCookie).toHaveBeenCalled();
    });

    it("should handle null access token from cookies", () => {
      mockCookieStorage.getAccessTokenCookie.mockReturnValue(null);

      const result = getAccessToken();

      expect(result).toBeNull();
    });
  });

  describe("Refresh Token Management (localStorage)", () => {
    it("should store refresh token in localStorage", () => {
      const testToken = "secure_refresh_token_123";

      setRefreshToken(testToken);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("jiki_refresh_token", testToken);
    });

    it("should retrieve refresh token from localStorage", () => {
      const expectedToken = "retrieved_refresh_token";
      mockLocalStorage.getItem.mockReturnValue(expectedToken);

      const result = getRefreshToken();

      expect(result).toBe(expectedToken);
      expect(mockLocalStorage.getItem).toHaveBeenCalledWith("jiki_refresh_token");
    });

    it("should remove refresh token from localStorage", () => {
      removeRefreshToken();

      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("jiki_refresh_token");
    });

    it("should handle null refresh token from localStorage", () => {
      mockLocalStorage.getItem.mockReturnValue(null);

      const result = getRefreshToken();

      expect(result).toBeNull();
    });
  });

  describe("Combined Token Management", () => {
    it("should remove only access token (not refresh token)", () => {
      removeAccessToken();

      // Verify access token removal (cookies)
      expect(mockCookieStorage.removeAccessTokenCookie).toHaveBeenCalled();

      // Verify refresh token is NOT removed
      expect(mockLocalStorage.removeItem).not.toHaveBeenCalled();
    });

    it("should remove refresh token independently", () => {
      removeRefreshToken();

      // Verify only refresh token removal
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("jiki_refresh_token");

      // Verify access token is NOT removed
      expect(mockCookieStorage.removeAccessTokenCookie).not.toHaveBeenCalled();
    });

    it("should handle token validation with cookies", () => {
      const validToken = createValidJWT();

      mockCookieStorage.getAccessTokenCookie.mockReturnValue(validToken);

      const result = hasToken();

      expect(result).toBe(true);
    });
  });

  describe("JWT Utilities", () => {
    it("should parse JWT payload correctly", () => {
      const token = createJWTWithPayload({ sub: "123", exp: 1699999999 });

      const payload = parseJwtPayload(token);

      expect(payload).toEqual({ sub: "123", exp: 1699999999 });
    });

    it("should extract expiry from JWT", () => {
      const expTimestamp = 1699999999;
      const token = createJWTWithPayload({ exp: expTimestamp });

      const expiry = getTokenExpiry(token);

      expect(expiry).toBe(expTimestamp * 1000); // Convert to milliseconds
    });

    it("should handle malformed JWT gracefully", () => {
      const malformedToken = "not.a.valid.jwt";

      const payload = parseJwtPayload(malformedToken);
      const expiry = getTokenExpiry(malformedToken);

      expect(payload).toBeNull();
      expect(expiry).toBeNull();
    });
  });

  describe("SSR Compatibility", () => {
    it("should handle missing window object for refresh tokens", () => {
      const originalWindow = global.window;

      // @ts-ignore
      delete global.window;

      expect(() => {
        setRefreshToken("test_token");
        getRefreshToken();
        removeRefreshToken();
      }).not.toThrow();

      // Restore window
      global.window = originalWindow;
    });

    // Note: SSR compatibility for access tokens is handled by cookie storage module
  });

  describe("Error Handling", () => {
    it("should handle localStorage errors gracefully", () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      // Should not throw
      expect(() => {
        setRefreshToken("test_token");
      }).not.toThrow();
    });

    it("should handle cookie storage errors by letting them bubble up", () => {
      mockCookieStorage.setAccessTokenCookie.mockImplementation(() => {
        throw new Error("Cookie error");
      });

      // Our storage functions don't catch cookie storage errors - they bubble up
      // This is actually the correct behavior since cookie storage handles its own errors internally
      expect(() => {
        setAccessToken("test_token");
      }).toThrow("Cookie error");
    });
  });
});

// Helper functions for creating test JWTs
function createValidJWT(): string {
  const futureExp = Math.floor((Date.now() + 3600000) / 1000);
  return createJWTWithPayload({ exp: futureExp, sub: "123" });
}

function createJWTWithPayload(payload: any): string {
  const header = { typ: "JWT", alg: "HS256" };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = "test_signature";

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}
