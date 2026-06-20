import { formatChatError, shouldRetryError } from "@/components/coding-exercise/lib/chatErrorHandler";
import { ChatApiError, ChatRateLimitedError, ChatUsageLimitError } from "@/components/coding-exercise/lib/chatApi";

const usage = { messagesToday: 100, messagesThisMonth: 480, dailyLimit: 100, monthlyLimit: 500 };

describe("chatErrorHandler", () => {
  describe("formatChatError", () => {
    it("formats generic auth errors", () => {
      const error = new ChatApiError("Unauthorized", 401);
      expect(formatChatError(error)).toBe("Authentication expired. Please refresh the page.");
    });

    it("formats token expired errors (shown after auto-retry fails)", () => {
      const error = new ChatApiError("Token expired", 401, { error: "token_expired", message: "Token has expired" });
      expect(formatChatError(error)).toBe("Session expired. Please try again.");
    });

    it("formats exercise mismatch errors", () => {
      const error = new ChatApiError("Forbidden", 403, { error: "exercise_mismatch" });
      expect(formatChatError(error)).toBe("Exercise mismatch. Please refresh and try again.");
    });

    it("formats invalid token errors", () => {
      const error = new ChatApiError("Invalid token", 401, { error: "invalid_token", message: "Invalid token" });
      expect(formatChatError(error)).toBe("Authentication failed. Please sign in again.");
    });

    it("formats rate limit errors", () => {
      const error = new ChatApiError("Too Many Requests", 429);
      expect(formatChatError(error)).toBe("Too many requests. Please wait a moment and try again.");
    });

    it("formats network errors", () => {
      const error = new Error("Failed to fetch");
      expect(formatChatError(error)).toBe("Network error. Please check your connection and try again.");
    });

    it("formats daily usage-limit errors with the UTC reset", () => {
      const error = new ChatUsageLimitError("daily", usage);
      expect(formatChatError(error)).toBe("You've used all 100 of today's messages. They reset at midnight UTC.");
    });

    it("formats monthly usage-limit errors with the 1st reset", () => {
      const error = new ChatUsageLimitError("monthly", usage);
      expect(formatChatError(error)).toBe("You've used all 500 messages this month. They reset on the 1st.");
    });

    it("formats rate-limited errors using the proxy message", () => {
      const error = new ChatRateLimitedError("Too many requests. Please wait a moment and try again.");
      expect(formatChatError(error)).toBe("Too many requests. Please wait a moment and try again.");
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
