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
  run: () => Promise<unknown>;
}> = [
  {
    name: "app UI message catalog",
    pointer: `/static/i18n/app/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/i18n/app/${UNKNOWN_LOCALE}/messages-${POINTER_HASH}.json`,
    body: {},
    run: async () =>
      (await import("@/lib/i18n/catalogLoader")).createCatalogLoader((path) => `https://assets.test${path}`)(
        UNKNOWN_LOCALE
      )
  },
  {
    name: "exercise prose index",
    pointer: `/static/exercises/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/exercises/${UNKNOWN_LOCALE}/index-${POINTER_HASH}.json`,
    body: [],
    run: async () => (await import("@/lib/api/exercise-meta")).getExerciseMetaBySlugs(["x"], UNKNOWN_LOCALE)
  },
  {
    name: "concept index (client)",
    pointer: `/static/concepts/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/concepts/${UNKNOWN_LOCALE}/index-${POINTER_HASH}.json`,
    body: [],
    run: async () => (await import("@/lib/api/concepts")).getConcepts(UNKNOWN_LOCALE)
  },
  {
    name: "concept index (server)",
    pointer: `/static/concepts/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/concepts/${UNKNOWN_LOCALE}/index-${POINTER_HASH}.json`,
    body: [],
    run: async () => (await import("@/lib/concepts/server-concepts")).getAllConceptsServer(UNKNOWN_LOCALE)
  },
  {
    name: "content metadata index",
    pointer: `/static/content/meta/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/content/meta/${UNKNOWN_LOCALE}/index-${POINTER_HASH}.json`,
    body: { blog: [], articles: [], guides: [], projects: [], testimonials: null, hasContent: {} },
    run: async () => (await import("@/lib/content/contentMeta")).getContentMeta(UNKNOWN_LOCALE)
  },
  {
    name: "level catalog",
    pointer: `/static/i18n/levels/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/i18n/levels/${UNKNOWN_LOCALE}/messages-${POINTER_HASH}.json`,
    body: {},
    run: async () => (await import("@/lib/api/level-meta")).fetchLevelMessages(UNKNOWN_LOCALE)
  },
  {
    name: "curriculum copy catalog",
    pointer: `/static/i18n/curriculum/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/i18n/curriculum/${UNKNOWN_LOCALE}/messages-${POINTER_HASH}.json`,
    body: {},
    run: async () => (await import("@/lib/api/curriculum-copy")).fetchCurriculumCopy(UNKNOWN_LOCALE)
  },
  {
    name: "badge copy catalog",
    pointer: `/static/i18n/badges/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/i18n/badges/${UNKNOWN_LOCALE}/messages-${POINTER_HASH}.json`,
    body: {},
    run: async () => (await import("@/lib/api/curriculum-copy")).fetchBadgeCopy(UNKNOWN_LOCALE)
  },
  {
    name: "exercise message catalog",
    pointer: `/static/i18n/exercises/maze/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/i18n/exercises/maze/${UNKNOWN_LOCALE}/messages-${POINTER_HASH}.json`,
    body: {},
    run: async () => (await import("@/lib/api/exercise-meta")).fetchExerciseMessages("maze", UNKNOWN_LOCALE)
  },
  {
    name: "interpreter message catalog",
    pointer: `/static/i18n/interpreter/javascript/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/i18n/interpreter/javascript/${UNKNOWN_LOCALE}/messages-${POINTER_HASH}.json`,
    body: {},
    run: async () => (await import("@/lib/api/exercise-meta")).fetchInterpreterMessages("javascript", UNKNOWN_LOCALE)
  },
  {
    name: "articles search index",
    pointer: `/static/content/search/articles/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/content/search/articles/${UNKNOWN_LOCALE}/index-${POINTER_HASH}.json`,
    body: { index: {}, items: [] },
    run: async () => (await import("@/lib/api/content-search")).getSearchIndex(UNKNOWN_LOCALE)
  },
  {
    name: "guides search index",
    pointer: `/static/content/search/guides/${UNKNOWN_LOCALE}/current.json`,
    artifact: `/static/content/search/guides/${UNKNOWN_LOCALE}/index-${POINTER_HASH}.json`,
    body: { index: {}, items: [] },
    run: async () => (await import("@/lib/api/content-search")).getGuidesSearchIndex(UNKNOWN_LOCALE)
  }
];

describe.each(NAMESPACES)("$name, for a locale absent from this build", ({ pointer, artifact, body, run }) => {
  it("resolves its hash from the pointer and fetches what the pointer names", async () => {
    global.fetch = mockFetch(body);
    await run();

    // Reading the pointer is what makes the namespace independent of the build.
    // A namespace still on a compiled manifest never gets here: it has no hash
    // for this locale and returns empty without asking anything.
    expect(fetched).toContain(pointer);
    expect(fetched).toContain(artifact);
  });
});

describe("the default locale", () => {
  it("never looks up a pointer", async () => {
    // English ships with the deploy, atomically, so its hash is compiled in and
    // its render path does zero runtime resolution. That matters because almost
    // all traffic is English.
    global.fetch = mockFetch([]);
    const { getExerciseMetaBySlugs } = await import("@/lib/api/exercise-meta");
    await getExerciseMetaBySlugs(["x"], "en");

    expect(fetched.filter((path) => path.endsWith("current.json"))).toEqual([]);
  });
});
