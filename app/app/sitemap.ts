import type { MetadataRoute } from "next";
import { getAllConceptsServer } from "@/lib/concepts/server-concepts";
import { getAllArticles } from "@/lib/content/getAllArticles";
import { getAllBlogPosts } from "@/lib/content/getAllBlogPosts";
import { getAllGuides } from "@/lib/content/getAllGuides";
import { getAllProjects } from "@/lib/content/getAllProjects";
import { alternateLanguages } from "@/lib/seo/alternates";

const STATIC_ROUTES = [
  "/",
  "/blog",
  "/help",
  "/guides",
  "/concepts",
  "/build",
  "/testimonials",
  "/premium",
  "/roadmap"
];

// Async because every content list it enumerates is now fetched rather than
// bundled. Next supports an async sitemap; what it does not support is a sitemap
// that silently omits a locale's content because the data shipped with the build.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [blog, articles, guides, projects, concepts] = await Promise.all([
    blogEntries(),
    articleEntries(),
    guideEntries(),
    projectEntries(),
    conceptEntries()
  ]);
  return [...staticEntries(), ...blog, ...articles, ...guides, ...projects, ...concepts];
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

async function blogEntries(): Promise<MetadataRoute.Sitemap> {
  return (await getAllBlogPosts("en")).map((post) => entry(`/blog/${post.slug}`, { lastModified: post.date }));
}

async function articleEntries(): Promise<MetadataRoute.Sitemap> {
  return (await getAllArticles("en"))
    .filter((article) => article.listed)
    .map((article) => entry(`/help/${article.slug}`, { lastModified: article.date }));
}

async function guideEntries(): Promise<MetadataRoute.Sitemap> {
  // Premium guides are deliberately kept out of the sitemap so they are not
  // surfaced externally.
  return (await getAllGuides("en"))
    .filter((guide) => !guide.premium)
    .map((guide) => entry(`/guides/${guide.slug}`, { lastModified: guide.date }));
}

async function projectEntries(): Promise<MetadataRoute.Sitemap> {
  // Coming-soon projects (no episodes) have no detail page. Episode pages are
  // not listed individually — the episode list lives on the project page.
  return (await getAllProjects("en"))
    .filter((project) => project.episodeCount > 0)
    .map((project) => entry(`/projects/${project.slug}`));
}

async function conceptEntries(): Promise<MetadataRoute.Sitemap> {
  // Slugs are locale-independent, so the en index is the canonical full list.
  return (await getAllConceptsServer("en")).map((concept) => entry(`/concepts/${concept.slug}`));
}
