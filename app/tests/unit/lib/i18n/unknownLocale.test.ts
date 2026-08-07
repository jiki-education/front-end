/**
 * The acceptance test for the content split.
 *
 * ## What it proves
 *
 * A locale that did not exist when this front-end was built must still render
 * from published artifacts alone. The failure it guards against is silent: a
 * namespace that reads a compiled hash manifest instead of a pointer does not
 * error for such a locale, it quietly returns nothing, and the page renders
 * empty or falls back to English. Nothing goes red; the locale is just missing.
 *
 * So the test uses a locale, `zz`, that appears in NO compiled manifest anywhere
 * in this build. For every locale-varying namespace it asserts two things:
 *
 *   1. the namespace asks for that locale's POINTER, and
 *   2. having read it, fetches the hash the pointer named.
 *
 * A namespace still reading a compiled manifest fails on the first: it never
 * requests a pointer, because it has nothing to look one up with.
 *
 * ## The other half
 *
 * `bundled.test.ts` covers the complementary failure, where data is not fetched
 * at all. Together they are the claim: everything locale-varying is fetched, and
 * everything fetched resolves for a locale this build has never heard of.
 */

const UNKNOWN_LOCALE = "zz";
const POINTER_HASH = "abc123abc123";

const fetched: string[] = [];

function mockFetch(body: unknown) {
  return jest.fn((url: string) => {
    const path = String(url).replace("https://assets.test", "");
    fetched.push(path);
    if (path.endsWith("current.json")) {
      return Promise.resolve({ ok: true, json: () => Promise.resolve({ hash: POINTER_HASH }) } as unknown as Response);
    }
    // The locale-invariant structure half. These cases are about whether the
    // pointer is consulted, so it is served empty; the listing cases below
    // exercise the merge itself.
    if (/structure-[0-9a-f]+\.json$/.test(path)) {
      const empty = path.includes("/concepts/") ? [] : { blog: {}, articles: {}, guides: {} };
      return Promise.resolve({ ok: true, json: () => Promise.resolve(empty) } as unknown as Response);
    }
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(body),
      text: () => Promise.resolve("")
    } as unknown as Response);
  }) as unknown as typeof fetch;
}

jest.mock("@/lib/assets", () => ({ assetsUrl: (path: string) => `https://assets.test${path}` }));
jest.mock("@/lib/server/origin", () => ({
  assetsUrl: (path: string) => Promise.resolve(`https://assets.test${path}`),
  originUrl: (path: string) => Promise.resolve(`https://assets.test${path}`)
}));

beforeEach(() => {
  fetched.length = 0;
  jest.resetModules();
});

/** Every namespace that varies by locale, and how to drive it. */
const NAMESPACES: Array<{
  name: string;
  pointer: string;
  artifact: string;
  body: unknown;
  run: (locale: string) => Promise<unknown>;
}> = [
  {
    name: "app UI message catalog",
    pointer: `/static/i18n/app/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/i18n/app/${UNKNOWN_LOCALE}/messages-${POINTER_HASH}.json`,
    body: {},
    run: async (locale: string) =>
      (await import("@/lib/i18n/catalogLoader")).createCatalogLoader((path) => `https://assets.test${path}`)(locale)
  },
  {
    name: "exercise prose index",
    pointer: `/static/exercises/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/exercises/${UNKNOWN_LOCALE}/index-${POINTER_HASH}.json`,
    body: [],
    run: async (locale: string) => (await import("@/lib/api/exercise-meta")).getExerciseMetaBySlugs(["x"], locale)
  },
  {
    name: "concept copy (client)",
    pointer: `/static/concepts/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/concepts/${UNKNOWN_LOCALE}/copy-${POINTER_HASH}.json`,
    body: {},
    run: async (locale: string) => (await import("@/lib/api/concepts")).getConcepts(locale)
  },
  {
    name: "concept copy (server)",
    pointer: `/static/concepts/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/concepts/${UNKNOWN_LOCALE}/copy-${POINTER_HASH}.json`,
    body: {},
    run: async (locale: string) => (await import("@/lib/concepts/server-concepts")).getAllConceptsServer(locale)
  },
  {
    name: "content copy catalog",
    pointer: `/static/content/copy/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/content/copy/${UNKNOWN_LOCALE}/copy-${POINTER_HASH}.json`,
    body: { blog: {}, articles: {}, guides: {} },
    run: async (locale: string) => (await import("@/lib/content/contentMeta")).getContentMeta(locale)
  },
  {
    name: "level catalog",
    pointer: `/static/i18n/levels/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/i18n/levels/${UNKNOWN_LOCALE}/messages-${POINTER_HASH}.json`,
    body: {},
    run: async (locale: string) => (await import("@/lib/api/level-meta")).fetchLevelMessages(locale)
  },
  {
    name: "curriculum copy catalog",
    pointer: `/static/i18n/curriculum/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/i18n/curriculum/${UNKNOWN_LOCALE}/messages-${POINTER_HASH}.json`,
    body: {},
    run: async (locale: string) => (await import("@/lib/api/curriculum-copy")).fetchCurriculumCopy(locale)
  },
  {
    name: "badge copy catalog",
    pointer: `/static/i18n/badges/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/i18n/badges/${UNKNOWN_LOCALE}/messages-${POINTER_HASH}.json`,
    body: {},
    run: async (locale: string) => (await import("@/lib/api/curriculum-copy")).fetchBadgeCopy(locale)
  },
  {
    name: "exercise message catalog",
    pointer: `/static/i18n/exercises/maze/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/i18n/exercises/maze/${UNKNOWN_LOCALE}/messages-${POINTER_HASH}.json`,
    body: {},
    run: async (locale: string) => (await import("@/lib/api/exercise-meta")).fetchExerciseMessages("maze", locale)
  },
  {
    name: "interpreter message catalog",
    pointer: `/static/i18n/interpreter/javascript/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/i18n/interpreter/javascript/${UNKNOWN_LOCALE}/messages-${POINTER_HASH}.json`,
    body: {},
    run: async (locale: string) =>
      (await import("@/lib/api/exercise-meta")).fetchInterpreterMessages("javascript", locale)
  },
  {
    name: "articles search index",
    pointer: `/static/content/search/articles/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/content/search/articles/${UNKNOWN_LOCALE}/index-${POINTER_HASH}.json`,
    body: { index: {}, items: [] },
    run: async (locale: string) => (await import("@/lib/api/content-search")).getSearchIndex(locale)
  },
  {
    name: "guides search index",
    pointer: `/static/content/search/guides/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/content/search/guides/${UNKNOWN_LOCALE}/index-${POINTER_HASH}.json`,
    body: { index: {}, items: [] },
    run: async (locale: string) => (await import("@/lib/api/content-search")).getGuidesSearchIndex(locale)
  }
];

describe.each(NAMESPACES)("$name, for a locale absent from this build", ({ pointer, artifact, body, run }) => {
  it("resolves its hash from the pointer and fetches what the pointer names", async () => {
    global.fetch = mockFetch(body);
    await run(UNKNOWN_LOCALE);

    // Reading the pointer is what makes the namespace independent of the build.
    // A namespace still on a compiled manifest never gets here: it has no hash
    // for this locale and returns empty without asking anything.
    expect(fetched).toContain(pointer);
    expect(fetched).toContain(artifact);
  });
});

/**
 * The default locale, across EVERY namespace.
 *
 * English ships with the deploy, atomically, so its hash is compiled in and its
 * render path must do zero runtime resolution. That matters because almost all
 * traffic is English, and because a pointer fetch on the English path is a
 * request to an object that deliberately does not exist: it cannot be served,
 * only waited on and then fallen back from.
 *
 * Checking one namespace was not enough. This runs the same twelve namespaces
 * the unknown-locale cases drive, so a namespace that starts consulting a
 * pointer for English is caught wherever it is.
 */
describe.each(NAMESPACES)("$name, for the default locale", ({ body, run }) => {
  it("never looks up a pointer", async () => {
    global.fetch = mockFetch(body);
    await run("en");

    expect(fetched.filter((path) => path.endsWith("current.json"))).toEqual([]);
  });
});

/**
 * The listings and the SEO metadata, which is where this had to end up.
 *
 * Fetching the right URL is necessary and not sufficient. The failure that
 * actually reached users was subtler: a locale's page BODY rendered perfectly by
 * direct URL while its listing was empty and its <title> was missing, because
 * the index that had to name it was published with the front-end build and had
 * never heard of the locale. So these assert the assembled RESULT for a locale
 * absent from every compiled manifest: real entries, with translated titles.
 */
describe("listings and SEO, for a locale absent from this build", () => {
  const STRUCTURE_ROUTE = /\/static\/(concepts|content)\/structure-[0-9a-f]+\.json$/;

  function serve(routes: Record<string, unknown>) {
    global.fetch = jest.fn((url: string) => {
      const path = String(url).replace("https://assets.test", "");
      fetched.push(path);
      const key = STRUCTURE_ROUTE.test(path) ? path.replace(/-[0-9a-f]+\.json$/, ".json") : path;
      if (path.endsWith("current.json")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ hash: POINTER_HASH })
        } as unknown as Response);
      }
      const body = routes[key];
      if (body === undefined) return Promise.resolve({ ok: false, status: 404 } as Response);
      return Promise.resolve({ ok: true, json: () => Promise.resolve(body) } as unknown as Response);
    }) as unknown as typeof fetch;
  }

  it("lists concepts, with translated titles", async () => {
    serve({
      "/static/concepts/structure.json": [
        {
          slug: "arrays",
          image: null,
          parentSlug: null,
          order: 1,
          category: false,
          childrenCount: 0,
          exerciseSlugs: []
        }
      ],
      [`/static/concepts/${UNKNOWN_LOCALE}/copy-${POINTER_HASH}.json`]: {
        arrays: { title: "Tömbök", description: "Egy tömb.", contentHash: "aaaaaaaaaaaa" }
      }
    });

    const { getConcepts } = await import("@/lib/api/concepts");
    const concepts = await getConcepts(UNKNOWN_LOCALE);

    expect(concepts).toEqual([
      expect.objectContaining({ slug: "arrays", title: "Tömbök", description: "Egy tömb.", order: 1 })
    ]);
  });

  it("produces concept SEO metadata, with the translated title", async () => {
    serve({
      "/static/concepts/structure.json": [
        {
          slug: "arrays",
          image: "/icon.webp",
          parentSlug: null,
          order: 1,
          category: false,
          childrenCount: 0,
          exerciseSlugs: []
        }
      ],
      [`/static/concepts/${UNKNOWN_LOCALE}/copy-${POINTER_HASH}.json`]: {
        arrays: { title: "Tömbök", description: "Egy tömb.", contentHash: "aaaaaaaaaaaa" }
      }
    });

    const { getConceptMetadata } = await import("@/lib/concepts/metadata");
    await expect(getConceptMetadata("arrays", UNKNOWN_LOCALE)).resolves.toEqual(
      expect.objectContaining({ title: "Tömbök", description: "Egy tömb." })
    );
  });

  it("lists blog posts, merging locale-invariant structure with translated copy", async () => {
    serve({
      "/static/content/structure.json": {
        blog: { hello: { date: "2026-01-01", author: { name: "iHiD" }, featured: true, coverImage: "/c.webp" } },
        articles: {},
        guides: {}
      },
      [`/static/content/copy/${UNKNOWN_LOCALE}/copy-${POINTER_HASH}.json`]: {
        blog: {
          hello: { title: "Helló", excerpt: "Üdv", seo: {}, tags: [], readingTime: 2, contentHash: "bbbbbbbbbbbb" }
        },
        articles: {},
        guides: {}
      }
    });

    const { getAllBlogPosts } = await import("@/lib/content/getAllBlogPosts");
    await expect(getAllBlogPosts(UNKNOWN_LOCALE)).resolves.toEqual([
      expect.objectContaining({
        slug: "hello",
        locale: UNKNOWN_LOCALE,
        title: "Helló",
        // from the structural half, which no translation had to restate
        date: "2026-01-01",
        featured: true
      })
    ]);
  });

  it("lets a listing route know the locale has content", async () => {
    serve({
      "/static/content/structure.json": {
        blog: { hello: { date: "2026-01-01", author: { name: "iHiD" }, featured: true, coverImage: "/c.webp" } },
        articles: {},
        guides: {}
      },
      [`/static/content/copy/${UNKNOWN_LOCALE}/copy-${POINTER_HASH}.json`]: {
        blog: {
          hello: { title: "Helló", excerpt: "Üdv", seo: {}, tags: [], readingTime: 2, contentHash: "bbbbbbbbbbbb" }
        },
        articles: {},
        guides: {}
      }
    });

    const { hasContent } = await import("@/lib/content/contentMeta");
    await expect(hasContent("blog", UNKNOWN_LOCALE)).resolves.toBe(true);
    // The route 404s on this one, which is right: the locale has no guides.
    await expect(hasContent("guides", UNKNOWN_LOCALE)).resolves.toBe(false);
  });

  it("drops an entry the locale has no copy for rather than showing English", async () => {
    serve({
      "/static/content/structure.json": {
        blog: {
          translated: { date: "2026-01-01", author: { name: "iHiD" }, featured: false, coverImage: "/c.webp" },
          untranslated: { date: "2026-01-02", author: { name: "iHiD" }, featured: false, coverImage: "/c.webp" }
        },
        articles: {},
        guides: {}
      },
      [`/static/content/copy/${UNKNOWN_LOCALE}/copy-${POINTER_HASH}.json`]: {
        blog: {
          translated: {
            title: "Lefordítva",
            excerpt: "x",
            seo: {},
            tags: [],
            readingTime: 1,
            contentHash: "cccccccccccc"
          }
        },
        articles: {},
        guides: {}
      }
    });

    const { getAllBlogPosts } = await import("@/lib/content/getAllBlogPosts");
    const posts = await getAllBlogPosts(UNKNOWN_LOCALE);
    expect(posts.map((p) => p.slug)).toEqual(["translated"]);
  });
});
