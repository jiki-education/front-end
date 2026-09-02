# SEO: metadata & structured data

Two layers of SEO signal are emitted from the public `(hybrid)/[locale]` tree:

1. **Page metadata** (title, description, OpenGraph, canonical, hreflang) via Next's
   `generateMetadata`. Canonicals/hreflang are emitted once for the whole tree from
   `app/(hybrid)/[locale]/layout.tsx` (see `lib/seo/alternates.ts`).
2. **JSON-LD structured data** (schema.org) via `<script type="application/ld+json">`.
3. **The sitemap** (`app/sitemap.ts`), which enumerates every public page in every
   served locale.

## JSON-LD

- **Component**: `components/seo/JsonLd.tsx` renders one script tag. It accepts a
  single node or an array of nodes and escapes `<` (prevents `</script>` breakout).
- **Builders**: `lib/seo/schemas.ts`. Every builder returns a plain object with its
  own `@context`. URLs are built with `canonicalUrl(localelessPath, locale)`, which
  reuses `localePath` so structured-data URLs match the page canonical exactly
  (default locale naked, others `/<locale>`-prefixed). `inLanguage` is the locale.

### What each page emits

| Page                                              | Nodes                                                                             |
| ------------------------------------------------- | --------------------------------------------------------------------------------- |
| `(hybrid)/[locale]/layout.tsx` (all public pages) | `Organization` + `WebSite`, linked by `@id`                                       |
| `concepts/[slug]`                                 | `LearningResource` + `BreadcrumbList`                                             |
| `projects/[slug]`                                 | `Course` (free online `CourseInstance`, episodes as `hasPart`) + `BreadcrumbList` |
| `projects/[slug]/episodes/[episodeSlug]`          | `VideoObject` + `BreadcrumbList`                                                  |
| `blog/[slug]`                                     | `BlogPosting` + `BreadcrumbList`                                                  |
| `guides/[slug]`                                   | `TechArticle` + `BreadcrumbList`                                                  |
| `help/[slug]`                                     | `Article` + `BreadcrumbList`                                                      |
| `exercises/[slug]`                                | `LearningResource` + `BreadcrumbList` (+ `VideoObject` when the exercise has one) |

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

## Sitemap

`app/sitemap.ts` emits **one `<url>` element per locale per page**, each carrying the
same reciprocal hreflang map (`xhtml:link`) built by `alternateLanguages()` — the
same helper page metadata uses, so the two cannot drift. Every entry lists all
alternates including itself, plus `x-default`.

Per-locale `<loc>` entries are what Google's localized-versions guidance requires
("Create a separate `<url>` element for each URL"). Hanging the whole cluster off
the English URL instead leaves non-English URLs discoverable only by following an
annotation, which is a clustering hint and not a discovery guarantee: Search
Console reported `/hu` as found via the language switcher on other locale pages,
with no sitemap credited.

The locale list is `SUPPORTED_LOCALES`, which resolves to the production-complete
set in a production build, so a locale that is served only on staging is never
advertised to Google.

### What is listed

Static routes, blog posts, listed help articles, non-premium guides, projects with
episodes, concepts, and **published exercises**.

Deliberate omissions: premium guides and challenges (both premium-gated), unlisted
articles, episode-less projects, and individual episode pages (the episode list
lives on the project page).

### Published exercises

`/exercises/<slug>` is a server-rendered public teaser of an exercise, built to be
crawled. Only exercises up to and including `LAST_PUBLISHED_LEVEL_SLUG` are listed,
which is the same cutoff the dashboard applies via `filterToPublishedLevels`.

The dashboard derives that from the API's level/lesson tree, which a build-time
consumer cannot reach, so `lib/exercises/published.ts` derives the same answer from
local data: the ordered level registry from `@jiki/curriculum` gives the cutoff, and
`lib/generated/exercise-levels.ts` (slug -> levelId, written by
`scripts/generate-exercise-cache.js`) says which side of it each exercise falls on.

Two behaviours differ from the dashboard's filter, both deliberately fail-closed: an
exercise with no known level is dropped, and a cutoff naming a level the registry
does not have publishes nothing. Dropping a live exercise costs an unlisted page;
keeping an unmapped one risks publishing unreleased curriculum.

Covered by `tests/unit/app/sitemap.test.ts` and
`tests/unit/lib/exercises/published.test.ts`.
