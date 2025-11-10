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

    const result = await verifyJWT(token, testSecret);
    expect(result.userId).toBe("user-123");
    expect(result.error).toBeUndefined();
  });

  it("should reject invalid JWT", async () => {
    const token = "invalid.jwt.token";
    const result = await verifyJWT(token, testSecret);
    expect(result.userId).toBeNull();
    expect(result.error).toBe("invalid");
  });

  it("should reject expired JWT", async () => {
    const secret = new TextEncoder().encode(testSecret);
    const token = await new SignJWT({ sub: "user-123" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("-1h") // Expired 1 hour ago
      .sign(secret);

    const result = await verifyJWT(token, testSecret);
    expect(result.userId).toBeNull();
    expect(result.error).toBe("expired");
  });

  it("should reject JWT with wrong secret", async () => {
    const secret = new TextEncoder().encode("wrong-secret");
    const token = await new SignJWT({ sub: "user-123" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);

    const result = await verifyJWT(token, testSecret);
    expect(result.userId).toBeNull();
    expect(result.error).toBe("invalid");
  });

  it("should reject JWT without sub claim", async () => {
    const secret = new TextEncoder().encode(testSecret);
    const token = await new SignJWT({}).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1h").sign(secret);

    const result = await verifyJWT(token, testSecret);
    expect(result.userId).toBeNull();
    expect(result.error).toBe("missing_claim");
  });

  it("should handle JWT with non-string sub claim", async () => {
    const secret = new TextEncoder().encode(testSecret);
    const token = await new SignJWT({ sub: 123 } as any)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);

    const result = await verifyJWT(token, testSecret);
    expect(result.userId).toBeNull();
    expect(result.error).toBe("missing_claim");
  });

  it("should detect token that is barely expired", async () => {
    const secret = new TextEncoder().encode(testSecret);
    // Create token that expired 1 second ago
    const expiredTime = Math.floor(Date.now() / 1000) - 1;
    const token = await new SignJWT({ sub: "user-123", exp: expiredTime })
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    const result = await verifyJWT(token, testSecret);
    expect(result.userId).toBeNull();
    expect(result.error).toBe("expired");
  });

  it("should accept token that expires in the future", async () => {
    const secret = new TextEncoder().encode(testSecret);
    // Create token that expires 1 hour in the future
    const futureTime = Math.floor(Date.now() / 1000) + 3600;
    const token = await new SignJWT({ sub: "user-123", exp: futureTime })
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    const result = await verifyJWT(token, testSecret);
    expect(result.userId).toBe("user-123");
    expect(result.error).toBeUndefined();
  });
});
