import type { MetadataRoute } from "next";
import { getAllConceptsServer } from "@/lib/concepts/server-concepts";
import { getAllArticles } from "@/lib/content/getAllArticles";
import { getAllBlogPosts } from "@/lib/content/getAllBlogPosts";
import { getAllGuides } from "@/lib/content/getAllGuides";
import { getAllProjects } from "@/lib/content/getAllProjects";
import { publishedExerciseSlugs } from "@/lib/exercises/published";
import { SUPPORTED_LOCALES } from "@/lib/i18n/config";
import { swapLocaleInPath } from "@/lib/i18n/localeBanner";
import { alternateLanguages } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/site";

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
  return [...staticEntries(), ...blog, ...articles, ...guides, ...projects, ...concepts, ...exerciseEntries()];
}

/**
 * One `<url>` per locale for a single page, each carrying the same reciprocal
 * hreflang map (xhtml:link) so Google clusters the variants together.
 *
 * Every locale gets its own `<loc>` rather than the whole cluster hanging off the
 * English URL, because that is what Google's localized-versions guidance asks
 * for: "Create a separate <url> element for each URL", each listing every
 * alternate "including itself". The compact form left non-English URLs
 * discoverable only by following an annotation, which is a clustering hint and
 * not a discovery guarantee — Search Console duly reported /hu as found via the
 * language switcher on other pages, with no sitemap credited.
 *
 * The alternates map is identical across the returned entries by construction:
 * it is built once, from the locale-less path, and shared.
 */
function entries(localelessPath: string, extra?: Partial<MetadataRoute.Sitemap[number]>): MetadataRoute.Sitemap {
  const languages = alternateLanguages(localelessPath);
  return SUPPORTED_LOCALES.map((locale) => ({
    url: `${SITE_URL}${swapLocaleInPath(localelessPath, locale)}`,
    alternates: { languages },
    ...extra
  }));
}

function staticEntries(): MetadataRoute.Sitemap {
  return STATIC_ROUTES.flatMap((route) => entries(route));
}

async function blogEntries(): Promise<MetadataRoute.Sitemap> {
  return (await getAllBlogPosts("en")).flatMap((post) => entries(`/blog/${post.slug}`, { lastModified: post.date }));
}

async function articleEntries(): Promise<MetadataRoute.Sitemap> {
  return (await getAllArticles("en"))
    .filter((article) => article.listed)
    .flatMap((article) => entries(`/help/${article.slug}`, { lastModified: article.date }));
}

async function guideEntries(): Promise<MetadataRoute.Sitemap> {
  // Premium guides are deliberately kept out of the sitemap so they are not
  // surfaced externally.
  return (await getAllGuides("en"))
    .filter((guide) => !guide.premium)
    .flatMap((guide) => entries(`/guides/${guide.slug}`, { lastModified: guide.date }));
}

async function projectEntries(): Promise<MetadataRoute.Sitemap> {
  // Coming-soon projects (no episodes) have no detail page. Episode pages are
  // not listed individually — the episode list lives on the project page.
  return (await getAllProjects("en"))
    .filter((project) => project.episodeCount > 0)
    .flatMap((project) => entries(`/projects/${project.slug}`));
}

async function conceptEntries(): Promise<MetadataRoute.Sitemap> {
  // Slugs are locale-independent, so the en index is the canonical full list.
  return (await getAllConceptsServer("en"))
    .map((concept) => concept.slug)
    .flatMap((slug) => entries(`/concepts/${slug}`));
}

/**
 * The public exercise pages — a server-rendered teaser of each exercise, built to
 * be crawled (breadcrumb, LearningResource and VideoObject JSON-LD).
 *
 * Only published exercises are listed; see publishedExerciseSlugs for the cutoff
 * and the exclusions. This needs no fetch: the slug list and the level mapping
 * are both compiled in, so unlike the content lists it is resolved synchronously.
 */
function exerciseEntries(): MetadataRoute.Sitemap {
  return publishedExerciseSlugs().flatMap((slug) => entries(`/exercises/${slug}`));
}
