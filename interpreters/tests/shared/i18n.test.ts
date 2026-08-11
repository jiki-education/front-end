import { describe, expect, test } from "vitest";
import { createTranslator, tagLocale } from "@shared/i18n";

/**
 * The translator resolves plural and ordinal variants through `Intl.PluralRules`,
 * so it has to be told the real locale. These cover the two ways that can go
 * wrong quietly: an untagged dict, and a locale code spelled in a form i18next
 * normalises differently from us.
 */
describe("createTranslator", () => {
  const messages = {
    greeting: "hello",
    nth_ordinal_one: "{{count}}st",
    nth_ordinal_two: "{{count}}nd",
    nth_ordinal_few: "{{count}}rd",
    nth_ordinal_other: "{{count}}th",
  };

  test("resolves ordinals against the tagged locale's CLDR categories", () => {
    const t = createTranslator(tagLocale("en", messages));

    expect([1, 2, 3, 4, 11, 21, 22, 23].map(count => t("nth", { count, ordinal: true }))).toEqual([
      "1st",
      "2nd",
      "3rd",
      "4th",
      "11th",
      "21st",
      "22nd",
      "23rd",
    ]);
  });

  test("a non-canonical locale code still finds its own messages", () => {
    // We name the locale `pt-pt` (the catalog directory name); i18next resolves
    // against `pt-PT`. Without canonicalising, every lookup would miss and every
    // string would render as its key.
    const t = createTranslator(tagLocale("pt-pt", { greeting: "olá" }));

    expect(t("greeting")).toBe("olá");
  });

  test("the locale tag is never itself a lookupable message", () => {
    const t = createTranslator(tagLocale("en", messages));

    expect(t("$locale")).toBe("$locale");
    expect(t("greeting")).toBe("hello");
  });

  test("an explicit locale argument overrides the tag", () => {
    const t = createTranslator(tagLocale("en", messages), "fr");

    // French ordinal categories are one (1) and other, so 2 and 3 resolve to
    // `_other` where English would have picked `_two` and `_few`.
    expect(t("nth", { count: 1, ordinal: true })).toBe("1st");
    expect(t("nth", { count: 2, ordinal: true })).toBe("2th");
    expect(t("nth", { count: 3, ordinal: true })).toBe("3th");
  });
});
