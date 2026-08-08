/**
 * Guards for the next-intl message catalog.
 *
 * The unit-test suite mocks next-intl, so a syntactically invalid ICU message
 * (unclosed brace, malformed plural, bad tag) would only surface at runtime.
 * This test runs every catalog string through the real ICU parser, and also
 * enforces the catalog invariants documented in .context/i18n.md.
 *
 * There is one catalog, `messages.json`. Only English is authored in this repo;
 * every other locale's catalog is authored in the i18n repo and published
 * straight to the cache tree, and its key parity with this file is guarded
 * there.
 */
import fs from "fs";
import path from "path";
import { IntlMessageFormat } from "intl-messageformat";

const MESSAGES_FILE = path.resolve(__dirname, "../../messages.json");
const LOCALE = "en";

const catalog = JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8")) as unknown;

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

const messages = flatten(catalog);

describe("message catalog", () => {
  it("is not empty", () => {
    // Everything below iterates the flattened catalog, which would pass
    // vacuously if it were empty. This is the check that it is not.
    expect(Object.keys(messages).length).toBeGreaterThan(0);
  });

  it("every message is valid ICU", () => {
    const failures: string[] = [];
    for (const [key, message] of Object.entries(messages)) {
      try {
        new IntlMessageFormat(message, LOCALE);
      } catch (error) {
        failures.push(`${key}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    expect(failures).toEqual([]);
  });

  it("plural messages stay within the subset the jest next-intl mock supports", () => {
    // jest.setup.js mocks next-intl with a regex-based ICU approximation: plurals
    // must be exactly `{arg, plural, one {...} other {...}}` where the bodies
    // contain at most simple `{var}` placeholders (no nested plural/select).
    // A message outside this subset would render correctly at runtime but
    // silently produce wrong output in unit tests — fail loudly here instead.
    // If you need a richer plural, upgrade the mock in jest.setup.js first.
    const supportedPlural = /\{\w+, plural, one \{(?:[^{}]|\{\w+\})*\} other \{(?:[^{}]|\{\w+\})*\}\}/g;
    const unsupported = Object.entries(messages)
      .filter(([, message]) => message.replace(supportedPlural, "").includes(", plural,"))
      .map(([key]) => key);
    expect(unsupported).toEqual([]);
  });

  it("no message has leading or trailing whitespace", () => {
    const padded = Object.entries(messages)
      .filter(([, message]) => message !== message.trim())
      .map(([key]) => key);
    expect(padded).toEqual([]);
  });
});
