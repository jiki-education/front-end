/**
 * Integration tests for chat API JWT authentication
 */

import { sendChatMessage, ChatApiError, ChatTokenExpiredError } from "@/components/coding-exercise/lib/chatApi";
import { getChatApiUrl } from "@/lib/api/config";

// Mock dependencies
jest.mock("@/lib/api/config");

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

describe("Chat API JWT Authentication", () => {
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

  const mockChatToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.dozjgNryP4J3jVmNHl0w5N_XgL0n3I9PlFUP0THsR8U";

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetChatApiUrl.mockReturnValue("http://localhost:8787/chat");
  });

  it("should send request with JWT in Authorization header", async () => {
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

    await sendChatMessage(mockPayload, mockCallbacks, mockChatToken);

    // Verify Authorization header is present
    expect(mockFetch).toHaveBeenCalledTimes(1);
    expect(mockFetch).toHaveBeenCalledWith("http://localhost:8787/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${mockChatToken}`
      },
      body: JSON.stringify(mockPayload)
    });
  });

  it("should NOT include credentials: include (no cookies)", async () => {
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

    await sendChatMessage(mockPayload, mockCallbacks, mockChatToken);

    const fetchCall = mockFetch.mock.calls[0][1];
    expect(fetchCall?.credentials).toBeUndefined();
  });

  it("should throw ChatTokenExpiredError on 401 with token_expired", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      headers: {
        get: () => "application/json"
      },
      json: () => ({ error: "token_expired", message: "Token has expired" })
    });

    await expect(sendChatMessage(mockPayload, mockCallbacks, mockChatToken)).rejects.toThrow(ChatTokenExpiredError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should throw ChatApiError on 401 without token_expired error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: "Unauthorized",
      headers: {
        get: () => "application/json"
      },
      json: () => ({ error: "invalid_token", message: "Invalid token" })
    });

    await expect(sendChatMessage(mockPayload, mockCallbacks, mockChatToken)).rejects.toThrow(ChatApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should handle non-401 errors normally", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      headers: {
        get: () => "application/json"
      },
      json: () => ({ error: "server_error", message: "Server error" })
    });

    await expect(sendChatMessage(mockPayload, mockCallbacks, mockChatToken)).rejects.toThrow(ChatApiError);
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("should call onComplete with response text on success", async () => {
    const mockBody = {
      getReader: () => ({
        read: jest
          .fn()
          .mockResolvedValueOnce({ done: false, value: new TextEncoder().encode("Hello world") })
          .mockResolvedValueOnce({ done: true })
      })
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      body: mockBody
    });

    await sendChatMessage(mockPayload, mockCallbacks, mockChatToken);

    expect(mockCallbacks.onComplete).toHaveBeenCalledWith("Hello world", null);
  });
});
