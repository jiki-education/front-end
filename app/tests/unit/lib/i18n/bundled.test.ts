import fs from "fs";
import path from "path";

/**
 * The other half of the acceptance test.
 *
 * `unknownLocale.test.ts` proves that everything fetched resolves for a locale
 * this build has never heard of. This one proves the set is complete: that no
 * locale-varying content is delivered at BUILD time instead, where the runtime
 * resolution it never performs cannot be observed failing.
 *
 * It is a static check over the source tree on purpose. A runtime test can only
 * exercise the code paths it thinks to call, and the failure here is a path
 * nobody thought about still importing a bundled blob.
 */

const APP_DIR = path.join(__dirname, "..", "..", "..", "..");
const GENERATED_DIR = path.join(APP_DIR, "lib", "generated");
const SOURCE_DIRS = ["app", "components", "lib", "hooks", "types", "middleware.ts"];

function sourceFiles(): string[] {
  const out: string[] = [];
  const walk = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    if (fs.statSync(dir).isFile()) {
      out.push(dir);
      return;
    }
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === "node_modules" || entry.name === "generated") continue;
        walk(full);
      } else if (/\.tsx?$/.test(entry.name)) {
        out.push(full);
      }
    }
  };
  for (const dir of SOURCE_DIRS) walk(path.join(APP_DIR, dir));
  return out;
}

describe("nothing locale-varying is bundled", () => {
  // The two cross-locale blobs this migration removed. They held every locale's
  // blog/article/guide/project/testimonial metadata and every locale's concept
  // titles, imported synchronously into the worker. While they existed, a locale
  // could serve every byte of its prose from R2 and still be invisible in every
  // listing, every sitemap and every <title>, because the thing that knew its
  // content existed shipped with the build.
  it.each(["content-meta-server.json", "concept-meta-server.json"])("does not generate %s", (name) => {
    expect(fs.existsSync(path.join(GENERATED_DIR, name))).toBe(false);
  });

  it("has no source file importing a per-locale content blob", () => {
    const offenders = sourceFiles().filter((file) =>
      /from\s+["'][^"']*generated\/(content|concept)-meta-server\.json["']/.test(fs.readFileSync(file, "utf8"))
    );
    expect(offenders.map((f) => path.relative(APP_DIR, f))).toEqual([]);
  });

  /**
   * Everything left in lib/generated/ must be one of two things:
   *
   *   - a HASH MANIFEST, which is fine. Only the default locale is ever read
   *     from one; every other locale goes through a pointer. It is a few hundred
   *     bytes and it is what a local build without R2 runs on.
   *   - data that does not vary by locale (asset fingerprints, icon URLs).
   *
   * Anything else is content delivered at build time, which is the thing this
   * whole split exists to stop doing.
   */
  it("generates only hash manifests and locale-invariant data", () => {
    const ALLOWED = new Set([
      // locale -> hash manifests, read for the default locale only
      "concept-hashes.ts",
      "content-hashes.ts",
      "curriculum-copy-hashes.ts",
      "exercise-hashes.ts",
      "exercise-message-hashes.ts",
      "interpreter-message-hashes.ts",
      "level-message-hashes.ts",
      "messages-hashes.ts",
      // locale-invariant: fingerprints for images, icons and CSS
      "asset-hashes.ts",
      "concept-icon-hashes.ts",
      "css-asset-hashes.json",
      // locale-varying, but published by this repo alone and so pointer-free.
      // See the resolver test below for why that is not the binding this file
      // exists to prevent.
      "video-hashes.ts"
    ]);

    const actual = fs.existsSync(GENERATED_DIR) ? fs.readdirSync(GENERATED_DIR).sort() : [];
    const unexpected = actual.filter((name) => !ALLOWED.has(name));

    expect(unexpected).toEqual([]);
  });

  /**
   * A hash manifest is only harmless while nothing reads a NON-default locale
   * out of it. `createHashResolver` is the one place allowed to touch one, and it
   * reads the compiled value solely for the default locale.
   *
   * So: every module importing a hash manifest must also import the resolver.
   * A module that reads a manifest without one is indexing it by locale directly,
   * which is exactly the build-time binding being removed.
   *
   * The exemption is for manifests whose artifacts THIS REPO is the only
   * publisher of. A pointer decouples a locale's content from the front-end
   * release cycle, and that is worth having precisely when someone else
   * publishes the content: the i18n repo pushes a translation to R2 and it goes
   * live with no deploy here. Videos are the opposite case. They are authored in
   * `curriculum/src/videos/videos.json`, in this repo, so a new recording is a
   * commit here and cannot appear without a deploy anyway. A pointer would add a
   * round trip and a failure mode to buy a decoupling from ourselves.
   *
   * The distinction to hold on to is that this is about the PUBLISHER, not about
   * whether the artifact varies by locale. The video index does vary by locale,
   * and a locale with its own recording gets its own artifact; what it never
   * needs is for anyone but this build to say which one.
   */
  it("reads every hash manifest through the pointer resolver", () => {
    const HASH_MANIFEST = /from\s+["'][^"']*generated\/[\w-]*(hashes)["']/;
    const LOCALE_INVARIANT = /generated\/(asset-hashes|concept-icon-hashes|css-asset-hashes)/;
    const FRONT_END_PUBLISHED = /generated\/video-hashes/;

    const offenders = sourceFiles().filter((file) => {
      const src = fs.readFileSync(file, "utf8");
      if (!HASH_MANIFEST.test(src)) return false;
      if (LOCALE_INVARIANT.test(src)) return false;
      if (FRONT_END_PUBLISHED.test(src)) return false;
      return !src.includes("catalogPointer");
    });

    expect(offenders.map((f) => path.relative(APP_DIR, f))).toEqual([]);
  });
});
