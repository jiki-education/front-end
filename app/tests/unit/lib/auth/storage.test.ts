/**
 * Unit tests for auth storage utilities - JWT parsing functions
 */

import { parseJwtPayload, getTokenExpiry } from "@/lib/auth/storage";

describe("Auth Storage - JWT Utilities", () => {
  describe("JWT Parsing", () => {
    it("should parse JWT payload correctly", () => {
      const token = createJWTWithPayload({ sub: "123", exp: 1699999999 });

      const payload = parseJwtPayload(token);

      expect(payload).toEqual({ sub: "123", exp: 1699999999 });
    });

    it("should extract expiry from JWT", () => {
      const expTimestamp = 1699999999;
      const token = createJWTWithPayload({ exp: expTimestamp });

      const expiry = getTokenExpiry(token);

      expect(expiry).toBe(expTimestamp * 1000); // Convert to milliseconds
    });

    it("should handle malformed JWT gracefully", () => {
      const malformedToken = "not.a.valid.jwt";

      const payload = parseJwtPayload(malformedToken);
      const expiry = getTokenExpiry(malformedToken);

      expect(payload).toBeNull();
      expect(expiry).toBeNull();
    });

    it("should handle JWT with missing payload", () => {
      const invalidToken = "header..signature";

      const payload = parseJwtPayload(invalidToken);

      expect(payload).toBeNull();
    });

    it("should handle JWT with invalid base64 payload", () => {
      const invalidToken = "header.invalid-base64.signature";

      const payload = parseJwtPayload(invalidToken);

      expect(payload).toBeNull();
    });

    it("should return null for empty token", () => {
      const payload = parseJwtPayload("");
      const expiry = getTokenExpiry("");

      expect(payload).toBeNull();
      expect(expiry).toBeNull();
    });

    it("should handle token with missing exp claim", () => {
      const token = createJWTWithPayload({ sub: "123" });

      const expiry = getTokenExpiry(token);

      expect(expiry).toBeNull();
    });
  });
});

// Helper function for creating test JWTs
function createJWTWithPayload(payload: any): string {
  const header = { typ: "JWT", alg: "HS256" };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  const signature = "test_signature";

  return `${encodedHeader}.${encodedPayload}.${signature}`;
}
