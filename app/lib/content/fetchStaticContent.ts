import { readArtifact } from "@/lib/server/artifacts";

/**
 * Fetch pre-rendered HTML content from a content-hashed cache-tree file.
 * Used by Server Components to load blog/article/guide/concept/project content.
 *
 * Read from disk during the production build and from R2 at runtime, via
 * readArtifact. A missing artifact still throws: the page cannot render without
 * its body, and failing loudly is the point.
 */
export async function fetchStaticContent(path: string): Promise<string> {
  const res = await readArtifact(path);
  if (!res.ok) {
    throw new Error(`Failed to fetch content: ${path} (${res.status})`);
  }
  return res.text();
}
