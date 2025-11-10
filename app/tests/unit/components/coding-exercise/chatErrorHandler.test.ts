import { formatChatError, shouldRetryError } from "@/components/coding-exercise/lib/chatErrorHandler";
import { ChatApiError } from "@/components/coding-exercise/lib/chatApi";

describe("chatErrorHandler", () => {
  describe("formatChatError", () => {
    it("formats generic auth errors", () => {
      const error = new ChatApiError("Unauthorized", 401);
      expect(formatChatError(error)).toBe("Authentication expired. Please refresh the page.");
    });

    it("formats token expired errors", () => {
      const error = new ChatApiError("Token expired", 401, { error: "token_expired", message: "Token has expired" });
      expect(formatChatError(error)).toBe("Session expired. Refreshing authentication...");
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
  });
});
