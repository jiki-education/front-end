/**
 * Unit tests for auth storage utilities - focus on secure refresh token handling
 */

import {
  setToken,
  getToken,
  removeToken,
  hasValidToken,
  isTokenExpired,
  parseJwtPayload,
  getTokenExpiry,
  setRefreshToken,
  getRefreshToken,
  removeRefreshToken
} from "@/lib/auth/storage";

// Mock the cookie storage module
jest.mock("@/lib/auth/cookie-storage", () => ({
  setRefreshTokenCookie: jest.fn(),
  getRefreshTokenCookie: jest.fn(),
  removeRefreshTokenCookie: jest.fn()
}));

// Mock sessionStorage for access token tests
const mockSessionStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn()
};

Object.defineProperty(window, "sessionStorage", {
  value: mockSessionStorage,
  writable: true
});

// Get references to mocked functions
import * as cookieStorageModule from "@/lib/auth/cookie-storage";
const mockCookieStorage = jest.mocked(cookieStorageModule);

describe("Auth Storage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSessionStorage.getItem.mockReturnValue(null);
  });

  describe("Access Token Management (sessionStorage)", () => {
    it("should store access token in sessionStorage", () => {
      const testToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2OTk5OTk5OTl9.test";
      const expiry = Date.now() + 3600000; // 1 hour from now

      setToken(testToken, expiry);

      expect(mockSessionStorage.setItem).toHaveBeenCalledWith("jiki_auth_token", testToken);
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith("jiki_auth_expiry", expiry.toString());
    });

    it("should retrieve access token from sessionStorage", () => {
      const testToken = "test_access_token";
      mockSessionStorage.getItem.mockImplementation((key) => {
        if (key === "jiki_auth_token") {
          return testToken;
        }
        if (key === "jiki_auth_expiry") {
          return (Date.now() + 3600000).toString();
        }
        return null;
      });

      const result = getToken();

      expect(result).toBe(testToken);
      expect(mockSessionStorage.getItem).toHaveBeenCalledWith("jiki_auth_token");
    });

    it("should return null for expired access token", () => {
      const testToken = "expired_token";
      mockSessionStorage.getItem.mockImplementation((key) => {
        if (key === "jiki_auth_token") {
          return testToken;
        }
        if (key === "jiki_auth_expiry") {
          return (Date.now() - 1000).toString(); // Expired
        }
        return null;
      });

      const result = getToken();

      expect(result).toBeNull();
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("jiki_auth_token");
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("jiki_auth_expiry");
    });
  });

  describe("Refresh Token Management (Secure Cookies)", () => {
    it("should delegate refresh token storage to secure cookies", () => {
      const testToken = "secure_refresh_token_123";

      setRefreshToken(testToken);

      expect(mockCookieStorage.setRefreshTokenCookie).toHaveBeenCalledWith(testToken);
    });

    it("should delegate refresh token retrieval to secure cookies", () => {
      const expectedToken = "retrieved_refresh_token";
      mockCookieStorage.getRefreshTokenCookie.mockReturnValue(expectedToken);

      const result = getRefreshToken();

      expect(result).toBe(expectedToken);
      expect(mockCookieStorage.getRefreshTokenCookie).toHaveBeenCalled();
    });

    it("should delegate refresh token removal to secure cookies", () => {
      removeRefreshToken();

      expect(mockCookieStorage.removeRefreshTokenCookie).toHaveBeenCalled();
    });

    it("should handle null refresh token from cookies", () => {
      mockCookieStorage.getRefreshTokenCookie.mockReturnValue(null);

      const result = getRefreshToken();

      expect(result).toBeNull();
    });
  });

  describe("Combined Token Management", () => {
    it("should remove both access and refresh tokens", () => {
      removeToken();

      // Verify access token removal (sessionStorage)
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("jiki_auth_token");
      expect(mockSessionStorage.removeItem).toHaveBeenCalledWith("jiki_auth_expiry");

      // Verify refresh token removal (secure cookies)
      expect(mockCookieStorage.removeRefreshTokenCookie).toHaveBeenCalled();
    });

    it("should handle token validation with both storage types", () => {
      const validToken = createValidJWT();
      const futureExpiry = Date.now() + 3600000;

      mockSessionStorage.getItem.mockImplementation((key) => {
        if (key === "jiki_auth_token") {
          return validToken;
        }
        if (key === "jiki_auth_expiry") {
          return futureExpiry.toString();
        }
        return null;
      });

      const result = hasValidToken();

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
    it("should handle missing window object for access tokens", () => {
      const originalWindow = global.window;

      // @ts-ignore
      delete global.window;

      expect(() => {
        setToken("test_token");
        getToken();
        removeToken();
        hasValidToken();
        isTokenExpired();
      }).not.toThrow();

      // Restore window
      global.window = originalWindow;
    });

    // Note: SSR compatibility for refresh tokens is handled by cookie storage module
    // Access token SSR behavior is covered by the 'should handle missing window object for access tokens' test above
  });

  describe("Error Handling", () => {
    it("should handle sessionStorage errors gracefully", () => {
      mockSessionStorage.setItem.mockImplementation(() => {
        throw new Error("Storage quota exceeded");
      });

      // Should not throw
      expect(() => {
        setToken("test_token");
      }).not.toThrow();
    });

    it("should handle cookie storage errors by letting them bubble up", () => {
      mockCookieStorage.setRefreshTokenCookie.mockImplementation(() => {
        throw new Error("Cookie error");
      });

      // Our storage functions don't catch cookie storage errors - they bubble up
      // This is actually the correct behavior since cookie storage handles its own errors internally
      expect(() => {
        setRefreshToken("test_token");
      }).toThrow("Cookie error");
    });
  });
});

// Helper functions for creating test JWTs
function createValidJWT(): string {
  const futureExp = Math.floor((Date.now() + 3600000) / 1000);
  return createJWTWithPayload({ exp: futureExp });
}

function createJWTWithPayload(payload: any): string {
  const header = { typ: "JWT", alg: "HS256" };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = "test_signature";

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}
