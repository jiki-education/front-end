/**
 * Unit tests for Exercism OAuth flow helpers
 */

import { isExercismAuthEnabled, buildExercismAuthorizeUrl, consumeExercismCallback } from "@/lib/auth/exercism";
import { generateCodeChallenge } from "@/lib/auth/pkce";

const STATE_KEY = "exercism_oauth_state";
const VERIFIER_KEY = "exercism_oauth_verifier";
const LOCALE_KEY = "exercism_oauth_locale";

describe("exercism", () => {
  beforeEach(() => {
    sessionStorage.clear();
    process.env.NEXT_PUBLIC_EXERCISM_OAUTH_CLIENT_ID = "test-client-id";
    process.env.NEXT_PUBLIC_EXERCISM_URL = "http://local.exercism.io:3020";
  });

  afterEach(() => {
    delete process.env.NEXT_PUBLIC_EXERCISM_OAUTH_CLIENT_ID;
    delete process.env.NEXT_PUBLIC_EXERCISM_URL;
  });

  describe("isExercismAuthEnabled", () => {
    it("returns true when client ID is configured", () => {
      expect(isExercismAuthEnabled()).toBe(true);
    });

    it("returns false when client ID is not configured", () => {
      delete process.env.NEXT_PUBLIC_EXERCISM_OAUTH_CLIENT_ID;

      expect(isExercismAuthEnabled()).toBe(false);
    });
  });

  describe("buildExercismAuthorizeUrl", () => {
    it("throws when client ID is not configured", () => {
      delete process.env.NEXT_PUBLIC_EXERCISM_OAUTH_CLIENT_ID;

      expect(() => buildExercismAuthorizeUrl()).toThrow("Exercism OAuth is not configured");
    });

    it("stashes the verifier and state in sessionStorage", () => {
      buildExercismAuthorizeUrl();

      expect(sessionStorage.getItem(VERIFIER_KEY)).toHaveLength(43);
      expect(sessionStorage.getItem(STATE_KEY)).toHaveLength(43);
      expect(sessionStorage.getItem(VERIFIER_KEY)).not.toBe(sessionStorage.getItem(STATE_KEY));
    });

    it("builds Exercism's authorize URL with the correct params", () => {
      const authorizeUrl = new URL(buildExercismAuthorizeUrl());

      expect(authorizeUrl.origin).toBe("http://local.exercism.io:3020");
      expect(authorizeUrl.pathname).toBe("/oauth/authorize");

      const params = authorizeUrl.searchParams;
      expect(params.get("response_type")).toBe("code");
      expect(params.get("client_id")).toBe("test-client-id");
      expect(params.get("redirect_uri")).toBe(`${window.location.origin}/auth/exercism/callback`);
      expect(params.get("scope")).toBe("profile");
      expect(params.get("state")).toBe(sessionStorage.getItem(STATE_KEY));
      expect(params.get("code_challenge_method")).toBe("S256");
      expect(params.get("code_challenge")).toBe(generateCodeChallenge(sessionStorage.getItem(VERIFIER_KEY)!));
    });

    it("stashes the locale the flow started in", () => {
      buildExercismAuthorizeUrl("bn");

      expect(sessionStorage.getItem(LOCALE_KEY)).toBe("bn");
    });

    it("stashes nothing for the default locale, which is no signal", () => {
      buildExercismAuthorizeUrl("en");

      expect(sessionStorage.getItem(LOCALE_KEY)).toBeNull();
    });

    it("stashes nothing when no locale is passed", () => {
      buildExercismAuthorizeUrl();

      expect(sessionStorage.getItem(LOCALE_KEY)).toBeNull();
    });

    it("clears a locale stashed by an abandoned earlier attempt", () => {
      sessionStorage.setItem(LOCALE_KEY, "bn");

      buildExercismAuthorizeUrl("en");

      expect(sessionStorage.getItem(LOCALE_KEY)).toBeNull();
    });

    it("defaults to exercism.org when no URL is configured", () => {
      delete process.env.NEXT_PUBLIC_EXERCISM_URL;

      expect(buildExercismAuthorizeUrl()).toContain("https://exercism.org/oauth/authorize");
    });
  });

  describe("consumeExercismCallback", () => {
    beforeEach(() => {
      sessionStorage.setItem(STATE_KEY, "stored-state");
      sessionStorage.setItem(VERIFIER_KEY, "stored-verifier");
    });

    it("returns the code and verifier when the state matches", () => {
      const result = consumeExercismCallback("auth-code", "stored-state");

      expect(result).toEqual({ status: "ok", code: "auth-code", codeVerifier: "stored-verifier" });
    });

    it("clears the stashed state and verifier", () => {
      consumeExercismCallback("auth-code", "stored-state");

      expect(sessionStorage.getItem(STATE_KEY)).toBeNull();
      expect(sessionStorage.getItem(VERIFIER_KEY)).toBeNull();
    });

    it("returns the locale the flow started in", () => {
      sessionStorage.setItem(LOCALE_KEY, "bn");

      const result = consumeExercismCallback("auth-code", "stored-state");

      expect(result).toEqual({
        status: "ok",
        code: "auth-code",
        codeVerifier: "stored-verifier",
        seedLocale: "bn"
      });
    });

    it("clears the stashed locale", () => {
      sessionStorage.setItem(LOCALE_KEY, "bn");

      consumeExercismCallback("auth-code", "stored-state");

      expect(sessionStorage.getItem(LOCALE_KEY)).toBeNull();
    });

    it("drops a stashed locale we no longer serve", () => {
      sessionStorage.setItem(LOCALE_KEY, "xx");

      const result = consumeExercismCallback("auth-code", "stored-state");

      expect(result).toEqual({ status: "ok", code: "auth-code", codeVerifier: "stored-verifier" });
    });

    it("returns an error when no code is provided", () => {
      const result = consumeExercismCallback(null, "stored-state");

      expect(result.status).toBe("error");
    });

    it("returns an error when the state does not match", () => {
      const result = consumeExercismCallback("auth-code", "tampered-state");

      expect(result.status).toBe("error");
    });

    it("returns an error when no state was stashed", () => {
      sessionStorage.removeItem(STATE_KEY);

      const result = consumeExercismCallback("auth-code", "stored-state");

      expect(result.status).toBe("error");
    });

    it("returns an error when no verifier was stashed", () => {
      sessionStorage.removeItem(VERIFIER_KEY);

      const result = consumeExercismCallback("auth-code", "stored-state");

      expect(result.status).toBe("error");
    });

    it("cannot be consumed twice", () => {
      const first = consumeExercismCallback("auth-code", "stored-state");
      const second = consumeExercismCallback("auth-code", "stored-state");

      expect(first.status).toBe("ok");
      expect(second.status).toBe("error");
    });
  });
});
