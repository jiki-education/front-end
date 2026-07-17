import { createInstance } from "i18next";

/**
 * Shared per-run i18n for the interpreters (inject-the-dict model).
 *
 * Each interpreter owns and authors its own student-facing diagnostic strings
 * (syntax/runtime/type/lint errors) but must NOT bundle every locale into the
 * compiled JS — locales scale (assume ~50 languages), so static-importing all
 * packs is a bug. Instead the app resolves the student's ONE active locale and
 * injects that single-locale message dict into each run via
 * `EvaluationContext.localeMessages`; the interpreter builds a translator from it.
 *
 * There is no global instance, no mutable active locale, and no `changeLanguage`
 * seam. Each `interpret`/`compile`/`evaluateFunction` run constructs a fresh,
 * isolated translator bound to its injected dict, so runs never interfere.
 *
 * `fallbackLng: false` — there is no runtime fallback: a missing key surfaces as
 * the key (visible), never silent English. Completeness is enforced by a guard
 * test, not a fallback. `escapeValue: false` keeps `<code>`/HTML and interpolated
 * values intact (these strings are rendered as HTML or relayed verbatim).
 */

/** A nested i18next-style message tree for ONE locale. */
export type Messages = Record<string, unknown>;

export type Translator = (key: string, params?: Record<string, unknown>) => string;

/**
 * Build a translator bound to a single injected locale dict. Creates a fresh,
 * isolated i18next instance (no shared/global state). If `messages` is
 * empty/undefined the translator is still constructable and gracefully returns
 * the key for any lookup.
 */
export function createTranslator(messages: Messages = {}): Translator {
  const instance = createInstance();

  void instance.init({
    lng: "x",
    fallbackLng: false,
    initImmediate: false,
    interpolation: { escapeValue: false },
    resources: { x: { translation: messages } },
  });

  return (key, params) => instance.t(key, params).toString();
}
