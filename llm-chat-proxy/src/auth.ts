import { jwtVerify } from "jose";

export interface JWTResult {
  userId: string | null;
  error?: 'expired' | 'invalid' | 'missing_claim';
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

    // User ID is in the 'sub' claim
    if (typeof payload.sub !== "string") {
      console.log("Invalid token: missing or invalid sub claim");
      return { userId: null, error: 'missing_claim' };
    }

    return { userId: payload.sub };
  } catch (error) {
    console.error("JWT verification failed:", error);
    
    // Check if error is specifically due to expiration
    if (error && typeof error === 'object' && 'code' in error) {
      if (error.code === 'ERR_JWT_EXPIRED') {
        console.log("Token is expired");
        return { userId: null, error: 'expired' };
      }
    }
    
    // All other errors (invalid signature, malformed token, etc.)
    return { userId: null, error: 'invalid' };
  }
}
