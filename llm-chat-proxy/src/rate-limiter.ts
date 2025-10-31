/**
 * Simple in-memory rate limiter for MVP.
 * TODO: Use Cloudflare KV or Durable Objects for production multi-region deployment.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

const RATE_LIMIT = 50; // messages per hour
const WINDOW_MS = 60 * 60 * 1000; // 1 hour

/**
 * Checks if a user has exceeded their rate limit.
 * Implements a sliding window rate limiter stored in memory.
 *
 * @param userId - The user ID to check
 * @returns true if the request is allowed, false if rate limit exceeded
 */
export async function checkRateLimit(userId: string): Promise<boolean> {
  const now = Date.now();
  const userLimit = rateLimitStore.get(userId);

  // Clean up expired entries periodically
  if (rateLimitStore.size > 10000) {
    cleanupExpiredEntries(now);
  }

  if (userLimit === undefined || userLimit.resetAt < now) {
    // First request or window expired - create new entry
    rateLimitStore.set(userId, {
      count: 1,
      resetAt: now + WINDOW_MS
    });
    return true;
  }

  if (userLimit.count >= RATE_LIMIT) {
    return false;
  }

  userLimit.count++;
  return true;
}

function cleanupExpiredEntries(now: number): void {
  const toDelete: string[] = [];

  for (const [userId, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      toDelete.push(userId);
    }
  }

  toDelete.forEach((userId) => rateLimitStore.delete(userId));
}
