// Locale resolver for the i18n key audits that still have a locale dimension.
// Single source of truth for "which locales should an audit check":
// PRODUCTION_LOCALES in app/lib/locales.ts, with a --locales CLI override for
// local dev.
//
// Only the interpreters audit uses it. The app and curriculum audits each guard
// a single authored catalog — English is the only locale either package holds,
// and every translation of those catalogs is guarded in the i18n repo against
// them — so they have no locale set to resolve. The interpreter tree really does
// hold two catalogs per language, `en` and the machine-readable `system`.
//
// ## Why PRODUCTION_LOCALES and not SUPPORTED_LOCALES
//
// This used to infer the set from the production branch of the SUPPORTED_LOCALES
// ternary. That worked only because the expression happened to have a shape a
// regex could read, and it broke the moment the expression changed: a
// three-tier version whose first branch is ALL_LOCALES parsed as "audit
// everything", which demanded Hungarian catalogs from packages that have none.
//
// PRODUCTION_LOCALES exists precisely to name the set that must be complete, and
// it is a plain literal array. Reading a constant that is declared for this
// purpose is a contract; inferring one from the shape of a conditional was an
// accident that held for a while.
//
// Usage from a package audit script:
//   import { resolveAuditLocales } from "../../scripts/i18n-locales.mjs";
//   const locales = resolveAuditLocales(process.argv.slice(2));
//
// Override for dev:  node audit.mjs --locales=en,hu   (or --locales en,hu)

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const PRODUCTION_LOCALES_JSON = join(HERE, "..", "app", "lib", "production-locales.json");

// Parse the `--locales=a,b` / `--locales a,b` flag out of an argv slice.
function parseLocalesFlag(argv) {
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg.startsWith("--locales=")) {
      return arg.slice("--locales=".length);
    }
    if (arg === "--locales" && i + 1 < argv.length) {
      return argv[i + 1];
    }
  }
  return null;
}

function splitList(value) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Every failure here is fatal. See resolveProductionLocales. */
function fail(reason) {
  throw new Error(
    `Cannot determine the production locale set: ${reason}.\n` +
      `Expected a literal \`export const PRODUCTION_LOCALES: readonly Locale[] = ["en", ...]\` in\n` +
      `  ${LOCALES_TS}\n` +
      `Pass --locales=en,hu to override for a local run.`
  );
}

/**
 * The production locale set, read from PRODUCTION_LOCALES in app/lib/locales.ts.
 *
 * THROWS rather than guessing. The previous version fell back to English-only,
 * or to ALL_LOCALES, whenever the parse failed, and the direction of a wrong
 * guess is what makes that unacceptable. Guessing too WIDE is survivable and
 * loud: the audit demands catalogs a package does not have and someone
 * investigates. Guessing too NARROW is silent: the audit passes while never
 * looking at a locale that is actually shipping, which is precisely the gap it
 * exists to find.
 *
 * A resolver that cannot read its own source of truth knows nothing, and the
 * only safe thing to report is that it knows nothing.
 */
export function resolveProductionLocales() {
  // The same file app/lib/locales.ts imports. This used to parse the array out of
  // locales.ts, which meant a source edit could quietly change what a blocking
  // check gates on: an unanchored match could run from a mention of the name in a
  // comment to whatever the next array happened to be, which is a wrong answer
  // wearing the shape of a right one. There is nothing to parse now.
  let raw;
  try {
    raw = readFileSync(PRODUCTION_LOCALES_JSON, "utf8");
  } catch (error) {
    fail(`cannot read ${PRODUCTION_LOCALES_JSON} (${error.code ?? error.message})`);
  }

  let locales;
  try {
    locales = JSON.parse(raw);
  } catch (error) {
    fail(`${PRODUCTION_LOCALES_JSON} is not valid JSON (${error.message})`);
  }

  if (!Array.isArray(locales) || locales.length === 0 || !locales.every((l) => typeof l === "string" && l)) {
    fail(`${PRODUCTION_LOCALES_JSON} must be a non-empty array of locale strings`);
  }

  return locales;
}

// Public entry point: honour a --locales flag (dev), otherwise the production set.
export function resolveAuditLocales(argv = process.argv.slice(2)) {
  const flag = parseLocalesFlag(argv);
  if (flag) return splitList(flag);
  return resolveProductionLocales();
}

// Allow running directly to print what would be audited.
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const argv = process.argv.slice(2);
  const flag = parseLocalesFlag(argv);
  const locales = resolveAuditLocales(argv);
  process.stdout.write(
    `${flag ? "override" : "production"} locales: ${locales.join(", ")}\n`
  );
}
