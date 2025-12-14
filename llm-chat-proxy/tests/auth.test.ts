import { describe, it, expect, vi } from "vitest";
import { verifyJWT } from "../src/auth";
import { SignJWT } from "jose";
import app from "../src/index";

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

describe("Chat Endpoint Authentication", () => {
  const testSecret = "test-secret-key-for-jwt-verification";

  async function createValidToken(userId: string = "user-123"): Promise<string> {
    const secret = new TextEncoder().encode(testSecret);
    return await new SignJWT({ sub: userId }).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1h").sign(secret);
  }

  async function createExpiredToken(): Promise<string> {
    const secret = new TextEncoder().encode(testSecret);
    return await new SignJWT({ sub: "user-123" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("-1h")
      .sign(secret);
  }

  const mockEnv = {
    DEVISE_JWT_SECRET_KEY: testSecret,
    GOOGLE_GEMINI_API_KEY: "test-gemini-key",
    LLM_SIGNATURE_SECRET: "test-signature-secret"
  };

  it("should accept valid JWT from Authorization header", async () => {
    const token = await createValidToken();

    const response = await app.request(
      "/chat",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Origin: "https://jiki.io"
        },
        body: JSON.stringify({
          exerciseSlug: "basic-movement",
          code: "test",
          question: "test",
          language: "jikiscript"
        })
      },
      mockEnv
    );

    // Should not return 401 (authentication should succeed)
    // Note: Will fail later due to missing Gemini integration, but auth should pass
    expect(response.status).not.toBe(401);
  });

  it("should accept valid JWT from cookie", async () => {
    const token = await createValidToken();

    const response = await app.request(
      "/chat",
      {
        method: "POST",
        headers: {
          Cookie: `jiki_access_token=${token}`,
          "Content-Type": "application/json",
          Origin: "https://jiki.io"
        },
        body: JSON.stringify({
          exerciseSlug: "basic-movement",
          code: "test",
          question: "test",
          language: "jikiscript"
        })
      },
      mockEnv
    );

    // Should not return 401 (authentication should succeed)
    expect(response.status).not.toBe(401);
  });

  it("should prioritize Authorization header over cookie", async () => {
    const headerToken = await createValidToken("user-from-header");
    const cookieToken = await createValidToken("user-from-cookie");

    const response = await app.request(
      "/chat",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${headerToken}`,
          Cookie: `jiki_access_token=${cookieToken}`,
          "Content-Type": "application/json",
          Origin: "https://jiki.io"
        },
        body: JSON.stringify({
          exerciseSlug: "basic-movement",
          code: "test",
          question: "test",
          language: "jikiscript"
        })
      },
      mockEnv
    );

    // Should not return 401 (header token should be used)
    expect(response.status).not.toBe(401);
  });

  it("should return 401 when no token provided", async () => {
    const response = await app.request(
      "/chat",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Origin: "https://jiki.io"
        },
        body: JSON.stringify({
          exerciseSlug: "basic-movement",
          code: "test",
          question: "test",
          language: "jikiscript"
        })
      },
      mockEnv
    );

    expect(response.status).toBe(401);
    const data = (await response.json()) as { error: string };
    expect(data.error).toBe("Missing authorization token");
  });

  it("should return 401 with expired token in Authorization header", async () => {
    const token = await createExpiredToken();

    const response = await app.request(
      "/chat",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          Origin: "https://jiki.io"
        },
        body: JSON.stringify({
          exerciseSlug: "basic-movement",
          code: "test",
          question: "test",
          language: "jikiscript"
        })
      },
      mockEnv
    );

    expect(response.status).toBe(401);
    const data = (await response.json()) as { error: string };
    expect(data.error).toBe("token_expired");
  });

  it("should return 401 with expired token in cookie", async () => {
    const token = await createExpiredToken();

    const response = await app.request(
      "/chat",
      {
        method: "POST",
        headers: {
          Cookie: `jiki_access_token=${token}`,
          "Content-Type": "application/json",
          Origin: "https://jiki.io"
        },
        body: JSON.stringify({
          exerciseSlug: "basic-movement",
          code: "test",
          question: "test",
          language: "jikiscript"
        })
      },
      mockEnv
    );

    expect(response.status).toBe(401);
    const data = (await response.json()) as { error: string };
    expect(data.error).toBe("token_expired");
  });

  it("should return 401 with invalid token in cookie", async () => {
    const response = await app.request(
      "/chat",
      {
        method: "POST",
        headers: {
          Cookie: `jiki_access_token=invalid.token.here`,
          "Content-Type": "application/json",
          Origin: "https://jiki.io"
        },
        body: JSON.stringify({
          exerciseSlug: "basic-movement",
          code: "test",
          question: "test",
          language: "jikiscript"
        })
      },
      mockEnv
    );

    expect(response.status).toBe(401);
    const data = (await response.json()) as { error: string };
    expect(data.error).toBe("invalid_token");
  });
});
