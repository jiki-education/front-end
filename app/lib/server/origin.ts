import { headers } from "next/headers";

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
