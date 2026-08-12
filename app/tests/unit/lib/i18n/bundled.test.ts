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
const GLOBAL_ERROR_COPY = path.join(APP_DIR, "lib", "i18n", "generated", "global-error-copy.ts");
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
      "css-asset-hashes.json"
    ]);

    const actual = fs.existsSync(GENERATED_DIR) ? fs.readdirSync(GENERATED_DIR).sort() : [];
    const unexpected = actual.filter((name) => !ALLOWED.has(name));

    expect(unexpected).toEqual([]);
  });

  /**
   * The ONE documented exception, held to being exactly one.
   *
   * `app/global-error.tsx` renders when the app has already failed, possibly
   * BECAUSE catalog loading failed, so it cannot await a pointer or a fetch. Its
   * three strings are therefore inlined for every locale into
   * lib/i18n/generated/global-error-copy.ts and committed, since no build has an
   * i18n checkout.
   *
   * That is a real exception to everything above, so it is written down here
   * rather than left to be noticed: exactly one module may read it, and it is the
   * accessor that exists to be that module. Anything else importing it is a
   * second build-time locale binding, which is what this file exists to prevent.
   */
  it("has exactly one reader of the inlined crash-page copy", () => {
    expect(fs.existsSync(GLOBAL_ERROR_COPY)).toBe(true);

    const importers = sourceFiles().filter((file) =>
      /from\s+["'][^"']*generated\/global-error-copy["']/.test(fs.readFileSync(file, "utf8"))
    );

    expect(importers.map((f) => path.relative(APP_DIR, f))).toEqual(["lib/i18n/globalErrorCopy.ts"]);
  });

  /**
   * A hash manifest is only harmless while nothing reads a NON-default locale
   * out of it. `createHashResolver` is the one place allowed to touch one, and it
   * reads the compiled value solely for the default locale.
   *
   * So: every module importing a hash manifest must also import the resolver.
   * A module that reads a manifest without one is indexing it by locale directly,
   * which is exactly the build-time binding being removed.
   */
  it("reads every hash manifest through the pointer resolver", () => {
    const HASH_MANIFEST = /from\s+["'][^"']*generated\/[\w-]*(hashes)["']/;
    const LOCALE_INVARIANT = /generated\/(asset-hashes|concept-icon-hashes|css-asset-hashes)/;

    const offenders = sourceFiles().filter((file) => {
      const src = fs.readFileSync(file, "utf8");
      if (!HASH_MANIFEST.test(src)) return false;
      if (LOCALE_INVARIANT.test(src)) return false;
      return !src.includes("catalogPointer");
    });

    expect(offenders.map((f) => path.relative(APP_DIR, f))).toEqual([]);
  });
});
