import type { MetadataRoute } from "next";
import conceptMetaServer from "@/lib/generated/concept-meta-server.json";
import { getAllArticles } from "@/lib/content/getAllArticles";
import { getAllBlogPosts } from "@/lib/content/getAllBlogPosts";
import { SITE_URL } from "@/lib/site";

const STATIC_ROUTES = ["", "/blog", "/articles", "/concepts", "/testimonials", "/premium"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticEntries(), ...blogEntries(), ...articleEntries(), ...conceptEntries()];
}

function staticEntries(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`
  }));
}

function blogEntries(): MetadataRoute.Sitemap {
  return getAllBlogPosts("en").map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.date
  }));
}

function articleEntries(): MetadataRoute.Sitemap {
  return getAllArticles("en")
    .filter((article) => article.listed)
    .map((article) => ({
      url: `${SITE_URL}/articles/${article.slug}`,
      lastModified: article.date
    }));
}

function conceptEntries(): MetadataRoute.Sitemap {
  const concepts = conceptMetaServer as { slug: string }[];
  return concepts.map((concept) => ({
    url: `${SITE_URL}/concepts/${concept.slug}`
  }));
}
