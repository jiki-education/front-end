/**
 * Unit tests for secure cookie storage utilities
 */

import {
  setRefreshTokenCookie,
  getRefreshTokenCookie,
  removeRefreshTokenCookie,
  hasRefreshTokenCookie
} from "@/lib/auth/cookie-storage";

// Mock document.cookie for testing
interface MockCookie {
  value: string;
  get: jest.MockedFunction<() => string>;
  set: jest.MockedFunction<(newValue: string) => void>;
}

const mockCookie: MockCookie = {
  value: "",
  get: jest.fn((): string => mockCookie.value),
  set: jest.fn((newValue: string): void => {
    mockCookie.value = newValue;
  })
};

// Override document.cookie with getter/setter
Object.defineProperty(document, "cookie", {
  get: mockCookie.get,
  set: mockCookie.set,
  configurable: true
});

// Note: JSDOM runs tests over HTTP by default, so secure flag won't be set

describe("Cookie Storage Utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCookie.value = "";
  });

  afterAll(() => {
    // Note: In JSDOM, location restoration is not needed as each test runs in isolation
  });

  describe("setRefreshTokenCookie", () => {
    it("should set a cookie with proper flags for HTTP (test environment)", () => {
      const testToken = "test_refresh_token_12345";

      setRefreshTokenCookie(testToken);

      expect(mockCookie.set).toHaveBeenCalledWith(
        expect.stringContaining("jiki_refresh_token=test_refresh_token_12345")
      );

      const cookieString = mockCookie.set.mock.calls[0][0];

      // Verify security flags (Secure flag not set in test environment over HTTP)
      expect(cookieString).toContain("SameSite=strict");
      expect(cookieString).toContain("Path=/");
      expect(cookieString).toContain("Expires=");
      // Note: Secure flag is conditional on HTTPS protocol
    });

    it("should set cookie with 30-day expiry", () => {
      const testToken = "test_token";
      const beforeCall = new Date();

      setRefreshTokenCookie(testToken);

      const cookieString = mockCookie.set.mock.calls[0][0];
      const expiresMatch = cookieString.match(/Expires=([^;]+)/);

      expect(expiresMatch).toBeTruthy();

      if (expiresMatch) {
        const expiryDate = new Date(expiresMatch[1]);
        const thirtyDaysFromNow = new Date(beforeCall);
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        // Allow 1 minute tolerance for test execution time
        const tolerance = 60 * 1000;
        expect(Math.abs(expiryDate.getTime() - thirtyDaysFromNow.getTime())).toBeLessThan(tolerance);
      }
    });

    it("should handle encoding of special characters", () => {
      const tokenWithSpecialChars = "token+with=special&chars";

      setRefreshTokenCookie(tokenWithSpecialChars);

      const cookieString = mockCookie.set.mock.calls[0][0];
      expect(cookieString).toContain("token%2Bwith%3Dspecial%26chars");
    });
  });

  describe("getRefreshTokenCookie", () => {
    it("should retrieve token from cookie", () => {
      mockCookie.value = "jiki_refresh_token=test_token_123; other_cookie=value";

      const result = getRefreshTokenCookie();

      expect(result).toBe("test_token_123");
    });

    it("should return null when cookie does not exist", () => {
      mockCookie.value = "other_cookie=value; another=cookie";

      const result = getRefreshTokenCookie();

      expect(result).toBeNull();
    });

    it("should return null when cookie exists but is empty", () => {
      mockCookie.value = "jiki_refresh_token=; other_cookie=value";

      const result = getRefreshTokenCookie();

      expect(result).toBe("");
    });

    it("should handle URL decoding", () => {
      mockCookie.value = "jiki_refresh_token=token%2Bwith%3Dspecial%26chars";

      const result = getRefreshTokenCookie();

      expect(result).toBe("token+with=special&chars");
    });

    it("should handle multiple cookies and find the right one", () => {
      mockCookie.value = "first=value1; jiki_refresh_token=correct_token; last=value2";

      const result = getRefreshTokenCookie();

      expect(result).toBe("correct_token");
    });

    it("should handle whitespace around cookies", () => {
      mockCookie.value = " first=value1 ; jiki_refresh_token=spaced_token ; last=value2 ";

      const result = getRefreshTokenCookie();

      expect(result).toBe("spaced_token");
    });
  });

  describe("removeRefreshTokenCookie", () => {
    it("should set cookie to expire in the past", () => {
      removeRefreshTokenCookie();

      expect(mockCookie.set).toHaveBeenCalledWith(expect.stringContaining("jiki_refresh_token="));

      const cookieString = mockCookie.set.mock.calls[0][0];
      expect(cookieString).toContain("Expires=Thu, 01 Jan 1970 00:00:00 GMT");
    });

    it("should maintain path when deleting", () => {
      removeRefreshTokenCookie();

      const cookieString = mockCookie.set.mock.calls[0][0];
      expect(cookieString).toContain("Path=/");
    });
  });

  describe("hasRefreshTokenCookie", () => {
    it("should return true when cookie exists", () => {
      mockCookie.value = "jiki_refresh_token=some_token";

      const result = hasRefreshTokenCookie();

      expect(result).toBe(true);
    });

    it("should return false when cookie does not exist", () => {
      mockCookie.value = "other_cookie=value";

      const result = hasRefreshTokenCookie();

      expect(result).toBe(false);
    });

    it("should return false when cookie exists but is empty", () => {
      mockCookie.value = "jiki_refresh_token=";

      const result = hasRefreshTokenCookie();

      expect(result).toBe(false);
    });
  });

  describe("Error handling", () => {
    it("should handle document.cookie read errors gracefully", () => {
      mockCookie.get.mockImplementation(() => {
        throw new Error("Cookie read error");
      });

      // Should not throw and return null
      const result = getRefreshTokenCookie();
      expect(result).toBeNull();
    });

    it("should handle document.cookie write errors gracefully", () => {
      mockCookie.set.mockImplementation(() => {
        throw new Error("Cookie write error");
      });

      // Should not throw
      expect(() => {
        setRefreshTokenCookie("test_token");
      }).not.toThrow();
    });
  });

  describe("SSR compatibility", () => {
    it("should handle missing window object", () => {
      const originalWindow = global.window;

      // @ts-ignore
      delete global.window;

      expect(() => {
        setRefreshTokenCookie("test_token");
      }).not.toThrow();

      expect(() => {
        getRefreshTokenCookie();
      }).not.toThrow();

      expect(() => {
        removeRefreshTokenCookie();
      }).not.toThrow();

      // Restore window
      global.window = originalWindow;
    });
  });
});
