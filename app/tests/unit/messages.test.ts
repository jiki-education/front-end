/**
 * Guards for the next-intl message catalogs.
 *
 * The unit-test suite mocks next-intl, so a syntactically invalid ICU message
 * (unclosed brace, malformed plural, bad tag) would only surface at runtime.
 * This test runs every catalog string through the real ICU parser, and also
 * enforces the catalog invariants documented in .context/i18n.md.
 */
import { IntlMessageFormat } from "intl-messageformat";
import en from "@/messages/en.json";
import hu from "@/messages/hu.json";

const CATALOGS = { en, hu } as const;

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
  it.each(Object.keys(CATALOGS) as (keyof typeof CATALOGS)[])("every %s message is valid ICU", (locale) => {
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

  it("en and hu have identical key trees", () => {
    expect(Object.keys(flatten(hu)).sort()).toEqual(Object.keys(flatten(en)).sort());
  });

  it("plural messages stay within the subset the jest next-intl mock supports", () => {
    // jest.setup.js mocks next-intl with a regex-based ICU approximation: plurals
    // must be exactly `{arg, plural, one {...} other {...}}` where the bodies
    // contain at most simple `{var}` placeholders (no nested plural/select).
    // A message outside this subset would render correctly at runtime but
    // silently produce wrong output in unit tests — fail loudly here instead.
    // If you need a richer plural, upgrade the mock in jest.setup.js first.
    const supportedPlural = /\{\w+, plural, one \{(?:[^{}]|\{\w+\})*\} other \{(?:[^{}]|\{\w+\})*\}\}/g;
    for (const locale of Object.keys(CATALOGS) as (keyof typeof CATALOGS)[]) {
      const unsupported = Object.entries(flatten(CATALOGS[locale]))
        .filter(([, message]) => message.replace(supportedPlural, "").includes(", plural,"))
        .map(([key]) => `${locale}:${key}`);
      expect(unsupported).toEqual([]);
    }
  });

  it("no message has leading or trailing whitespace", () => {
    for (const locale of Object.keys(CATALOGS) as (keyof typeof CATALOGS)[]) {
      const padded = Object.entries(flatten(CATALOGS[locale]))
        .filter(([, message]) => message !== message.trim())
        .map(([key]) => `${locale}:${key}`);
      expect(padded).toEqual([]);
    }
  });
});
