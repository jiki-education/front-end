/**
 * Guards for the curriculum level display catalog
 * (`curriculum/src/levels/messages.json`).
 *
 * These are curriculum content, not app chrome, so they live with the curriculum
 * rather than in `messages.json` at the app root. English is the only catalog on
 * disk here — every translation of it is authored in the i18n repo and published
 * straight to the cache tree — so what is guarded is that the one authored
 * catalog stays in lockstep with the level registry (which remains the source of
 * truth for level ids and their canonical English titles), and that its entries
 * are well formed. Cross-locale key parity is the i18n repo's guard, against the
 * same file, and cannot be checked from here.
 */
import fs from "fs";
import path from "path";
import { levels } from "@jiki/curriculum";

const CATALOG_FILE = path.join(__dirname, "../../../curriculum/src/levels/messages.json");

function readCatalog(): Record<string, { title: string }> {
  return JSON.parse(fs.readFileSync(CATALOG_FILE, "utf-8"));
}

describe("level message catalog", () => {
  it("covers exactly the level registry, in order", () => {
    expect(Object.keys(readCatalog())).toEqual(levels.map((level) => level.id));
  });

  it("titles match the level registry", () => {
    const catalog = readCatalog();
    for (const level of levels) {
      expect(catalog[level.id].title).toBe(level.title);
    }
  });

  it("every entry has a well-formed title", () => {
    for (const [id, entry] of Object.entries(readCatalog())) {
      expect(typeof entry.title).toBe("string");
      expect(entry.title).toBe(entry.title.trim());
      expect(entry.title.length).toBeGreaterThan(0);
      expect(Object.keys(entry)).toEqual(["title"]);
      expect(id).toMatch(/^[a-z0-9-]+$/);
    }
  });
});
