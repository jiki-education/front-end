/**
 * Projects are the one listing with an English fallback, and the one whose
 * episode index can belong to a different locale than its copy. Both are easy to
 * regress into "blank hub" or "404 on an index path that was never built", so
 * they are pinned here.
 */
jest.mock("@/lib/generated/content-hashes", () => ({
  contentIndexHashes: {
    search: { articles: {}, guides: {} },
    meta: {},
    copy: { en: "00aa11bb2233" },
    projects: { en: "00aa11bb2211" }
  },
  contentStructureHash: "00aa11bb2222"
}));

const readArtifactJson = jest.fn();
jest.mock("@/lib/server/artifacts", () => ({
  readArtifactJson: (path: string) => readArtifactJson(path)
}));

jest.mock("@/lib/server/origin", () => ({
  assetsUrl: (path: string) => `https://assets.test${path}`
}));

import type { ContentMeta } from "@/lib/content/contentMeta";
import type * as ContentMetaModule from "@/lib/content/contentMeta";

// `getContentMeta` is wrapped in React's cache(), which memoises for the life of
// the module. A test process has no request to scope that to, so each case takes
// a fresh copy of the module rather than sharing one cache.
//
// Every fake hash here is HEX: catalogPointer validates a pointer's hash against
// /^[0-9a-f]{8,64}$/ and treats anything else as a malformed pointer.
async function loadContentMeta(locale: string): Promise<ContentMeta> {
  let meta: ContentMeta | undefined;
  await jest.isolateModulesAsync(async () => {
    const mod: typeof ContentMetaModule = await import("@/lib/content/contentMeta");
    meta = await mod.getContentMeta(locale);
  });
  return meta as ContentMeta;
}

const STRUCTURE = {
  blog: {},
  articles: {},
  guides: {},
  projects: {
    "a-project": {
      order: 1,
      image: "cover.webp",
      livestream: true,
      upcomingStreams: [],
      episodes: { en: { count: 2, hash: "00aa11bb2244" } }
    }
  }
};

const ENGLISH_COPY = {
  "a-project": { title: "A Project", description: "In English", tags: ["Tag"] }
};

function respond(routes: Record<string, unknown>) {
  readArtifactJson.mockImplementation((path: string) => Promise.resolve(routes[path] ?? null));
}

describe("getContentMeta projects", () => {
  beforeEach(() => {
    readArtifactJson.mockReset();
  });

  it("falls back to English copy when a locale has no project catalog", async () => {
    respond({
      "/static/content/structure-00aa11bb2222.json": STRUCTURE,
      "/static/content/projects/en/meta-00aa11bb2211.json": ENGLISH_COPY
      // no /static/content/projects/hu/current.json: hu is untranslated
    });

    const { projects } = await loadContentMeta("hu");

    expect(projects).toHaveLength(1);
    expect(projects[0].title).toBe("A Project");
    expect(projects[0].locale).toBe("hu");
  });

  it("prefers the locale's own copy, field by field", async () => {
    respond({
      "/static/content/structure-00aa11bb2222.json": STRUCTURE,
      "/static/content/projects/en/meta-00aa11bb2211.json": ENGLISH_COPY,
      "/static/content/projects/hu/current.json": { hash: "00aa11bb2200" },
      "/static/content/projects/hu/meta-00aa11bb2200.json": {
        "a-project": { title: "Egy projekt" }
      }
    });

    const { projects } = await loadContentMeta("hu");

    expect(projects[0].title).toBe("Egy projekt");
    // Untranslated fields still render, rather than blanking.
    expect(projects[0].description).toBe("In English");
    expect(projects[0].tags).toEqual(["Tag"]);
  });

  it("reads the default locale's episode index when the locale has none", async () => {
    respond({
      "/static/content/structure-00aa11bb2222.json": STRUCTURE,
      "/static/content/projects/en/meta-00aa11bb2211.json": ENGLISH_COPY
    });

    const { projects } = await loadContentMeta("hu");

    expect(projects[0].episodesLocale).toBe("en");
    expect(projects[0].episodesIndexHash).toBe("00aa11bb2244");
    expect(projects[0].episodeCount).toBe(2);
  });

  it("uses the locale's own episode index when the front-end built one", async () => {
    respond({
      "/static/content/structure-00aa11bb2222.json": {
        ...STRUCTURE,
        projects: {
          "a-project": {
            ...STRUCTURE.projects["a-project"],
            episodes: {
              en: { count: 2, hash: "00aa11bb2244" },
              hu: { count: 1, hash: "00aa11bb2255" }
            }
          }
        }
      },
      "/static/content/projects/en/meta-00aa11bb2211.json": ENGLISH_COPY
    });

    const { projects } = await loadContentMeta("hu");

    expect(projects[0].episodesLocale).toBe("hu");
    expect(projects[0].episodesIndexHash).toBe("00aa11bb2255");
    expect(projects[0].episodeCount).toBe(1);
  });
});
