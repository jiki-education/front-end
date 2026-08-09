#!/usr/bin/env node

/**
 * i18n translation-key audit for the app (next-intl).
 *
 * Verifies that every translation key referenced in the code has a matching
 * entry in the message dictionary, `app/messages.json`.
 *
 * That is one file and not one per locale because the app authors English and
 * nothing else: every translation of this catalog lives in the i18n repo, which
 * publishes it straight to R2 and runs its own key-parity guard against this file
 * as the original. A locale going live therefore cannot introduce a missing key
 * here, and there is no locale set for this script to resolve.
 *
 * Usage:
 *   node scripts/audit-i18n-keys.mjs
 *
 * Exit code: non-zero if any referenced key is missing.
 *
 * How key references are found (next-intl conventions):
 *   - `const t = useTranslations("namespace")` / `= await getTranslations("ns")`
 *     / `getTranslations({ namespace: "ns" })` binds a variable to a namespace.
 *   - `useTranslations()` / `getTranslations()` (no namespace) bind to the root.
 *   - Then `t("sub.key")`, `t.rich("k")`, `t.markup("k")`, `t.raw("k")` reference
 *     `namespace + "." + literal`. We resolve against the message tree.
 *   - `t.has("k")` is an existence probe, so a missing key there is legitimate —
 *     those references are NOT required (they're reported separately, quietly).
 *   - The keyed toast helpers in `lib/toast.tsx` — toastError / toastSuccess /
 *     toastMessage / toastLoading(key, …) — take a `toasts`-namespace key as
 *     their first arg, resolved at render time by `<ToastMessage>`, so their
 *     call sites carry no `useTranslations` binding. A dedicated pass scans them
 *     and treats a literal first arg as a required ref at `toasts.<key>`.
 *   - Dynamic keys — `t(\`nav.${id}\`)`, `t(item.key as ...)`, `t(variable)` —
 *     cannot be resolved statically. They are reported as "unverifiable", never
 *     flagged as missing (no false positives).
 *
 * next-intl uses ICU MessageFormat inside a single message string for plurals /
 * select, NOT i18next-style `key_one` / `key_other` suffix keys, so there is no
 * plural/context suffix to strip. (If this ever migrates to i18next, add suffix
 * handling here.)
 *
 * We do NOT modify any dict or source — audit and report only.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.join(__dirname, "..");
const MESSAGES_FILE = path.join(APP_DIR, "messages.json");

// Directories scanned for key references.
const SCAN_DIRS = ["app", "components", "lib", "hooks"].map((d) => path.join(APP_DIR, d));
const CODE_EXT = new Set([".ts", ".tsx"]);
const IGNORE_DIRS = new Set(["node_modules", ".next", "dist", "coverage", ".open-next", "__mocks__"]);

// ---------------------------------------------------------------------------
// Message dictionary helpers
// ---------------------------------------------------------------------------

/** Load the message dictionary, returning the parsed object (or null if absent). */
function loadDict() {
  if (!fs.existsSync(MESSAGES_FILE)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8"));
}

/**
 * Build a Set of every path in the message tree — both intermediate nodes
 * ("layout.footer") and leaves ("layout.footer.about.heading"). A referenced key
 * "exists" if it appears here as either; that avoids false positives when a
 * namespace node is referenced directly and keeps us focused on truly-absent keys.
 */
function collectPaths(obj, prefix, out) {
  for (const [k, v] of Object.entries(obj)) {
    const full = prefix ? `${prefix}.${k}` : k;
    out.add(full);
    if (v && typeof v === "object" && !Array.isArray(v)) {
      collectPaths(v, full, out);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Source scanning
// ---------------------------------------------------------------------------

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) {
    return out;
  }
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        walk(path.join(dir, entry.name), out);
      }
    } else if (CODE_EXT.has(path.extname(entry.name)) && !entry.name.endsWith(".d.ts")) {
      out.push(path.join(dir, entry.name));
    }
  }
  return out;
}

// A binding: `const t = useTranslations("ns")`, `= await getTranslations("ns")`,
// `getTranslations({ namespace: "ns" })`, or no-namespace (root). Captures the
// variable name, the namespace ("" for root), and the source offset so we can
// resolve each call against the nearest preceding binding of that variable.
const BINDING_RE = /(?:const|let|var)\s+(\w+)\s*=\s*(?:await\s+)?(?:useTranslations|getTranslations)\s*\(\s*([^)]*)\)/g;

/** Extract the namespace string from a useTranslations/getTranslations arg blob. */
function parseNamespaceArg(arg) {
  const trimmed = arg.trim();
  if (trimmed === "") {
    return ""; // root namespace
  }
  // Object form: getTranslations({ namespace: "x", locale }) — or just { locale }.
  if (trimmed.startsWith("{")) {
    const m = trimmed.match(/namespace\s*:\s*["'`]([^"'`]+)["'`]/);
    return m ? m[1] : ""; // no explicit namespace -> root
  }
  // String-literal form.
  const m = trimmed.match(/^["'`]([^"'`]+)["'`]$/);
  if (m) {
    return m[1];
  }
  // Dynamic namespace (variable). Signal "unknown" so calls resolve as dynamic.
  return null;
}

// A call site on a bound translator: t("k"), t.rich("k"), t.markup("k"),
// t.raw("k"), t.has("k"), or a dynamic first arg. We match `<name>` then an
// optional `.method`, then `(` and inspect the first argument.
function callRegexFor(varName) {
  return new RegExp(`\\b${varName}\\s*(?:\\.(rich|markup|raw|has))?\\s*\\(`, "g");
}

/** Read the first-argument token starting just after the "(" at index `open`. */
function firstArgLiteral(src, open) {
  let i = open;
  // skip whitespace
  while (i < src.length && /\s/.test(src[i])) {
    i++;
  }
  const quote = src[i];
  if (quote === '"' || quote === "'") {
    let j = i + 1;
    let val = "";
    while (j < src.length && src[j] !== quote) {
      if (src[j] === "\\") {
        val += src[j + 1];
        j += 2;
        continue;
      }
      val += src[j];
      j++;
    }
    return { kind: "literal", value: val };
  }
  if (quote === "`") {
    // Template literal — dynamic unless it has no ${}.
    let j = i + 1;
    let val = "";
    let dynamic = false;
    while (j < src.length && src[j] !== "`") {
      if (src[j] === "$" && src[j + 1] === "{") {
        dynamic = true;
        break;
      }
      val += src[j];
      j++;
    }
    return dynamic ? { kind: "dynamic", value: val } : { kind: "literal", value: val };
  }
  return { kind: "dynamic", value: null };
}

/**
 * Resolve the namespace in effect for a call at `offset` in a file, given the
 * file's bindings (sorted by offset). Uses the nearest binding that appears
 * before the call — a good heuristic for files that reuse `t` across multiple
 * components/functions. Returns { namespace } | { dynamic: true } | null.
 */
function namespaceForCall(bindings, varName, offset) {
  let chosen = null;
  for (const b of bindings) {
    if (b.varName !== varName) {
      continue;
    }
    if (b.offset < offset) {
      chosen = b;
    } else {
      break;
    }
  }
  return chosen;
}

function scanFile(file, refs, dynamics, hasProbes) {
  const src = fs.readFileSync(file, "utf8");
  const rel = path.relative(APP_DIR, file);

  // Collect bindings (var -> namespace, with offset).
  const bindings = [];
  const varNames = new Set();
  let m;
  BINDING_RE.lastIndex = 0;
  while ((m = BINDING_RE.exec(src)) !== null) {
    const varName = m[1];
    const ns = parseNamespaceArg(m[2]);
    bindings.push({ varName, namespace: ns, offset: m.index });
    varNames.add(varName);
  }
  if (varNames.size === 0) {
    return;
  }
  bindings.sort((a, b) => a.offset - b.offset);

  for (const varName of varNames) {
    const re = callRegexFor(varName);
    let cm;
    while ((cm = re.exec(src)) !== null) {
      const method = cm[1]; // rich|markup|raw|has|undefined
      const openParen = cm.index + cm[0].length; // index right after "("
      const arg = firstArgLiteral(src, openParen);
      const binding = namespaceForCall(bindings, varName, cm.index);
      if (!binding) {
        continue; // call to a same-named var that isn't a translator binding
      }
      const line = src.slice(0, cm.index).split("\n").length;
      const where = `${rel}:${line}`;

      if (binding.namespace === null) {
        // Dynamic namespace — cannot resolve.
        dynamics.push({ where, reason: "dynamic namespace", varName });
        continue;
      }
      if (arg.kind === "dynamic") {
        dynamics.push({ where, reason: "dynamic key", varName, namespace: binding.namespace });
        continue;
      }
      // Static literal key.
      const fullKey = binding.namespace ? `${binding.namespace}.${arg.value}` : arg.value;
      if (method === "has") {
        hasProbes.add(fullKey);
        continue; // existence probes are not required keys
      }
      if (!refs.has(fullKey)) {
        refs.set(fullKey, new Set());
      }
      refs.get(fullKey).add(where);
    }
  }
}

// ---------------------------------------------------------------------------
// Keyed toast helpers (lib/toast.tsx)
// ---------------------------------------------------------------------------

// The four keyed toast helpers each take a `toasts`-namespace key as their first
// argument; the copy is resolved later by <ToastMessage>, so these call sites
// have no useTranslations/getTranslations binding for the scan above to catch.
// The names are globally unique and always imported under their own name (no
// aliasing), so a plain name match is enough. lib/toast.tsx is the source of
// truth for this list.
const TOAST_HELPERS = ["toastError", "toastSuccess", "toastMessage", "toastLoading"];
const TOAST_NAMESPACE = "toasts";
const TOAST_SOURCE = path.join("lib", "toast.tsx"); // where the helpers are defined — skip so their signatures aren't scanned as calls
const TOAST_CALL_RE = new RegExp(`\\b(${TOAST_HELPERS.join("|")})\\s*\\(`, "g");

/**
 * Scan a file for keyed toast-helper calls. A literal first arg becomes a
 * required ref at `toasts.<key>`; a template literal with ${} or a non-literal
 * first arg (variable, ternary, …) goes into the dynamics bucket like any other
 * unverifiable reference.
 */
function scanToastCalls(file, refs, dynamics) {
  const rel = path.relative(APP_DIR, file);
  if (rel === TOAST_SOURCE) {
    return; // the helper definitions themselves, not call sites
  }
  const src = fs.readFileSync(file, "utf8");
  let cm;
  TOAST_CALL_RE.lastIndex = 0;
  while ((cm = TOAST_CALL_RE.exec(src)) !== null) {
    const openParen = cm.index + cm[0].length; // index right after "("
    const arg = firstArgLiteral(src, openParen);
    const line = src.slice(0, cm.index).split("\n").length;
    const where = `${rel}:${line}`;
    if (arg.kind === "dynamic") {
      dynamics.push({ where, reason: "dynamic toast key", namespace: TOAST_NAMESPACE, varName: cm[1] });
      continue;
    }
    const fullKey = `${TOAST_NAMESPACE}.${arg.value}`;
    if (!refs.has(fullKey)) {
      refs.set(fullKey, new Set());
    }
    refs.get(fullKey).add(where);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  console.log(`i18n key audit — app/messages.json  (next-intl)\n`);

  // Gather references from source.
  const refs = new Map(); // fullKey -> Set<where>
  const dynamics = []; // { where, reason, ... }
  const hasProbes = new Set(); // keys only referenced via t.has()

  let fileCount = 0;
  for (const dir of SCAN_DIRS) {
    for (const file of walk(dir)) {
      fileCount++;
      scanFile(file, refs, dynamics, hasProbes);
      scanToastCalls(file, refs, dynamics);
    }
  }

  console.log(`Scanned ${fileCount} source files.`);
  console.log(`Statically-resolved key references: ${refs.size}`);
  console.log(`Dynamic / unverifiable references:  ${dynamics.length}`);
  console.log(`Existence probes (t.has, not required): ${hasProbes.size}\n`);

  // Load the dictionary and its path set.
  const baseDict = loadDict();
  const dictPathSet = baseDict ? collectPaths(baseDict, "", new Set()) : null;

  // ---- MISSING KEYS ----
  let anyMissing = false;
  const sortedRefs = [...refs.keys()].sort();

  if (dictPathSet === null) {
    console.error(`✗ app/messages.json NOT FOUND — cannot audit.`);
    anyMissing = true;
  } else {
    const missing = sortedRefs.filter((k) => !dictPathSet.has(k));
    if (missing.length === 0) {
      console.log(`✓ 0 missing keys (${sortedRefs.length} referenced keys all present)`);
    } else {
      anyMissing = true;
      console.log(`✗ ${missing.length} MISSING key(s) — should be added to messages.json:`);
      for (const key of missing) {
        const wheres = [...refs.get(key)].sort();
        console.log(`    ${key}`);
        console.log(
          `        referenced by: ${wheres.slice(0, 5).join(", ")}${wheres.length > 5 ? `, +${wheres.length - 5} more` : ""}`
        );
      }
    }
  }

  // ---- UNUSED KEYS (lower priority) ----
  if (dictPathSet) {
    // Leaf keys only: a node whose children are all used is naturally "used".
    const leaves = new Set();
    (function leafWalk(o, p) {
      for (const [k, v] of Object.entries(o)) {
        const f = p ? `${p}.${k}` : k;
        if (v && typeof v === "object" && !Array.isArray(v)) {
          leafWalk(v, f);
        } else {
          leaves.add(f);
        }
      }
    })(baseDict, "");
    // A leaf is "used" if it is referenced directly, OR is a descendant of a
    // referenced key (namespace referenced whole), OR probed via t.has, OR could
    // be produced by a dynamic reference (best-effort: skip dynamic-prefixed).
    const referencedPrefixes = [...refs.keys(), ...hasProbes];
    const unused = [...leaves].filter((leaf) => {
      if (refs.has(leaf) || hasProbes.has(leaf)) {
        return false;
      }
      // descendant of a referenced namespace key?
      return !referencedPrefixes.some((r) => leaf === r || leaf.startsWith(`${r}.`));
    });
    console.log(`\nUnused leaf keys (lower priority — may be referenced dynamically or dead): ${unused.length}`);
    for (const k of unused.slice(0, 40).sort()) {
      console.log(`    ${k}`);
    }
    if (unused.length > 40) {
      console.log(`    …and ${unused.length - 40} more`);
    }
  }

  // ---- DYNAMIC / UNVERIFIABLE (summary) ----
  if (dynamics.length > 0) {
    console.log(`\nDynamic / unverifiable references (cannot statically check — review manually): ${dynamics.length}`);
    const byReason = {};
    for (const d of dynamics) {
      const label = d.namespace !== undefined ? `${d.reason} (ns "${d.namespace}")` : d.reason;
      (byReason[label] ||= []).push(d.where);
    }
    for (const [label, wheres] of Object.entries(byReason).sort()) {
      console.log(`    ${label}: ${wheres.length}`);
      for (const w of wheres.slice(0, 6)) {
        console.log(`        ${w}`);
      }
      if (wheres.length > 6) {
        console.log(`        …and ${wheres.length - 6} more`);
      }
    }
  }

  console.log("");
  if (anyMissing) {
    console.log("RESULT: FAIL — missing keys above must be added to messages.json.");
    process.exit(1);
  }
  console.log("RESULT: PASS — every statically-resolved key is present in messages.json.");
}

main();
