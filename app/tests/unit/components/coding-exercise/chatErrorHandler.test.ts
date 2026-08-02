import { formatChatError, shouldRetryError } from "@/components/coding-exercise/lib/chatErrorHandler";
import { ChatApiError, ChatRateLimitedError, ChatUsageLimitError } from "@/components/coding-exercise/lib/chatApi";

const usage = { messagesToday: 100, messagesThisMonth: 480, dailyLimit: 100, monthlyLimit: 500 };

describe("chatErrorHandler", () => {
  describe("formatChatError", () => {
    it("keys generic auth errors", () => {
      const error = new ChatApiError("Unauthorized", 401);
      expect(formatChatError(error)).toEqual({ type: "key", key: "chatError.authExpired", params: undefined });
    });

    it("keys token expired errors (shown after auto-retry fails)", () => {
      const error = new ChatApiError("Token expired", 401, { error: "token_expired", message: "Token has expired" });
      expect(formatChatError(error)).toEqual({ type: "key", key: "chatError.sessionExpired", params: undefined });
    });

    it("keys exercise mismatch errors", () => {
      const error = new ChatApiError("Forbidden", 403, { error: "exercise_mismatch" });
      expect(formatChatError(error)).toEqual({ type: "key", key: "chatError.exerciseMismatch", params: undefined });
    });

    it("keys invalid token errors", () => {
      const error = new ChatApiError("Invalid token", 401, { error: "invalid_token", message: "Invalid token" });
      expect(formatChatError(error)).toEqual({ type: "key", key: "chatError.authFailed", params: undefined });
    });

    it("keys rate limit errors", () => {
      const error = new ChatApiError("Too Many Requests", 429);
      expect(formatChatError(error)).toEqual({ type: "key", key: "chatError.tooManyRequests", params: undefined });
    });

    it("keys network errors", () => {
      const error = new Error("Failed to fetch");
      expect(formatChatError(error)).toEqual({ type: "key", key: "chatError.networkError", params: undefined });
    });

    it("keys daily usage-limit errors to the shared cap message, passing the limit", () => {
      const error = new ChatUsageLimitError("daily", usage);
      expect(formatChatError(error)).toEqual({
        type: "key",
        key: "chatUsageNotice.limitReached.daily",
        params: { limit: 100 }
      });
    });

    it("keys monthly usage-limit errors to the shared cap message, passing the limit", () => {
      const error = new ChatUsageLimitError("monthly", usage);
      expect(formatChatError(error)).toEqual({
        type: "key",
        key: "chatUsageNotice.limitReached.monthly",
        params: { limit: 500 }
      });
    });

    it("passes rate-limited errors through with the proxy's own copy", () => {
      const error = new ChatRateLimitedError("Too many requests. Please wait a moment and try again.");
      expect(formatChatError(error)).toEqual({
        type: "text",
        text: "Too many requests. Please wait a moment and try again."
      });
    });

    it("falls back to the localized key when the proxy gives no rate-limit copy", () => {
      const error = new ChatRateLimitedError();
      expect(formatChatError(error)).toEqual({ type: "key", key: "chatError.tooManyRequests", params: undefined });
    });

    it("passes unclassified ChatApiError statuses through with the server message", () => {
      const error = new ChatApiError("I'm a teapot", 418);
      expect(formatChatError(error)).toEqual({ type: "text", text: "I'm a teapot" });
    });

    it("passes unclassified runtime errors through verbatim", () => {
      const error = new Error("Something odd happened");
      expect(formatChatError(error)).toEqual({ type: "text", text: "Something odd happened" });
    });

    it("keys client-originated no-response-body errors instead of relaying English", () => {
      const error = new ChatApiError("No response body received", undefined, undefined, "no_response_body");
      expect(formatChatError(error)).toEqual({ type: "key", key: "chatError.noResponseBody", params: undefined });
    });

    it("keys stream-processing errors instead of relaying English", () => {
      const error = new ChatApiError("boom", undefined, undefined, "stream_processing");
      expect(formatChatError(error)).toEqual({ type: "key", key: "chatError.streamProcessing", params: undefined });
    });

    it("keys unknown client errors instead of relaying English", () => {
      const error = new ChatApiError("Unknown error", undefined, undefined, "unknown");
      expect(formatChatError(error)).toEqual({ type: "key", key: "chatError.unknown", params: undefined });
    });

    it("keys our own composed HTTP-status message instead of relaying English", () => {
      const error = new ChatApiError("HTTP 422: Unprocessable Entity", 422, undefined, "request_failed");
      expect(formatChatError(error)).toEqual({ type: "key", key: "chatError.requestFailed", params: undefined });
    });

    it("keys completely unknown errors to the generic fallback", () => {
      expect(formatChatError("nope")).toEqual({ type: "key", key: "chatError.unexpected", params: undefined });
    });
  });

  describe("shouldRetryError", () => {
    it("retries server errors", () => {
      const error = new ChatApiError("Internal Server Error", 500);
      expect(shouldRetryError(error)).toBe(true);
    });

    it("does not retry generic auth errors", () => {
      const error = new ChatApiError("Unauthorized", 401);
      expect(shouldRetryError(error)).toBe(false);
    });

    it("does not retry token expired errors (handled by refresh logic)", () => {
      const error = new ChatApiError("Token expired", 401, { error: "token_expired", message: "Token has expired" });
      expect(shouldRetryError(error)).toBe(false);
    });

    it("does not retry invalid token errors", () => {
      const error = new ChatApiError("Invalid token", 401, { error: "invalid_token", message: "Invalid token" });
      expect(shouldRetryError(error)).toBe(false);
    });

    it("retries network errors", () => {
      const error = new Error("Failed to fetch");
      expect(shouldRetryError(error)).toBe(true);
    });

    it("does not retry usage-limit errors (won't recover until reset)", () => {
      expect(shouldRetryError(new ChatUsageLimitError("daily", usage))).toBe(false);
    });

    it("does not auto-retry rate-limited errors (would prolong the throttle)", () => {
      expect(shouldRetryError(new ChatRateLimitedError())).toBe(false);
    });
  });
});
