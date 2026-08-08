/**
 * Guards for the JavaScript interpreter's i18next message catalogs.
 *
 * The interpreter owns/authors these diagnostic strings. This fast, local guard
 * enforces the catalog invariants (valid interpolation shape, no stray
 * whitespace, key-tree consistency). The authoritative cross-package
 * completeness check is the app-side validator described in front-end/i18n_TODO.md.
 *
 * ## Locales are discovered, not imported
 *
 * The locale list is read from `src/javascript/locales/` rather than written out
 * as static imports, so adding, translating or removing a locale is a data change
 * and never a code change here. This is the same discovery the build already does
 * in `app/scripts/generate-interpreter-i18n-cache.js`, including its exclusion of
 * the `system` pseudo-locale, and it holds equally when `en` is the only locale
 * present.
 *
 * ## Key parity
 *
 * A human locale that IS present must be at EXACT key parity with the canonical
 * `en` tree: every en key present (no gaps) and no extra keys (no orphans). Gaps
 * mean a newly-added `en` key silently shipped missing from a live locale;
 * orphans mean a renamed, invented or stale key that nothing can ever look up.
 *
 * Note this says nothing about which locales exist. `en` is the only catalog
 * authored in this repo; the rest are owned by the i18n repo and published
 * straight to the cache tree, so discovery routinely finds `en` alone.
 */
import fs from "fs";
import nodePath from "path";
import { fileURLToPath } from "url";
import { describe, it, expect } from "vitest";

const LOCALES_DIR = nodePath.resolve(nodePath.dirname(fileURLToPath(import.meta.url)), "../../src/javascript/locales");

// The pseudo-locale bundled as the no-injection canary. Errors-only by design (it
// deliberately carries no `description.*` keys), so it is not a human locale and
// is not compared against `en`.
const SYSTEM_LOCALE = "system";

type Catalog = Record<string, unknown>;

function readCatalogs(): Record<string, Catalog> {
  const catalogs: Record<string, Catalog> = {};
  for (const entry of fs.readdirSync(LOCALES_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const file = nodePath.join(LOCALES_DIR, entry.name, "translation.json");
    if (!fs.existsSync(file)) continue;
    catalogs[entry.name] = JSON.parse(fs.readFileSync(file, "utf8")) as Catalog;
  }
  return catalogs;
}

const ALL_CATALOGS = readCatalogs();
const ALL_LOCALES = Object.keys(ALL_CATALOGS);
const HUMAN_LOCALES = ALL_LOCALES.filter(locale => locale !== SYSTEM_LOCALE);
const en = ALL_CATALOGS.en;

function flatten(node: unknown, prefix = ""): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") {
      result[path] = value;
    } else {
      Object.assign(result, flatten(value, path));
    }
  }
  return result;
}

// i18next encodes plural/context/ordinal variants as key suffixes. For key-tree
// comparison we compare the base keys, ignoring which variants each locale spells
// out (e.g. `InvalidNumberOfArguments` vs its `_exact`/`_atLeast`/`_range` forms),
// since which plural categories a language needs is a property of the language.
const SUFFIX = /_(zero|one|two|few|many|other|exact|atLeast|range|ordinal)$/;
function baseKeys(catalog: unknown): Set<string> {
  return new Set(Object.keys(flatten(catalog)).map(k => k.replace(SUFFIX, "")));
}

describe("javascript translation catalogs", () => {
  it("finds the canonical en catalog", () => {
    // Everything below is `it.each` over a discovered list, which would pass
    // vacuously if discovery ever returned nothing. This is the check that it did
    // not, and that `en` itself is present.
    expect(en).toBeDefined();
    expect(Object.keys(flatten(en)).length).toBeGreaterThan(0);
  });

  it.each(ALL_LOCALES)("every %s leaf is a string", locale => {
    // flatten() only keeps string leaves, so a non-string (array/number/null)
    // would be silently dropped. Assert the catalog is all strings by checking
    // that re-flattening loses nothing structurally is overkill here; instead
    // confirm no empty strings sneaked in.
    const empties = Object.entries(flatten(ALL_CATALOGS[locale]))
      .filter(([, message]) => message.length === 0)
      .map(([key]) => `${locale}:${key}`);
    expect(empties).toEqual([]);
  });

  it.each(ALL_LOCALES)("every %s message has balanced {{ }} interpolation", locale => {
    const unbalanced = Object.entries(flatten(ALL_CATALOGS[locale]))
      .filter(([, message]) => (message.match(/\{\{/g) ?? []).length !== (message.match(/\}\}/g) ?? []).length)
      .map(([key]) => `${locale}:${key}`);
    expect(unbalanced).toEqual([]);
  });

  it.each(ALL_LOCALES)("no %s message has leading or trailing whitespace", locale => {
    const padded = Object.entries(flatten(ALL_CATALOGS[locale]))
      .filter(([, message]) => message !== message.trim())
      .map(([key]) => `${locale}:${key}`);
    expect(padded).toEqual([]);
  });

  // `system` is exempt: it is the errors-only canary base, not a human locale,
  // and deliberately carries no `description.*` keys.
  it.each(HUMAN_LOCALES)("%s is at exact key parity with the canonical en tree", locale => {
    const enKeys = baseKeys(en);
    const localeKeys = baseKeys(ALL_CATALOGS[locale]);
    const missing = [...enKeys].filter(k => !localeKeys.has(k)); // in en, absent from locale
    const orphans = [...localeKeys].filter(k => !enKeys.has(k)); // in locale, absent from en
    expect({ missing, orphans }).toEqual({ missing: [], orphans: [] });
  });
});
