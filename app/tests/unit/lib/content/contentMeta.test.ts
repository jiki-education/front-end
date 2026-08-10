/**
 * Projects and their episodes split into structure and copy exactly as posts do,
 * and both halves have to be joined at read time. The failures that pins guards
 * against are a listing that quietly renders English under a translated URL, and
 * a project advertising episodes the locale cannot read.
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

const EPISODE_ONE = "a-project/5981d746-0aaf-40c1-9f44-344ddfb004ad";
const EPISODE_TWO = "a-project/f3e23284-2470-42bb-8782-9aad2eaf3e2e";

// Structure carries no copy at all: no title, no excerpt, no seo, no reading
// time, no content hash. Anything a translator writes is in the copy artifact.
const STRUCTURE = {
  blog: {},
  articles: {},
  guides: {},
  projects: {
    "a-project": {
      order: 1,
      image: "cover.webp",
      livestream: true,
      upcomingStreams: []
    }
  },
  "project-episodes": {
    [EPISODE_ONE]: {
      uuid: "5981d746-0aaf-40c1-9f44-344ddfb004ad",
      slug: "setting-up-the-project",
      project: "a-project",
      order: 1,
      date: "2026-07-11",
      videoProvider: "youtube",
      videoKey: "aEmZE-VnxsQ",
      durationSeconds: 5334,
      premium: false,
      image: "cover.webp",
      guides: []
    },
    [EPISODE_TWO]: {
      uuid: "f3e23284-2470-42bb-8782-9aad2eaf3e2e",
      slug: "our-first-page",
      project: "a-project",
      order: 2,
      date: "2026-05-15",
      videoProvider: "mux",
      videoKey: "v2kO7cS7n8Ihguz",
      durationSeconds: 1530,
      premium: false,
      image: "cover.webp",
      guides: []
    }
  }
};

const ENGLISH_PROJECT_COPY = {
  "a-project": { title: "A Project", description: "In English", tags: ["Tag"] }
};

function episodeCopy(title: string, hash: string) {
  return {
    title,
    excerpt: "An excerpt",
    seo: { description: "For search", keywords: [] },
    tags: [],
    readingTime: 40,
    contentHash: hash
  };
}

const EMPTY_COPY = { blog: {}, articles: {}, guides: {}, "project-episodes": {} };

function respond(routes: Record<string, unknown>) {
  readArtifactJson.mockImplementation((path: string) => Promise.resolve(routes[path] ?? null));
}

describe("getContentMeta projects", () => {
  beforeEach(() => {
    readArtifactJson.mockReset();
  });

  it("drops a project the locale has no copy for", async () => {
    respond({
      "/static/content/structure-00aa11bb2222.json": STRUCTURE,
      "/static/content/projects/en/meta-00aa11bb2211.json": ENGLISH_PROJECT_COPY
      // no /static/content/projects/hu/current.json: hu is untranslated
    });

    const { projects } = await loadContentMeta("hu");

    // There is no English fallback. A locale is complete before it is served, so
    // an untranslated project is absent rather than quietly English.
    expect(projects).toEqual([]);
  });

  it("renders a project from its own locale's copy", async () => {
    respond({
      "/static/content/structure-00aa11bb2222.json": STRUCTURE,
      "/static/content/projects/hu/current.json": { hash: "00aa11bb2200" },
      "/static/content/projects/hu/meta-00aa11bb2200.json": {
        "a-project": { title: "Egy projekt", description: "Magyarul", tags: ["Cimke"] }
      }
    });

    const { projects } = await loadContentMeta("hu");

    expect(projects).toHaveLength(1);
    expect(projects[0].title).toBe("Egy projekt");
    expect(projects[0].description).toBe("Magyarul");
    expect(projects[0].tags).toEqual(["Cimke"]);
    expect(projects[0].locale).toBe("hu");
  });

  it("leaves an untranslated field empty rather than filling it from English", async () => {
    respond({
      "/static/content/structure-00aa11bb2222.json": STRUCTURE,
      "/static/content/projects/en/meta-00aa11bb2211.json": ENGLISH_PROJECT_COPY,
      "/static/content/projects/hu/current.json": { hash: "00aa11bb2200" },
      "/static/content/projects/hu/meta-00aa11bb2200.json": {
        "a-project": { title: "Egy projekt" }
      }
    });

    const { projects } = await loadContentMeta("hu");

    expect(projects[0].description).toBe("");
    expect(projects[0].tags).toEqual([]);
  });
});

describe("getContentMeta project episodes", () => {
  beforeEach(() => {
    readArtifactJson.mockReset();
  });

  it("joins episode structure to the locale's episode copy", async () => {
    respond({
      "/static/content/structure-00aa11bb2222.json": STRUCTURE,
      "/static/content/copy/en/copy-00aa11bb2233.json": {
        ...EMPTY_COPY,
        "project-episodes": {
          [EPISODE_ONE]: episodeCopy("Episode 1", "00aa11bb3311"),
          [EPISODE_TWO]: episodeCopy("Episode 2", "00aa11bb3322")
        }
      },
      "/static/content/projects/en/meta-00aa11bb2211.json": ENGLISH_PROJECT_COPY
    });

    const { episodes, projects } = await loadContentMeta("en");

    expect(episodes.map((e) => e.title)).toEqual(["Episode 1", "Episode 2"]);
    // The two-part key is a join key only: `slug` is the episode's own, because
    // that is what the URL uses.
    expect(episodes.map((e) => e.slug)).toEqual(["setting-up-the-project", "our-first-page"]);
    expect(episodes[0].uuid).toBe("5981d746-0aaf-40c1-9f44-344ddfb004ad");
    expect(episodes[0].videoKey).toBe("aEmZE-VnxsQ");
    expect(episodes[0].contentHash).toBe("00aa11bb3311");
    expect(episodes[0].locale).toBe("en");
    expect(projects[0].episodeCount).toBe(2);
  });

  it("orders episodes by their structural order, not by key", async () => {
    respond({
      "/static/content/structure-00aa11bb2222.json": STRUCTURE,
      "/static/content/copy/en/copy-00aa11bb2233.json": {
        ...EMPTY_COPY,
        "project-episodes": {
          [EPISODE_TWO]: episodeCopy("Episode 2", "00aa11bb3322"),
          [EPISODE_ONE]: episodeCopy("Episode 1", "00aa11bb3311")
        }
      },
      "/static/content/projects/en/meta-00aa11bb2211.json": ENGLISH_PROJECT_COPY
    });

    const { episodes } = await loadContentMeta("en");

    expect(episodes.map((e) => e.order)).toEqual([1, 2]);
  });

  it("counts only the episodes the locale has copy for", async () => {
    respond({
      "/static/content/structure-00aa11bb2222.json": STRUCTURE,
      "/static/content/copy/hu/current.json": { hash: "00aa11bb2244" },
      "/static/content/copy/hu/copy-00aa11bb2244.json": {
        ...EMPTY_COPY,
        "project-episodes": { [EPISODE_ONE]: episodeCopy("Elso resz", "00aa11bb3333") }
      },
      "/static/content/projects/hu/current.json": { hash: "00aa11bb2200" },
      "/static/content/projects/hu/meta-00aa11bb2200.json": {
        "a-project": { title: "Egy projekt", description: "Magyarul", tags: [] }
      }
    });

    const { episodes, projects } = await loadContentMeta("hu");

    expect(episodes.map((e) => e.title)).toEqual(["Elso resz"]);
    expect(projects[0].episodeCount).toBe(1);
  });

  it("shows no episodes for a locale whose copy artifact has an empty bucket", async () => {
    respond({
      "/static/content/structure-00aa11bb2222.json": STRUCTURE,
      "/static/content/copy/hu/current.json": { hash: "00aa11bb2244" },
      "/static/content/copy/hu/copy-00aa11bb2244.json": EMPTY_COPY,
      "/static/content/projects/hu/current.json": { hash: "00aa11bb2200" },
      "/static/content/projects/hu/meta-00aa11bb2200.json": {
        "a-project": { title: "Egy projekt", description: "Magyarul", tags: [] }
      }
    });

    const { episodes, projects } = await loadContentMeta("hu");

    // A Hungarian project never borrows the English episode list. It reports
    // that it has no episodes in this locale, which is what is true.
    expect(episodes).toEqual([]);
    expect(projects[0].episodeCount).toBe(0);
  });

  it("drops an episode the structure does not know about", async () => {
    respond({
      "/static/content/structure-00aa11bb2222.json": STRUCTURE,
      "/static/content/copy/en/copy-00aa11bb2233.json": {
        ...EMPTY_COPY,
        "project-episodes": {
          [EPISODE_ONE]: episodeCopy("Episode 1", "00aa11bb3311"),
          "a-project/deleted-uuid": episodeCopy("Removed", "00aa11bb3344")
        }
      },
      "/static/content/projects/en/meta-00aa11bb2211.json": ENGLISH_PROJECT_COPY
    });

    const { episodes } = await loadContentMeta("en");

    expect(episodes.map((e) => e.title)).toEqual(["Episode 1"]);
  });
});
