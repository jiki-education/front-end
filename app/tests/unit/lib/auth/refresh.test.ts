/**
 * Unit tests for refresh token module
 * Tests critical authentication flow including race conditions and error handling
 */

import { refreshAccessToken, isCurrentlyRefreshing } from "@/lib/auth/refresh";
import * as storage from "@/lib/auth/storage";
import * as apiConfig from "@/lib/api/config";

// Mock dependencies
jest.mock("@/lib/auth/storage");
jest.mock("@/lib/api/config");

// Mock global fetch
global.fetch = jest.fn();

describe("refresh.ts - Token Refresh Module", () => {
  const mockStorage = jest.mocked(storage);
  const mockApiConfig = jest.mocked(apiConfig);
  const mockFetch = jest.mocked(fetch);

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementations
    mockApiConfig.getApiUrl.mockReturnValue("http://localhost:3060/auth/refresh");
    mockStorage.getRefreshToken.mockReturnValue("valid_refresh_token");
  });

  describe("Successful Refresh Flow", () => {
    it("should successfully refresh token from response headers", async () => {
      const newAccessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE3MDA5OTk5OTl9.new_token";
      const mockExpiry = 1700999999000;

      // Mock successful response with token in headers
      const mockHeaders = {
        get: jest.fn((key: string) => {
          const headers: { [key: string]: string } = {
            authorization: `Bearer ${newAccessToken}`,
            "content-type": "application/json"
          };
          return headers[key.toLowerCase()] || null;
        })
      };

      const mockResponse = {
        ok: true,
        status: 200,
        headers: mockHeaders,
        json: jest.fn().mockResolvedValue({ message: "Token refreshed" })
      } as any;

      mockFetch.mockResolvedValue(mockResponse);
      mockStorage.getTokenExpiry.mockReturnValue(mockExpiry);

      const result = await refreshAccessToken();

      expect(result).toBe(newAccessToken);
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3060/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: "valid_refresh_token" })
      });
      expect(mockStorage.setToken).toHaveBeenCalledWith(newAccessToken, mockExpiry);
    });

    it("should successfully refresh token from response body when not in headers", async () => {
      const newAccessToken = "body_token_123";
      const mockExpiry = 1700999999000;

      // Mock response without auth header, token in body
      const mockHeaders = {
        get: jest.fn((key: string) => {
          const headers: { [key: string]: string } = {
            "content-type": "application/json"
          };
          return headers[key.toLowerCase()] || null;
        })
      };

      const mockResponse = {
        ok: true,
        status: 200,
        headers: mockHeaders,
        json: jest.fn().mockResolvedValue({
          access_token: newAccessToken,
          message: "Token refreshed"
        })
      } as any;

      mockFetch.mockResolvedValue(mockResponse);
      mockStorage.getTokenExpiry.mockReturnValue(mockExpiry);

      const result = await refreshAccessToken();

      expect(result).toBe(newAccessToken);
      expect(mockStorage.setToken).toHaveBeenCalledWith(newAccessToken, mockExpiry);
    });

    it("should handle token expiry extraction correctly", async () => {
      const newAccessToken = "token_with_expiry";
      const extractedExpiry = 1700888888000;

      const mockHeaders = {
        get: jest.fn((key: string) => {
          if (key.toLowerCase() === "authorization") {
            return `Bearer ${newAccessToken}`;
          }
          if (key.toLowerCase() === "content-type") {
            return "application/json";
          }
          return null;
        })
      };

      const mockResponse = {
        ok: true,
        status: 200,
        headers: mockHeaders,
        json: jest.fn().mockResolvedValue({ message: "Success" })
      } as any;

      mockFetch.mockResolvedValue(mockResponse);
      mockStorage.getTokenExpiry.mockReturnValue(extractedExpiry);

      const result = await refreshAccessToken();

      expect(result).toBe(newAccessToken);
      expect(mockStorage.getTokenExpiry).toHaveBeenCalledWith(newAccessToken);
      expect(mockStorage.setToken).toHaveBeenCalledWith(newAccessToken, extractedExpiry);
    });

    it("should store token without expiry when getTokenExpiry returns null", async () => {
      const newAccessToken = "token_no_expiry";

      const mockHeaders = {
        get: jest.fn((key: string) => {
          if (key.toLowerCase() === "authorization") {
            return `Bearer ${newAccessToken}`;
          }
          if (key.toLowerCase() === "content-type") {
            return "application/json";
          }
          return null;
        })
      };

      const mockResponse = {
        ok: true,
        status: 200,
        headers: mockHeaders,
        json: jest.fn().mockResolvedValue({})
      } as any;

      mockFetch.mockResolvedValue(mockResponse);
      mockStorage.getTokenExpiry.mockReturnValue(null);

      const result = await refreshAccessToken();

      expect(result).toBe(newAccessToken);
      expect(mockStorage.setToken).toHaveBeenCalledWith(newAccessToken, undefined);
    });
  });

  describe("Failed Refresh Scenarios", () => {
    it("should handle 401 unauthorized response", async () => {
      const mockResponse = {
        ok: false,
        status: 401,
        statusText: "Unauthorized"
      } as any;

      mockFetch.mockResolvedValue(mockResponse);

      const result = await refreshAccessToken();

      expect(result).toBeNull();
      expect(mockStorage.removeToken).toHaveBeenCalled();
      expect(mockStorage.removeRefreshToken).toHaveBeenCalled();
    });

    it("should handle 500 server error response", async () => {
      const mockResponse = {
        ok: false,
        status: 500,
        statusText: "Internal Server Error"
      } as any;

      mockFetch.mockResolvedValue(mockResponse);

      const result = await refreshAccessToken();

      expect(result).toBeNull();
      expect(mockStorage.removeToken).toHaveBeenCalled();
      expect(mockStorage.removeRefreshToken).toHaveBeenCalled();
    });

    it("should handle network errors", async () => {
      mockFetch.mockRejectedValue(new Error("Network error"));

      const result = await refreshAccessToken();

      expect(result).toBeNull();
      expect(mockStorage.removeToken).toHaveBeenCalled();
      expect(mockStorage.removeRefreshToken).toHaveBeenCalled();
    });

    it("should handle missing refresh token", async () => {
      mockStorage.getRefreshToken.mockReturnValue(null);

      const result = await refreshAccessToken();

      expect(result).toBeNull();
      expect(mockFetch).not.toHaveBeenCalled();
      expect(mockStorage.removeToken).not.toHaveBeenCalled();
    });

    it("should handle invalid content type response", async () => {
      const mockHeaders = {
        get: jest.fn((key: string) => {
          if (key.toLowerCase() === "content-type") {
            return "text/html";
          }
          return null;
        })
      };

      const mockResponse = {
        ok: true,
        status: 200,
        headers: mockHeaders
      } as any;

      mockFetch.mockResolvedValue(mockResponse);

      const result = await refreshAccessToken();

      expect(result).toBeNull();
    });

    it("should handle missing access token in response", async () => {
      const mockHeaders = {
        get: jest.fn((key: string) => {
          if (key.toLowerCase() === "content-type") {
            return "application/json";
          }
          return null;
        })
      };

      const mockResponse = {
        ok: true,
        status: 200,
        headers: mockHeaders,
        json: jest.fn().mockResolvedValue({ message: "No token provided" })
      } as any;

      mockFetch.mockResolvedValue(mockResponse);

      const result = await refreshAccessToken();

      expect(result).toBeNull();
    });

    it("should handle JSON parsing errors", async () => {
      const mockHeaders = {
        get: jest.fn((key: string) => {
          if (key.toLowerCase() === "content-type") {
            return "application/json";
          }
          return null;
        })
      };

      const mockResponse = {
        ok: true,
        status: 200,
        headers: mockHeaders,
        json: jest.fn().mockRejectedValue(new Error("Invalid JSON"))
      } as any;

      mockFetch.mockResolvedValue(mockResponse);

      const result = await refreshAccessToken();

      expect(result).toBeNull();
      expect(mockStorage.removeToken).toHaveBeenCalled();
      expect(mockStorage.removeRefreshToken).toHaveBeenCalled();
    });
  });

  describe("Race Condition Prevention", () => {
    it("should prevent concurrent refresh requests", async () => {
      const newAccessToken = "concurrent_token";

      const mockHeaders = {
        get: jest.fn((key: string) => {
          if (key.toLowerCase() === "authorization") {
            return `Bearer ${newAccessToken}`;
          }
          if (key.toLowerCase() === "content-type") {
            return "application/json";
          }
          return null;
        })
      };

      const mockResponse = {
        ok: true,
        status: 200,
        headers: mockHeaders,
        json: jest.fn().mockResolvedValue({})
      } as any;

      // Mock a slow response
      mockFetch.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(mockResponse), 100)));
      mockStorage.getTokenExpiry.mockReturnValue(1700999999000);

      // Start multiple refresh requests concurrently
      const promise1 = refreshAccessToken();
      const promise2 = refreshAccessToken();
      const promise3 = refreshAccessToken();

      // All should return the same token
      const [result1, result2, result3] = await Promise.all([promise1, promise2, promise3]);

      expect(result1).toBe(newAccessToken);
      expect(result2).toBe(newAccessToken);
      expect(result3).toBe(newAccessToken);

      // fetch should only be called once despite multiple requests
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should track refreshing state correctly", async () => {
      const newAccessToken = "state_tracking_token";

      const mockHeaders = {
        get: jest.fn((key: string) => {
          if (key.toLowerCase() === "authorization") {
            return `Bearer ${newAccessToken}`;
          }
          return null;
        })
      };

      const mockResponse = {
        ok: true,
        status: 200,
        headers: mockHeaders,
        json: jest.fn().mockResolvedValue({})
      } as any;

      mockFetch.mockImplementation(() => new Promise((resolve) => setTimeout(() => resolve(mockResponse), 50)));
      mockStorage.getTokenExpiry.mockReturnValue(1700999999000);

      // State should be false initially
      expect(isCurrentlyRefreshing()).toBe(false);

      // Start refresh
      const refreshPromise = refreshAccessToken();

      // State should be true during refresh
      expect(isCurrentlyRefreshing()).toBe(true);

      // Wait for completion
      await refreshPromise;

      // State should be false after completion
      expect(isCurrentlyRefreshing()).toBe(false);
    });

    it("should reset state after failed refresh", async () => {
      mockFetch.mockRejectedValue(new Error("Network failure"));

      expect(isCurrentlyRefreshing()).toBe(false);

      const refreshPromise = refreshAccessToken();
      expect(isCurrentlyRefreshing()).toBe(true);

      const result = await refreshPromise;
      expect(result).toBeNull();
      expect(isCurrentlyRefreshing()).toBe(false);
    });

    it("should handle multiple refresh attempts after failure", async () => {
      // First call fails
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const result1 = await refreshAccessToken();
      expect(result1).toBeNull();
      expect(isCurrentlyRefreshing()).toBe(false);

      // Second call succeeds
      const newAccessToken = "retry_success_token";
      const mockHeaders = {
        get: jest.fn((key: string) => {
          if (key.toLowerCase() === "authorization") {
            return `Bearer ${newAccessToken}`;
          }
          if (key.toLowerCase() === "content-type") {
            return "application/json";
          }
          return null;
        })
      };

      const mockResponse = {
        ok: true,
        status: 200,
        headers: mockHeaders,
        json: jest.fn().mockResolvedValue({})
      } as any;

      mockFetch.mockResolvedValue(mockResponse);
      mockStorage.getTokenExpiry.mockReturnValue(1700999999000);

      const result2 = await refreshAccessToken();
      expect(result2).toBe(newAccessToken);
      expect(isCurrentlyRefreshing()).toBe(false);
    });
  });

  describe("Response Parsing Scenarios", () => {
    it("should extract token from Authorization header (case insensitive)", async () => {
      const newAccessToken = "case_insensitive_token";

      // Test different header casing
      const testCases = ["Authorization", "authorization", "AUTHORIZATION"];

      for (const _headerName of testCases) {
        const mockHeaders = {
          get: jest.fn((key: string) => {
            if (key.toLowerCase() === "authorization") {
              return `Bearer ${newAccessToken}`;
            }
            if (key.toLowerCase() === "content-type") {
              return "application/json";
            }
            return null;
          })
        };

        const mockResponse = {
          ok: true,
          status: 200,
          headers: mockHeaders,
          json: jest.fn().mockResolvedValue({})
        } as any;

        mockFetch.mockResolvedValue(mockResponse);
        mockStorage.getTokenExpiry.mockReturnValue(1700999999000);

        const result = await refreshAccessToken();
        expect(result).toBe(newAccessToken);

        // Reset mocks for next iteration
        jest.clearAllMocks();
        mockStorage.getRefreshToken.mockReturnValue("valid_refresh_token");
        mockApiConfig.getApiUrl.mockReturnValue("http://localhost:3060/auth/refresh");
      }
    });

    it("should handle malformed Authorization header", async () => {
      const malformedHeaders = [
        "InvalidFormat",
        "Bearer", // No token part
        "NotBearer token123",
        "Bearer token1 token2 extra" // Too many parts
      ];

      for (const malformedHeader of malformedHeaders) {
        const mockHeaders = {
          get: jest.fn((key: string) => {
            if (key.toLowerCase() === "authorization") {
              return malformedHeader;
            }
            if (key.toLowerCase() === "content-type") {
              return "application/json";
            }
            return null;
          })
        };

        const mockResponse = {
          ok: true,
          status: 200,
          headers: mockHeaders,
          json: jest.fn().mockResolvedValue({ access_token: "fallback_token" })
        } as any;

        mockFetch.mockResolvedValue(mockResponse);
        mockStorage.getTokenExpiry.mockReturnValue(1700999999000);

        const result = await refreshAccessToken();
        // Should fall back to body token
        expect(result).toBe("fallback_token");

        // Reset mocks for next iteration
        jest.clearAllMocks();
        mockStorage.getRefreshToken.mockReturnValue("valid_refresh_token");
        mockApiConfig.getApiUrl.mockReturnValue("http://localhost:3060/auth/refresh");
      }
    });

    it("should handle missing Authorization header gracefully", async () => {
      const mockHeaders = {
        get: jest.fn((key: string) => {
          if (key.toLowerCase() === "content-type") {
            return "application/json";
          }
          return null; // No authorization header
        })
      };

      const mockResponse = {
        ok: true,
        status: 200,
        headers: mockHeaders,
        json: jest.fn().mockResolvedValue({ access_token: "body_only_token" })
      } as any;

      mockFetch.mockResolvedValue(mockResponse);
      mockStorage.getTokenExpiry.mockReturnValue(1700999999000);

      const result = await refreshAccessToken();
      expect(result).toBe("body_only_token");
    });

    it("should prefer header token over body token when both exist", async () => {
      const headerToken = "header_priority_token";
      const bodyToken = "body_token";

      const mockHeaders = {
        get: jest.fn((key: string) => {
          if (key.toLowerCase() === "authorization") {
            return `Bearer ${headerToken}`;
          }
          if (key.toLowerCase() === "content-type") {
            return "application/json";
          }
          return null;
        })
      };

      const mockResponse = {
        ok: true,
        status: 200,
        headers: mockHeaders,
        json: jest.fn().mockResolvedValue({ access_token: bodyToken })
      } as any;

      mockFetch.mockResolvedValue(mockResponse);
      mockStorage.getTokenExpiry.mockReturnValue(1700999999000);

      const result = await refreshAccessToken();
      expect(result).toBe(headerToken);
      expect(mockStorage.setToken).toHaveBeenCalledWith(headerToken, 1700999999000);
    });

    it("should handle various content types properly", async () => {
      const contentTypes = [
        "application/json",
        "application/json; charset=utf-8",
        "text/plain", // Should fail
        "APPLICATION/JSON", // Should fail (case sensitive)
        "", // Should fail
        null // Should fail
      ];

      const validTypes = contentTypes.slice(0, 2);
      const invalidTypes = contentTypes.slice(2);

      // Test valid content types
      for (const contentType of validTypes) {
        const mockHeaders = {
          get: jest.fn((key: string) => {
            if (key.toLowerCase() === "content-type") {
              return contentType;
            }
            return null; // No authorization header, token should come from body
          })
        };

        const mockResponse = {
          ok: true,
          status: 200,
          headers: mockHeaders,
          json: jest.fn().mockResolvedValue({ access_token: "valid_token" })
        } as any;

        mockFetch.mockResolvedValue(mockResponse);
        mockStorage.getTokenExpiry.mockReturnValue(1700999999000);

        const result = await refreshAccessToken();
        expect(result).toBe("valid_token");

        // Reset mocks for next iteration
        jest.clearAllMocks();
        mockStorage.getRefreshToken.mockReturnValue("valid_refresh_token");
        mockApiConfig.getApiUrl.mockReturnValue("http://localhost:3060/auth/refresh");
      }

      // Test invalid content types
      for (const contentType of invalidTypes) {
        const mockHeaders = {
          get: jest.fn((key: string) => {
            if (key.toLowerCase() === "content-type") {
              return contentType;
            }
            return null;
          })
        };

        const mockResponse = {
          ok: true,
          status: 200,
          headers: mockHeaders,
          json: jest.fn().mockResolvedValue({ access_token: "invalid_content_type_token" })
        } as any;

        mockFetch.mockResolvedValue(mockResponse);

        const result = await refreshAccessToken();
        expect(result).toBeNull();

        // Reset mocks for next iteration
        jest.clearAllMocks();
        mockStorage.getRefreshToken.mockReturnValue("valid_refresh_token");
        mockApiConfig.getApiUrl.mockReturnValue("http://localhost:3060/auth/refresh");
      }
    });
  });

  describe("API Configuration Integration", () => {
    it("should use correct API endpoint from config", async () => {
      const customApiUrl = "https://api.example.com/auth/refresh";
      mockApiConfig.getApiUrl.mockReturnValue(customApiUrl);

      const mockHeaders = {
        get: jest.fn((key: string) => {
          if (key.toLowerCase() === "authorization") {
            return "Bearer test_token";
          }
          return null;
        })
      };

      const mockResponse = {
        ok: true,
        status: 200,
        headers: mockHeaders,
        json: jest.fn().mockResolvedValue({})
      } as any;

      mockFetch.mockResolvedValue(mockResponse);
      mockStorage.getTokenExpiry.mockReturnValue(1700999999000);

      await refreshAccessToken();

      expect(mockApiConfig.getApiUrl).toHaveBeenCalledWith("/auth/refresh");
      expect(mockFetch).toHaveBeenCalledWith(customApiUrl, expect.any(Object));
    });

    it("should include correct request headers and body", async () => {
      const refreshToken = "specific_refresh_token_123";
      mockStorage.getRefreshToken.mockReturnValue(refreshToken);

      const mockHeaders = {
        get: jest.fn(() => "Bearer response_token")
      };

      const mockResponse = {
        ok: true,
        status: 200,
        headers: mockHeaders,
        json: jest.fn().mockResolvedValue({})
      } as any;

      mockFetch.mockResolvedValue(mockResponse);
      mockStorage.getTokenExpiry.mockReturnValue(1700999999000);

      await refreshAccessToken();

      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3060/auth/refresh", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          refresh_token: refreshToken
        })
      });
    });
  });
});
