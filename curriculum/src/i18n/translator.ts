import { createInstance } from "i18next";

/**
 * Curriculum-owned i18n.
 *
 * The curriculum resolves all of its own student-facing strings (logic-error
 * messages passed to `ExecutionContext.logicError`, scenario `errorHtml`, hints,
 * scenario names/descriptions, function descriptions) and hands finished,
 * localized strings to whoever renders them. The interpreter and the app are dumb
 * renderers: `logicError` relays `{{message}}` verbatim (see the LogicError
 * pre-translated contract) and the app renders the `errorHtml` string it is given.
 *
 * Unlike the interpreter (which bundles one shared catalog), the curriculum must
 * NOT bundle the corpus of per-exercise dictionaries into the compiled JS (the
 * deployment target is a Cloudflare Worker + R2). Instead, an exercise's message
 * dict for the student's ONE locale is delivered as data (fetched from R2 by the
 * app at runtime) and injected into the exercise instance. The exercise never
 * knows the locale code — it is handed the already-resolved-for-that-locale dict
 * and builds a translator from it via `createTranslator`.
 *
 * We still use i18next (fed only the injected single-locale dict) so plurals,
 * `{{var}}` interpolation, and `escapeValue: false` HTML pass-through keep working
 * — just with no global state, no namespaces, and no locale switching.
 */

/** A nested i18next-style message tree for ONE locale. */
export type Messages = Record<string, unknown>;

export type Translator = (key: string, params?: Record<string, unknown>) => string;

/**
 * Build a translator bound to a single injected locale dict. Creates a fresh,
 * isolated i18next instance (no shared/global state), so translators built from
 * different dicts never interfere. `escapeValue: false` keeps `<code>`/HTML and
 * interpolated values intact (these strings are rendered as HTML or relayed
 * verbatim). If `messages` is empty/undefined, the translator is still
 * constructable and gracefully returns the key for any lookup.
 */
function buildTranslator(messages: Messages): Translator {
  const instance = createInstance();

  void instance.init({
    lng: "x",
    fallbackLng: false,
    initImmediate: false,
    interpolation: { escapeValue: false },
    resources: { x: { translation: messages } }
  });

  return (key, params) => instance.t(key, params).toString();
}

// A translator is a stateless function of its dict, so memoize per dict identity:
// the app holds each locale pack as a singleton, so every exercise/codeCheck built
// from the same pack reuses one i18next instance instead of rebuilding per call.
const translatorCache = new WeakMap<Messages, Translator>();
const emptyTranslator = buildTranslator({});

export function createTranslator(messages: Messages = {}): Translator {
  // Empty dicts (the "no catalog" default) all share one instance; they can't be
  // WeakMap keys reliably since callers often pass a fresh `{}`.
  if (Object.keys(messages).length === 0) {
    return emptyTranslator;
  }
  const cached = translatorCache.get(messages);
  if (cached !== undefined) {
    return cached;
  }
  const translator = buildTranslator(messages);
  translatorCache.set(messages, translator);
  return translator;
}
