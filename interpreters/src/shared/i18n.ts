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
 *
 * ## Why the dict names its own locale
 *
 * i18next picks plural and ordinal variants through `Intl.PluralRules`, which
 * needs the real locale: `1st/2nd/3rd` in English, `1re/2e` in French, `3-тю` vs
 * `4-ту` in Ukrainian. This used to init with a synthetic `lng: "x"`, which has no
 * CLDR data at all, so every locale (English included) fell back to a crude
 * one/other split and rendered nonsense like "21th".
 *
 * The locale therefore travels WITH the dict, under the reserved `$locale` key,
 * rather than as a second value threaded down every call in the app's run rail.
 * A message dict that does not say which language it is written in is an
 * incomplete injection: i18next cannot resolve it correctly without that. The key
 * is stamped at the app's fetch boundary (`fetchInterpreterMessages`), never
 * stored in the on-disk catalogs, so the translation pipeline never sees it.
 *
 * An untagged dict resolves as `en`. That is right for the bundled default (whose
 * descriptions are English) and loud for anything else: a French dict read with
 * English ordinal rules asks for categories French does not spell, and those
 * render as their raw key path, exactly like any other missing key.
 */

/** A nested i18next-style message tree for ONE locale. */
export type Messages = Record<string, unknown>;

export type Translator = (key: string, params?: Record<string, unknown>) => string;

/**
 * The reserved key under which an injected dict declares the locale it is written
 * in (e.g. `"pt-pt"`). Stripped before the dict is handed to i18next, so it can
 * never be looked up as a message.
 */
export const LOCALE_KEY = "$locale";

/** Default locale for a dict that carries no `$locale` (the bundled English default). */
const DEFAULT_LOCALE = "en";

/** Stamp a dict with the locale it is written in, ready to inject. */
export function tagLocale(locale: string, messages: Messages): Messages {
  return { ...messages, [LOCALE_KEY]: locale };
}

/**
 * i18next canonicalises language codes internally (`pt-pt` becomes `pt-PT`) when
 * resolving, but not when reading `resources`, so a non-canonical code would find
 * no bundle at all. Canonicalise up front so both sides agree. An unparseable code
 * is passed through untouched: it will simply resolve nothing, which is the
 * intended loud failure.
 */
function canonicalLocale(locale: string): string {
  try {
    return Intl.getCanonicalLocales(locale)[0] ?? locale;
  } catch {
    return locale;
  }
}

/**
 * Build a translator bound to a single injected locale dict. Creates a fresh,
 * isolated i18next instance (no shared/global state). If `messages` is
 * empty/undefined the translator is still constructable and gracefully returns
 * the key for any lookup.
 *
 * The locale is read from the dict's `$locale` key (see above); pass `locale`
 * explicitly to override it, which is mostly useful in tests that import a
 * catalog straight off disk.
 */
export function createTranslator(messages: Messages = {}, locale?: string): Translator {
  const { [LOCALE_KEY]: taggedLocale, ...translation } = messages;
  const lng = canonicalLocale(locale ?? (typeof taggedLocale === "string" ? taggedLocale : DEFAULT_LOCALE));

  const instance = createInstance();

  void instance.init({
    lng,
    fallbackLng: false,
    initImmediate: false,
    interpolation: { escapeValue: false },
    resources: { [lng]: { translation } },
  });

  return (key, params) => instance.t(key, params).toString();
}
