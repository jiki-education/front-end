import systemMessages from "./locales/system/translation.json";
import { createTranslator, type Messages, type Translator } from "../shared/i18n";

export type { Messages, Translator };
export { systemMessages };

/**
 * Build the per-run translator for a single JavaScript interpretation.
 *
 * The active locale's message dict is injected per run (via
 * `EvaluationContext.localeMessages`); there is no global instance and no
 * `changeLanguage`. When nothing is injected we resolve against the `system`
 * pseudo-locale (structured "Type: context: value" strings) — never English — so
 * a forgotten injection surfaces as a loud, obvious canary rather than plausible
 * silent English. There is no runtime fallback (`fallbackLng: false`): a missing
 * key in an injected locale surfaces as the key.
 */
export function buildTranslator(localeMessages?: Messages): Translator {
  return createTranslator(localeMessages ?? systemMessages);
}
