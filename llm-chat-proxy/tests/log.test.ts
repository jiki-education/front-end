import { describe, it, expect, vi, afterEach } from "vitest";

// isDev is resolved from process.env.NODE_ENV at module load, so each variant is
// exercised by setting the env and re-importing the module in isolation.
async function loadLog(nodeEnv: string | undefined) {
  vi.resetModules();
  const prev = process.env.NODE_ENV;
  if (nodeEnv === undefined) {
    delete process.env.NODE_ENV;
  } else {
    process.env.NODE_ENV = nodeEnv;
  }
  const mod = await import("../src/log");
  process.env.NODE_ENV = prev;
  return mod;
}

describe("debugLog", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("logs in development", async () => {
    const { debugLog, isDev } = await loadLog("development");
    expect(isDev).toBe(true);
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    debugLog("hello", 123);
    expect(spy).toHaveBeenCalledWith("hello", 123);
  });

  it("is silent in production", async () => {
    const { debugLog, isDev } = await loadLog(undefined);
    expect(isDev).toBe(false);
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    debugLog("should not appear");
    expect(spy).not.toHaveBeenCalled();
  });

  it("is silent under other envs (e.g. test)", async () => {
    const { debugLog, isDev } = await loadLog("test");
    expect(isDev).toBe(false);
    const spy = vi.spyOn(console, "log").mockImplementation(() => {});
    debugLog("should not appear");
    expect(spy).not.toHaveBeenCalled();
  });
});
