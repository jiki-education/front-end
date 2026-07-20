#!/usr/bin/env node
// Audit i18n translation-key consistency for the curriculum package, across every
// production locale (or a --locales override).
//
// Each exercise owns per-locale dicts at
//   src/exercises/<name>/locales/<locale>/translation.json
// and resolves its keys via a translator (`ex.t`, `exercise.t`, `this.t`), the
// declarative `descriptionKey` / `errorKey` props, and content-key string VALUES
// (`name: "scenarios.foo.name"`, hint question/answer in metadata.json, etc).
//
// Keys are scoped PER EXERCISE. An exercise also inherits key references from any
// base class it `extends` in src/exercise-categories/ (every maze exercise refs
// `describers.move`, `errors.hitWall`, ...). The app build deep-merges the family
// base catalog (exercise-categories/<family>/locales/<locale>/translation.json)
// into each member exercise, so an exercise's available keys for a locale =
// its own dict keys UNION its family's dict keys (for that same locale).
//
// The set of keys the CODE references is locale-independent (extracted from source
// once, using the authoring locale `en` as the namespace/shape oracle). That exact
// reference set is then verified against EVERY resolved production locale's dict.
// A key present in en but absent from hu (when hu is live) is a failure; a missing
// `locales/<locale>/` catalog for a live locale is a failure too.
//
// Locale set comes from the shared resolver (production SUPPORTED_LOCALES), with a
// `--locales=en,hu` override for local dev.
//
// Reports, grouped by locale then exercise:
//   (a) keys referenced in code but MISSING from that locale's dict  -> FAILURE
//   (b) locales/<locale>/ catalogs absent for a live locale          -> FAILURE
//   (c) dynamic `t(`...${x}`...)` refs that can't be statically verified -> info
//   (d) keys in the authoring (en) dict never referenced in code      -> secondary
//
// Read-only. Exit code 1 if any key/catalog is missing in any resolved locale.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { resolveAuditLocales } from "../../scripts/i18n-locales.mjs";

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const EX_DIR = join(ROOT, "src", "exercises");
const CATEGORIES_DIR = join(ROOT, "src", "exercise-categories");
// The locale content is authored in; used as the oracle for "what keys does the
// code reference" (namespaces + plural shapes) and for the unused-key check.
const AUTHORING_LOCALE = "en";

const argv = process.argv.slice(2);
const auditLocales = resolveAuditLocales(argv);
// Always load the authoring locale (even if not in the audit set) so the reference
// set is stable when someone runs e.g. `--locales=hu` alone.
const localesToLoad = [...new Set([AUTHORING_LOCALE, ...auditLocales])];

// ---- key-reference extraction -------------------------------------------------

// Dynamic translator calls with interpolation: t(`checks.${x}.should`)
const T_DYNAMIC = /\b(?:ex|exercise|this|context|ctx)\.t\(\s*`([^`]*\$\{[^`]*)`/g;
// Any quoted string literal shaped like a dotted key: foo.bar or foo.bar.baz
const DOTTED = /(["'])([A-Za-z][A-Za-z0-9_]*(?:\.[A-Za-z0-9_]+)+)\1/g;

function extractFromSource(src) {
  const dotted = new Set();
  const dynamics = new Set();
  let m;
  T_DYNAMIC.lastIndex = 0;
  while ((m = T_DYNAMIC.exec(src)) !== null) dynamics.add(m[1]);
  DOTTED.lastIndex = 0;
  while ((m = DOTTED.exec(src)) !== null) dotted.add(m[2]);
  return { dotted, dynamics };
}

// ---- extends-chain resolution -------------------------------------------------

function readImports(src) {
  const map = {};
  const re = /import\s+([A-Za-z0-9_]+)\s+from\s*["']([^"']+)["']/g;
  let m;
  while ((m = re.exec(src)) !== null) map[m[1]] = m[2];
  return map;
}

function resolveModule(fromFile, relPath) {
  if (!relPath.startsWith(".")) return null;
  const base = resolve(dirname(fromFile), relPath);
  for (const cand of [base + ".ts", base + ".tsx", join(base, "index.ts")]) {
    if (existsSync(cand)) return cand;
  }
  return null;
}

// Walk the extends chain from an Exercise.ts file, collecting referenced keys from
// every file in the chain (base classes reference describers.*/errors.* too).
function collectChainKeys(entryFile, acc, seen) {
  if (!entryFile || seen.has(entryFile)) return;
  seen.add(entryFile);
  const src = readFileSync(entryFile, "utf8");
  const { dotted, dynamics } = extractFromSource(src);
  dotted.forEach((k) => acc.dotted.add(k));
  dynamics.forEach((k) => acc.dynamics.add(k));

  const extendsMatch = src.match(/class\s+\w+\s+extends\s+([A-Za-z0-9_]+)/);
  if (!extendsMatch) return;
  const relPath = readImports(src)[extendsMatch[1]];
  if (!relPath) return;
  collectChainKeys(resolveModule(entryFile, relPath), acc, seen);
}

// ---- dict flattening ----------------------------------------------------------

const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;

function flatten(obj, prefix, out) {
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === "object" && !Array.isArray(v)) flatten(v, key, out);
    else out.add(key);
  }
}

// Load + flatten one translation.json into a Set of dotted keys. Returns null if
// the file does not exist; throws-as-string captured by caller for parse errors.
function loadDictKeys(path) {
  if (!existsSync(path)) return null;
  const keys = new Set();
  flatten(JSON.parse(readFileSync(path, "utf8")), "", keys);
  return keys;
}

function pluralBasesOf(keys) {
  const bases = new Set();
  for (const k of keys) if (PLURAL_SUFFIX.test(k)) bases.add(k.replace(PLURAL_SUFFIX, ""));
  return bases;
}

// A referenced key is satisfied if the dict has it directly OR as a plural variant.
function satisfies(keys, pluralBases, refKey) {
  return keys.has(refKey) || pluralBases.has(refKey);
}

// ---- per-exercise files -------------------------------------------------------

function ownSourceFiles(exDir) {
  const files = [];
  for (const name of readdirSync(exDir)) {
    const full = join(exDir, name);
    if (!statSync(full).isFile()) continue;
    if (name.endsWith(".test.ts")) continue;
    if (name.endsWith(".ts") || name === "metadata.json") files.push(full);
  }
  return files;
}

function ownTsFiles(exDir) {
  return readdirSync(exDir)
    .map((n) => join(exDir, n))
    .filter((p) => statSync(p).isFile() && p.endsWith(".ts") && !p.endsWith(".test.ts"));
}

// Family = first `exercise-categories/<family>` reference in any .ts file (mirrors
// the app build's deriveFamily). Its base catalog is merged into the member dict.
function deriveFamily(exDir) {
  for (const f of ownTsFiles(exDir)) {
    const m = readFileSync(f, "utf8").match(/exercise-categories\/([^/"'`\s]+)/);
    if (m) return m[1];
  }
  return null;
}

// ---- preload family base catalogs, per locale ---------------------------------
// familyKeys[family][locale] = Set|null (null = catalog file absent for locale)
const familyKeys = {};
if (existsSync(CATEGORIES_DIR)) {
  for (const fam of readdirSync(CATEGORIES_DIR)) {
    if (!statSync(join(CATEGORIES_DIR, fam)).isDirectory()) continue;
    familyKeys[fam] = {};
    for (const locale of localesToLoad) {
      const p = join(CATEGORIES_DIR, fam, "locales", locale, "translation.json");
      try {
        familyKeys[fam][locale] = loadDictKeys(p);
      } catch (e) {
        familyKeys[fam][locale] = null;
        console.error(`WARN: bad JSON in family catalog ${fam}/${locale}: ${e.message}`);
      }
    }
  }
}

// ---- run ----------------------------------------------------------------------

const results = [];
for (const name of readdirSync(EX_DIR).sort()) {
  const exDir = join(EX_DIR, name);
  if (!statSync(exDir).isDirectory()) continue;
  const entryFile = join(exDir, "Exercise.ts");

  // 1. Extract the (locale-independent) reference set from source + extends chain.
  const acc = { dotted: new Set(), dynamics: new Set() };
  for (const f of ownSourceFiles(exDir)) {
    const { dotted, dynamics } = extractFromSource(readFileSync(f, "utf8"));
    dotted.forEach((k) => acc.dotted.add(k));
    dynamics.forEach((k) => acc.dynamics.add(k));
  }
  if (existsSync(entryFile)) collectChainKeys(entryFile, acc, new Set());

  const family = deriveFamily(exDir);
  const famPerLocale = family && familyKeys[family] ? familyKeys[family] : {};

  // 2. Load own dict keys for every locale we need.
  const ownKeys = {}; // locale -> Set|null
  const parseError = {};
  for (const locale of localesToLoad) {
    try {
      ownKeys[locale] = loadDictKeys(join(exDir, "locales", locale, "translation.json"));
    } catch (e) {
      ownKeys[locale] = null;
      parseError[locale] = e.message;
    }
  }

  // 3. Merged (own + family) keys per locale.
  const merged = {}; // locale -> Set
  for (const locale of localesToLoad) {
    const set = new Set(famPerLocale[locale] || []);
    (ownKeys[locale] || []).forEach((k) => set.add(k));
    merged[locale] = set;
  }

  // 4. Reference set: dotted literals whose top-level namespace exists in the
  //    AUTHORING (en) merged dict — filters out import paths, filenames, selectors,
  //    code examples. Stable across locales so an en-only key still gets checked
  //    against hu.
  const authoring = merged[AUTHORING_LOCALE] || new Set();
  const namespaces = new Set([...authoring].map((k) => k.split(".")[0]));
  const references = new Set();
  for (const k of acc.dotted) if (namespaces.has(k.split(".")[0])) references.add(k);

  const hasWork = references.size > 0 || acc.dynamics.size > 0 || authoring.size > 0;
  if (!hasWork) continue;

  // 5. Per-locale missing keys + catalog presence.
  const perLocale = {};
  for (const locale of auditLocales) {
    const keys = merged[locale];
    const pbases = pluralBasesOf(keys);
    const missing = [];
    for (const k of references) if (!satisfies(keys, pbases, k)) missing.push(k);
    // "No catalog" = this exercise references keys but has neither its own dict nor
    // a family dict for this locale.
    const ownAbsent = ownKeys[locale] === null || ownKeys[locale] === undefined;
    const famAbsent = family ? !famPerLocale[locale] : true;
    perLocale[locale] = {
      missing: missing.sort(),
      ownAbsent,
      famAbsent: family ? famAbsent : null,
      parseError: parseError[locale] || null
    };
  }

  // 6. Unused (secondary): authoring-locale own keys never referenced in code.
  const dynamicPrefixes = [...acc.dynamics].map((d) => d.split("${")[0]).filter(Boolean);
  const unused = [];
  for (const k of ownKeys[AUTHORING_LOCALE] || []) {
    const base = k.replace(PLURAL_SUFFIX, "");
    if (references.has(k) || references.has(base)) continue;
    if (dynamicPrefixes.some((p) => k.startsWith(p))) continue;
    unused.push(k);
  }

  results.push({
    name,
    family,
    references,
    dynamics: [...acc.dynamics].sort(),
    perLocale,
    unused: unused.sort()
  });
}

// ---- report -------------------------------------------------------------------

function group(keys) {
  // Group dotted keys by their top-level namespace for actionable output.
  const byNs = {};
  for (const k of keys) (byNs[k.split(".")[0]] ??= []).push(k);
  return byNs;
}

console.log("=".repeat(78));
console.log("i18n KEY AUDIT — curriculum");
console.log("=".repeat(78));
console.log(`Audit locales: ${auditLocales.join(", ")}   (authoring oracle: ${AUTHORING_LOCALE})`);
console.log(`Exercises scanned: ${results.length}`);
console.log("");

for (const locale of auditLocales) {
  const offenders = results.filter((r) => r.perLocale[locale].missing.length || r.perLocale[locale].parseError);
  const noCatalog = results.filter((r) => r.perLocale[locale].ownAbsent && r.perLocale[locale].missing.length);

  console.log("#".repeat(78));
  console.log(`# LOCALE: ${locale}`);
  console.log("#".repeat(78));

  console.log(`\n### (a) MISSING keys — referenced in code, absent from ${locale} dict [FAILURE]`);
  if (offenders.length === 0) {
    console.log("  None. ✅");
  } else {
    for (const r of offenders) {
      const pl = r.perLocale[locale];
      if (pl.parseError) {
        console.log(`  ${r.name}: JSON PARSE ERROR — ${pl.parseError}`);
        continue;
      }
      const tags = [];
      if (pl.ownAbsent) tags.push("no own locales/" + locale + "/ dir");
      if (r.family && pl.famAbsent) tags.push(`family '${r.family}' has no ${locale} catalog`);
      console.log(`  ${r.name}${tags.length ? " (" + tags.join("; ") + ")" : ""}:`);
      const byNs = group(pl.missing);
      for (const ns of Object.keys(byNs).sort()) {
        for (const k of byNs[ns].sort()) console.log(`      - ${k}`);
      }
    }
  }
  console.log(`  Missing keys in ${locale}: ${offenders.reduce((n, r) => n + r.perLocale[locale].missing.length, 0)}`);

  if (noCatalog.length) {
    console.log(`\n### (b) Exercises with NO ${locale} catalog but code references keys [FAILURE]`);
    for (const r of noCatalog) console.log(`  ${r.name} (${r.perLocale[locale].missing.length} keys unresolved)`);
  }
  console.log("");
}

// Dynamic + unused are locale-independent (evaluated against authoring locale).
const dynamicResults = results.filter((r) => r.dynamics.length);
console.log("#".repeat(78));
console.log("# LOCALE-INDEPENDENT");
console.log("#".repeat(78));

console.log("\n### (c) Dynamic key references — cannot statically verify [info]");
if (dynamicResults.length === 0) console.log("  None.");
else for (const r of dynamicResults) console.log(`  ${r.name}: ${r.dynamics.map((d) => "`" + d + "`").join(", ")}`);

const unusedResults = results.filter((r) => r.unused.length);
console.log(`\n### (d) UNUSED keys — in ${AUTHORING_LOCALE} dict, never referenced in code [secondary]`);
if (unusedResults.length === 0) console.log("  None. ✅");
else for (const r of unusedResults) console.log(`  ${r.name}: ${r.unused.join(", ")}`);
const totalUnused = unusedResults.reduce((n, r) => n + r.unused.length, 0);
console.log(`  Total unused: ${totalUnused}`);

console.log("\n" + "=".repeat(78));
const perLocaleSummary = auditLocales
  .map((l) => `${l}=${results.reduce((n, r) => n + r.perLocale[l].missing.length, 0)}`)
  .join(", ");
console.log(`SUMMARY: missing per locale [${perLocaleSummary}]; ${totalUnused} unused; ${results.length} exercises`);
console.log("=".repeat(78));

const anyMissing = auditLocales.some((l) =>
  results.some((r) => r.perLocale[l].missing.length || r.perLocale[l].parseError)
);
process.exit(anyMissing ? 1 : 0);
