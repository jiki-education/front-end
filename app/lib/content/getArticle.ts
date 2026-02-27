import { headers } from "next/headers";
import { getAllArticles } from "./getAllArticles";
import type { ProcessedArticle } from "./types";

/**
 * Get a single article by slug and locale (metadata + rendered content)
 * Falls back to English if the requested locale doesn't exist
 *
 * @throws Error if the article doesn't exist at all
 */
export async function getArticle(slug: string, locale: string): Promise<ProcessedArticle> {
  const allArticles = getAllArticles(locale);
  const meta = allArticles.find((a) => a.slug === slug);

  if (!meta) {
    throw new Error(`Article not found: ${slug}`);
  }

  const content = await fetchContentFromOrigin(
    `/static/content/articles/${slug}/${meta.locale}-${meta.contentHash}.html`
  );
  return { ...meta, content };
}

async function fetchContentFromOrigin(path: string): Promise<string> {
  const headersList = await headers();
  const host = headersList.get("host") || "localhost:3071";
  const proto = headersList.get("x-forwarded-proto") || "http";
  const url = `${proto}://${host}${path}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch content: ${path} (${res.status})`);
  }
  return res.text();
}
