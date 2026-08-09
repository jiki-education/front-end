import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

/**
 * Guard for curriculum message catalogs. Every exercise (and exercise family)
 * that ships a `messages.json` must have no leaf string with leading/trailing
 * whitespace — whitespace-padded fragments are how string-concatenation bugs
 * sneak back in.
 *
 * The curriculum authors English and nothing else: every translation of these
 * catalogs lives in the i18n repo and is published from there, and key parity
 * between a translation and its English original is guarded there, against these
 * same files. So there is nothing to compare here and no locale to enumerate.
 *
 * The scan is generic, so this guard covers new catalogs automatically.
 */

const EXERCISES_DIR = path.resolve(fileURLToPath(import.meta.url), "../../../src/exercises");
const EXERCISE_CATEGORIES_DIR = path.resolve(fileURLToPath(import.meta.url), "../../../src/exercise-categories");

type Tree = Record<string, unknown>;

function leafStrings(obj: Tree, prefix = ""): [string, string][] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object") return leafStrings(v as Tree, key);
    return typeof v === "string" ? [[key, v] as [string, string]] : [];
  });
}

function catalogsIn(root: string, labelPrefix = ""): { slug: string; file: string }[] {
  if (!existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => ({ slug: labelPrefix + d.name, file: path.join(root, d.name, "messages.json") }))
    .filter((e) => existsSync(e.file));
}

function loadCatalog(file: string): Tree {
  return JSON.parse(readFileSync(file, "utf-8")) as Tree;
}

// Both per-exercise catalogs and per-family base catalogs (authored once, merged
// into members at build time) are guarded by the same whitespace rule.
const catalogs = [...catalogsIn(EXERCISES_DIR), ...catalogsIn(EXERCISE_CATEGORIES_DIR, "exercise-categories/")];

describe("curriculum message catalogs", () => {
  it("has at least one catalog to guard", () => {
    expect(catalogs.length).toBeGreaterThan(0);
  });

  for (const { slug, file } of catalogs) {
    // NB: the catalog is read inside the `it`, never at collection time, so a
    // malformed catalog fails its own test rather than crashing the whole suite.
    it(`${slug} has no leading/trailing whitespace in any message`, () => {
      for (const [key, value] of leafStrings(loadCatalog(file))) {
        expect(value, `${slug} ${key}`).toBe(value.trim());
      }
    });
  }
});
