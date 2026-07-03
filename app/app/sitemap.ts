import type { MetadataRoute } from "next";
import conceptMetaServer from "@/lib/generated/concept-meta-server.json";
import { getAllArticles } from "@/lib/content/getAllArticles";
import { getAllBlogPosts } from "@/lib/content/getAllBlogPosts";
import { alternateLanguages } from "@/lib/seo/alternates";

const STATIC_ROUTES = ["/", "/blog", "/articles", "/concepts", "/testimonials", "/premium", "/roadmap"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticEntries(), ...blogEntries(), ...articleEntries(), ...conceptEntries()];
}

// Every entry carries reciprocal hreflang alternates (xhtml:link) so Google
// indexes the en/hu variants together. The `url` stays the naked-en URL.
function entry(localelessPath: string, extra?: Partial<MetadataRoute.Sitemap[number]>): MetadataRoute.Sitemap[number] {
  const languages = alternateLanguages(localelessPath);
  return {
    // `loc` is the naked-en URL, kept identical to the `en` alternate.
    url: languages.en,
    alternates: { languages },
    ...extra
  };
}

function staticEntries(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.map((route) => entry(route));
}

function blogEntries(): MetadataRoute.Sitemap {
  return getAllBlogPosts("en").map((post) => entry(`/blog/${post.slug}`, { lastModified: post.date }));
}

function articleEntries(): MetadataRoute.Sitemap {
  return getAllArticles("en")
    .filter((article) => article.listed)
    .map((article) => entry(`/articles/${article.slug}`, { lastModified: article.date }));
}

function conceptEntries(): MetadataRoute.Sitemap {
  const concepts = conceptMetaServer as { slug: string }[];
  return concepts.map((concept) => entry(`/concepts/${concept.slug}`));
}
