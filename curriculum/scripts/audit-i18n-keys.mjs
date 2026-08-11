#!/usr/bin/env node
// Audit i18n translation-key consistency for the curriculum package.
//
// Each exercise owns a message catalog at
//   src/exercises/<name>/messages.json
// and resolves its keys via a translator (`ex.t`, `exercise.t`, `this.t`), the
// declarative `descriptionKey` / `errorKey` props, and content-key string VALUES
// (`name: "scenarios.foo.name"`, hint question/answer in metadata.json, etc).
//
// Keys are scoped PER EXERCISE. An exercise also inherits key references from any
// base class it `extends` in src/exercise-categories/ (every maze exercise refs
// `describers.move`, `errors.hitWall`, ...). The app build deep-merges the family
// base catalog (exercise-categories/<family>/messages.json) into each member
// exercise, so an exercise's available keys = its own catalog's keys UNION its
// family's.
//
// ## One catalog, not one per locale
//
// The curriculum authors English and nothing else. Every translation of these
// catalogs lives in the i18n repo, which publishes them straight to R2 and runs
// its own key-parity guard against these files as the original. So this audit has
// one dimension — does the authored catalog cover what the code references — and
// no locale set to resolve or iterate.
//
// Reports, per exercise:
//   (a) keys referenced in code but MISSING from the catalog       -> FAILURE
//   (b) exercises with NO catalog at all but code that needs one    -> FAILURE
//   (c) dynamic `t(`...${x}`...)` refs that can't be statically verified -> info
//   (d) keys in the catalog never referenced in code                -> secondary
//
// Read-only. Exit code 1 if any referenced key is missing.

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(fileURLToPath(new URL(".", import.meta.url)), "..");
const EX_DIR = join(ROOT, "src", "exercises");
const CATEGORIES_DIR = join(ROOT, "src", "exercise-categories");

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

// Load + flatten one messages.json into a Set of dotted keys. Returns null if
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

// ---- preload family base catalogs ---------------------------------------------
// familyKeys[family] = Set|null (null = the family ships no catalog)
const familyKeys = {};
if (existsSync(CATEGORIES_DIR)) {
  for (const fam of readdirSync(CATEGORIES_DIR)) {
    if (!statSync(join(CATEGORIES_DIR, fam)).isDirectory()) continue;
    try {
      familyKeys[fam] = loadDictKeys(join(CATEGORIES_DIR, fam, "messages.json"));
    } catch (e) {
      familyKeys[fam] = null;
      console.error(`WARN: bad JSON in family catalog ${fam}: ${e.message}`);
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
  const famKeys = (family && familyKeys[family]) || null;

  // 2. Load the exercise's own catalog keys.
  let ownKeys = null;
  let parseError = null;
  try {
    ownKeys = loadDictKeys(join(exDir, "messages.json"));
  } catch (e) {
    parseError = e.message;
  }

  // 3. Available keys = own UNION family, matching the build-time deep merge.
  const merged = new Set(famKeys || []);
  (ownKeys || []).forEach((k) => merged.add(k));

  // 4. Reference set: dotted literals whose top-level namespace exists in the
  //    merged catalog — filters out import paths, filenames, selectors and code
  //    examples, which are dotted strings too but not keys.
  const namespaces = new Set([...merged].map((k) => k.split(".")[0]));
  const references = new Set();
  for (const k of acc.dotted) if (namespaces.has(k.split(".")[0])) references.add(k);

  const hasWork = references.size > 0 || acc.dynamics.size > 0 || merged.size > 0;
  if (!hasWork) continue;

  // 5. Missing keys + catalog presence.
  const pbases = pluralBasesOf(merged);
  const missing = [];
  for (const k of references) if (!satisfies(merged, pbases, k)) missing.push(k);

  // 6. Unused (secondary): own keys never referenced in code.
  const dynamicPrefixes = [...acc.dynamics].map((d) => d.split("${")[0]).filter(Boolean);
  const unused = [];
  for (const k of ownKeys || []) {
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
    missing: missing.sort(),
    // "No catalog" = this exercise references keys but ships neither its own
    // catalog nor a family one.
    ownAbsent: ownKeys === null,
    famAbsent: family ? !famKeys : null,
    parseError,
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
console.log(`Exercises scanned: ${results.length}`);
console.log("");

const offenders = results.filter((r) => r.missing.length || r.parseError);
const noCatalog = results.filter((r) => r.ownAbsent && r.missing.length);

console.log(`### (a) MISSING keys — referenced in code, absent from the catalog [FAILURE]`);
if (offenders.length === 0) {
  console.log("  None. ✅");
} else {
  for (const r of offenders) {
    if (r.parseError) {
      console.log(`  ${r.name}: JSON PARSE ERROR — ${r.parseError}`);
      continue;
    }
    const tags = [];
    if (r.ownAbsent) tags.push("no own messages.json");
    if (r.family && r.famAbsent) tags.push(`family '${r.family}' has no catalog`);
    console.log(`  ${r.name}${tags.length ? " (" + tags.join("; ") + ")" : ""}:`);
    const byNs = group(r.missing);
    for (const ns of Object.keys(byNs).sort()) {
      for (const k of byNs[ns].sort()) console.log(`      - ${k}`);
    }
  }
}
const totalMissing = offenders.reduce((n, r) => n + r.missing.length, 0);
console.log(`  Missing keys: ${totalMissing}`);

if (noCatalog.length) {
  console.log(`\n### (b) Exercises with NO catalog but code references keys [FAILURE]`);
  for (const r of noCatalog) console.log(`  ${r.name} (${r.missing.length} keys unresolved)`);
}
console.log("");

const dynamicResults = results.filter((r) => r.dynamics.length);

console.log("\n### (c) Dynamic key references — cannot statically verify [info]");
if (dynamicResults.length === 0) console.log("  None.");
else for (const r of dynamicResults) console.log(`  ${r.name}: ${r.dynamics.map((d) => "`" + d + "`").join(", ")}`);

const unusedResults = results.filter((r) => r.unused.length);
console.log(`\n### (d) UNUSED keys — in the catalog, never referenced in code [secondary]`);
if (unusedResults.length === 0) console.log("  None. ✅");
else for (const r of unusedResults) console.log(`  ${r.name}: ${r.unused.join(", ")}`);
const totalUnused = unusedResults.reduce((n, r) => n + r.unused.length, 0);
console.log(`  Total unused: ${totalUnused}`);

console.log("\n" + "=".repeat(78));
console.log(`SUMMARY: ${totalMissing} missing; ${totalUnused} unused; ${results.length} exercises`);
console.log("=".repeat(78));

process.exit(offenders.length > 0 ? 1 : 0);
