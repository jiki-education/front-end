/**
 * Unit tests for chatTokenApi.ts - JWT token fetching for chat
 */

import { fetchChatToken, ChatTokenError } from "@/components/coding-exercise/lib/chatTokenApi";
import { getApiUrl } from "@/lib/api/config";
import { refreshAccessToken } from "@/lib/auth/refresh";

jest.mock("@/lib/api/config");
jest.mock("@/lib/auth/refresh");

const mockGetApiUrl = getApiUrl as jest.MockedFunction<typeof getApiUrl>;
const mockRefreshAccessToken = refreshAccessToken as jest.MockedFunction<typeof refreshAccessToken>;

const mockFetch = jest.fn();
global.fetch = mockFetch;

describe("chatTokenApi", () => {
  const mockToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.test";

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetApiUrl.mockReturnValue("http://localhost:3060/internal/assistant_conversations");
  });

  describe("fetchChatToken", () => {
    it("should fetch token successfully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ token: mockToken })
      });

      const result = await fetchChatToken({ lessonSlug: "test-exercise" });

      expect(result).toBe(mockToken);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3060/internal/assistant_conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ lesson_slug: "test-exercise" })
      });
    });

    it("should use snake_case for lesson_slug in request body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ token: mockToken })
      });

      await fetchChatToken({ lessonSlug: "my-exercise-slug" });

      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody).toEqual({ lesson_slug: "my-exercise-slug" });
    });

    it("should retry on 401 after successful session refresh", async () => {
      // First call returns 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({ error: "unauthorized" })
      });

      // Session refresh succeeds
      mockRefreshAccessToken.mockResolvedValueOnce(true);

      // Second call succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ token: mockToken })
      });

      const result = await fetchChatToken({ lessonSlug: "test-exercise" });

      expect(result).toBe(mockToken);
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockRefreshAccessToken).toHaveBeenCalledTimes(1);
    });

    it("should not retry on 401 if session refresh fails", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({ error: "unauthorized" })
      });

      // Session refresh fails
      mockRefreshAccessToken.mockResolvedValueOnce(false);

      await expect(fetchChatToken({ lessonSlug: "test-exercise" })).rejects.toThrow(ChatTokenError);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockRefreshAccessToken).toHaveBeenCalledTimes(1);
    });

    it("should not retry more than once on repeated 401", async () => {
      // First call returns 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({ error: "unauthorized" })
      });

      // Session refresh succeeds
      mockRefreshAccessToken.mockResolvedValueOnce(true);

      // Second call also returns 401
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({ error: "unauthorized" })
      });

      await expect(fetchChatToken({ lessonSlug: "test-exercise" })).rejects.toThrow(ChatTokenError);
      // Should have tried twice, but NOT a third time
      expect(mockFetch).toHaveBeenCalledTimes(2);
      // Session refresh only called once (for the first 401)
      expect(mockRefreshAccessToken).toHaveBeenCalledTimes(1);
    });

    it("should throw ChatTokenError on non-401 errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({ error: "server_error", message: "Database connection failed" })
      });

      await expect(fetchChatToken({ lessonSlug: "test-exercise" })).rejects.toThrow(ChatTokenError);
      // Should not attempt session refresh for non-401 errors
      expect(mockRefreshAccessToken).not.toHaveBeenCalled();
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should include status and error data in ChatTokenError", async () => {
      const errorData = { error: "invalid_lesson", message: "Lesson not found" };
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: "Not Found",
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(errorData)
      });

      try {
        await fetchChatToken({ lessonSlug: "nonexistent" });
        fail("Expected ChatTokenError to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ChatTokenError);
        const chatError = error as ChatTokenError;
        expect(chatError.status).toBe(404);
        expect(chatError.data).toEqual(errorData);
        expect(chatError.message).toBe("HTTP 404: Not Found");
      }
    });

    it("should handle text error responses", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 502,
        statusText: "Bad Gateway",
        headers: { get: () => "text/html" },
        text: () => Promise.resolve("<html>Bad Gateway</html>")
      });

      try {
        await fetchChatToken({ lessonSlug: "test-exercise" });
        fail("Expected ChatTokenError to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ChatTokenError);
        const chatError = error as ChatTokenError;
        expect(chatError.status).toBe(502);
        expect(chatError.data).toBe("<html>Bad Gateway</html>");
      }
    });

    it("should handle error response parsing failure gracefully", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        headers: { get: () => "application/json" },
        json: () => Promise.reject(new Error("Invalid JSON"))
      });

      try {
        await fetchChatToken({ lessonSlug: "test-exercise" });
        fail("Expected ChatTokenError to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ChatTokenError);
        const chatError = error as ChatTokenError;
        expect(chatError.status).toBe(500);
        expect(chatError.data).toEqual({ error: "unknown", message: "Failed to parse error response" });
      }
    });
  });

  describe("ChatTokenError", () => {
    it("should have correct name property", () => {
      const error = new ChatTokenError("Test error");
      expect(error.name).toBe("ChatTokenError");
    });

    it("should store status and data properties", () => {
      const error = new ChatTokenError("Test error", 403, { reason: "forbidden" });
      expect(error.message).toBe("Test error");
      expect(error.status).toBe(403);
      expect(error.data).toEqual({ reason: "forbidden" });
    });

    it("should be instanceof Error", () => {
      const error = new ChatTokenError("Test");
      expect(error).toBeInstanceOf(Error);
    });
  });
});
