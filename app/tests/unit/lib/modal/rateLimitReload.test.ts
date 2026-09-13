import { AUTO_RELOAD_COOLDOWN_MS, hasRecentlyAutoReloaded, recordAutoReload } from "@/lib/modal/modals/rateLimitReload";

const NOW = 1_700_000_000_000;

describe("rateLimitReload", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    jest.restoreAllMocks();
  });

  it("reports no reload before one has happened", () => {
    expect(hasRecentlyAutoReloaded(NOW)).toBe(false);
  });

  it("reports a reload that just happened", () => {
    recordAutoReload(NOW);

    expect(hasRecentlyAutoReloaded(NOW)).toBe(true);
  });

  it("still reports one just inside the cooldown", () => {
    recordAutoReload(NOW);

    expect(hasRecentlyAutoReloaded(NOW + AUTO_RELOAD_COOLDOWN_MS - 1)).toBe(true);
  });

  // The point of the window: a tab left open for hours gets its automatic retry
  // back, because a limit hit that long after the last one is a new incident.
  it("lets the automatic retry return once the cooldown has passed", () => {
    recordAutoReload(NOW);

    expect(hasRecentlyAutoReloaded(NOW + AUTO_RELOAD_COOLDOWN_MS)).toBe(false);
  });

  // A clock correction must not hand out an unlimited supply of retries.
  it("treats a reload stamped in the future as recent", () => {
    recordAutoReload(NOW + 60_000);

    expect(hasRecentlyAutoReloaded(NOW)).toBe(true);
  });

  it("ignores a value it cannot read as a time", () => {
    window.sessionStorage.setItem("jiki-rate-limit-auto-reloaded-at", "not-a-time");

    expect(hasRecentlyAutoReloaded(NOW)).toBe(false);
  });

  // Storage throws outright in some privacy modes. Failing to answer is not an
  // option here: the modal has to render either way.
  it("treats unreadable storage as a first attempt", () => {
    jest.spyOn(window.Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("SecurityError");
    });

    expect(hasRecentlyAutoReloaded(NOW)).toBe(false);
  });

  it("survives storage it cannot write to", () => {
    jest.spyOn(window.Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });

    expect(() => recordAutoReload(NOW)).not.toThrow();
  });
});
