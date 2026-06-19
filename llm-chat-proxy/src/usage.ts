/**
 * Per-user message usage tracking, backed by Cloudflare KV.
 *
 * Counters are keyed by JWT sub and bucketed by UTC day and UTC month, capping a
 * user at DAILY_LIMIT messages per day and MONTHLY_LIMIT per month. KV is
 * eventually consistent, so under heavy concurrency from a single user a count
 * can slightly lag (a user might squeak one or two past the cap). That is an
 * acceptable trade for a cost guard.
 */

export const DAILY_LIMIT = 100;
export const MONTHLY_LIMIT = 500;

// KV resets a key's TTL on every put, so each TTL is measured from the LAST
// write and must outlive the rest of its bucket: a day key may still be read
// ~24h after its final write, a month key up to ~31 days. Generous margins.
const DAY_TTL_SECONDS = 2 * 24 * 60 * 60; // 48h
const MONTH_TTL_SECONDS = 40 * 24 * 60 * 60; // 40 days

function bucketKeys(userId: string, now: Date): { dayKey: string; monthKey: string } {
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return {
    dayKey: `usage:${userId}:day:${year}-${month}-${day}`,
    monthKey: `usage:${userId}:month:${year}-${month}`
  };
}

function parseCount(raw: string | null): number {
  if (raw === null) {
    return 0;
  }
  const n = parseInt(raw, 10);
  return Number.isFinite(n) ? n : 0;
}

export interface UsageCounts {
  day: number;
  month: number;
}

export interface UsageMeta {
  messagesToday: number;
  messagesThisMonth: number;
  dailyLimit: number;
  monthlyLimit: number;
}

/**
 * Structured usage block returned to the client on every response (success and
 * cap rejection alike) so the app always knows the user's current standing.
 */
export function buildUsageMeta(counts: UsageCounts): UsageMeta {
  return {
    messagesToday: counts.day,
    messagesThisMonth: counts.month,
    dailyLimit: DAILY_LIMIT,
    monthlyLimit: MONTHLY_LIMIT
  };
}

export interface UsageCheck {
  allowed: boolean;
  scope?: "daily" | "monthly";
  counts: UsageCounts;
}

/**
 * Reads the user's current day/month counts and decides whether another message
 * is allowed. Does NOT mutate anything - call recordUsage() once the request is
 * committed to reaching Gemini. Monthly limit takes precedence over daily.
 */
export async function checkUsage(kv: KVNamespace, userId: string, now: Date): Promise<UsageCheck> {
  const { dayKey, monthKey } = bucketKeys(userId, now);
  const [dayRaw, monthRaw] = await Promise.all([kv.get(dayKey), kv.get(monthKey)]);
  const counts: UsageCounts = { day: parseCount(dayRaw), month: parseCount(monthRaw) };

  if (counts.month >= MONTHLY_LIMIT) {
    return { allowed: false, scope: "monthly", counts };
  }
  if (counts.day >= DAILY_LIMIT) {
    return { allowed: false, scope: "daily", counts };
  }
  return { allowed: true, counts };
}

/**
 * Increments both counters and returns the new totals (including this message),
 * suitable for reporting back to the client.
 */
export async function recordUsage(kv: KVNamespace, userId: string, now: Date): Promise<UsageCounts> {
  const { dayKey, monthKey } = bucketKeys(userId, now);
  const [dayRaw, monthRaw] = await Promise.all([kv.get(dayKey), kv.get(monthKey)]);
  const day = parseCount(dayRaw) + 1;
  const month = parseCount(monthRaw) + 1;
  await Promise.all([
    kv.put(dayKey, String(day), { expirationTtl: DAY_TTL_SECONDS }),
    kv.put(monthKey, String(month), { expirationTtl: MONTH_TTL_SECONDS })
  ]);
  return { day, month };
}
