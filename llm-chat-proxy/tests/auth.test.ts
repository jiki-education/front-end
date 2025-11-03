import { describe, it, expect } from "vitest";
import { verifyJWT } from "../src/auth";
import { SignJWT } from "jose";

describe("JWT Authentication", () => {
  const testSecret = "test-secret-key-for-jwt-verification";

  it("should verify valid JWT", async () => {
    // Create a valid test JWT
    const secret = new TextEncoder().encode(testSecret);
    const token = await new SignJWT({ sub: "user-123" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);

    const userId = await verifyJWT(token, testSecret);
    expect(userId).toBe("user-123");
  });

  it("should reject invalid JWT", async () => {
    const token = "invalid.jwt.token";
    const userId = await verifyJWT(token, testSecret);
    expect(userId).toBeNull();
  });

  it("should reject expired JWT", async () => {
    const secret = new TextEncoder().encode(testSecret);
    const token = await new SignJWT({ sub: "user-123" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("-1h") // Expired 1 hour ago
      .sign(secret);

    const userId = await verifyJWT(token, testSecret);
    expect(userId).toBeNull();
  });

  it("should reject JWT with wrong secret", async () => {
    const secret = new TextEncoder().encode("wrong-secret");
    const token = await new SignJWT({ sub: "user-123" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);

    const userId = await verifyJWT(token, testSecret);
    expect(userId).toBeNull();
  });

  it("should reject JWT without sub claim", async () => {
    const secret = new TextEncoder().encode(testSecret);
    const token = await new SignJWT({}).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1h").sign(secret);

    const userId = await verifyJWT(token, testSecret);
    expect(userId).toBeNull();
  });

  it("should handle JWT with non-string sub claim", async () => {
    const secret = new TextEncoder().encode(testSecret);
    const token = await new SignJWT({ sub: 123 } as any)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);

    const userId = await verifyJWT(token, testSecret);
    expect(userId).toBeNull();
  });
});
