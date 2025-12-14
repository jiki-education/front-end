/**
 * Integration tests for chat API refresh token functionality with httpOnly cookies
 */

import { sendChatMessage, ChatApiError } from "@/components/coding-exercise/lib/chatApi";
import { refreshAccessToken } from "@/lib/auth/refresh";
import { getChatApiUrl } from "@/lib/api/config";

// Mock dependencies
jest.mock("@/lib/auth/refresh");
jest.mock("@/lib/api/config");

const mockRefreshAccessToken = refreshAccessToken as jest.MockedFunction<typeof refreshAccessToken>;
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

describe("Chat API Refresh Token Integration (httpOnly Cookies)", () => {
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

  it("should retry request after successful token refresh on 401", async () => {
    // First request fails with 401 (token expired in cookie)
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      headers: {
        get: () => "application/json"
      },
      json: () => ({ error: "token_expired", message: "Token has expired" })
    });

    // Refresh succeeds (Server Action updates httpOnly cookie)
    mockRefreshAccessToken.mockResolvedValueOnce("new_token");

    // Second request succeeds with updated cookie
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

    // Both calls should use credentials: 'include' (NO Authorization header)
    expect(mockFetch).toHaveBeenNthCalledWith(1, "http://localhost:8787/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(mockPayload)
    });

    expect(mockFetch).toHaveBeenNthCalledWith(2, "http://localhost:8787/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(mockPayload)
    });
  });

  it("should throw error if refresh fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      headers: {
        get: () => "application/json"
      },
      json: () => ({ error: "token_expired", message: "Token has expired" })
    });

    // Refresh fails (Server Action couldn't refresh token)
    mockRefreshAccessToken.mockResolvedValueOnce(null);

    await expect(sendChatMessage(mockPayload, mockCallbacks)).rejects.toThrow(ChatApiError);

    expect(mockRefreshAccessToken).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledTimes(1); // Only original call, no retry
  });

  it("should handle non-401 errors normally without refresh attempt", async () => {
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

  it("should send cookies automatically without Authorization header", async () => {
    const mockBody = {
      getReader: () => ({
        read: jest
          .fn()
          .mockResolvedValueOnce({ done: false, value: new Uint8Array([116, 101, 115, 116]) })
          .mockResolvedValueOnce({ done: true })
      })
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: mockBody
    });

    await sendChatMessage(mockPayload, mockCallbacks);

    // Verify NO Authorization header, only credentials: 'include'
    const fetchCall = mockFetch.mock.calls[0][1];
    expect(fetchCall?.headers).not.toHaveProperty("Authorization");
    expect(fetchCall?.credentials).toBe("include");
  });
});
