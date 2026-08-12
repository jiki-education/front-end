#!/usr/bin/env node
/**
 * audit-i18n-keys.mjs
 *
 * Audits translation-key consistency for each interpreter language
 * (javascript / python / jikiscript) against the catalogs THIS REPO AUTHORS.
 *
 * GOAL: every translation key the code can reference at runtime must have an
 * entry in the authored English dict (`src/<lang>/locales/en/translation.json`).
 * A key the code can produce with no entry there can never be translated by
 * anyone, and surfaces to the student as the raw key: there is no runtime
 * fallback in the inject-the-dict model. Secondary (info, non-failing): dict
 * keys never referenced in code.
 *
 * WHY THERE IS NO LOCALE DIMENSION HERE ANY MORE
 * ----------------------------------------------
 * This audit used to iterate PRODUCTION_LOCALES and require
 * `src/<lang>/locales/<locale>/translation.json` for each one. That check could
 * never pass for any locale but English, however completely that locale was
 * translated, because a translated interpreter catalog is never a file in this
 * repo:
 *
 *   - `locales/` here holds exactly two authored catalogs per language, `en` and
 *     the `system` pseudo-locale, and nothing materialises a third. The build
 *     step over this tree (`app/scripts/generate-interpreter-i18n-cache.js`)
 *     publishes what is on disk; it does not fetch anything.
 *   - Every TRANSLATED catalog is authored in the `i18n` repo
 *     (`locales/<locale>/interpreters/<language>/messages.json`) and published
 *     by that repo straight to R2 as
 *     `/static/i18n/interpreter/<language>/<locale>/messages-<hash>.json`. The
 *     app fetches it at runtime through the locale's pointer and injects it as
 *     `EvaluationContext.localeMessages` (`app/lib/api/exercise-meta.ts`,
 *     `fetchInterpreterMessages`). See the publisher table in
 *     `app/.context/i18n.md`.
 *
 * So adding `hu` to PRODUCTION_LOCALES turned this red for a reason that had
 * nothing to do with Hungarian: the audit was looking on a disk that structurally
 * cannot hold the answer. Widening the check further, or pointing it at R2, would
 * both be wrong; the honest boundary is that this repo can only verify the
 * catalogs it authors.
 *
 * WHAT STILL GUARDS A TARGET LOCALE, AND WHERE
 * -------------------------------------------
 * The invariant "every key the code can reference resolves in `hu`" is still
 * enforced, as the composition of two checks that each run where their data
 * actually lives:
 *
 *   1. HERE: code references ⊆ authored English catalog (this script).
 *   2. IN `i18n`: translated catalog ⊇ English catalog, per key, by that repo's
 *      own `scripts/validate.mjs`; and no locale reaches PRODUCTION_LOCALES
 *      until `i18n` reports it complete, which the sibling `locale-completeness`
 *      job in `.github/workflows/i18n.yml` enforces by reading the completeness
 *      record `i18n` publishes.
 *
 * Together those give the same guarantee the old locale loop was trying to give,
 * and unlike the old loop they are both satisfiable. This leaves the interpreters
 * audit shaped exactly like the app and curriculum ones: one authored English
 * catalog, guarded against the code that reads it.
 *
 * ONLY JAVASCRIPT IS TRANSLATED, AND THAT IS NOT THIS SCRIPT'S BUSINESS
 * --------------------------------------------------------------------
 * `javascript` is the only interpreter any locale has a translated catalog for;
 * python and jikiscript are English-only everywhere, by decision, and must never
 * block a production locale. With no locale dimension left they cannot: all three
 * languages are audited against their own English catalog, which is worth keeping
 * for all three (it is the check that a key the code throws is authored at all)
 * and says nothing about any locale. If python or jikiscript is translated later,
 * the guarantee for it arrives through (2) above, with no change needed here.
 *
 * THE `system` PSEUDO-LOCALE (reported, deliberately not blocking)
 * ---------------------------------------------------------------
 * `system` is the other catalog this repo authors: the structured canary each
 * interpreter bundles so a forgotten injection screams instead of silently
 * reading as English (see `src/<lang>/translator.ts`). A key missing from it
 * degrades that canary to a raw key, so it is worth reporting, and this repo can
 * honestly verify it. It is a WARN rather than an ERROR only because jikiscript
 * has two known gaps today (listed in the output); filling those and promoting
 * this to a failure is a deliberate one-line change, not a rewrite.
 *
 * HOW KEYS ARE REFERENCED IN CODE
 * --------------------------------
 * Error messages are localized via `translate()` (python/jikiscript) or
 * `this.translate()` / `executor.translate()` (javascript). Two shapes:
 *
 *   1. Literal-key calls:   translate("error.syntax.PermanentlyExcludedToken")
 *   2. Dynamic-key calls:   translate(`error.runtime.${type}`, context)
 *
 * For the dynamic shape the concrete key is `error.<category>.<type>` where
 * `<type>` ranges over a string-literal union type
 * (SyntaxErrorType / RuntimeErrorType / LintErrorType /
 * DisabledLanguageFeatureErrorType). Those unions are the authoritative,
 * statically-knowable set of keys the code can produce, so we expand them into
 * the category namespace and treat every member as a "used" key. Where a member
 * has a literal throw-site (`this.error("<type>", …)`) we record file:line so
 * each missing key is actionable.
 *
 * Category <- union mapping:
 *   error.syntax.*                  <- SyntaxErrorType
 *   error.runtime.*                 <- RuntimeErrorType
 *   error.lint.*                    <- LintErrorType
 *   error.disabledLanguageFeature.* <- DisabledLanguageFeatureErrorType
 *
 * NOT statically verifiable (reported as info, never a failure):
 *   - error.stdlib.${error.message}  -> stdlib error identifiers built at throw
 *     time from thrown stdlib errors; the concrete key is not a static union.
 *   - RuntimeErrorType members used only as `new StdlibError("<Type>", …)`
 *     category tags (message comes from error.stdlib.<message>, never
 *     error.runtime.<Type>), and never thrown directly.
 *   - LogicErrorInExecution / FunctionExecutionError {{message}} passthrough:
 *     normal keyed runtime entries; the payload is pre-translated by the
 *     curriculum and relayed verbatim, so nothing extra to verify.
 *   - Python raw-English literal keys, e.g. translate("Unexpected character.").
 *     Not error.* keys; with no dict entry they resolve to themselves.
 *
 * Usage:   node scripts/audit-i18n-keys.mjs
 * Exit 1 if any referenced key is missing from an authored English catalog (or a
 * language has no English catalog at all). Takes no locale argument: there is no
 * locale set to choose from.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LANGS = ["javascript", "python", "jikiscript"];

// The two catalogs authored in this repo. `en` is what every translation is made
// from, so a gap in it is a failure; `system` is the no-injection canary, so a
// gap in it is reported and does not block. Nothing else can appear here: see
// "WHY THERE IS NO LOCALE DIMENSION HERE ANY MORE" above.
const SOURCE_LOCALE = "en";
const CANARY_LOCALE = "system";

// i18next encodes plural/context/ordinal variants as key suffixes. Strip them
// so `InvalidNumberOfArguments_exact` matches the `InvalidNumberOfArguments`
// key produced from the union type.
const SUFFIX = /_(zero|one|two|few|many|other|exact|atLeast|range|ordinal)$/;

// union type name -> dict category prefix
const UNION_CATEGORY = {
  SyntaxErrorType: "error.syntax",
  RuntimeErrorType: "error.runtime",
  LintErrorType: "error.lint",
  DisabledLanguageFeatureErrorType: "error.disabledLanguageFeature",
};

// -------------------------------------------------------------------------

function walkFiles(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) {
      if (name === "locales" || name === "node_modules") continue;
      walkFiles(full, out);
    } else if (name.endsWith(".ts")) {
      out.push(full);
    }
  }
  return out;
}

function flattenDict(node, prefix = "", out = {}) {
  for (const [key, value] of Object.entries(node)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object") {
      flattenDict(value, path, out);
    } else {
      out[path] = value;
    }
  }
  return out;
}

/** Load a locale dict; returns { ok, dictKeys, dictBaseKeys, error }. */
function loadLocale(langDir, locale) {
  const file = join(langDir, "locales", locale, "translation.json");
  if (!existsSync(file)) {
    return { ok: false, error: `no catalog dir: ${relative(ROOT, file)}` };
  }
  let dict;
  try {
    dict = JSON.parse(readFileSync(file, "utf8"));
  } catch (e) {
    return { ok: false, error: `invalid JSON in ${relative(ROOT, file)}: ${e.message}` };
  }
  const flat = flattenDict(dict);
  return {
    ok: true,
    dictKeys: new Set(Object.keys(flat)),
    dictBaseKeys: new Set(Object.keys(flat).map(k => k.replace(SUFFIX, ""))),
  };
}

/** Extract members of `export type <Name>ErrorType = "a" | "b" | ...;` blocks. */
function extractUnionMembers(source, unionName) {
  const re = new RegExp(`export type\\s+${unionName}\\s*=([\\s\\S]*?);`, "g");
  const members = new Set();
  let m;
  while ((m = re.exec(source)) !== null) {
    for (const lit of m[1].matchAll(/"([^"]+)"/g)) members.add(lit[1]);
  }
  return members;
}

function lineOf(source, index) {
  let line = 1;
  for (let i = 0; i < index && i < source.length; i++) {
    if (source[i] === "\n") line++;
  }
  return line;
}

// -------------------------------------------------------------------------
// Analyse ONE language's code (locale-independent): which keys can it reference,
// and where does each come from (throw-site or union), plus the dynamic buckets.
// -------------------------------------------------------------------------
function analyseLanguage(lang) {
  const langDir = join(ROOT, "src", lang);
  // Include src/shared for union types the language reuses (notably
  // DisabledLanguageFeatureErrorType, which JS imports from shared/interfaces.ts).
  const files = [...walkFiles(langDir), ...walkFiles(join(ROOT, "src", "shared"))];

  const usedKeys = new Set(); // fully-qualified error.<cat>.<type>
  const provenance = new Map(); // key -> human-readable source (throw-site or union)
  const unionSummary = {};
  const dynamicPrefixes = new Set();
  const literalTextKeys = new Set(); // non-error.* resolve-to-self English keys
  const stdlibTypeTags = new Set();
  const directThrowLiterals = new Set();

  // Per-file scan for line-accurate throw-sites and literal translate() keys.
  const throwSites = new Map(); // type -> "relpath:line"
  const literalKeySites = new Map(); // full key -> "relpath:line"

  const combinedParts = [];
  for (const file of files) {
    const src = readFileSync(file, "utf8");
    combinedParts.push(src);
    const rel = relative(ROOT, file);

    // this.error("Type" / executor.error("Type"
    for (const m of src.matchAll(/\.error\(\s*["']([^"']+)["']/g)) {
      directThrowLiterals.add(m[1]);
      if (!throwSites.has(m[1])) throwSites.set(m[1], `${rel}:${lineOf(src, m.index)}`);
    }
    // new StdlibError("Type", ...) — category tag, not a runtime message key
    for (const m of src.matchAll(/\bStdlibError\(\s*["']([^"']+)["']/g)) {
      stdlibTypeTags.add(m[1]);
    }
    // literal / template translate() calls
    for (const m of src.matchAll(/(?:\.|\b)translate\(\s*(["'`])([\s\S]*?)\1/g)) {
      const [, quote, raw] = m;
      if (quote === "`") {
        const idx = raw.indexOf("${");
        if (idx === -1) {
          registerLiteral(raw, `${rel}:${lineOf(src, m.index)}`);
        } else {
          dynamicPrefixes.add(raw.slice(0, idx).replace(/\.$/, ""));
        }
      } else {
        registerLiteral(raw, `${rel}:${lineOf(src, m.index)}`);
      }
    }
  }
  function registerLiteral(key, site) {
    if (key.startsWith("error.")) {
      usedKeys.add(key);
      if (!literalKeySites.has(key)) literalKeySites.set(key, site);
    } else {
      literalTextKeys.add(key);
    }
  }

  const combined = combinedParts.join("\n");

  // Union-expanded keys.
  for (const [unionName, category] of Object.entries(UNION_CATEGORY)) {
    const members = extractUnionMembers(combined, unionName);
    unionSummary[unionName] = members.size;
    for (const member of members) usedKeys.add(`${category}.${member}`);
  }

  // Provenance for every used key: prefer a concrete throw/literal site.
  for (const key of usedKeys) {
    const type = key.split(".").pop();
    if (literalKeySites.has(key)) provenance.set(key, `literal translate() @ ${literalKeySites.get(key)}`);
    else if (throwSites.has(type)) provenance.set(key, `thrown @ ${throwSites.get(type)}`);
    else provenance.set(key, `union member (dynamic throw, no literal site)`);
  }

  // Reclassify runtime members that are only stdlib type-tags (never thrown
  // directly) — not message-keyed, so a missing error.runtime.<Type> is expected.
  const typeTagOnly = new Set();
  for (const key of usedKeys) {
    if (!key.startsWith("error.runtime.")) continue;
    const type = key.slice("error.runtime.".length);
    if (stdlibTypeTags.has(type) && !directThrowLiterals.has(type)) typeTagOnly.add(key);
  }
  for (const k of typeTagOnly) usedKeys.delete(k); // exclude from required set

  return { langDir, usedKeys, provenance, unionSummary, dynamicPrefixes, literalTextKeys, typeTagOnly };
}

// -------------------------------------------------------------------------

console.log(`${"=".repeat(72)}`);
console.log(`i18n key audit — interpreters`);
console.log(`authored catalogs checked: ${SOURCE_LOCALE} (blocking), ${CANARY_LOCALE} (reported)`);
console.log(`translated catalogs live in the i18n repo and are guarded there — see header`);
console.log("=".repeat(72));

let totalFailures = 0;
let totalWarnings = 0;

/** Report the keys `usedKeys` references that one catalog does not hold. */
function reportMissing(a, lang, locale, missing, level) {
  const byNs = new Map();
  for (const k of missing) {
    const ns = k.split(".").slice(0, 2).join(".");
    if (!byNs.has(ns)) byNs.set(ns, []);
    byNs.get(ns).push(k);
  }
  console.log(
    `\n[${level}] catalog "${locale}": ${missing.length} referenced key(s) MISSING from ${lang}/locales/${locale}/translation.json`
  );
  for (const [ns, keys] of [...byNs].sort()) {
    console.log(`   ${ns}.*`);
    for (const k of keys) {
      console.log(`      - ${k}`);
      console.log(`        source: ${a.provenance.get(k)}`);
    }
  }
}

for (const lang of LANGS) {
  const a = analyseLanguage(lang);

  console.log(`\n${"#".repeat(72)}`);
  console.log(`LANGUAGE: ${lang}`);
  console.log("#".repeat(72));
  console.log(
    `union members -> ${Object.entries(a.unionSummary)
      .map(([u, n]) => `${u}:${n}`)
      .join("  ")}`
  );
  console.log(`referenced (required) keys: ${a.usedKeys.size}`);

  // Blocking: the authored English catalog. A key with no entry here is a key no
  // locale can ever have, because every translation is made from this file.
  const source = loadLocale(a.langDir, SOURCE_LOCALE);
  if (!source.ok) {
    totalFailures++;
    console.log(`\n[CRITICAL] catalog "${SOURCE_LOCALE}": ${source.error}`);
    console.log(`   -> all ${a.usedKeys.size} referenced keys are unresolvable.`);
  } else {
    const missing = [...a.usedKeys].filter(k => !source.dictKeys.has(k) && !source.dictBaseKeys.has(k)).sort();
    if (missing.length === 0) {
      console.log(`\n[ok] catalog "${SOURCE_LOCALE}": all ${a.usedKeys.size} referenced keys present.`);
    } else {
      totalFailures += missing.length;
      reportMissing(a, lang, SOURCE_LOCALE, missing, "CRITICAL");
    }
  }

  // Reported, not blocking: the `system` canary catalog. See the header.
  const canary = loadLocale(a.langDir, CANARY_LOCALE);
  if (!canary.ok) {
    totalWarnings++;
    console.log(`\n[WARN] catalog "${CANARY_LOCALE}": ${canary.error}`);
  } else {
    const missing = [...a.usedKeys].filter(k => !canary.dictKeys.has(k) && !canary.dictBaseKeys.has(k)).sort();
    if (missing.length === 0) {
      console.log(`[ok] catalog "${CANARY_LOCALE}": all ${a.usedKeys.size} referenced keys present.`);
    } else {
      totalWarnings += missing.length;
      reportMissing(a, lang, CANARY_LOCALE, missing, "WARN");
      console.log(`   -> these degrade the no-injection canary to a raw key; not blocking (see header).`);
    }
  }

  // Info: dict keys never referenced (computed against en as the authored base).
  const en = source;
  if (en.ok) {
    const staticCategories = new Set(Object.values(UNION_CATEGORY));
    const usedBase = new Set([...a.usedKeys].map(k => k.replace(SUFFIX, "")));
    const unused = [...en.dictBaseKeys]
      .filter(k => {
        const cat = k.split(".").slice(0, 2).join(".");
        return staticCategories.has(cat) && !usedBase.has(k);
      })
      .sort();
    console.log(`\n[info] UNUSED en keys (in dict, not produced by static code paths): ${unused.length}`);
    for (const k of unused) console.log(`   - ${k}`);
  }

  console.log(`\n[info] dynamic / cannot statically verify (not failures):`);
  console.log(`   template-key prefixes in code: ${[...a.dynamicPrefixes].sort().join(", ") || "(none)"}`);
  if (a.typeTagOnly.size) {
    console.log(
      `   stdlib type-tag runtime members (no error.runtime entry expected): ${[...a.typeTagOnly].sort().join(", ")}`
    );
  }
  if (a.literalTextKeys.size) {
    console.log(`   literal-text translate() keys (resolve-to-self English, not error.*): ${a.literalTextKeys.size}`);
    for (const k of [...a.literalTextKeys].sort()) console.log(`      · ${JSON.stringify(k)}`);
  }
}

console.log(`\n${"=".repeat(72)}`);
console.log(
  totalFailures === 0
    ? `RESULT: OK — every referenced key is authored in "${SOURCE_LOCALE}" for all three interpreters.`
    : `RESULT: ${totalFailures} failure(s) in the authored "${SOURCE_LOCALE}" catalogs — see [CRITICAL] sections above.`
);
if (totalWarnings > 0) {
  console.log(`         ${totalWarnings} "${CANARY_LOCALE}" canary gap(s) reported above (not blocking).`);
}
console.log("=".repeat(72));

process.exit(totalFailures === 0 ? 0 : 1);
