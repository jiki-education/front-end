import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

/**
 * Guard for curriculum message catalogs, mirroring the app's
 * `tests/unit/messages.test.ts`. Every exercise that has a `locales/` dir must:
 *   - have an `en` catalog (canonical),
 *   - keep every other locale structurally identical to `en` (same key tree), and
 *   - have no leaf string with leading/trailing whitespace
 *     (whitespace-padded fragments are how string-concatenation bugs sneak back in).
 *
 * The scan is generic, so this guard covers new exercise catalogs automatically as
 * the extraction sweep proceeds.
 */

const EXERCISES_DIR = path.resolve(fileURLToPath(import.meta.url), "../../../src/exercises");

type Tree = Record<string, unknown>;

function leafPaths(obj: Tree, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    return v !== null && typeof v === "object" ? leafPaths(v as Tree, key) : [key];
  });
}

function leafStrings(obj: Tree, prefix = ""): [string, string][] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object") return leafStrings(v as Tree, key);
    return typeof v === "string" ? [[key, v] as [string, string]] : [];
  });
}

function exercisesWithLocales(): { slug: string; localesDir: string }[] {
  return readdirSync(EXERCISES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({ slug: d.name, localesDir: path.join(EXERCISES_DIR, d.name, "locales") }))
    .filter((e) => existsSync(e.localesDir));
}

function loadCatalog(localesDir: string, locale: string): Tree {
  return JSON.parse(readFileSync(path.join(localesDir, locale, "translation.json"), "utf-8")) as Tree;
}

const catalogs = exercisesWithLocales();

describe("curriculum message catalogs", () => {
  it("has at least one exercise catalog to guard (prototype: dnd-roll)", () => {
    expect(catalogs.length).toBeGreaterThan(0);
  });

  for (const { slug, localesDir } of catalogs) {
    describe(slug, () => {
      const locales = readdirSync(localesDir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name);

      it("has an `en` catalog", () => {
        expect(locales).toContain("en");
      });

      // NB: catalogs are read inside each `it`, never at collection time — a
      // mid-migration exercise with an empty `locales/` dir must fail its own
      // test, not crash the whole suite at collection.
      for (const locale of locales.filter((l) => l !== "en")) {
        it(`${locale} key tree is identical to en`, () => {
          const enKeys = leafPaths(loadCatalog(localesDir, "en")).sort();
          expect(leafPaths(loadCatalog(localesDir, locale)).sort()).toEqual(enKeys);
        });
      }

      for (const locale of locales) {
        it(`${locale} has no leading/trailing whitespace in any message`, () => {
          for (const [key, value] of leafStrings(loadCatalog(localesDir, locale))) {
            expect(value, `${slug}/${locale} ${key}`).toBe(value.trim());
          }
        });
      }
    });
  }
});
