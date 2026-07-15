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

  it("no message has leading or trailing whitespace", () => {
    for (const locale of Object.keys(CATALOGS) as (keyof typeof CATALOGS)[]) {
      const padded = Object.entries(flatten(CATALOGS[locale]))
        .filter(([, message]) => message !== message.trim())
        .map(([key]) => `${locale}:${key}`);
      expect(padded).toEqual([]);
    }
  });
});
