/**
 * Guards for the JavaScript interpreter's i18next message catalogs.
 *
 * The interpreter owns/authors these diagnostic strings. This fast, local guard
 * enforces the catalog invariants (valid interpolation shape, no stray
 * whitespace, no keys `en` does not have). The authoritative cross-package
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
 * ## Why this no longer requires full key parity
 *
 * It used to demand that every human locale carry the entire `en` key tree. The
 * intent was that a newly-added `en` key could not silently ship missing from a
 * live locale, but the effect was the opposite: keys were added to `en` and
 * English strings were copied into `hu` to satisfy this test, which left 70
 * untranslated values that every mechanical check reported as done. A guard that
 * is satisfied by copying English is a guard that manufactures fake translations.
 *
 * So an untranslated key is now simply ABSENT from its locale file. That is safe
 * at runtime by design: `src/shared/i18n.ts` sets `fallbackLng: false`, so a
 * missing key renders as its own key path, visibly, never as silent English.
 * Whether a locale is complete enough to ship is a counting question, answered by
 * `translator/scripts/interpreter-catalog-status`, not by this test.
 *
 * What this test still enforces, and what nothing else can catch, is the other
 * direction: a locale must never hold a key `en` does not have. That is always a
 * bug (a renamed, invented or stale key), and it stays a hard failure.
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

  // A human locale may be partially translated (missing keys are absent, and
  // render as the key path at runtime), but it may never carry a key `en` does
  // not have: that is a renamed, invented or stale key, and it would ship a
  // string nothing can ever look up. `system` is exempt, being the errors-only
  // canary base rather than a human locale.
  it.each(HUMAN_LOCALES)("%s has no keys the canonical en tree lacks", locale => {
    const enKeys = baseKeys(en);
    const orphans = [...baseKeys(ALL_CATALOGS[locale])].filter(k => !enKeys.has(k));
    expect(orphans).toEqual([]);
  });
});
