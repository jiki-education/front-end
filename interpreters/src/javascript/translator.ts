import systemMessages from "./locales/system/translation.json";
import enMessages from "./locales/en/translation.json";
import { createTranslator, type Messages, type Translator } from "../shared/i18n";

export type { Messages, Translator };
export { systemMessages };

/**
 * The bundled no-injection default.
 *
 * Errors resolve against the `system` pseudo-locale — the structured canary
 * that screams when a locale was never injected. Descriptions have no such
 * structured form (they are compositional prose HTML), and are authored ONCE
 * in `en`; `system` deliberately holds no `description.*` keys. So the default
 * layers `en`'s descriptions over `system`'s error canaries: a forgotten
 * injection still surfaces loud canary errors, while educational prose stays
 * readable English rather than raw keys. Production always injects the active
 * locale's full dict, so this default is only ever the dev/test fallback.
 */
const defaultMessages: Messages = {
  ...(systemMessages as Messages),
  description: (enMessages as Messages).description,
};

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
  return createTranslator(localeMessages ?? defaultMessages);
}
