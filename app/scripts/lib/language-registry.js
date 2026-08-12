/**
 * Read `lib/i18n/language-registry.ts` from plain node.
 *
 * ## Why this is not a regex, and not a JSON file
 *
 * The roster has to be TypeScript: `Locale` is a literal union derived from it,
 * and a JSON import is `string[]`. So anything outside the TypeScript module
 * graph that needs the roster has to get it out of a `.ts` file somehow, and
 * there are three ways to do that:
 *
 *   - Match a regex against the source. This is what the deploy gate used to do
 *     to find PRODUCTION_LOCALES, and it is the reason that list moved into JSON:
 *     the pattern could start at a mention of the name in a comment and run on to
 *     the next array, silently reading a different list from the intended one.
 *     Never again.
 *   - Duplicate the roster into JSON by hand. Two lists, one of them wrong
 *     eventually.
 *   - Parse it properly. That is this: hand the file to the TypeScript compiler
 *     (already a devDependency, since the repo is TypeScript) and evaluate the
 *     emitted JavaScript. There is no pattern to misread, because the thing
 *     reading the file is the same compiler that type-checks it.
 *
 * The evaluation is safe to do and stays honest because the registry module
 * imports nothing and contains no logic beyond the roster itself: the emitted
 * module is a literal array and a couple of filters over it. That constraint is
 * stated at the top of the registry, and this throws if it is ever broken.
 *
 * The DEPLOY GATE still does not use this. `verify-locale-completeness.js` runs
 * as a plain node script with no install step in its CI job, so it reads the
 * generated `production-locales.json` bytes and nothing else. This module is for
 * the generators and the checker, which run where node_modules exists.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

export const APP_DIR = path.join(__dirname, "..", "..");
export const REGISTRY_FILE = path.join(APP_DIR, "lib", "i18n", "language-registry.ts");
export const PRODUCTION_LOCALES_FILE = path.join(APP_DIR, "lib", "production-locales.json");
export const MESSAGES_FILE = path.join(APP_DIR, "messages.json");
export const GLOBAL_ERROR_COPY_FILE = path.join(APP_DIR, "lib", "i18n", "generated", "global-error-copy.ts");

/** The keys of the `globalError` section of `messages.json`, in render order. */
export const GLOBAL_ERROR_KEYS = ["title", "message", "actionLabel"];

const VALID_STATUSES = new Set(["advertised", "known", "production"]);

/**
 * Evaluate an import-free TypeScript module and return its exports.
 *
 * Used for the roster and for the generated global-error copy, both of which are
 * pure data that a node script needs and that must be TypeScript for the type
 * system's sake. The import-free requirement is what makes this safe and honest,
 * and it is checked rather than assumed.
 */
export function evalTsModule(file, what) {
  const ts = require("typescript");
  const source = fs.readFileSync(file, "utf8");

  if (/^\s*import\s/m.test(source)) {
    throw new Error(
      `${file} has grown an import. It is evaluated standalone by scripts/lib/language-registry.js, so it ` +
        `must import nothing. Move whatever needs the import into a module that is not read from plain node ` +
        `(${what}).`
    );
  }

  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: file
  });

  // `module`/`exports` are built here rather than named as such at the top level:
  // Next's lint rules reserve the identifier `module`, and the emitted CommonJS
  // only needs an object with an `exports` property to write onto.
  const shim = { exports: {} };
  new Function("exports", "module", "require", outputText)(shim.exports, shim, () => {
    throw new Error(`${what} must not require anything at runtime.`);
  });

  return shim.exports;
}

let cached;

/**
 * The roster, as `[{ code, flag, displayCode?, status }, ...]` in file order.
 */
export function readLanguageRegistry() {
  if (cached) return cached;

  const languages = evalTsModule(REGISTRY_FILE, "the language registry").LANGUAGES;
  if (!Array.isArray(languages) || languages.length === 0) {
    throw new Error(`${REGISTRY_FILE} did not export a non-empty LANGUAGES array.`);
  }

  cached = languages;
  return cached;
}

export function isValidStatus(status) {
  return VALID_STATUSES.has(status);
}

export function statuses() {
  return [...VALID_STATUSES];
}

/** Locales the codebase knows: ALL_LOCALES, in roster order. */
export function knownLocales() {
  return readLanguageRegistry()
    .filter((language) => language.status !== "advertised")
    .map((language) => language.code);
}

/** Locales production serves: PRODUCTION_LOCALES, in roster order. */
export function productionLocales() {
  return readLanguageRegistry()
    .filter((language) => language.status === "production")
    .map((language) => language.code);
}

export const DEFAULT_LOCALE = "en";

/**
 * The sibling i18n checkout, resolved exactly as the front-end's other i18n
 * scripts resolve it (`JIKI_I18N_REPO`, else `../../i18n`), or undefined when
 * there is no checkout there. Callers decide whether its absence is fatal:
 * generators refuse to write without it, the checker downgrades the checks that
 * need it, and CI has no checkout at all.
 */
export function resolveI18nRepo() {
  const repo = path.resolve(process.env.JIKI_I18N_REPO || path.join(APP_DIR, "..", "..", "i18n"));
  return fs.existsSync(path.join(repo, "locales")) ? repo : undefined;
}

/** One locale's app UI catalog: English from this repo, everything else from i18n. */
export function readCatalog(locale, i18nRepo) {
  const file =
    locale === DEFAULT_LOCALE
      ? MESSAGES_FILE
      : i18nRepo && path.join(i18nRepo, "locales", locale, "app", "messages.json");
  if (!file || !fs.existsSync(file)) return undefined;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}
