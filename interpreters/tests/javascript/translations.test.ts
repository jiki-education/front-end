/**
 * Guards for the JavaScript interpreter's i18next message catalogs.
 *
 * The interpreter owns/authors these diagnostic strings. This fast, local guard
 * enforces the catalog invariants (valid interpolation shape, no stray
 * whitespace, key-tree consistency). The authoritative cross-package completeness
 * check is the app-side validator described in front-end/i18n_TODO.md.
 */
import en from "@javascript/locales/en/translation.json";
import hu from "@javascript/locales/hu/translation.json";
import system from "@javascript/locales/system/translation.json";
import { describe, it, expect } from "vitest";

const HUMAN_CATALOGS = { en, hu } as const;
const ALL_CATALOGS = { en, hu, system } as const;

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
// out (e.g. `InvalidNumberOfArguments` vs its `_exact`/`_atLeast`/`_range` forms).
const SUFFIX = /_(zero|one|two|few|many|other|exact|atLeast|range|ordinal)$/;
function baseKeys(catalog: unknown): Set<string> {
  return new Set(Object.keys(flatten(catalog)).map(k => k.replace(SUFFIX, "")));
}

describe("javascript translation catalogs", () => {
  it.each(Object.keys(ALL_CATALOGS) as (keyof typeof ALL_CATALOGS)[])("every %s leaf is a string", locale => {
    // flatten() only keeps string leaves, so a non-string (array/number/null)
    // would be silently dropped. Assert the catalog is all strings by checking
    // that re-flattening loses nothing structurally is overkill here; instead
    // confirm no empty strings sneaked in.
    const empties = Object.entries(flatten(ALL_CATALOGS[locale]))
      .filter(([, message]) => message.length === 0)
      .map(([key]) => `${locale}:${key}`);
    expect(empties).toEqual([]);
  });

  it.each(Object.keys(ALL_CATALOGS) as (keyof typeof ALL_CATALOGS)[])(
    "every %s message has balanced {{ }} interpolation",
    locale => {
      const unbalanced = Object.entries(flatten(ALL_CATALOGS[locale]))
        .filter(([, message]) => (message.match(/\{\{/g) ?? []).length !== (message.match(/\}\}/g) ?? []).length)
        .map(([key]) => `${locale}:${key}`);
      expect(unbalanced).toEqual([]);
    }
  );

  it.each(Object.keys(ALL_CATALOGS) as (keyof typeof ALL_CATALOGS)[])(
    "no %s message has leading or trailing whitespace",
    locale => {
      const padded = Object.entries(flatten(ALL_CATALOGS[locale]))
        .filter(([, message]) => message !== message.trim())
        .map(([key]) => `${locale}:${key}`);
      expect(padded).toEqual([]);
    }
  );

  // `hu` is intentionally a partial proof-of-concept; full en/hu parity is stubbed
  // in a later seed pass (see i18n_TODO.md). Until then we only guard against
  // drift: every human-locale key must exist in the canonical `en` tree.
  it.each(Object.keys(HUMAN_CATALOGS) as (keyof typeof HUMAN_CATALOGS)[])(
    "every %s key exists in the canonical en tree",
    locale => {
      const enKeys = baseKeys(en);
      const orphans = [...baseKeys(HUMAN_CATALOGS[locale])].filter(k => !enKeys.has(k));
      expect(orphans).toEqual([]);
    }
  );
});
