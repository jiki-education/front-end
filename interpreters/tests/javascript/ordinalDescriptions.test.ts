import { describe, expect, test } from "vitest";
import { interpret } from "@javascript/interpreter";
import { tagLocale } from "@shared/i18n";
import type { Messages } from "@shared/i18n";
import enMessages from "@javascript/locales/en/translation.json";

/**
 * The non-English catalogs are FIXTURES here, not imports.
 *
 * `en` is the only catalog authored in this repo; every other locale is owned by
 * the i18n repo and published straight to the cache tree, so there is no hu/fr/uk
 * file on disk to import. That is the right shape for this test anyway: what is
 * under test is how i18next resolves CLDR ordinal categories against the tagged
 * locale, not whether some shipped catalog happens to say a particular sentence.
 * Pinning the exact strings here keeps the assertions readable and stops a
 * retranslation elsewhere from failing a test about plural rules.
 *
 * Each fixture spells exactly the ordinal categories CLDR defines for its
 * language, which is the property being exercised: hu one/other, fr one/other,
 * uk few/other.
 */
function repeatResult(forms: Record<string, string>): Messages {
  return { description: { repeatStatement: forms } } as unknown as Messages;
}

const huMessages = repeatResult({
  repeatResult_ordinal_one: "Ez a sor elindította ennek a repeat blokknak a(z) {{count}}. iterációját.",
  repeatResult_ordinal_other: "Ez a sor elindította ennek a repeat blokknak a(z) {{count}}. iterációját.",
  // Rendered alongside the result in the same description. Present so the
  // "no raw key paths anywhere" sweep below is testing the ordinal resolution
  // rather than just the gaps in a deliberately partial fixture.
  repeatStep:
    "Jiki a ciklushoz tartozó belső számlálóját <code>{{iteration}}</code> értékre növelte, ellenőrizte, hogy <code>{{iteration}} &le; {{countValue}}</code>, és úgy döntött, hogy lefuttatja a kódblokkot.",
});

const frMessages = repeatResult({
  repeatResult_ordinal_one: "Cette ligne a démarré la {{count}}re itération de ce bloc repeat.",
  repeatResult_ordinal_other: "Cette ligne a démarré la {{count}}e itération de ce bloc repeat.",
});

const ukMessages = repeatResult({
  repeatResult_ordinal_few: "Цей рядок розпочав ітерацію {{count}} цього блоку repeat.",
  repeatResult_ordinal_other: "Цей рядок розпочав ітерацію {{count}} цього блоку repeat.",
});

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
 */

const REPEAT_25 = "repeat(25) {\n}";

function iterationDescriptions(messages: Messages): string[] {
  const { frames, success } = interpret(REPEAT_25, { localeMessages: messages });
  expect(success).toBe(true);
  return frames.map(frame => (frame as unknown as { description: string }).description);
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

  test("Hungarian uses the Hungarian ordinal form, never an English suffix", () => {
    const descriptions = iterationDescriptions(tagLocale("hu", huMessages));

    // Hungarian writes an ordinal as the numeral plus a full stop, for every number.
    expect(descriptions[0]).toContain("Ez a sor elindította ennek a repeat blokknak a(z) 1. iterációját.");
    expect(descriptions[2]).toContain("a(z) 3. iterációját");
    expect(descriptions[22]).toContain("a(z) 23. iterációját");

    // Hungarian's CLDR ordinal categories are one (1, 5, ...) and other, so a
    // locale that only spelled one of them would render a raw key path here.
    for (const description of descriptions) {
      expect(description).not.toContain("description.repeatStatement");
      expect(description).not.toMatch(/\d(st|nd|rd|th)\b/);
    }
  });

  test("French distinguishes 1re from 2e, which English rules cannot express", () => {
    const descriptions = iterationDescriptions(tagLocale("fr", frMessages));

    expect(descriptions[0]).toContain("Cette ligne a démarré la 1re itération de ce bloc repeat.");
    expect(descriptions[1]).toContain("la 2e itération");
    expect(descriptions[2]).toContain("la 3e itération");
    expect(descriptions[20]).toContain("la 21e itération");
  });

  test("Ukrainian reads the numeral as a cardinal, by choice", () => {
    // Ukrainian ordinal endings vary by numeral (1-ша, 2-га, 3-тя, 4-та, 7-ма) in a
    // way CLDR's few/other split does not track, so the sentence was restructured to
    // take a plain cardinal rather than render a wrong ordinal for most numbers.
    const descriptions = iterationDescriptions(tagLocale("uk", ukMessages));

    expect(descriptions[0]).toContain("Цей рядок розпочав ітерацію 1 цього блоку repeat.");
    // 3 is CLDR's `few` for Ukrainian; 4 is `other`. Both must be spelled.
    expect(descriptions[2]).toContain("ітерацію 3 цього блоку");
    expect(descriptions[3]).toContain("ітерацію 4 цього блоку");
  });

  test("a dict that does not name its locale is not silently rendered with English rules", () => {
    // The loud-canary contract: `fallbackLng: false` means an unresolvable variant
    // surfaces as its key path. An untagged Hungarian dict is read as English, which
    // asks for `_ordinal_two` — a category Hungarian does not spell.
    const descriptions = iterationDescriptions(huMessages);

    expect(descriptions[1]).toContain("description.repeatStatement.repeatResult");
  });
});
