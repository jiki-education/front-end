/**
 * Unit tests for Server Actions in lib/auth/actions.ts
 * Tests all authentication Server Actions with httpOnly cookie management
 */

// Unmock the actions module so we can test the actual implementation
jest.unmock("@/lib/auth/actions");

import {
  loginAction,
  signupAction,
  googleLoginAction,
  refreshTokenAction,
  logoutAction,
  logoutFromAllDevicesAction
} from "@/lib/auth/actions";
import type { User } from "@/types/auth";

// Mock Next.js modules
jest.mock("next/headers", () => ({
  cookies: jest.fn()
}));

jest.mock("next/cache", () => ({
  revalidatePath: jest.fn()
}));

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const mockCookies = cookies as jest.MockedFunction<typeof cookies>;
const mockRevalidatePath = revalidatePath as jest.MockedFunction<typeof revalidatePath>;

// Mock fetch
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.MockedFunction<typeof fetch>;

// Mock cookie store
function createMockCookieStore() {
  return {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn()
  };
}

// Test user data
const mockUser: User = {
  handle: "testuser",
  email: "test@example.com",
  name: "Test User",
  membership_type: "standard",
  subscription_status: "never_subscribed",
  subscription: null,
  provider: "email",
  email_confirmed: true
};

// Helper to create mock fetch response
function createMockResponse(data: any, ok: boolean = true, authHeader?: string) {
  return {
    ok,
    status: ok ? 200 : 400,
    statusText: ok ? "OK" : "Bad Request",
    headers: {
      get: (name: string) => {
        if (name === "Authorization" && authHeader) {
          return authHeader;
        }
        return null;
      }
    },
    json: () => Promise.resolve(data)
  };
}

describe("Server Actions - Authentication", () => {
  let mockCookieStore: ReturnType<typeof createMockCookieStore>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockCookieStore = createMockCookieStore();
    mockCookies.mockResolvedValue(mockCookieStore as any);
    process.env.NEXT_PUBLIC_API_URL = "https://api.test.com";
  });

  describe("loginAction", () => {
    const credentials = { email: "test@example.com", password: "password123" };

    it("should successfully login and set cookies", async () => {
      const mockResponse = createMockResponse(
        { user: mockUser, refresh_token: "refresh-token-456" },
        true,
        "Bearer access-token-123"
      );
      mockFetch.mockResolvedValueOnce(mockResponse as any);

      const result = await loginAction(credentials);

      expect(result).toEqual({ success: true, user: mockUser });
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.test.com/auth/login",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user: credentials })
        })
      );
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        "jiki_access_token",
        "access-token-123",
        expect.objectContaining({
          httpOnly: true,
          sameSite: "strict",
          path: "/"
        })
      );
      expect(mockCookieStore.set).toHaveBeenCalledWith(
        "jiki_refresh_token",
        "refresh-token-456",
        expect.objectContaining({
          httpOnly: true,
          sameSite: "strict"
        })
      );
      expect(mockRevalidatePath).toHaveBeenCalledWith("/", "layout");
    });

    it("should handle login failure", async () => {
      const mockResponse = createMockResponse({ error: { message: "Invalid credentials" } }, false);
      mockFetch.mockResolvedValueOnce(mockResponse as any);

      const result = await loginAction(credentials);

      expect(result).toEqual({ success: false, error: "Invalid credentials" });
      expect(mockCookieStore.set).not.toHaveBeenCalled();
      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should handle missing access token", async () => {
      const mockResponse = createMockResponse({ user: mockUser, refresh_token: "refresh-token-456" }, true);
      mockFetch.mockResolvedValueOnce(mockResponse as any);

      const result = await loginAction(credentials);

      expect(result).toEqual({ success: false, error: "Invalid response from server" });
      expect(mockCookieStore.set).not.toHaveBeenCalled();
    });

    it("should handle missing refresh token", async () => {
      const mockResponse = createMockResponse({ user: mockUser }, true, "Bearer access-token-123");
      mockFetch.mockResolvedValueOnce(mockResponse as any);

      const result = await loginAction(credentials);

      expect(result).toEqual({ success: false, error: "Invalid response from server" });
      expect(mockCookieStore.set).not.toHaveBeenCalled();
    });

    it("should handle network error", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network failure"));

      const result = await loginAction(credentials);

      expect(result).toEqual({ success: false, error: "Network error" });
      expect(mockCookieStore.set).not.toHaveBeenCalled();
    });

    it("should use default error message when API doesn't provide one", async () => {
      const mockResponse = createMockResponse({}, false);
      mockFetch.mockResolvedValueOnce(mockResponse as any);

      const result = await loginAction(credentials);

      expect(result).toEqual({ success: false, error: "Login failed" });
    });
  });

  describe("signupAction", () => {
    const userData = {
      email: "new@example.com",
      password: "password123",
      password_confirmation: "password123",
      handle: "newuser"
    };

    it("should successfully signup and set cookies", async () => {
      const mockResponse = createMockResponse(
        { user: mockUser, refresh_token: "refresh-token-456" },
        true,
        "Bearer access-token-123"
      );
      mockFetch.mockResolvedValueOnce(mockResponse as any);

      const result = await signupAction(userData);

      expect(result).toEqual({ success: true, user: mockUser });
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.test.com/auth/signup",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ user: userData })
        })
      );
      expect(mockCookieStore.set).toHaveBeenCalledTimes(2);
      expect(mockRevalidatePath).toHaveBeenCalledWith("/", "layout");
    });

    it("should handle signup failure", async () => {
      const mockResponse = createMockResponse({ error: { message: "Email already exists" } }, false);
      mockFetch.mockResolvedValueOnce(mockResponse as any);

      const result = await signupAction(userData);

      expect(result).toEqual({ success: false, error: "Email already exists" });
      expect(mockCookieStore.set).not.toHaveBeenCalled();
    });

    it("should handle network error during signup", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Connection timeout"));

      const result = await signupAction(userData);

      expect(result).toEqual({ success: false, error: "Network error" });
    });
  });

  describe("googleLoginAction", () => {
    const authCode = "google-auth-code-123";

    it("should successfully authenticate with Google", async () => {
      const mockResponse = createMockResponse(
        { user: mockUser, refresh_token: "refresh-token-456" },
        true,
        "Bearer access-token-123"
      );
      mockFetch.mockResolvedValueOnce(mockResponse as any);

      const result = await googleLoginAction(authCode);

      expect(result).toEqual({ success: true, user: mockUser });
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.test.com/auth/google",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ code: authCode })
        })
      );
      expect(mockCookieStore.set).toHaveBeenCalledTimes(2);
      expect(mockRevalidatePath).toHaveBeenCalledWith("/", "layout");
    });

    it("should handle Google OAuth failure", async () => {
      const mockResponse = createMockResponse({ error: { message: "Invalid authorization code" } }, false);
      mockFetch.mockResolvedValueOnce(mockResponse as any);

      const result = await googleLoginAction(authCode);

      expect(result).toEqual({ success: false, error: "Invalid authorization code" });
      expect(mockCookieStore.set).not.toHaveBeenCalled();
    });

    it("should handle missing tokens in Google response", async () => {
      const mockResponse = createMockResponse({ user: mockUser }, true);
      mockFetch.mockResolvedValueOnce(mockResponse as any);

      const result = await googleLoginAction(authCode);

      expect(result).toEqual({ success: false, error: "Invalid response from server" });
    });
  });

  describe("refreshTokenAction", () => {
    it("should successfully refresh access token", async () => {
      mockCookieStore.get.mockReturnValueOnce({ value: "existing-refresh-token" } as any);

      const mockResponse = createMockResponse({ user: mockUser }, true, "Bearer new-access-token");
      mockFetch.mockResolvedValueOnce(mockResponse as any);

      const result = await refreshTokenAction();

      expect(result).toEqual({ success: true, user: mockUser });
      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.test.com/auth/refresh",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ refresh_token: "existing-refresh-token" })
        })
      );
      expect(mockCookieStore.set).toHaveBeenCalledWith("jiki_access_token", "new-access-token", expect.any(Object));
      expect(mockRevalidatePath).toHaveBeenCalledWith("/", "layout");
    });

    it("should return error when no refresh token exists", async () => {
      mockCookieStore.get.mockReturnValueOnce(undefined);

      const result = await refreshTokenAction();

      expect(result).toEqual({ success: false, error: "No refresh token" });
      expect(mockFetch).not.toHaveBeenCalled();
    });

    it("should clear cookies when refresh fails", async () => {
      mockCookieStore.get.mockReturnValueOnce({ value: "expired-refresh-token" } as any);

      const mockResponse = createMockResponse({ error: { message: "Refresh token expired" } }, false);
      mockFetch.mockResolvedValueOnce(mockResponse as any);

      const result = await refreshTokenAction();

      expect(result).toEqual({ success: false, error: "Refresh failed" });
      expect(mockCookieStore.delete).toHaveBeenCalledTimes(2);
      expect(mockCookieStore.delete).toHaveBeenCalledWith(expect.objectContaining({ name: "jiki_access_token" }));
      expect(mockCookieStore.delete).toHaveBeenCalledWith(expect.objectContaining({ name: "jiki_refresh_token" }));
      expect(mockRevalidatePath).toHaveBeenCalledWith("/", "layout");
    });

    it("should handle missing access token in refresh response", async () => {
      mockCookieStore.get.mockReturnValueOnce({ value: "refresh-token" } as any);

      const mockResponse = createMockResponse({ user: mockUser }, true);
      mockFetch.mockResolvedValueOnce(mockResponse as any);

      const result = await refreshTokenAction();

      expect(result).toEqual({ success: false, error: "Invalid refresh response" });
    });

    it("should handle network error during refresh", async () => {
      mockCookieStore.get.mockReturnValueOnce({ value: "refresh-token" } as any);
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await refreshTokenAction();

      expect(result).toEqual({ success: false, error: "Network error" });
    });
  });

  describe("logoutAction", () => {
    it("should call logout endpoint and clear cookies", async () => {
      mockCookieStore.get.mockReturnValueOnce({ value: "access-token-123" } as any);
      mockFetch.mockResolvedValueOnce({ ok: true } as any);

      await logoutAction();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.test.com/auth/logout",
        expect.objectContaining({
          method: "DELETE",
          headers: expect.objectContaining({
            Authorization: "Bearer access-token-123"
          })
        })
      );
      expect(mockCookieStore.delete).toHaveBeenCalledTimes(2);
      expect(mockRevalidatePath).toHaveBeenCalledWith("/", "layout");
    });

    it("should clear cookies even if logout API fails", async () => {
      mockCookieStore.get.mockReturnValueOnce({ value: "access-token-123" } as any);
      mockFetch.mockRejectedValueOnce(new Error("API error"));

      await logoutAction();

      expect(mockCookieStore.delete).toHaveBeenCalledTimes(2);
      expect(mockRevalidatePath).toHaveBeenCalledWith("/", "layout");
    });

    it("should clear cookies when no access token exists", async () => {
      mockCookieStore.get.mockReturnValueOnce(undefined);

      await logoutAction();

      expect(mockFetch).not.toHaveBeenCalled();
      expect(mockCookieStore.delete).toHaveBeenCalledTimes(2);
    });
  });

  describe("logoutFromAllDevicesAction", () => {
    it("should call logout/all endpoint and clear cookies", async () => {
      mockCookieStore.get.mockReturnValueOnce({ value: "access-token-123" } as any);
      mockFetch.mockResolvedValueOnce({ ok: true } as any);

      await logoutFromAllDevicesAction();

      expect(mockFetch).toHaveBeenCalledWith(
        "https://api.test.com/auth/logout/all",
        expect.objectContaining({
          method: "DELETE",
          headers: expect.objectContaining({
            Authorization: "Bearer access-token-123"
          })
        })
      );
      expect(mockCookieStore.delete).toHaveBeenCalledTimes(2);
      expect(mockRevalidatePath).toHaveBeenCalledWith("/", "layout");
    });

    it("should clear cookies even if logout/all API fails", async () => {
      mockCookieStore.get.mockReturnValueOnce({ value: "access-token-123" } as any);
      mockFetch.mockRejectedValueOnce(new Error("API error"));

      await logoutFromAllDevicesAction();

      expect(mockCookieStore.delete).toHaveBeenCalledTimes(2);
      expect(mockRevalidatePath).toHaveBeenCalledWith("/", "layout");
    });
  });

  describe("Cookie Configuration", () => {
    it("should set cookies with local domain and httpOnly in test environment", async () => {
      const credentials = { email: "test@example.com", password: "password123" };
      const mockResponse = createMockResponse(
        { user: mockUser, refresh_token: "refresh-token-456" },
        true,
        "Bearer access-token-123"
      );
      mockFetch.mockResolvedValueOnce(mockResponse as any);

      await loginAction(credentials);

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        "jiki_access_token",
        expect.any(String),
        expect.objectContaining({
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          domain: ".local.jiki.io",
          path: "/"
        })
      );
    });

    it("should set access token with 1-year maxAge", async () => {
      const credentials = { email: "test@example.com", password: "password123" };
      const mockResponse = createMockResponse(
        { user: mockUser, refresh_token: "refresh-token-456" },
        true,
        "Bearer access-token-123"
      );
      mockFetch.mockResolvedValueOnce(mockResponse as any);

      await loginAction(credentials);

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        "jiki_access_token",
        expect.any(String),
        expect.objectContaining({
          maxAge: 365 * 24 * 60 * 60 // 1 year in seconds
        })
      );
    });

    it("should set refresh token with 5-year maxAge", async () => {
      const credentials = { email: "test@example.com", password: "password123" };
      const mockResponse = createMockResponse(
        { user: mockUser, refresh_token: "refresh-token-456" },
        true,
        "Bearer access-token-123"
      );
      mockFetch.mockResolvedValueOnce(mockResponse as any);

      await loginAction(credentials);

      expect(mockCookieStore.set).toHaveBeenCalledWith(
        "jiki_refresh_token",
        expect.any(String),
        expect.objectContaining({
          maxAge: 5 * 365 * 24 * 60 * 60 // 5 years in seconds
        })
      );
    });
  });

  describe("Cache Revalidation", () => {
    it("should revalidate cache after successful login", async () => {
      const credentials = { email: "test@example.com", password: "password123" };
      const mockResponse = createMockResponse(
        { user: mockUser, refresh_token: "refresh-token-456" },
        true,
        "Bearer access-token-123"
      );
      mockFetch.mockResolvedValueOnce(mockResponse as any);

      await loginAction(credentials);

      expect(mockRevalidatePath).toHaveBeenCalledWith("/", "layout");
      expect(mockRevalidatePath).toHaveBeenCalledTimes(1);
    });

    it("should not revalidate cache on failed login", async () => {
      const credentials = { email: "test@example.com", password: "wrong" };
      const mockResponse = createMockResponse({ error: { message: "Invalid" } }, false);
      mockFetch.mockResolvedValueOnce(mockResponse as any);

      await loginAction(credentials);

      expect(mockRevalidatePath).not.toHaveBeenCalled();
    });

    it("should revalidate cache after logout", async () => {
      mockCookieStore.get.mockReturnValueOnce(undefined);

      await logoutAction();

      expect(mockRevalidatePath).toHaveBeenCalledWith("/", "layout");
    });
  });
});
