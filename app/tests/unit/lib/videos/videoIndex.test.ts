import fs from "fs";
import path from "path";
import { videoFor, type VideoIndex } from "@/lib/videos/select";
import { assembleConcepts, type ConceptStructure } from "@/lib/concepts/assemble";

const APP_DIR = path.join(__dirname, "..", "..", "..", "..");
const STATIC_DIR = path.join(APP_DIR, "public", "static");

function readOnly(dir: string, prefix: string): Record<string, unknown> {
  const file = fs.readdirSync(dir).find((name) => name.startsWith(prefix));
  if (!file) {
    throw new Error(`No ${prefix}* artifact in ${dir}. Run the cache generators.`);
  }
  return JSON.parse(fs.readFileSync(path.join(dir, file), "utf8"));
}

/**
 * The bug this whole artifact exists to prevent.
 *
 * Videos used to be folded into the copy catalogs. The i18n repo republishes
 * those per locale and builds each entry as a closed literal of
 * title/description/contentHash, so every video was present in English and
 * silently absent in Hungarian, Greek, French, Italian and Ukrainian: no concept
 * recap and no video lesson played anything at all. Nothing type-checked it,
 * because the catalogs are runtime fetches typed by assertion.
 *
 * So the guard is on the published bytes, not on a mock.
 */
describe("no copy catalog carries video data", () => {
  it.each([
    ["concept copy", path.join(STATIC_DIR, "concepts", "en"), "copy-"],
    ["curriculum copy", path.join(STATIC_DIR, "i18n", "curriculum", "en"), "messages-"]
  ])("%s has no video field on any entry", (_label, dir, prefix) => {
    const catalog = readOnly(dir, prefix);
    const offenders = Object.entries(catalog)
      .filter(([, entry]) => {
        const keys = Object.keys(entry as object);
        return keys.includes("video") || keys.includes("deepDiveVideo");
      })
      .map(([slug]) => slug);

    expect(offenders).toEqual([]);
  });
});

describe("the published video index", () => {
  const index = readOnly(path.join(STATIC_DIR, "videos", "en"), "index-") as unknown as VideoIndex;

  it("stores each recording once, however many things point at it", () => {
    const ids = Object.values(index.sources).map((source) => source.id);
    expect(ids.length).toBe(new Set(ids).size);

    // The loops video teaches four concepts and is one lesson. Five references,
    // one source; that dedup is the reason refs exist at all.
    const loopsRefs = Object.entries(index.refs).filter(([, video]) => video === "for-while-loops");
    expect(loopsRefs.map(([slug]) => slug).sort()).toEqual(["break", "continue", "for-loops", "while-loops"]);
  });

  it("points every ref at a source it actually published", () => {
    const dangling = Object.entries(index.refs)
      .filter(([, videoSlug]) => !(videoSlug in index.sources))
      .map(([slug, videoSlug]) => `${slug} -> ${videoSlug}`);

    expect(dangling).toEqual([]);
  });

  it("gives every source the fields the VideoObject JSON-LD requires", () => {
    for (const [slug, source] of Object.entries(index.sources)) {
      expect(typeof source.id).toBe("string");
      expect(source.id).not.toHaveLength(0);
      expect(["mux", "youtube"]).toContain(source.provider);
      expect(typeof source.durationSeconds).toBe("number");
      expect(typeof source.uploadDate).toBe("string");
      expect(slug).not.toHaveLength(0);
    }
  });
});

describe("videoFor", () => {
  const index: VideoIndex = {
    sources: {
      "for-while-loops": { provider: "mux", id: "loops-id", durationSeconds: 314, uploadDate: "2026-07-28" },
      arrays: { provider: "mux", id: "arrays-id", durationSeconds: 100, uploadDate: "2026-01-01" }
    },
    refs: { "while-loops": "for-while-loops" }
  };

  it("resolves a concept through its ref", () => {
    expect(videoFor(index, "while-loops")?.id).toBe("loops-id");
  });

  it("resolves a video lesson by its own slug, which needs no ref", () => {
    expect(videoFor(index, "arrays")?.id).toBe("arrays-id");
  });

  it("returns null for something that names no video", () => {
    expect(videoFor(index, "type-conversion")).toBeNull();
  });

  it("does not resolve inherited object properties to a video", () => {
    expect(videoFor(index, "constructor")).toBeNull();
    expect(videoFor(index, "toString")).toBeNull();
  });
});

describe("assembleConcepts", () => {
  const structure: ConceptStructure[] = [
    {
      slug: "while-loops",
      image: null,
      parentSlug: null,
      order: 1,
      category: false,
      childrenCount: 0,
      exerciseSlugs: []
    },
    {
      slug: "type-conversion",
      image: null,
      parentSlug: null,
      order: 2,
      category: false,
      childrenCount: 0,
      exerciseSlugs: []
    }
  ];

  // Exactly the shape scripts/publish.mjs in the i18n repo emits: title,
  // description, contentHash, and nothing else it could not compute.
  const translatedCopy = {
    "while-loops": { title: "Ciklusok", description: "…", contentHash: "abc" },
    "type-conversion": { title: "Típuskonverzió", description: "…", contentHash: "def" }
  };

  const videos: VideoIndex = {
    sources: { "for-while-loops": { provider: "mux", id: "loops-id", durationSeconds: 314, uploadDate: "2026-07-28" } },
    refs: { "while-loops": "for-while-loops" }
  };

  it("attaches videos to a locale whose copy was published without them", () => {
    const [whileLoops] = assembleConcepts(structure, translatedCopy, videos);
    expect(whileLoops.video?.id).toBe("loops-id");
  });

  it("leaves a concept that names no video with a null one, not a missing key", () => {
    const typeConversion = assembleConcepts(structure, translatedCopy, videos)[1];
    expect(typeConversion.video).toBeNull();
  });
});
