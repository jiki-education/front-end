import { headers } from "next/headers";

/**
 * Fetch pre-rendered HTML content from a static file on the same origin.
 * Used by server components to load blog post and article content.
 */
export async function fetchStaticContent(path: string): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("host");
  const proto = headersList.get("x-forwarded-proto");

  if (!host || !proto) {
    throw new Error(`Missing request headers (host: ${host}, proto: ${proto}) — cannot fetch ${path}`);
  }

  const url = `${proto}://${host}${path}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch content: ${path} (${res.status})`);
  }
  return res.text();
}
