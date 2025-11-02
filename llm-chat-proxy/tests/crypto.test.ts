import { describe, it, expect } from "vitest";
import { generateSignature, createSignaturePayload } from "../src/crypto";

describe("Crypto - HMAC Signature Generation", () => {
  const testSecret = "test-secret-key-for-hmac-signatures";

  describe("generateSignature", () => {
    it("should generate 64-character hex signature for SHA-256", async () => {
      const signature = await generateSignature("test payload", testSecret);

      expect(signature).toMatch(/^[0-9a-f]{64}$/);
      expect(signature.length).toBe(64);
    });

    it("should be deterministic - same input produces same signature", async () => {
      const payload = "userId:exerciseSlug:message:timestamp";

      const signature1 = await generateSignature(payload, testSecret);
      const signature2 = await generateSignature(payload, testSecret);

      expect(signature1).toBe(signature2);
    });

    it("should produce different signatures for different payloads", async () => {
      const signature1 = await generateSignature("payload1", testSecret);
      const signature2 = await generateSignature("payload2", testSecret);

      expect(signature1).not.toBe(signature2);
    });

    it("should produce different signatures for different secrets", async () => {
      const payload = "same payload";

      const signature1 = await generateSignature(payload, "secret1");
      const signature2 = await generateSignature(payload, "secret2");

      expect(signature1).not.toBe(signature2);
    });

    it("should handle empty string payload", async () => {
      const signature = await generateSignature("", testSecret);

      expect(signature).toMatch(/^[0-9a-f]{64}$/);
      expect(signature.length).toBe(64);
    });

    it("should handle very long messages", async () => {
      const longMessage = "A".repeat(100000); // 100KB message
      const signature = await generateSignature(longMessage, testSecret);

      expect(signature).toMatch(/^[0-9a-f]{64}$/);
      expect(signature.length).toBe(64);
    });

    it("should handle special characters without breaking", async () => {
      const specialChars = "Special: \n\r\t:colons:newlines\n\uD83D\uDE00emoji\u0000null";
      const signature = await generateSignature(specialChars, testSecret);

      expect(signature).toMatch(/^[0-9a-f]{64}$/);
      expect(signature.length).toBe(64);
    });

    it("should handle unicode characters correctly", async () => {
      const unicode = "Hello 世界 🌍 Café ñ";
      const signature = await generateSignature(unicode, testSecret);

      expect(signature).toMatch(/^[0-9a-f]{64}$/);
      expect(signature.length).toBe(64);
    });

    it("should produce lowercase hex output", async () => {
      const signature = await generateSignature("test", testSecret);

      expect(signature).toBe(signature.toLowerCase());
      expect(signature).not.toMatch(/[A-F]/);
    });

    it("should match expected signature for known test vector", async () => {
      // This test ensures the signature format matches what Rails will verify
      // If this test fails after a change, Rails verification WILL break
      const payload = "123:hello-world:This is a test response.:2024-01-01T00:00:00Z";
      const secret = "test-secret";

      const signature = await generateSignature(payload, secret);

      // Expected signature generated using the same algorithm
      // This was pre-computed to lock in the format
      // Note: Update this expected value if you intentionally change the signature algorithm
      // You MUST also update Rails to match
      expect(signature).toBe("dc0f6642af64302dd5934467b09614af249154c5546b7e605540064b0c8832bc");
    });
  });

  describe("createSignaturePayload", () => {
    it("should format payload with colon separators", () => {
      const payload = createSignaturePayload("user123", "exercise-slug", "Assistant response", "2024-01-01T12:00:00Z");

      expect(payload).toBe("user123:exercise-slug:Assistant response:2024-01-01T12:00:00Z");
    });

    it("should handle empty strings in payload components", () => {
      const payload = createSignaturePayload("", "", "", "");

      expect(payload).toBe(":::");
    });

    it("should preserve colons in message content", () => {
      const message = "Code example: const x: string = 'test';";
      const payload = createSignaturePayload("user123", "exercise", message, "2024-01-01T12:00:00Z");

      expect(payload).toBe(`user123:exercise:${message}:2024-01-01T12:00:00Z`);
    });

    it("should preserve newlines in message content", () => {
      const message = "Line 1\nLine 2\nLine 3";
      const payload = createSignaturePayload("user123", "exercise", message, "2024-01-01T12:00:00Z");

      expect(payload).toBe(`user123:exercise:${message}:2024-01-01T12:00:00Z`);
    });

    it("should handle very long messages without truncation", () => {
      const longMessage = "A".repeat(50000);
      const payload = createSignaturePayload("user123", "exercise", longMessage, "2024-01-01T12:00:00Z");

      expect(payload).toContain(longMessage);
      expect(payload.length).toBe("user123".length + 1 + "exercise".length + 1 + longMessage.length + 1 + "2024-01-01T12:00:00Z".length);
    });

    it("should handle unicode in all components", () => {
      const payload = createSignaturePayload("用户123", "练习-slug", "响应 🎉", "2024-01-01T12:00:00Z");

      expect(payload).toBe("用户123:练习-slug:响应 🎉:2024-01-01T12:00:00Z");
    });
  });

  describe("Integration - Signature + Payload", () => {
    it("should generate consistent signatures for complete payloads", async () => {
      const userId = "user-abc-123";
      const exerciseSlug = "hello-world";
      const message = "Here's a hint: check your loop condition.";
      const timestamp = "2024-01-15T10:30:00.000Z";

      const payload = createSignaturePayload(userId, exerciseSlug, message, timestamp);
      const signature1 = await generateSignature(payload, testSecret);
      const signature2 = await generateSignature(payload, testSecret);

      expect(signature1).toBe(signature2);
      expect(signature1).toMatch(/^[0-9a-f]{64}$/);
    });

    it("should produce different signatures when any component changes", async () => {
      const basePayload = createSignaturePayload("user123", "exercise", "message", "2024-01-01T00:00:00Z");
      const changedUserId = createSignaturePayload("user456", "exercise", "message", "2024-01-01T00:00:00Z");
      const changedExercise = createSignaturePayload("user123", "different", "message", "2024-01-01T00:00:00Z");
      const changedMessage = createSignaturePayload("user123", "exercise", "different", "2024-01-01T00:00:00Z");
      const changedTimestamp = createSignaturePayload("user123", "exercise", "message", "2024-01-01T00:00:01Z");

      const baseSig = await generateSignature(basePayload, testSecret);
      const userIdSig = await generateSignature(changedUserId, testSecret);
      const exerciseSig = await generateSignature(changedExercise, testSecret);
      const messageSig = await generateSignature(changedMessage, testSecret);
      const timestampSig = await generateSignature(changedTimestamp, testSecret);

      expect(userIdSig).not.toBe(baseSig);
      expect(exerciseSig).not.toBe(baseSig);
      expect(messageSig).not.toBe(baseSig);
      expect(timestampSig).not.toBe(baseSig);
    });
  });
});
