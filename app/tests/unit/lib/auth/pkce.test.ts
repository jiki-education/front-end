/**
 * Unit tests for PKCE utilities
 */

import { generateCodeVerifier, generateCodeChallenge } from "@/lib/auth/pkce";

describe("pkce", () => {
  describe("generateCodeVerifier", () => {
    it("generates a 43 character base64url string", () => {
      const verifier = generateCodeVerifier();

      expect(verifier).toHaveLength(43);
      expect(verifier).toMatch(/^[A-Za-z0-9\-_]+$/);
    });

    it("generates a different value each time", () => {
      const verifiers = new Set(Array.from({ length: 10 }, () => generateCodeVerifier()));

      expect(verifiers.size).toBe(10);
    });
  });

  describe("generateCodeChallenge", () => {
    it("derives the S256 challenge from a verifier", () => {
      // Known value from RFC 7636 Appendix B
      const verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";

      const challenge = generateCodeChallenge(verifier);

      expect(challenge).toBe("E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM");
    });

    it("produces base64url output without padding", () => {
      const challenge = generateCodeChallenge(generateCodeVerifier());

      expect(challenge).toMatch(/^[A-Za-z0-9\-_]+$/);
      expect(challenge).not.toContain("=");
    });

    it("produces the same challenge for the same verifier", () => {
      const verifier = generateCodeVerifier();

      expect(generateCodeChallenge(verifier)).toBe(generateCodeChallenge(verifier));
    });
  });
});
