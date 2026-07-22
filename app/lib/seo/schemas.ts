import { localePath } from "@/lib/i18n/routes";
import { SITE_URL } from "@/lib/site";

// Stable @id anchors so every page's nodes can reference the one Organization /
// WebSite entity by id instead of repeating it (schema.org node deduplication).
const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const ORG_REF = { "@id": ORG_ID };

/** Absolute URL for a site-relative path; already-absolute URLs pass through. */
function absolute(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) {
    return pathOrUrl;
  }
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`;
}

/**
 * The canonical absolute URL for a locale-less path in a given locale. Uses the
 * same `localePath` rule as page canonicals/hreflang (default locale naked,
 * others `/<locale>`-prefixed) so structured-data URLs never drift from the
 * `<link rel="canonical">` Google reads on the same page.
 */
export function canonicalUrl(localelessPath: string, locale: string): string {
  return `${SITE_URL}${localePath(localelessPath, locale)}`;
}

/** Seconds -> ISO 8601 duration (e.g. 605 -> "PT10M5S"), as VideoObject expects. */
function isoDuration(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const parts = [
    hours ? `${hours}H` : "",
    minutes ? `${minutes}M` : "",
    // Keep a seconds term when it's the only non-zero unit so we never emit "PT".
    seconds || (!hours && !minutes) ? `${seconds}S` : ""
  ];
  return `PT${parts.join("")}`;
}

// -- Global site entities (emitted once, from the public [locale] layout) --------

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Jiki",
    url: SITE_URL,
    logo: `${SITE_URL}/static/images/logo-peeking.webp`,
    description: "Learn to code and build in the LLM-era. Fun, effective and free.",
    sameAs: ["https://www.youtube.com/@jiki-coding"]
  };
}

export function websiteSchema(locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": SITE_ID,
    url: SITE_URL,
    name: "Jiki",
    inLanguage: locale,
    publisher: ORG_REF
  };
}

// -- Breadcrumbs -----------------------------------------------------------------

/** A BreadcrumbList from ordered {name, locale-less path} crumbs. */
export function breadcrumbSchema(crumbs: { name: string; path: string }[], locale: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: canonicalUrl(crumb.path, locale)
    }))
  };
}

// -- Articles (blog / help / guides) ---------------------------------------------

interface ArticleInput {
  type: "Article" | "BlogPosting" | "TechArticle";
  path: string;
  locale: string;
  headline: string;
  description: string;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  image?: string;
  keywords?: string[];
}

export function articleSchema(article: ArticleInput) {
  const url = canonicalUrl(article.path, article.locale);
  return {
    "@context": "https://schema.org",
    "@type": article.type,
    headline: article.headline,
    description: article.description,
    url,
    mainEntityOfPage: url,
    inLanguage: article.locale,
    ...(article.datePublished ? { datePublished: article.datePublished } : {}),
    ...(article.dateModified ? { dateModified: article.dateModified } : {}),
    ...(article.image ? { image: absolute(article.image) } : {}),
    ...(article.keywords && article.keywords.length > 0 ? { keywords: article.keywords.join(", ") } : {}),
    // Person author when we have one, otherwise attribute to the Organization.
    author: article.authorName ? { "@type": "Person", name: article.authorName } : ORG_REF,
    publisher: ORG_REF
  };
}

// -- Videos (episodes) -----------------------------------------------------------

interface VideoInput {
  path: string;
  locale: string;
  name: string;
  description: string;
  uploadDate: string;
  durationSeconds?: number;
  provider: "youtube" | "mux";
  videoKey: string;
  thumbnailUrl: string;
  isAccessibleForFree?: boolean;
}

export function videoObjectSchema(video: VideoInput) {
  const embedUrl =
    video.provider === "youtube"
      ? `https://www.youtube.com/embed/${video.videoKey}`
      : `https://player.mux.com/${video.videoKey}`;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: video.name,
    description: video.description,
    thumbnailUrl: video.thumbnailUrl,
    uploadDate: video.uploadDate,
    ...(video.durationSeconds ? { duration: isoDuration(video.durationSeconds) } : {}),
    embedUrl,
    ...(video.provider === "mux" ? { contentUrl: `https://stream.mux.com/${video.videoKey}.m3u8` } : {}),
    url: canonicalUrl(video.path, video.locale),
    inLanguage: video.locale,
    isFamilyFriendly: true,
    ...(video.isAccessibleForFree === undefined ? {} : { isAccessibleForFree: video.isAccessibleForFree }),
    publisher: ORG_REF
  };
}

// -- Courses (projects) ----------------------------------------------------------

interface CourseInput {
  path: string;
  locale: string;
  name: string;
  description: string;
  image?: string;
  episodes: { name: string; path: string; description?: string }[];
}

export function courseSchema(course: CourseInput) {
  const url = canonicalUrl(course.path, course.locale);
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    name: course.name,
    description: course.description,
    url,
    inLanguage: course.locale,
    ...(course.image ? { image: absolute(course.image) } : {}),
    provider: ORG_REF,
    isAccessibleForFree: true,
    // Google's Course rich result needs a delivery instance + an offer; the whole
    // platform is free, so a single free online instance covers every project.
    hasCourseInstance: {
      "@type": "CourseInstance",
      courseMode: "online",
      inLanguage: course.locale,
      offers: {
        "@type": "Offer",
        price: 0,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock"
      }
    },
    hasPart: course.episodes.map((episode) => ({
      "@type": "CreativeWork",
      name: episode.name,
      url: canonicalUrl(episode.path, course.locale),
      ...(episode.description ? { description: episode.description } : {})
    }))
  };
}

// -- Learning resources (concepts) -----------------------------------------------

export function conceptLearningResourceSchema(
  concept: { slug: string; title: string; description: string },
  locale: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: concept.title,
    description: concept.description,
    url: canonicalUrl(`/concepts/${concept.slug}`, locale),
    inLanguage: locale,
    learningResourceType: "Concept",
    educationalLevel: "Beginner",
    teaches: concept.title,
    isAccessibleForFree: true,
    provider: ORG_REF
  };
}
