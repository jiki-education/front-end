import lunr from "lunr";
import { contentIndexHashes } from "@/lib/generated/content-hashes";
import { assetsUrl } from "@/lib/assets";
import { searchIndexPath, searchIndexPointerPath } from "@/lib/assets-paths";
import { createHashResolver } from "@/lib/i18n/catalogPointer";
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

// The scope here is the content TYPE (articles or guides), so one resolver
// serves both: English from the compiled manifest, every other locale from its
// pointer, so a search index published by the i18n repo goes live with no
// front-end rebuild.
const resolveHash = createHashResolver({
  label: "search index",
  compiledHashes: (type) => contentIndexHashes.search[type as "articles" | "guides"],
  pointerPath: (locale, type) => searchIndexPointerPath(type as "articles" | "guides", locale),
  resolveUrl: assetsUrl
});

async function fetchSearchIndex(type: "articles" | "guides", locale: string): Promise<SearchIndexData> {
  let hash: string;
  try {
    hash = await resolveHash(locale, type);
  } catch {
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
