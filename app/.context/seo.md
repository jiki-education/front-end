# SEO: metadata & structured data

Two layers of SEO signal are emitted from the public `(hybrid)/[locale]` tree:

1. **Page metadata** (title, description, OpenGraph, canonical, hreflang) via Next's
   `generateMetadata`. Canonicals/hreflang are emitted once for the whole tree from
   `app/(hybrid)/[locale]/layout.tsx` (see `lib/seo/alternates.ts`).
2. **JSON-LD structured data** (schema.org) via `<script type="application/ld+json">`.

## JSON-LD

- **Component**: `components/seo/JsonLd.tsx` renders one script tag. It accepts a
  single node or an array of nodes and escapes `<` (prevents `</script>` breakout).
- **Builders**: `lib/seo/schemas.ts`. Every builder returns a plain object with its
  own `@context`. URLs are built with `canonicalUrl(localelessPath, locale)`, which
  reuses `localePath` so structured-data URLs match the page canonical exactly
  (default locale naked, others `/<locale>`-prefixed). `inLanguage` is the locale.

### What each page emits

| Page | Nodes |
| --- | --- |
| `(hybrid)/[locale]/layout.tsx` (all public pages) | `Organization` + `WebSite`, linked by `@id` |
| `concepts/[slug]` | `LearningResource` + `BreadcrumbList` |
| `projects/[slug]` | `Course` (free online `CourseInstance`, episodes as `hasPart`) + `BreadcrumbList` |
| `projects/[slug]/episodes/[episodeSlug]` | `VideoObject` + `BreadcrumbList` |
| `blog/[slug]` | `BlogPosting` + `BreadcrumbList` |
| `guides/[slug]` | `TechArticle` + `BreadcrumbList` |
| `help/[slug]` | `Article` + `BreadcrumbList` |

`VideoObject` on episodes is what populates Google Search Console's **Video indexing**
report. `embedUrl`/`contentUrl` and the thumbnail are derived from
`videoProvider` + `videoKey` (YouTube embed vs Mux player/stream).

### Type choices

- Guides are reference articles, not step-based tutorials, so `TechArticle` (Google
  removed `HowTo` rich results in 2023).
- Help pages are single articles, not Q&A pairs, so `Article` (not `FAQPage`/`QAPage`;
  Google restricts `FAQPage` rich results to authoritative gov/health sites anyway).
- `WebSite` carries no `SearchAction` (sitelinks searchbox) — there's no site search,
  and Google deprecated that rich result in 2024.

### Not yet covered

- **Concept videos** could emit `VideoObject`, but the Rails `/external/concepts/:slug`
  `video_data` payload (`types/lesson.ts` `VideoSource`) lacks `duration` and
  `uploadDate`, both of which Google needs. Add those server-side first.
- Index/list pages (`/blog`, `/guides`, `/concepts`, …) emit no `CollectionPage`/
  `ItemList` yet.

Builders are covered by `tests/unit/lib/seo/schemas.test.ts`.
