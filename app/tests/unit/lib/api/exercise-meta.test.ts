/**
 * An exercise's cached content is two artifacts: prose keyed by (slug, locale)
 * and code keyed by (slug, language). These cover the seam between them, which
 * is where a mistake would show up as a student seeing the wrong language's code
 * or an untranslated page rather than as an error.
 */

const exerciseIndexHashes: Record<string, string> = { en: "e0e0e0e0e0e0" };
const exerciseCodeIndexHashes: Record<string, string> = { javascript: "f3f3f3f3f3f3" };

jest.mock("@/lib/generated/exercise-hashes", () => ({
  get exerciseIndexHashes() {
    return exerciseIndexHashes;
  },
  get exerciseCodeIndexHashes() {
    return exerciseCodeIndexHashes;
  }
}));
jest.mock("@/lib/generated/exercise-message-hashes", () => ({ exerciseMessageHashes: {} }));
jest.mock("@/lib/generated/interpreter-message-hashes", () => ({ interpreterMessageHashes: {} }));
jest.mock("@/lib/assets", () => ({ assetsUrl: (path: string) => `https://assets.test${path}` }));

const PROSE_HASH = "a1a1a1a1a1a1";
const CODE_HASH = "d2d2d2d2d2d2";
const HU_INDEX_HASH = "b0b0b0b0b0b0";

// The routes the module is allowed to ask for. Anything else is a bug in the
// path construction, and the fetch mock says so rather than 404ing quietly.
const ROUTES: Record<string, unknown> = {
  "/static/exercises/en/index-e0e0e0e0e0e0.json": [
    { slug: "maze-basic", title: "Maze", description: "A maze.", proseHash: PROSE_HASH }
  ],
  "/static/exercises/hu/current.json": { hash: HU_INDEX_HASH },
  "/static/exercises/hu/index-b0b0b0b0b0b0.json": [
    { slug: "maze-basic", title: "Labirintus", description: "Egy labirintus.", proseHash: "c1c1c1c1c1c1" }
  ],
  "/static/exercises/code/javascript/index-f3f3f3f3f3f3.json": { "maze-basic": CODE_HASH },
  [`/static/exercises/maze-basic/en/prose-${PROSE_HASH}.json`]: { instructions: "Solve it." },
  "/static/exercises/maze-basic/hu/prose-c1c1c1c1c1c1.json": { instructions: "Oldd meg." },
  [`/static/exercises/maze-basic/code/javascript/code-${CODE_HASH}.json`]: {
    stub: "function solve() {}",
    solution: "function solve() { return 1; }"
  }
};

let requested: string[] = [];

beforeEach(() => {
  requested = [];
  jest.resetModules();
  global.fetch = jest.fn((url: string) => {
    const path = String(url).replace("https://assets.test", "");
    requested.push(path);
    if (!(path in ROUTES)) {
      return Promise.resolve({ ok: false, status: 404 } as Response);
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve(ROUTES[path]) } as unknown as Response);
  }) as unknown as typeof fetch;
});

async function load() {
  return import("@/lib/api/exercise-meta");
}

describe("fetchExerciseContent", () => {
  it("assembles prose and code into the shape the loader consumes", async () => {
    const { fetchExerciseContent } = await load();
    await expect(fetchExerciseContent("maze-basic", "en", "javascript")).resolves.toEqual({
      title: "Maze",
      description: "A maze.",
      instructions: "Solve it.",
      stub: "function solve() {}",
      solution: "function solve() { return 1; }",
      proseHash: PROSE_HASH,
      codeHash: CODE_HASH
    });
  });

  it("takes code from the language and prose from the locale, independently", async () => {
    // The point of the split: a Hungarian student gets Hungarian instructions and
    // the identical JavaScript code, from an artifact with no locale in its path.
    const { fetchExerciseContent } = await load();
    const content = await fetchExerciseContent("maze-basic", "hu", "javascript");
    expect(content.instructions).toBe("Oldd meg.");
    expect(content.title).toBe("Labirintus");
    expect(content.stub).toBe("function solve() {}");
    expect(requested).toContain(`/static/exercises/maze-basic/code/javascript/code-${CODE_HASH}.json`);
  });

  it("resolves a non-English index hash from the pointer, not from a compiled hash", async () => {
    // This is what makes translated instructions publishable without a deploy:
    // "hu" is absent from the compiled manifest entirely.
    expect(exerciseIndexHashes.hu).toBeUndefined();
    const { fetchExerciseContent } = await load();
    await fetchExerciseContent("maze-basic", "hu", "javascript");
    expect(requested).toContain("/static/exercises/hu/current.json");
  });

  it("does not look up a pointer for English", async () => {
    const { fetchExerciseContent } = await load();
    await fetchExerciseContent("maze-basic", "en", "javascript");
    expect(requested.filter((path) => path.endsWith("current.json"))).toEqual([]);
  });

  it("fetches prose and code concurrently rather than in series", async () => {
    // Splitting one artifact into two must not add a round trip of depth, which
    // is only true while these two stay in the same Promise.all.
    const { fetchExerciseContent } = await load();
    await fetchExerciseContent("maze-basic", "en", "javascript");
    const proseAt = requested.indexOf(`/static/exercises/maze-basic/en/prose-${PROSE_HASH}.json`);
    const codeAt = requested.indexOf(`/static/exercises/maze-basic/code/javascript/code-${CODE_HASH}.json`);
    expect(Math.abs(proseAt - codeAt)).toBe(1);
  });

  it("fails loudly when the exercise has no code in this language", async () => {
    const { fetchExerciseContent } = await load();
    await expect(fetchExerciseContent("maze-basic", "en", "python")).rejects.toThrow(/No code for exercise/);
  });

  it("fails loudly when the exercise is missing from the locale's prose index", async () => {
    const { fetchExerciseContent } = await load();
    await expect(fetchExerciseContent("not-a-slug", "en", "javascript")).rejects.toThrow(
      /not found in the prose index/
    );
  });
});

describe("getExerciseMetaBySlugs", () => {
  it("returns the requested slugs' titles for the locale", async () => {
    const { getExerciseMetaBySlugs } = await load();
    await expect(getExerciseMetaBySlugs(["maze-basic", "nope"], "hu")).resolves.toEqual([
      { slug: "maze-basic", title: "Labirintus", description: "Egy labirintus.", proseHash: "c1c1c1c1c1c1" }
    ]);
  });

  it("returns nothing rather than throwing when a locale has no index at all", async () => {
    const { getExerciseMetaBySlugs } = await load();
    await expect(getExerciseMetaBySlugs(["maze-basic"], "de")).resolves.toEqual([]);
  });
});
