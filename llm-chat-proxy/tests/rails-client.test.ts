import { describe, it, expect, vi, beforeEach } from "vitest";
import { saveConversationToRails } from "../src/rails-client";

// Mock fetch
global.fetch = vi.fn();

describe("Rails Client", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should send conversation data to Rails", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 201
    });

    await saveConversationToRails({
      userId: "user-123",
      exerciseSlug: "basic-movement",
      userMessage: "How do I solve this?",
      assistantMessage: "Try breaking it down...",
      railsApiUrl: "http://localhost:3061",
      internalSecret: "test-secret"
    });

    expect(global.fetch).toHaveBeenCalledOnce();
    const [url, options] = (global.fetch as any).mock.calls[0];

    expect(url).toBe("http://localhost:3061/api/internal/llm/conversations");
    expect(options.method).toBe("POST");
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(options.headers["X-Internal-Secret"]).toBe("test-secret");

    const body = JSON.parse(options.body);
    expect(body.user_id).toBe("user-123");
    expect(body.exercise_slug).toBe("basic-movement");
    expect(body.messages).toHaveLength(2);
    expect(body.messages[0].role).toBe("user");
    expect(body.messages[0].content).toBe("How do I solve this?");
    expect(body.messages[1].role).toBe("assistant");
    expect(body.messages[1].content).toBe("Try breaking it down...");
  });

  it("should include token estimates", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 201
    });

    await saveConversationToRails({
      userId: "user-123",
      exerciseSlug: "basic-movement",
      userMessage: "Test message",
      assistantMessage: "Test response",
      railsApiUrl: "http://localhost:3061",
      internalSecret: "test-secret"
    });

    const [, options] = (global.fetch as any).mock.calls[0];
    const body = JSON.parse(options.body);

    expect(body.messages[0].tokens).toBeGreaterThan(0);
    expect(body.messages[1].tokens).toBeGreaterThan(0);
  });

  it("should not throw on failed request", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      statusText: "Internal Server Error"
    });

    // Should not throw
    await expect(
      saveConversationToRails({
        userId: "user-123",
        exerciseSlug: "basic-movement",
        userMessage: "Test",
        assistantMessage: "Test",
        railsApiUrl: "http://localhost:3061",
        internalSecret: "test-secret"
      })
    ).resolves.toBeUndefined();
  });

  it("should not throw on network error", async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error("Network error"));

    // Should not throw
    await expect(
      saveConversationToRails({
        userId: "user-123",
        exerciseSlug: "basic-movement",
        userMessage: "Test",
        assistantMessage: "Test",
        railsApiUrl: "http://localhost:3061",
        internalSecret: "test-secret"
      })
    ).resolves.toBeUndefined();
  });

  it("should include timestamp", async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      status: 201
    });

    await saveConversationToRails({
      userId: "user-123",
      exerciseSlug: "basic-movement",
      userMessage: "Test",
      assistantMessage: "Test",
      railsApiUrl: "http://localhost:3061",
      internalSecret: "test-secret"
    });

    const [, options] = (global.fetch as any).mock.calls[0];
    const body = JSON.parse(options.body);

    expect(body.timestamp).toBeDefined();
    expect(new Date(body.timestamp).getTime()).toBeGreaterThan(0);
  });
});
