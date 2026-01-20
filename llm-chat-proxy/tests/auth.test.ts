import { describe, it, expect, vi } from "vitest";
import { verifyJWT } from "../src/auth";
import { SignJWT } from "jose";
import app from "../src/index";

describe("JWT Authentication", () => {
  const testSecret = "test-secret-key-for-jwt-verification";

  it("should verify valid JWT with exercise_slug", async () => {
    const secret = new TextEncoder().encode(testSecret);
    const token = await new SignJWT({ sub: "user-123", exercise_slug: "maze-solve-basic" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);

    const result = await verifyJWT(token, testSecret);
    expect(result.userId).toBe("user-123");
    expect(result.exerciseSlug).toBe("maze-solve-basic");
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
    const token = await new SignJWT({ sub: "user-123", exercise_slug: "maze-solve-basic" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("-1h") // Expired 1 hour ago
      .sign(secret);

    const result = await verifyJWT(token, testSecret);
    expect(result.userId).toBeNull();
    expect(result.error).toBe("expired");
  });

  it("should reject JWT with wrong secret", async () => {
    const secret = new TextEncoder().encode("wrong-secret");
    const token = await new SignJWT({ sub: "user-123", exercise_slug: "maze-solve-basic" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);

    const result = await verifyJWT(token, testSecret);
    expect(result.userId).toBeNull();
    expect(result.error).toBe("invalid");
  });

  it("should reject JWT without exercise_slug claim", async () => {
    const secret = new TextEncoder().encode(testSecret);
    const token = await new SignJWT({ sub: "user-123" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);

    const result = await verifyJWT(token, testSecret);
    expect(result.userId).toBeNull();
    expect(result.error).toBe("missing_claim");
  });

  it("should reject JWT without sub claim", async () => {
    const secret = new TextEncoder().encode(testSecret);
    const token = await new SignJWT({}).setProtectedHeader({ alg: "HS256" }).setExpirationTime("1h").sign(secret);

    const result = await verifyJWT(token, testSecret);
    expect(result.userId).toBeNull();
    expect(result.error).toBe("missing_claim");
  });

  it("should accept JWT with numeric sub claim (Rails compatibility)", async () => {
    const secret = new TextEncoder().encode(testSecret);
    const token = await new SignJWT({ sub: 123, exercise_slug: "maze-solve-basic" } as any)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);

    const result = await verifyJWT(token, testSecret);
    expect(result.userId).toBe("123");
    expect(result.exerciseSlug).toBe("maze-solve-basic");
    expect(result.error).toBeUndefined();
  });

  it("should reject JWT with invalid sub claim type", async () => {
    const secret = new TextEncoder().encode(testSecret);
    const token = await new SignJWT({ sub: { id: 123 }, exercise_slug: "maze-solve-basic" } as any)
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
    const token = await new SignJWT({ sub: "user-123", exercise_slug: "maze-solve-basic", exp: expiredTime })
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
    const token = await new SignJWT({ sub: "user-123", exercise_slug: "maze-solve-basic", exp: futureTime })
      .setProtectedHeader({ alg: "HS256" })
      .sign(secret);

    const result = await verifyJWT(token, testSecret);
    expect(result.userId).toBe("user-123");
    expect(result.exerciseSlug).toBe("maze-solve-basic");
    expect(result.error).toBeUndefined();
  });
});

describe("Chat Endpoint Authentication", () => {
  const testSecret = "test-secret-key-for-jwt-verification";

  async function createValidToken(
    userId: string = "user-123",
    exerciseSlug: string = "maze-solve-basic"
  ): Promise<string> {
    const secret = new TextEncoder().encode(testSecret);
    return await new SignJWT({ sub: userId, exercise_slug: exerciseSlug })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
      .sign(secret);
  }

  async function createExpiredToken(): Promise<string> {
    const secret = new TextEncoder().encode(testSecret);
    return await new SignJWT({ sub: "user-123", exercise_slug: "maze-solve-basic" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("-1h")
      .sign(secret);
  }

  async function createTokenWithoutExerciseSlug(): Promise<string> {
    const secret = new TextEncoder().encode(testSecret);
    return await new SignJWT({ sub: "user-123" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("1h")
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
          exerciseSlug: "maze-solve-basic",
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

  it("should return 403 when exerciseSlug does not match token", async () => {
    const token = await createValidToken("user-123", "different-exercise");

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
          exerciseSlug: "maze-solve-basic",
          code: "test",
          question: "test",
          language: "jikiscript"
        })
      },
      mockEnv
    );

    expect(response.status).toBe(403);
    const data = (await response.json()) as { error: string };
    expect(data.error).toBe("exercise_mismatch");
  });

  it("should return 401 when token is missing exercise_slug claim", async () => {
    const token = await createTokenWithoutExerciseSlug();

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
          exerciseSlug: "maze-solve-basic",
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
          exerciseSlug: "maze-solve-basic",
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
          exerciseSlug: "maze-solve-basic",
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
});
