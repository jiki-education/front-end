import { jwtVerify } from "jose";

/**
 * Verifies a JWT token and returns the user ID if valid.
 * Uses the Devise JWT secret from Rails to validate tokens.
 *
 * @param token - The JWT token to verify
 * @param secret - The shared secret key from Rails
 * @returns The user ID (sub claim) if valid, null otherwise
 */
export async function verifyJWT(token: string, secret: string): Promise<string | null> {
  try {
    const secretKey = new TextEncoder().encode(secret);
    const { payload } = await jwtVerify(token, secretKey, {
      algorithms: ["HS256"]
    });

    // Check expiration (devise-jwt includes exp claim)
    if (payload.exp !== undefined && payload.exp < Math.floor(Date.now() / 1000)) {
      console.log("Token expired");
      return null;
    }

    // User ID is in the 'sub' claim
    if (typeof payload.sub !== "string") {
      console.log("Invalid token: missing or invalid sub claim");
      return null;
    }

    return payload.sub;
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}
