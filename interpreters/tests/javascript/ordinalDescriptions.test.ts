import { describe, expect, test } from "vitest";
import { interpret } from "@javascript/interpreter";
import { tagLocale } from "@shared/i18n";
import type { Messages } from "@shared/i18n";
import enMessages from "@javascript/locales/en/translation.json";

/**
 * "The Nth iteration" is the one place a description carries an ordinal, and
 * ordinals are orthography, not arithmetic: English needs 1st/2nd/3rd/21st,
 * Hungarian writes "1." for all of them, and other languages inflect for case
 * and gender. This used to be an `addOrdinalSuffix()` in TypeScript that appended
 * "st"/"nd"/"rd"/"th" before the string ever reached the catalog, so EVERY locale
 * rendered an English ordinal inside its own sentence.
 *
 * It is now an i18next ordinal plural (`{ count, ordinal: true }`), resolved
 * against the injected locale's own CLDR ordinal categories. These tests assert
 * the rendered output rather than the key shape, because the key shape passing is
 * exactly what the old bug looked like from the inside.
 *
 * ## Why the non-English cases use fixtures
 *
 * `en` is the only catalog authored in this repo; every other locale is owned by
 * the i18n repo and published straight to the cache tree, so there is no `hu` or
 * `fr` file here to import. What these cases need to prove is not the wording of
 * any particular translation but that the CLDR categories are resolved against
 * the INJECTED locale rather than English, and a fixture spelling its categories
 * as placeholders proves exactly that without asserting on prose this repo does
 * not own.
 */

const REPEAT_25 = "repeat(25) {\n}";

function iterationDescriptions(messages: Messages): string[] {
  const { frames, success } = interpret(REPEAT_25, { localeMessages: messages });
  expect(success).toBe(true);
  return frames.map(frame => (frame as unknown as { description: string }).description);
}

/**
 * A catalog carrying only the `description.repeatStatement.repeatResult` variants
 * named in `categories`. Values are placeholders, not translations: the assertion
 * is about which category i18next picks, so the text only has to be identifiable.
 */
function fixtureCatalog(categories: string[]): Messages {
  const repeatResult = Object.fromEntries(
    categories.map(category => [`repeatResult_ordinal_${category}`, `[${category}] {{count}}`])
  );
  return { description: { repeatStatement: repeatResult } } as unknown as Messages;
}

describe("ordinal iteration descriptions", () => {
  test("English uses real English ordinals, including the teens and the twenties", () => {
    const descriptions = iterationDescriptions(tagLocale("en", enMessages as Messages));

    expect(descriptions[0]).toContain("This line started the 1st iteration of this repeat block.");
    expect(descriptions[1]).toContain("This line started the 2nd iteration of this repeat block.");
    expect(descriptions[2]).toContain("This line started the 3rd iteration of this repeat block.");
    expect(descriptions[3]).toContain("This line started the 4th iteration of this repeat block.");
    // The cases the hand-rolled suffix function existed to get right, and which a
    // naive one/other plural resolver gets wrong.
    expect(descriptions[10]).toContain("the 11th iteration");
    expect(descriptions[11]).toContain("the 12th iteration");
    expect(descriptions[12]).toContain("the 13th iteration");
    expect(descriptions[20]).toContain("the 21st iteration");
    expect(descriptions[21]).toContain("the 22nd iteration");
    expect(descriptions[22]).toContain("the 23rd iteration");
  });

  test("Hungarian resolves its own ordinal categories, not English's", () => {
    // Hungarian's CLDR ordinal categories are `one` (1 and 5) and `other`. English
    // would ask for `two` at 2 and `few` at 3, neither of which Hungarian spells,
    // so English rules applied here would surface a key path.
    const descriptions = iterationDescriptions(tagLocale("hu", fixtureCatalog(["one", "other"])));

    expect(descriptions[0]).toContain("[one] 1");
    expect(descriptions[4]).toContain("[one] 5");
    expect(descriptions[1]).toContain("[other] 2");
    expect(descriptions[2]).toContain("[other] 3");
    expect(descriptions[22]).toContain("[other] 23");

    // The fixture spells only `repeatResult`, so that is the key under test here.
    for (const description of descriptions) {
      expect(description).not.toContain("description.repeatStatement.repeatResult");
      expect(description).not.toMatch(/\d(st|nd|rd|th)\b/);
    }
  });

  test("French distinguishes its single ordinal form, which English rules cannot express", () => {
    // French ordinals are `one` for 1 alone and `other` for everything else, so 21
    // takes `other` where English takes `one`.
    const descriptions = iterationDescriptions(tagLocale("fr", fixtureCatalog(["one", "other"])));

    expect(descriptions[0]).toContain("[one] 1");
    expect(descriptions[1]).toContain("[other] 2");
    expect(descriptions[2]).toContain("[other] 3");
    expect(descriptions[20]).toContain("[other] 21");
  });

  test("a locale whose sentence takes a plain cardinal needs no ordinal variants", () => {
    // Ukrainian ordinal endings vary by numeral (1-ша, 2-га, 3-тя, 4-та, 7-ма) in a
    // way CLDR's few/other split does not track, so such a sentence is restructured
    // to take a plain cardinal rather than render a wrong ordinal for most numbers.
    // The unsuffixed key then serves every count.
    const plainCardinal = {
      description: { repeatStatement: { repeatResult: "iteration {{count}}" } },
    } as unknown as Messages;
    const descriptions = iterationDescriptions(tagLocale("uk", plainCardinal));

    expect(descriptions[0]).toContain("iteration 1");
    expect(descriptions[2]).toContain("iteration 3");
    expect(descriptions[3]).toContain("iteration 4");
  });

  test("a dict that does not name its locale is not silently rendered with English rules", () => {
    // The loud-canary contract: `fallbackLng: false` means an unresolvable variant
    // surfaces as its key path. An untagged Hungarian-shaped dict is read as
    // English, which asks for `_ordinal_two` at 2 — a category Hungarian does not
    // spell.
    const descriptions = iterationDescriptions(fixtureCatalog(["one", "other"]));

    expect(descriptions[1]).toContain("description.repeatStatement.repeatResult");
  });
});
