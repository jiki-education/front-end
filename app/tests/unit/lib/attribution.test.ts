import { captureAttribution, readAttribution } from "@/lib/attribution";

const STORAGE_KEY = "jiki_attribution";

// jsdom doesn't let you reassign window.location, but it does honour
// history.pushState — use that to drive pathname + search.
function setLocation(url: string) {
  const parsed = new URL(url);
  window.history.pushState({}, "", parsed.pathname + parsed.search);
}

function setReferrer(referrer: string) {
  Object.defineProperty(document, "referrer", {
    value: referrer,
    configurable: true
  });
}

describe("attribution", () => {
  beforeEach(() => {
    window.localStorage.clear();
    setReferrer("");
  });

  describe("captureAttribution", () => {
    it("stores referrer, landing_path, and UTM params on first call", () => {
      setReferrer("https://twitter.com/some/post");
      setLocation("https://jiki.io/landing?utm_source=twitter&utm_medium=social&utm_campaign=launch&extra=x");

      captureAttribution();

      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
      expect(stored).toMatchObject({
        referrer: "https://twitter.com/some/post",
        landing_path: "/landing",
        utm_source: "twitter",
        utm_medium: "social",
        utm_campaign: "launch"
      });
      expect(typeof stored.captured_at).toBe("string");
    });

    it("stores pathname only — never the full URL with query string", () => {
      setLocation("https://jiki.io/auth/confirm?confirmation_token=SECRET123");

      captureAttribution();

      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
      expect(stored.landing_path).toBe("/auth/confirm");
      expect(JSON.stringify(stored)).not.toContain("SECRET123");
    });

    it("first-touch wins — does not overwrite on subsequent calls", () => {
      setReferrer("https://twitter.com/a");
      setLocation("https://jiki.io/?utm_source=twitter");
      captureAttribution();
      const first = window.localStorage.getItem(STORAGE_KEY);

      setReferrer("https://google.com/");
      setLocation("https://jiki.io/?utm_source=google");
      captureAttribution();

      expect(window.localStorage.getItem(STORAGE_KEY)).toBe(first);
    });

    it("stores null for missing referrer / UTM params", () => {
      setLocation("https://jiki.io/");

      captureAttribution();

      const stored = JSON.parse(window.localStorage.getItem(STORAGE_KEY)!);
      expect(stored).toMatchObject({
        referrer: null,
        landing_path: "/",
        utm_source: null,
        utm_medium: null,
        utm_campaign: null
      });
    });

    it("does not throw if localStorage.setItem throws (private mode / quota)", () => {
      const setItem = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new Error("QuotaExceeded");
      });

      expect(() => captureAttribution()).not.toThrow();

      setItem.mockRestore();
    });
  });

  describe("readAttribution", () => {
    it("returns the parsed attribution object when present", () => {
      const payload = {
        referrer: "https://x.com",
        landing_path: "/",
        utm_source: "x",
        utm_medium: null,
        utm_campaign: null,
        captured_at: "2026-01-01T00:00:00.000Z"
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

      expect(readAttribution()).toEqual(payload);
    });

    it("returns null when nothing has been captured", () => {
      expect(readAttribution()).toBeNull();
    });

    it("returns null when stored value is malformed JSON", () => {
      window.localStorage.setItem(STORAGE_KEY, "not-json{");

      expect(readAttribution()).toBeNull();
    });
  });
});
