import { headers } from "next/headers";

// See lib/assets.ts for why the content-hashed cache trees are served from R2.
const ASSETS_HOST = "https://assets.jiki.io";

/**
 * Build an absolute same-origin URL from the incoming request headers.
 * Server Components only — they can't use relative URLs, and the static assets
 * are served from the origin (R2-backed), not bundled.
 */
export async function originUrl(path: string): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("host");
  const proto = headersList.get("x-forwarded-proto");

  if (!host || !proto) {
    throw new Error(`Missing request headers (host: ${host}, proto: ${proto}) — cannot build URL for ${path}`);
  }

  return `${proto}://${host}${path}`;
}

/**
 * Absolute URL for a content-hashed cache-tree asset, for Server Components.
 * Production serves these from the persistent R2 bucket (assets.jiki.io); in
 * development there is no R2, so fall back to an absolute same-origin URL built
 * from the request headers. Mirrors the client-side `assetsUrl` in lib/assets.ts.
 */
export async function assetsUrl(path: string): Promise<string> {
  if (process.env.NODE_ENV === "production") {
    return `${ASSETS_HOST}${path}`;
  }
  return originUrl(path);
}
