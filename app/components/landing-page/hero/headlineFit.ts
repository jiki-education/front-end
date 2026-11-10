// How much to shrink the landing headline in each locale, so its highlight phrase stays on one
// line as it does in English. The headline is sized in cqw (see .headlineBox in
// Hero.module.css), so its width relative to the column depends only on the text and never on
// the viewport. One ratio per locale therefore holds at every screen width, and the server
// can render the right size with nothing to measure or adjust after hydration.
//
// Each value is the largest scale at which the highlight stays on one line, measured in the
// browser, less 0.01 for safety. If a locale's headline is retranslated, measure it again.
// Locales not listed render at full size.
const HEADLINE_SCALES: Partial<Record<string, number>> = {
  de: 0.6,
  el: 0.58,
  "es-419": 0.69,
  "es-ES": 0.69,
  fr: 0.75,
  hu: 0.57,
  it: 0.6,
  ja: 0.76,
  "pt-BR": 0.69,
  "pt-PT": 0.69,
  sr: 0.68,
  uk: 0.63
};

export function headlineScaleFor(locale: string): number {
  return HEADLINE_SCALES[locale] ?? 1;
}
