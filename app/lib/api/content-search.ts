import { contentIndexHashes } from "@/lib/generated/content-hashes";
import { assetsUrl } from "@/lib/assets";
import type { SearchIndexData } from "@/lib/content/types";

async function fetchSearchIndex(type: "articles" | "guides", locale: string): Promise<SearchIndexData> {
  const hashes = contentIndexHashes.search[type];
  const hash = hashes[locale] || hashes["en"];
  const effectiveLocale = hashes[locale] ? locale : "en";

  const res = await fetch(assetsUrl(`/static/content/search/${type}/${effectiveLocale}/index-${hash}.json`));
  if (!res.ok) {
    throw new Error(`Failed to fetch ${type} search index`);
  }
  return res.json();
}

export async function getSearchIndex(locale: string): Promise<SearchIndexData> {
  return fetchSearchIndex("articles", locale);
}

export async function getGuidesSearchIndex(locale: string): Promise<SearchIndexData> {
  return fetchSearchIndex("guides", locale);
}
