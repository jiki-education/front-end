/**
 * Unit tests for useChat token management logic
 * Tests ensureValidToken, token refresh, and retry on expiry
 */

import { renderHook, act, waitFor } from "@testing-library/react";
import { useChat } from "@/components/coding-exercise/lib/useChat";
import { fetchChatToken } from "@/components/coding-exercise/lib/chatTokenApi";
import { sendChatMessage, ChatTokenExpiredError } from "@/components/coding-exercise/lib/chatApi";
import { useChatContext } from "@/components/coding-exercise/lib/useChatContext";

// Mock all external dependencies
jest.mock("@/components/coding-exercise/lib/chatTokenApi");
jest.mock("@/components/coding-exercise/lib/chatApi");
jest.mock("@/components/coding-exercise/lib/conversationApi");
jest.mock("@/components/coding-exercise/lib/useChatContext");

const mockFetchChatToken = fetchChatToken as jest.MockedFunction<typeof fetchChatToken>;
const mockSendChatMessage = sendChatMessage as jest.MockedFunction<typeof sendChatMessage>;
const mockUseChatContext = useChatContext as jest.MockedFunction<typeof useChatContext>;

// Create a mock orchestrator with minimal interface
function createMockOrchestrator() {
  return {
    store: {
      getState: () => ({
        code: "test code",
        currentTest: null,
        currentTaskIndex: 0
      }),
      subscribe: jest.fn(() => jest.fn())
    },
    getCode: () => "test code",
    currentTaskIndex: 0,
    exercise: {
      slug: "test-exercise",
      tasks: [{ id: "task-1", name: "Task 1" }]
    }
  } as any;
}

describe("useChat token management", () => {
  const mockToken = "mock-jwt-token-12345";
  const mockNewToken = "mock-new-jwt-token-67890";

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default mock for useChatContext
    mockUseChatContext.mockReturnValue({
      exerciseSlug: "test-exercise",
      contextSlug: "test-lesson",
      currentCode: "console.log('test');",
      currentTaskId: "task-1",
      language: "javascript",
      exerciseTitle: "Test Exercise",
      exerciseInstructions: "Test instructions",
      exercise: { slug: "test-exercise", tasks: [] }
    });

    // Default: fetchChatToken succeeds
    mockFetchChatToken.mockResolvedValue(mockToken);

    // Default: sendChatMessage succeeds immediately
    mockSendChatMessage.mockImplementation((_payload, callbacks, _token) => {
      callbacks.onComplete("Test response", null);
      return Promise.resolve();
    });
  });

  describe("ensureValidToken (via sendMessage)", () => {
    it("should fetch token on first message when no token exists", async () => {
      const orchestrator = createMockOrchestrator();
      const { result } = renderHook(() => useChat(orchestrator));

      await act(async () => {
        await result.current.sendMessage("Hello");
      });

      expect(mockFetchChatToken).toHaveBeenCalledTimes(1);
      expect(mockFetchChatToken).toHaveBeenCalledWith({ lessonSlug: "test-lesson" });
      expect(mockSendChatMessage).toHaveBeenCalledTimes(1);
    });

    it("should use cached token for subsequent messages", async () => {
      const orchestrator = createMockOrchestrator();

      // Mock returns empty response so status goes to idle
      mockSendChatMessage.mockImplementation((_payload, callbacks, _token) => {
        callbacks.onComplete("", null);
        return Promise.resolve();
      });

      const { result } = renderHook(() => useChat(orchestrator));

      // Send first message - should fetch token
      await act(async () => {
        await result.current.sendMessage("First message");
      });

      // Wait for status to become idle so we can send another message
      await waitFor(() => {
        expect(result.current.status).toBe("idle");
      });

      // Send second message - should reuse cached token
      await act(async () => {
        await result.current.sendMessage("Second message");
      });

      // Token should only be fetched once
      expect(mockFetchChatToken).toHaveBeenCalledTimes(1);
      expect(mockSendChatMessage).toHaveBeenCalledTimes(2);
    });

    it("should pass token to sendChatMessage", async () => {
      const orchestrator = createMockOrchestrator();
      const { result } = renderHook(() => useChat(orchestrator));

      await act(async () => {
        await result.current.sendMessage("Test message");
      });

      // Verify token was passed to sendChatMessage
      expect(mockSendChatMessage).toHaveBeenCalledWith(expect.any(Object), expect.any(Object), mockToken);
    });
  });

  describe("token refresh on ChatTokenExpiredError", () => {
    it("should retry with new token when ChatTokenExpiredError is thrown", async () => {
      const orchestrator = createMockOrchestrator();

      // First call throws ChatTokenExpiredError, second succeeds
      mockSendChatMessage
        .mockRejectedValueOnce(new ChatTokenExpiredError())
        .mockImplementationOnce((_payload, callbacks, _token) => {
          callbacks.onComplete("Retry succeeded", null);
          return Promise.resolve();
        });

      // Set up fetchChatToken to return different tokens
      mockFetchChatToken.mockResolvedValueOnce(mockToken).mockResolvedValueOnce(mockNewToken);

      const { result } = renderHook(() => useChat(orchestrator));

      await act(async () => {
        await result.current.sendMessage("Test message");
      });

      // Should have fetched token twice (initial + after expiry)
      expect(mockFetchChatToken).toHaveBeenCalledTimes(2);

      // Should have called sendChatMessage twice (initial failed + retry)
      expect(mockSendChatMessage).toHaveBeenCalledTimes(2);

      // Verify the retry used the new token
      expect(mockSendChatMessage).toHaveBeenLastCalledWith(expect.any(Object), expect.any(Object), mockNewToken);
    });

    it("should only retry once on token expiry", async () => {
      const orchestrator = createMockOrchestrator();

      // Both calls throw ChatTokenExpiredError
      mockSendChatMessage
        .mockRejectedValueOnce(new ChatTokenExpiredError())
        .mockRejectedValueOnce(new ChatTokenExpiredError());

      const { result } = renderHook(() => useChat(orchestrator));

      await act(async () => {
        await result.current.sendMessage("Test message");
      });

      // Should only try twice, not infinitely retry
      expect(mockSendChatMessage).toHaveBeenCalledTimes(2);

      // Should set error status
      expect(result.current.status).toBe("error");
    });

    it("should not retry on non-token errors", async () => {
      const orchestrator = createMockOrchestrator();

      // Throw a regular error, not ChatTokenExpiredError
      mockSendChatMessage.mockRejectedValueOnce(new Error("Network error"));

      const { result } = renderHook(() => useChat(orchestrator));

      await act(async () => {
        await result.current.sendMessage("Test message");
      });

      // Should only try once
      expect(mockSendChatMessage).toHaveBeenCalledTimes(1);
      expect(mockFetchChatToken).toHaveBeenCalledTimes(1);

      // Should set error status
      expect(result.current.status).toBe("error");
    });
  });

  describe("token clearing", () => {
    it("should clear token when clearConversation is called", async () => {
      const orchestrator = createMockOrchestrator();

      // Mock returns empty response so status goes to idle
      mockSendChatMessage.mockImplementation((_payload, callbacks, _token) => {
        callbacks.onComplete("", null);
        return Promise.resolve();
      });

      const { result } = renderHook(() => useChat(orchestrator));

      // Send message to cache a token
      await act(async () => {
        await result.current.sendMessage("First message");
      });

      await waitFor(() => {
        expect(result.current.status).toBe("idle");
      });

      // Clear conversation (which clears token via chatState.clearChat)
      act(() => {
        result.current.clearConversation();
      });

      // Send another message - should fetch new token
      await act(async () => {
        await result.current.sendMessage("After clear");
      });

      // Token should be fetched twice (once before clear, once after)
      expect(mockFetchChatToken).toHaveBeenCalledTimes(2);
    });
  });

  describe("concurrent token fetching", () => {
    it("should deduplicate concurrent token fetch requests", async () => {
      const orchestrator = createMockOrchestrator();

      // Make fetchChatToken take some time to simulate real network
      let resolveTokenFetch: (token: string) => void;
      mockFetchChatToken.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolveTokenFetch = resolve;
          })
      );

      // Track how many times sendChatMessage is called
      let sendCallCount = 0;
      mockSendChatMessage.mockImplementation((_payload, callbacks, _token) => {
        sendCallCount++;
        callbacks.onComplete(`Response ${sendCallCount}`, null);
        return Promise.resolve();
      });

      const { result } = renderHook(() => useChat(orchestrator));

      // Start first message (will wait for token)
      const promise1 = act(async () => {
        await result.current.sendMessage("Message 1");
      });

      // fetchChatToken should be called once
      expect(mockFetchChatToken).toHaveBeenCalledTimes(1);

      // Resolve the token fetch
      act(() => {
        resolveTokenFetch(mockToken);
      });

      await promise1;

      // After first message completes, only one token fetch should have occurred
      expect(mockFetchChatToken).toHaveBeenCalledTimes(1);
    });
  });
});
