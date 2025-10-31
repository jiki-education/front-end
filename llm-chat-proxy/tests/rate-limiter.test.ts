import { describe, it, expect } from "vitest";
import { checkRateLimit } from "../src/rate-limiter";

describe("Rate Limiter", () => {
  it("should allow first request", async () => {
    const allowed = await checkRateLimit("user-first-request");
    expect(allowed).toBe(true);
  });

  it("should allow multiple requests under limit", async () => {
    // Use a unique user ID to avoid collision with other tests
    const userId = "user-multiple-requests";
    for (let i = 0; i < 50; i++) {
      const allowed = await checkRateLimit(userId);
      expect(allowed).toBe(true);
    }
  });

  it("should block requests over limit", async () => {
    // Use a unique user ID to avoid collision with other tests
    const userId = "user-block-limit";
    // Make 50 requests (at limit)
    for (let i = 0; i < 50; i++) {
      await checkRateLimit(userId);
    }

    // 51st request should be blocked
    const allowed = await checkRateLimit(userId);
    expect(allowed).toBe(false);
  });

  it("should track different users separately", async () => {
    // Use unique user IDs to avoid collision with other tests
    const userId1 = "user-separate-1";
    const userId2 = "user-separate-2";

    // User 1 hits limit
    for (let i = 0; i < 50; i++) {
      await checkRateLimit(userId1);
    }

    // User 1 should be blocked
    const user1Allowed = await checkRateLimit(userId1);
    expect(user1Allowed).toBe(false);

    // User 2 should still be allowed
    const user2Allowed = await checkRateLimit(userId2);
    expect(user2Allowed).toBe(true);
  });

  it("should handle empty user ID", async () => {
    const allowed = await checkRateLimit("");
    expect(allowed).toBe(true);
  });

  it("should increment count for same user", async () => {
    // Use a unique user ID
    const userId = "user-increment-test";
    await checkRateLimit(userId);
    await checkRateLimit(userId);
    const result = await checkRateLimit(userId);
    expect(result).toBe(true);
  });
});
