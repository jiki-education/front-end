import { contentIndexHashes } from "@/lib/generated/content-hashes";
import type { SearchIndexData } from "@/lib/content/types";

export async function getSearchIndex(locale: string): Promise<SearchIndexData> {
  const hash = contentIndexHashes.search[locale] || contentIndexHashes.search["en"];
  const effectiveLocale = contentIndexHashes.search[locale] ? locale : "en";

  const res = await fetch(`/static/content/search/articles-${effectiveLocale}-${hash}.json`);
  if (!res.ok) {
    throw new Error("Failed to fetch search index");
  }
  return res.json();
}
