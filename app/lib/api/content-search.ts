import type { SearchIndexData } from "@/lib/content/loaders/types";

export async function getSearchIndex(locale: string): Promise<SearchIndexData> {
  const res = await fetch(`/api/content/search-index?locale=${encodeURIComponent(locale)}`);
  if (!res.ok) {
    throw new Error("Failed to fetch search index");
  }
  return res.json();
}
