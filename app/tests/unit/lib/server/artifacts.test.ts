import fs from "fs";
import path from "path";

/**
 * The build must never fetch a cache-tree artifact.
 *
 * Every artifact is content-hashed, and `deploy` uploads AFTER the build. So any
 * build that changes an artifact asks R2 for a hash that by definition is not
 * there yet: the request could only succeed if the build had already succeeded.
 * It fails as a 404 far from its cause, or, for a reader that tolerates a miss,
 * silently bakes in an empty page.
 *
 * These lock in the rule that fixed it: while the build is running there is a
 * filesystem holding the artifacts, so read from it.
 */

const APP_DIR = path.join(__dirname, "..", "..", "..", "..");

// The runtime branch resolves an absolute URL from the request headers, which
// only exist inside a request. The test is about WHICH source is used, not about
// URL shape, so the resolver is stubbed.
jest.mock("@/lib/server/origin", () => ({
  assetsUrl: (p: string) => Promise.resolve(`https://assets.test${p}`),
  originUrl: (p: string) => Promise.resolve(`https://assets.test${p}`)
}));

describe("readArtifact", () => {
  const originalPhase = process.env.NEXT_PHASE;
  const fetchSpy = jest.fn();

  beforeEach(() => {
    jest.resetModules();
    fetchSpy.mockReset();
    global.fetch = fetchSpy;
  });

  afterEach(() => {
    if (originalPhase === undefined) delete process.env.NEXT_PHASE;
    else process.env.NEXT_PHASE = originalPhase;
  });

  it("reads from disk during the production build, without fetching", async () => {
    process.env.NEXT_PHASE = "phase-production-build";
    const { readArtifact } = await import("@/lib/server/artifacts");

    // Any generated artifact will do; this asserts the SOURCE, not the content.
    const conceptsDir = path.join(APP_DIR, "public", "static", "concepts");
    const structure = fs.existsSync(conceptsDir)
      ? fs.readdirSync(conceptsDir).find((f) => f.startsWith("structure-"))
      : undefined;
    if (!structure) {
      throw new Error("no concept structure artifact on disk; run the cache generators first");
    }

    const res = await readArtifact(`/static/concepts/${structure}`);

    expect(res.ok).toBe(true);
    expect(Array.isArray(await res.json())).toBe(true);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("reports a miss rather than throwing, so callers keep deciding what is fatal", async () => {
    process.env.NEXT_PHASE = "phase-production-build";
    const { readArtifact } = await import("@/lib/server/artifacts");

    const res = await readArtifact("/static/concepts/structure-000000000000.json");

    expect(res.ok).toBe(false);
    expect(res.status).toBe(404);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("fetches at runtime, where there is no filesystem", async () => {
    delete process.env.NEXT_PHASE;
    fetchSpy.mockResolvedValue({ ok: true, status: 200, json: () => Promise.resolve([]) });
    const { readArtifact } = await import("@/lib/server/artifacts");

    await readArtifact("/static/concepts/structure-abc123abc123.json");

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});

describe("server artifact reads all go through readArtifact", () => {
  // A server module that fetches an assetsUrl directly reintroduces the bug in a
  // place the build only discovers on the one page that happens to render it.
  const SERVER_READERS = [
    "lib/server/artifacts.ts",
    "lib/content/fetchStaticContent.ts",
    "lib/content/contentMeta.ts",
    "lib/concepts/server-concepts.ts",
    "lib/api/exercise-meta-server.ts"
  ];

  it.each(SERVER_READERS.filter((f) => f !== "lib/server/artifacts.ts"))(
    "%s never fetches an assetsUrl itself",
    (relative) => {
      const src = fs.readFileSync(path.join(APP_DIR, relative), "utf8");
      expect(src).not.toMatch(/fetch\(\s*await\s+assetsUrl|fetch\(\s*assetsUrl/);
    }
  );

  it("resolves every server pointer through the artifact reader too", () => {
    // A pointer is a cache-tree object like any other, so a resolver left on
    // plain fetch has exactly the same build-time problem as the artifact it names.
    for (const relative of SERVER_READERS) {
      const src = fs.readFileSync(path.join(APP_DIR, relative), "utf8");
      const resolvers = src.match(/createHashResolver\(\{/g)?.length ?? 0;
      const readers = src.match(/readPointer:/g)?.length ?? 0;
      expect({ file: relative, resolvers, readers }).toEqual({ file: relative, resolvers, readers: resolvers });
    }
  });
});
