import { describe, it, expect, vi } from "vitest";
import { checkUsage, recordUsage, DAILY_LIMIT, MONTHLY_LIMIT } from "../src/usage";

// Minimal in-memory KV mock supporting the get/put surface usage.ts relies on.
function makeKV(initial: Record<string, string> = {}) {
  const store = new Map<string, string>(Object.entries(initial));
  const kv = {
    get: vi.fn(async (key: string) => store.get(key) ?? null),
    put: vi.fn(async (key: string, value: string) => {
      store.set(key, value);
    }),
    store
  };
  return kv as unknown as KVNamespace & { store: Map<string, string>; put: ReturnType<typeof vi.fn> };
}

const NOW = new Date("2026-06-19T12:00:00Z");
const DAY_KEY = "usage:user-1:day:2026-06-19";
const MONTH_KEY = "usage:user-1:month:2026-06";

describe("checkUsage", () => {
  it("allows a fresh user with zero counts", async () => {
    const kv = makeKV();
    const result = await checkUsage(kv, "user-1", NOW);
    expect(result).toEqual({ allowed: true, counts: { day: 0, month: 0 } });
  });

  it("buckets keys by UTC day and month", async () => {
    const kv = makeKV();
    await checkUsage(kv, "user-1", NOW);
    expect(kv.get).toHaveBeenCalledWith(DAY_KEY);
    expect(kv.get).toHaveBeenCalledWith(MONTH_KEY);
  });

  it("blocks when the daily limit is reached", async () => {
    const kv = makeKV({ [DAY_KEY]: String(DAILY_LIMIT), [MONTH_KEY]: String(DAILY_LIMIT) });
    const result = await checkUsage(kv, "user-1", NOW);
    expect(result.allowed).toBe(false);
    expect(result.scope).toBe("daily");
  });

  it("blocks when the monthly limit is reached, even if the day is fresh", async () => {
    const kv = makeKV({ [DAY_KEY]: "0", [MONTH_KEY]: String(MONTHLY_LIMIT) });
    const result = await checkUsage(kv, "user-1", NOW);
    expect(result.allowed).toBe(false);
    expect(result.scope).toBe("monthly");
  });

  it("prioritises the monthly cap over the daily cap", async () => {
    const kv = makeKV({ [DAY_KEY]: String(DAILY_LIMIT), [MONTH_KEY]: String(MONTHLY_LIMIT) });
    const result = await checkUsage(kv, "user-1", NOW);
    expect(result.scope).toBe("monthly");
  });

  it("allows the message at one below the daily limit", async () => {
    const kv = makeKV({ [DAY_KEY]: String(DAILY_LIMIT - 1), [MONTH_KEY]: "10" });
    const result = await checkUsage(kv, "user-1", NOW);
    expect(result.allowed).toBe(true);
  });
});

describe("recordUsage", () => {
  it("increments both counters from zero and returns the new totals", async () => {
    const kv = makeKV();
    const counts = await recordUsage(kv, "user-1", NOW);
    expect(counts).toEqual({ day: 1, month: 1 });
    expect(kv.store.get(DAY_KEY)).toBe("1");
    expect(kv.store.get(MONTH_KEY)).toBe("1");
  });

  it("increments from existing counts", async () => {
    const kv = makeKV({ [DAY_KEY]: "7", [MONTH_KEY]: "42" });
    const counts = await recordUsage(kv, "user-1", NOW);
    expect(counts).toEqual({ day: 8, month: 43 });
  });

  it("writes counters with an expiry TTL", async () => {
    const kv = makeKV();
    await recordUsage(kv, "user-1", NOW);
    for (const call of kv.put.mock.calls) {
      expect(call[2]).toMatchObject({ expirationTtl: expect.any(Number) });
    }
  });
});
