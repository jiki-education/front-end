import { jwtVerify } from "jose";
import { debugLog } from "./log";

export interface JWTResult {
  userId: string | null;
  exerciseSlug?: string;
  error?: "expired" | "invalid" | "missing_claim";
}

/**
 * Verifies a JWT token and returns detailed result information.
 * Uses the Devise JWT secret from Rails to validate tokens.
 *
 * @param token - The JWT token to verify
 * @param secret - The shared secret key from Rails
 * @returns JWTResult with user ID if valid, or error details if invalid
 */
export async function verifyJWT(token: string, secret: string): Promise<JWTResult> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"]
    });

    // User ID is in the 'sub' claim (accept string or number)
    if (typeof payload.sub !== "string" && typeof payload.sub !== "number") {
      debugLog("Invalid token: missing or invalid sub claim");
      return { userId: null, error: "missing_claim" };
    }
    const userId = String(payload.sub);

    // Exercise slug is required for chat tokens
    if (typeof payload.exercise_slug !== "string") {
      debugLog("Invalid token: missing or invalid exercise_slug claim");
      return { userId: null, error: "missing_claim" };
    }

    return { userId, exerciseSlug: payload.exercise_slug };
  } catch (error) {
    // Expired tokens are a routine client condition (the frontend auto-retries),
    // so they are dev-only noise. Genuinely invalid tokens (bad signature,
    // malformed) are unexpected and logged as errors even in production.
    if (error && typeof error === "object" && "code" in error && error.code === "ERR_JWT_EXPIRED") {
      debugLog("Token is expired");
      return { userId: null, error: "expired" };
    }

    console.error("JWT verification failed:", error);
    // All other errors (invalid signature, malformed token, etc.)
    return { userId: null, error: "invalid" };
  }
}
