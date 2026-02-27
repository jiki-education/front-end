import { headers } from "next/headers";
import { getAllBlogPosts } from "./getAllBlogPosts";
import type { ProcessedBlogPost } from "./types";

/**
 * Get a single blog post by slug and locale (metadata + rendered content)
 * Falls back to English if the requested locale doesn't exist
 *
 * @throws Error if the post doesn't exist at all
 */
export async function getBlogPost(slug: string, locale: string): Promise<ProcessedBlogPost> {
  const allPosts = getAllBlogPosts(locale);
  const meta = allPosts.find((p) => p.slug === slug);

  if (!meta) {
    throw new Error(`Blog post not found: ${slug}`);
  }

  const content = await fetchContentFromOrigin(`/static/content/blog/${slug}/${meta.locale}-${meta.contentHash}.html`);
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
