/**
 * Guards for the next-intl message catalogs.
 *
 * The unit-test suite mocks next-intl, so a syntactically invalid ICU message
 * (unclosed brace, malformed plural, bad tag) would only surface at runtime.
 * This test runs every catalog string through the real ICU parser, and also
 * enforces the catalog invariants documented in .context/i18n.md.
 */
import fs from "fs";
import path from "path";
import { IntlMessageFormat } from "intl-messageformat";

// Catalogs are DISCOVERED on disk rather than statically imported. Only `en` is
// authored in this repo; every other locale's catalog is owned by the i18n repo
// and published straight to the cache tree, so which files are present here is a
// data question that must never be a code change in this test.
const MESSAGES_DIR = path.resolve(__dirname, "../../messages");

function readCatalogs(): Record<string, unknown> {
  const catalogs: Record<string, unknown> = {};
  for (const file of fs.readdirSync(MESSAGES_DIR)) {
    if (!file.endsWith(".json")) continue;
    catalogs[path.basename(file, ".json")] = JSON.parse(fs.readFileSync(path.join(MESSAGES_DIR, file), "utf8"));
  }
  return catalogs;
}

const CATALOGS = readCatalogs();
const LOCALES = Object.keys(CATALOGS);
const en = CATALOGS.en;

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

describe("message catalogs", () => {
  it("finds the canonical en catalog", () => {
    // Everything below iterates a discovered list, which would pass vacuously if
    // discovery ever returned nothing. This is the check that it did not.
    expect(en).toBeDefined();
    expect(Object.keys(flatten(en)).length).toBeGreaterThan(0);
  });

  it.each(LOCALES)("every %s message is valid ICU", (locale) => {
    const failures: string[] = [];
    for (const [key, message] of Object.entries(flatten(CATALOGS[locale]))) {
      try {
        new IntlMessageFormat(message, locale);
      } catch (error) {
        failures.push(`${key}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    expect(failures).toEqual([]);
  });

  // Any catalog that IS present must match en's key tree exactly. Vacuous when
  // en is the only one on disk, which is the normal state now that the i18n repo
  // publishes the rest.
  it("every catalog present has the same key tree as en", () => {
    // A plain loop rather than `it.each`, which throws on an empty table: en
    // alone is the expected steady state, not a failure.
    const enKeys = Object.keys(flatten(en)).sort();
    for (const locale of LOCALES.filter((locale) => locale !== "en")) {
      expect({ locale, keys: Object.keys(flatten(CATALOGS[locale])).sort() }).toEqual({ locale, keys: enKeys });
    }
  });

  it("plural messages stay within the subset the jest next-intl mock supports", () => {
    // jest.setup.js mocks next-intl with a regex-based ICU approximation: plurals
    // must be exactly `{arg, plural, one {...} other {...}}` where the bodies
    // contain at most simple `{var}` placeholders (no nested plural/select).
    // A message outside this subset would render correctly at runtime but
    // silently produce wrong output in unit tests — fail loudly here instead.
    // If you need a richer plural, upgrade the mock in jest.setup.js first.
    const supportedPlural = /\{\w+, plural, one \{(?:[^{}]|\{\w+\})*\} other \{(?:[^{}]|\{\w+\})*\}\}/g;
    for (const locale of LOCALES) {
      const unsupported = Object.entries(flatten(CATALOGS[locale]))
        .filter(([, message]) => message.replace(supportedPlural, "").includes(", plural,"))
        .map(([key]) => `${locale}:${key}`);
      expect(unsupported).toEqual([]);
    }
  });

  it("no message has leading or trailing whitespace", () => {
    for (const locale of LOCALES) {
      const padded = Object.entries(flatten(CATALOGS[locale]))
        .filter(([, message]) => message !== message.trim())
        .map(([key]) => `${locale}:${key}`);
      expect(padded).toEqual([]);
    }
  });
});
