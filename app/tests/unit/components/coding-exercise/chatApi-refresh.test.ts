/**
 * Integration tests for chat API refresh token functionality
 */

import { sendChatMessage, ChatApiError } from "@/components/coding-exercise/lib/chatApi";
import { refreshAccessToken } from "@/lib/auth/refresh";
import { getToken } from "@/lib/auth/storage";
import { getChatApiUrl } from "@/lib/api/config";

// Mock dependencies
jest.mock("@/lib/auth/refresh");
jest.mock("@/lib/auth/storage");
jest.mock("@/lib/api/config");

const mockRefreshAccessToken = refreshAccessToken as jest.MockedFunction<typeof refreshAccessToken>;
const mockGetToken = getToken as jest.MockedFunction<typeof getToken>;
const mockGetChatApiUrl = getChatApiUrl as jest.MockedFunction<typeof getChatApiUrl>;

// Mock fetch and web APIs
const mockFetch = jest.fn();
global.fetch = mockFetch;

// Mock ReadableStream for Node.js test environment
if (typeof ReadableStream === "undefined") {
  global.ReadableStream = class ReadableStream {
    constructor() {
      // Minimal implementation for tests
    }
  } as any;
}

// Mock TextEncoder for Node.js test environment
if (typeof TextEncoder === "undefined") {
  global.TextEncoder = class TextEncoder {
    encode(str: string) {
      return new Uint8Array(Buffer.from(str, "utf8"));
    }
  } as any;
}

// Mock TextDecoder for Node.js test environment
if (typeof TextDecoder === "undefined") {
  global.TextDecoder = class TextDecoder {
    decode(bytes: Uint8Array) {
      return Buffer.from(bytes).toString("utf8");
    }
  } as any;
}

describe("Chat API Refresh Token Integration", () => {
  const mockPayload = {
    exerciseSlug: "test-exercise",
    code: "console.log('test');",
    question: "How does this work?",
    language: "javascript",
    history: []
  };

  const mockCallbacks = {
    onTextChunk: jest.fn(),
    onSignature: jest.fn(),
    onError: jest.fn(),
    onComplete: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetChatApiUrl.mockReturnValue("http://localhost:8787/chat");
  });

  it("should retry request after successful token refresh when token expired", async () => {
    // Setup: initial token, refresh token available
    mockGetToken
      .mockReturnValueOnce("expired_token") // First call returns expired token
      .mockReturnValueOnce("new_token"); // Second call returns new token

    mockRefreshAccessToken.mockResolvedValueOnce("new_token");

    // First request fails with token_expired
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      headers: {
        get: () => "application/json"
      },
      json: () => ({ error: "token_expired", message: "Token has expired" })
    });

    // Second request succeeds - mock a simple readable stream
    const mockBody = {
      getReader: () => ({
        read: jest
          .fn()
          .mockResolvedValueOnce({ done: false, value: new Uint8Array([116, 101, 115, 116]) }) // "test"
          .mockResolvedValueOnce({ done: true })
      })
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: mockBody
    });

    await sendChatMessage(mockPayload, mockCallbacks);

    // Verify refresh was called
    expect(mockRefreshAccessToken).toHaveBeenCalledTimes(1);

    // Verify two fetch calls were made
    expect(mockFetch).toHaveBeenCalledTimes(2);

    // First call with expired token
    expect(mockFetch).toHaveBeenNthCalledWith(1, "http://localhost:8787/chat", {
      method: "POST",
      headers: {
        Authorization: "Bearer expired_token",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mockPayload)
    });

    // Second call with new token
    expect(mockFetch).toHaveBeenNthCalledWith(2, "http://localhost:8787/chat", {
      method: "POST",
      headers: {
        Authorization: "Bearer new_token",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(mockPayload)
    });
  });

  it("should not retry for invalid_token errors", async () => {
    mockGetToken.mockReturnValue("invalid_token");

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      headers: {
        get: () => "application/json"
      },
      json: () => ({ error: "invalid_token", message: "Invalid token" })
    });

    const error = await sendChatMessage(mockPayload, mockCallbacks).catch((e) => e);

    expect(error).toBeInstanceOf(ChatApiError);
    expect(error.status).toBe(401);

    // Should not attempt refresh for invalid tokens
    expect(mockRefreshAccessToken).not.toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should throw error if refresh fails", async () => {
    mockGetToken.mockReturnValue("expired_token");
    mockRefreshAccessToken.mockResolvedValueOnce(null); // Refresh failed

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      headers: {
        get: () => "application/json"
      },
      json: () => ({ error: "token_expired", message: "Token has expired" })
    });

    await expect(sendChatMessage(mockPayload, mockCallbacks)).rejects.toThrow(ChatApiError);

    expect(mockRefreshAccessToken).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(1); // Only original call, no retry
  });

  it("should handle non-401 errors normally", async () => {
    mockGetToken.mockReturnValue("valid_token");

    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      headers: {
        get: () => "application/json"
      },
      json: () => ({ error: "server_error", message: "Server error" })
    });

    await expect(sendChatMessage(mockPayload, mockCallbacks)).rejects.toThrow(ChatApiError);

    // Should not attempt refresh for non-auth errors
    expect(mockRefreshAccessToken).not.toHaveBeenCalled();
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });
});
