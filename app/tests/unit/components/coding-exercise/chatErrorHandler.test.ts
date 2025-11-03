import { formatChatError, shouldRetryError } from "@/components/coding-exercise/lib/chatErrorHandler";
import { ChatApiError } from "@/components/coding-exercise/lib/chatApi";

describe("chatErrorHandler", () => {
  describe("formatChatError", () => {
    it("formats auth errors", () => {
      const error = new ChatApiError("Unauthorized", 401);
      expect(formatChatError(error)).toBe("Authentication expired. Please refresh the page.");
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

    it("does not retry auth errors", () => {
      const error = new ChatApiError("Unauthorized", 401);
      expect(shouldRetryError(error)).toBe(false);
    });

    it("retries network errors", () => {
      const error = new Error("Failed to fetch");
      expect(shouldRetryError(error)).toBe(true);
    });
  });
});
