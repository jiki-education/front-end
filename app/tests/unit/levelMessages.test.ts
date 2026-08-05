/**
 * Guards for the curriculum level display catalogs
 * (`curriculum/src/levels/locales/{locale}/translation.json`).
 *
 * These are curriculum content, not app chrome, so they live with the curriculum
 * rather than in `messages/*.json` — but they need the same invariants: every
 * locale carries the same key tree, and the `en` catalog stays in lockstep with
 * the level registry (which remains the source of truth for level ids and their
 * canonical English titles).
 */
import fs from "fs";
import path from "path";
import { levels } from "@jiki/curriculum";
import { ALL_LOCALES } from "@/lib/locales";

const LOCALES_DIR = path.join(__dirname, "../../../curriculum/src/levels/locales");

function readCatalog(locale: string): Record<string, { title: string }> {
  return JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, locale, "translation.json"), "utf-8"));
}

const LOCALES = fs
  .readdirSync(LOCALES_DIR, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

describe("level message catalogs", () => {
  it("ships a catalog for every locale in ALL_LOCALES", () => {
    expect(LOCALES).toEqual([...ALL_LOCALES].sort());
  });

  it("the en catalog covers exactly the level registry, in order", () => {
    expect(Object.keys(readCatalog("en"))).toEqual(levels.map((level) => level.id));
  });

  it("the en titles match the level registry", () => {
    const en = readCatalog("en");
    for (const level of levels) {
      expect(en[level.id].title).toBe(level.title);
    }
  });

  it.each(LOCALES)("the %s catalog has the same key tree as en", (locale) => {
    expect(Object.keys(readCatalog(locale)).sort()).toEqual(Object.keys(readCatalog("en")).sort());
  });

  it.each(LOCALES)("every %s entry has a well-formed title", (locale) => {
    for (const [id, entry] of Object.entries(readCatalog(locale))) {
      expect(typeof entry.title).toBe("string");
      expect(entry.title).toBe(entry.title.trim());
      expect(entry.title.length).toBeGreaterThan(0);
      expect(Object.keys(entry)).toEqual(["title"]);
      expect(id).toMatch(/^[a-z0-9-]+$/);
    }
  });
});
