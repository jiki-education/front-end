#!/usr/bin/env node
/**
 * audit-i18n-keys.mjs
 *
 * Audits translation-key consistency for each interpreter language
 * (javascript / python / jikiscript) against EVERY production locale.
 *
 * GOAL: every translation key the code can reference at runtime must have an
 * entry in each production locale's dict
 * (`src/<lang>/locales/<locale>/translation.json`). A key present in `en` but
 * missing from another production locale (e.g. `hu`) is a failure — there is no
 * runtime fallback in the inject-the-dict model, so a missing key surfaces to
 * the student as the raw key. Secondary (info, non-failing): dict keys never
 * referenced in code.
 *
 * WHICH LOCALES ARE CHECKED
 * -------------------------
 * The production locale set comes from the shared resolver
 * (`front-end/scripts/i18n-locales.mjs`, parsed from app/lib/locales.ts
 * SUPPORTED_LOCALES). Override for dev with `--locales=en,hu`.
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
 * Usage:   node scripts/audit-i18n-keys.mjs [--locales=en,hu]
 * Exit 1 if any referenced key is missing from ANY production locale (or a
 * language is missing a catalog dir for a production locale).
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveAuditLocales } from "../../scripts/i18n-locales.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const LANGS = ["javascript", "python", "jikiscript"];

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

const argv = process.argv.slice(2);
const locales = resolveAuditLocales(argv);
const overriding = argv.some(a => a === "--locales" || a.startsWith("--locales="));

console.log(`${"=".repeat(72)}`);
console.log(`i18n key audit — interpreters`);
console.log(`${overriding ? "override" : "production"} locales checked: ${locales.join(", ")}`);
console.log("=".repeat(72));

let totalFailures = 0;

for (const lang of LANGS) {
  const a = analyseLanguage(lang);

  console.log(`\n${"#".repeat(72)}`);
  console.log(`LANGUAGE: ${lang}`);
  console.log("#".repeat(72));
  console.log(
    `union members -> ${Object.entries(a.unionSummary).map(([u, n]) => `${u}:${n}`).join("  ")}`
  );
  console.log(`referenced (required) keys: ${a.usedKeys.size}`);

  for (const locale of locales) {
    const loc = loadLocale(a.langDir, locale);
    if (!loc.ok) {
      totalFailures++;
      console.log(`\n[CRITICAL] locale "${locale}": ${loc.error}`);
      console.log(`   -> all ${a.usedKeys.size} referenced keys are unresolvable for this locale.`);
      continue;
    }

    const missing = [...a.usedKeys]
      .filter(k => !loc.dictKeys.has(k) && !loc.dictBaseKeys.has(k))
      .sort();

    if (missing.length === 0) {
      console.log(`\n[ok] locale "${locale}": all ${a.usedKeys.size} referenced keys present.`);
      continue;
    }

    totalFailures += missing.length;
    // Group by namespace for actionability.
    const byNs = new Map();
    for (const k of missing) {
      const ns = k.split(".").slice(0, 2).join(".");
      if (!byNs.has(ns)) byNs.set(ns, []);
      byNs.get(ns).push(k);
    }
    console.log(`\n[CRITICAL] locale "${locale}": ${missing.length} referenced key(s) MISSING from ${lang}/locales/${locale}/translation.json`);
    for (const [ns, keys] of [...byNs].sort()) {
      console.log(`   ${ns}.*`);
      for (const k of keys) {
        console.log(`      - ${k}`);
        console.log(`        source: ${a.provenance.get(k)}`);
      }
    }
  }

  // Info: dict keys never referenced (computed against en as the authored base).
  const en = loadLocale(a.langDir, "en");
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
    console.log(`   stdlib type-tag runtime members (no error.runtime entry expected): ${[...a.typeTagOnly].sort().join(", ")}`);
  }
  if (a.literalTextKeys.size) {
    console.log(`   literal-text translate() keys (resolve-to-self English, not error.*): ${a.literalTextKeys.size}`);
    for (const k of [...a.literalTextKeys].sort()) console.log(`      · ${JSON.stringify(k)}`);
  }
}

console.log(`\n${"=".repeat(72)}`);
console.log(totalFailures === 0
  ? `RESULT: OK — every referenced key resolves in all production locales (${locales.join(", ")}).`
  : `RESULT: ${totalFailures} failure(s) across locales ${locales.join(", ")} — see [CRITICAL] sections above.`);
console.log("=".repeat(72));

process.exit(totalFailures === 0 ? 0 : 1);
