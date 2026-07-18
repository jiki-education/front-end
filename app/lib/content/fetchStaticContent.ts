import { assetsUrl } from "@/lib/server/origin";

/**
 * Fetch pre-rendered HTML content from a content-hashed cache-tree file.
 * Used by Server Components to load blog/article/guide/concept/project content.
 * Served from R2 (assets.jiki.io) in production, the request origin in dev.
 */
export async function fetchStaticContent(path: string): Promise<string> {
  const url = await assetsUrl(path);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch content: ${path} (${res.status})`);
  }
  return res.text();
}
