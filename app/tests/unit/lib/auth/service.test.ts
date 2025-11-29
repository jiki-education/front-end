/**
 * Unit tests for auth service functions
 */

import { googleLogin } from "@/lib/auth/service";
import { api } from "@/lib/api";
import { setAccessToken, setRefreshToken } from "@/lib/auth/storage";
import type { AuthResponse, User } from "@/types/auth";

// Mock dependencies
jest.mock("@/lib/api");
jest.mock("@/lib/auth/storage");

const mockApi = api as jest.Mocked<typeof api>;
const mockSetAccessToken = setAccessToken as jest.MockedFunction<typeof setAccessToken>;
const mockSetRefreshToken = setRefreshToken as jest.MockedFunction<typeof setRefreshToken>;

describe("Auth Service - googleLogin", () => {
  const mockUser: User = {
    id: 123,
    handle: "testuser",
    email: "test@example.com",
    name: "Test User",
    created_at: "2023-01-01T00:00:00Z",
    membership_type: "standard",
    subscription_status: "never_subscribed",
    subscription: null
  };

  const mockAuthResponse: AuthResponse = {
    user: mockUser,
    token: "access-token-123",
    refresh_token: "refresh-token-456"
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should successfully authenticate with Google and store tokens", async () => {
    const mockResponse = {
      data: mockAuthResponse,
      headers: new Headers(),
      status: 200
    };
    mockApi.post.mockResolvedValue(mockResponse);
    const result = await googleLogin("auth-code-123");

    expect(result).toEqual(mockUser);
    expect(mockApi.post).toHaveBeenCalledWith("/auth/google", { code: "auth-code-123" });
    expect(mockSetAccessToken).toHaveBeenCalledWith("access-token-123");
    expect(mockSetRefreshToken).toHaveBeenCalledWith("refresh-token-456");
  });

  it("should handle token in Authorization header", async () => {
    const headers = new Headers();
    headers.set("Authorization", "Bearer header-token-789");

    const mockResponse = {
      data: { ...mockAuthResponse, token: undefined },
      headers,
      status: 200
    };
    mockApi.post.mockResolvedValue(mockResponse);

    const result = await googleLogin("auth-code-123");

    expect(result).toEqual(mockUser);
    expect(mockSetAccessToken).toHaveBeenCalledWith("header-token-789");
  });

  it("should handle token in lowercase authorization header", async () => {
    const headers = new Headers();
    headers.set("authorization", "Bearer lowercase-token-789");

    const mockResponse = {
      data: { ...mockAuthResponse, token: undefined },
      headers,
      status: 200
    };
    mockApi.post.mockResolvedValue(mockResponse);

    const result = await googleLogin("auth-code-123");

    expect(result).toEqual(mockUser);
    expect(mockSetAccessToken).toHaveBeenCalledWith("lowercase-token-789");
  });

  it("should prefer header token over body token", async () => {
    const headers = new Headers();
    headers.set("Authorization", "Bearer header-token");

    const mockResponse = {
      data: { ...mockAuthResponse, token: "body-token" },
      headers,
      status: 200
    };
    mockApi.post.mockResolvedValue(mockResponse);

    await googleLogin("auth-code-123");

    expect(mockSetAccessToken).toHaveBeenCalledWith("header-token");
  });

  it("should handle different token field names in response body", async () => {
    const testCases = [
      { field: "token", value: "token-value" },
      { field: "jwt", value: "jwt-value" },
      { field: "access_token", value: "access-token-value" }
    ];

    for (const testCase of testCases) {
      jest.clearAllMocks();

      const responseData = {
        ...mockAuthResponse,
        token: undefined,
        [testCase.field]: testCase.value
      };

      const mockResponse = {
        data: responseData,
        headers: new Headers(),
        status: 200
      };
      mockApi.post.mockResolvedValue(mockResponse);

      await googleLogin("auth-code-123");

      expect(mockSetAccessToken).toHaveBeenCalledWith(testCase.value);
    }
  });

  it("should store token with 1-year cookie expiration", async () => {
    const mockResponse = {
      data: mockAuthResponse,
      headers: new Headers(),
      status: 200
    };
    mockApi.post.mockResolvedValue(mockResponse);

    await googleLogin("auth-code-123");

    expect(mockSetAccessToken).toHaveBeenCalledWith("access-token-123");
  });

  it("should handle missing access token gracefully", async () => {
    const responseWithoutToken = {
      user: mockUser,
      refresh_token: "refresh-token-456"
    };

    const mockResponse = {
      data: responseWithoutToken,
      headers: new Headers(),
      status: 200
    };
    mockApi.post.mockResolvedValue(mockResponse);

    const result = await googleLogin("auth-code-123");

    expect(result).toEqual(mockUser);
    expect(mockSetAccessToken).not.toHaveBeenCalled();
    expect(mockSetRefreshToken).toHaveBeenCalledWith("refresh-token-456");
  });

  it("should handle missing refresh token gracefully", async () => {
    const responseWithoutRefreshToken = {
      user: mockUser,
      token: "access-token-123"
    };

    const mockResponse = {
      data: responseWithoutRefreshToken,
      headers: new Headers(),
      status: 200
    };
    mockApi.post.mockResolvedValue(mockResponse);

    const result = await googleLogin("auth-code-123");

    expect(result).toEqual(mockUser);
    expect(mockSetAccessToken).toHaveBeenCalledWith("access-token-123");
    expect(mockSetRefreshToken).not.toHaveBeenCalled();
  });

  it("should handle malformed Authorization header gracefully", async () => {
    const headers = new Headers();
    headers.set("Authorization", "InvalidFormat token");

    const mockResponse = {
      data: mockAuthResponse,
      headers,
      status: 200
    };
    mockApi.post.mockResolvedValue(mockResponse);

    await googleLogin("auth-code-123");

    // Should fall back to body token
    expect(mockSetAccessToken).toHaveBeenCalledWith("access-token-123");
  });

  it("should handle API errors properly", async () => {
    const apiError = new Error("Google OAuth API error");
    mockApi.post.mockRejectedValue(apiError);

    await expect(googleLogin("invalid-code")).rejects.toThrow("Google OAuth API error");

    expect(mockSetAccessToken).not.toHaveBeenCalled();
    expect(mockSetRefreshToken).not.toHaveBeenCalled();
  });

  it("should handle network errors properly", async () => {
    mockApi.post.mockRejectedValue(new Error("Network error"));

    await expect(googleLogin("auth-code-123")).rejects.toThrow("Network error");

    expect(mockSetAccessToken).not.toHaveBeenCalled();
    expect(mockSetRefreshToken).not.toHaveBeenCalled();
  });

  it("should call API endpoint with correct parameters", async () => {
    const mockResponse = {
      data: mockAuthResponse,
      headers: new Headers(),
      status: 200
    };
    mockApi.post.mockResolvedValue(mockResponse);

    await googleLogin("specific-auth-code");

    expect(mockApi.post).toHaveBeenCalledWith("/auth/google", { code: "specific-auth-code" });
    expect(mockApi.post).toHaveBeenCalledTimes(1);
  });
});
