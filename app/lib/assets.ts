// Persistent, CDN-fronted R2 bucket that serves the content-hashed cache trees
// (i18n, exercises, concepts, content) in production. Every file in those trees
// is fingerprinted and immutable, and R2 uploads are additive, so old URLs keep
// resolving across a redeploy. Serving them from R2 — rather than the worker's
// bundled static assets, which are destroyed on every redeploy — keeps in-flight
// sessions alive. In development there is no R2, so the path is served relatively
// from public/ by the Next dev server.
const ASSETS_HOST = "https://assets.jiki.io";

/**
 * Resolve a `/static/...` cache-tree path to the URL it should be fetched from:
 * the R2 asset host in production, the same relative path in development.
 *
 * Client-only (synchronous). Server Components can't use relative URLs — they use
 * the async `assetsUrl` in `lib/server/origin.ts` instead.
 */
export function assetsUrl(path: string): string {
  return process.env.NODE_ENV === "production" ? `${ASSETS_HOST}${path}` : path;
}
