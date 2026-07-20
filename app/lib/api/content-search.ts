import lunr from "lunr";
import { contentIndexHashes } from "@/lib/generated/content-hashes";
import { assetsUrl } from "@/lib/assets";
import { searchIndexPath } from "@/lib/assets-paths";
import type { SearchIndexData } from "@/lib/content/types";

// A locale with no search index resolves to an empty (but valid) lunr index
// rather than silently falling back to the English one. Building an empty index
// keeps the consumer's `lunr.Index.load` working (it just yields no results),
// instead of crashing on a missing/invalid payload.
function emptySearchIndex(): SearchIndexData {
  const idx = lunr(function () {
    this.ref("slug");
    this.field("title");
    this.field("excerpt");
  });
  return { index: idx.toJSON(), items: [] };
}

async function fetchSearchIndex(type: "articles" | "guides", locale: string): Promise<SearchIndexData> {
  const hash = contentIndexHashes.search[type][locale];
  if (!hash) {
    return emptySearchIndex();
  }

  const res = await fetch(assetsUrl(searchIndexPath(type, locale, hash)));
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
