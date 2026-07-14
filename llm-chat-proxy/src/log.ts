/**
 * Whether we're running in local development. In production (deployed Worker)
 * NODE_ENV is unset, so this is false.
 */
export const isDev = process.env.NODE_ENV === "development";

/**
 * Logs only in development. Use for tracing/debug output that must not add to
 * production log volume - Cloudflare Workers Logs bills per log EVENT (not size),
 * so every stray console.log is a billable event retained for 7 days. In prod we
 * emit a single structured summary per request instead (see index.ts); genuine
 * failures use console.error directly so they are always visible.
 */
export function debugLog(...args: unknown[]): void {
  if (isDev) {
    console.log(...args);
  }
}
