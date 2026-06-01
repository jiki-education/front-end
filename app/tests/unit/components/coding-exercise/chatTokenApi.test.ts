/**
 * Unit tests for chatTokenApi.ts - JWT token fetching for chat
 */

import {
  ChatTokenAccessDeniedError,
  ChatTokenError,
  ChatTokenInvalidCaptchaError,
  fetchChatToken
} from "@/components/coding-exercise/lib/chatTokenApi";
import { getApiUrl } from "@/lib/api/config";

jest.mock("@/lib/api/config");

const mockGetApiUrl = getApiUrl as jest.MockedFunction<typeof getApiUrl>;

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

      const result = await fetchChatToken({
        context: { type: "lesson", slug: "test-exercise" },
        cfTurnstileResponse: "test-token"
      });

      expect(result).toBe(mockToken);
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith("http://localhost:3060/internal/assistant_conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ lesson_slug: "test-exercise", cf_turnstile_response: "test-token" })
      });
    });

    it("should use snake_case for lesson_slug in request body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ token: mockToken })
      });

      await fetchChatToken({
        context: { type: "lesson", slug: "my-exercise-slug" },
        cfTurnstileResponse: "test-token"
      });

      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody).toEqual({ lesson_slug: "my-exercise-slug", cf_turnstile_response: "test-token" });
    });

    it("should send project_slug for project context", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ token: mockToken })
      });

      await fetchChatToken({
        context: { type: "project", slug: "my-project-slug" },
        cfTurnstileResponse: "test-token"
      });

      const requestBody = JSON.parse(mockFetch.mock.calls[0][1].body);
      expect(requestBody).toEqual({ project_slug: "my-project-slug", cf_turnstile_response: "test-token" });
    });

    it("should throw ChatTokenError on 401 errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({ error: "unauthorized" })
      });

      await expect(
        fetchChatToken({ context: { type: "lesson", slug: "test-exercise" }, cfTurnstileResponse: "test-token" })
      ).rejects.toThrow(ChatTokenError);
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it("should throw ChatTokenError on non-401 errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        headers: { get: () => "application/json" },
        json: () => Promise.resolve({ error: "server_error", message: "Database connection failed" })
      });

      await expect(
        fetchChatToken({ context: { type: "lesson", slug: "test-exercise" }, cfTurnstileResponse: "test-token" })
      ).rejects.toThrow(ChatTokenError);
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
        await fetchChatToken({ context: { type: "lesson", slug: "nonexistent" }, cfTurnstileResponse: "test-token" });
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
        await fetchChatToken({ context: { type: "lesson", slug: "test-exercise" }, cfTurnstileResponse: "test-token" });
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
        await fetchChatToken({ context: { type: "lesson", slug: "test-exercise" }, cfTurnstileResponse: "test-token" });
        fail("Expected ChatTokenError to be thrown");
      } catch (error) {
        expect(error).toBeInstanceOf(ChatTokenError);
        const chatError = error as ChatTokenError;
        expect(chatError.status).toBe(500);
        expect(chatError.data).toEqual({ error: "unknown", message: "Failed to parse error response" });
      }
    });
  });

  describe("403 disambiguation", () => {
    function mock403(errorBody: unknown) {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        statusText: "Forbidden",
        headers: { get: () => "application/json" },
        json: () => Promise.resolve(errorBody)
      });
    }

    it("throws ChatTokenAccessDeniedError when error.type is access_denied", async () => {
      mock403({ error: { type: "access_denied", message: "Upgrade required" } });

      try {
        await fetchChatToken({ context: { type: "lesson", slug: "x" }, cfTurnstileResponse: "test-token" });
        fail("expected throw");
      } catch (error) {
        expect(error).toBeInstanceOf(ChatTokenAccessDeniedError);
        expect(error).toBeInstanceOf(ChatTokenError);
        expect((error as ChatTokenAccessDeniedError).status).toBe(403);
        expect((error as ChatTokenAccessDeniedError).message).toBe("Upgrade required");
      }
    });

    it("throws ChatTokenInvalidCaptchaError when error.type is invalid_captcha", async () => {
      mock403({ error: { type: "invalid_captcha", message: "Verification failed" } });

      try {
        await fetchChatToken({ context: { type: "lesson", slug: "x" }, cfTurnstileResponse: "test-token" });
        fail("expected throw");
      } catch (error) {
        expect(error).toBeInstanceOf(ChatTokenInvalidCaptchaError);
        expect(error).toBeInstanceOf(ChatTokenError);
        expect((error as ChatTokenInvalidCaptchaError).message).toBe("Verification failed");
      }
    });

    it("falls through to ChatTokenError when error.type is unknown", async () => {
      mock403({ error: { type: "something_else", message: "Nope" } });

      try {
        await fetchChatToken({ context: { type: "lesson", slug: "x" }, cfTurnstileResponse: "test-token" });
        fail("expected throw");
      } catch (error) {
        expect(error).toBeInstanceOf(ChatTokenError);
        expect(error).not.toBeInstanceOf(ChatTokenAccessDeniedError);
        expect(error).not.toBeInstanceOf(ChatTokenInvalidCaptchaError);
      }
    });

    it("falls through to ChatTokenError when 403 body is malformed", async () => {
      mock403({ unexpected: "shape" });

      try {
        await fetchChatToken({ context: { type: "lesson", slug: "x" }, cfTurnstileResponse: "test-token" });
        fail("expected throw");
      } catch (error) {
        expect(error).toBeInstanceOf(ChatTokenError);
        expect(error).not.toBeInstanceOf(ChatTokenAccessDeniedError);
        expect(error).not.toBeInstanceOf(ChatTokenInvalidCaptchaError);
      }
    });

    it("uses generic message when access_denied body has no message", async () => {
      mock403({ error: { type: "access_denied" } });

      try {
        await fetchChatToken({ context: { type: "lesson", slug: "x" }, cfTurnstileResponse: "test-token" });
        fail("expected throw");
      } catch (error) {
        expect(error).toBeInstanceOf(ChatTokenAccessDeniedError);
        expect((error as ChatTokenAccessDeniedError).message).toBe("HTTP 403: Forbidden");
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
