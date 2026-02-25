"use server";

import { getContentLoader } from "@/lib/content/loaders";
import type { SearchIndexData } from "@/lib/content/loaders/types";

export async function getSearchIndex(locale: string): Promise<SearchIndexData> {
  const loader = await getContentLoader();
  return loader.getSearchIndex("articles", locale);
}
