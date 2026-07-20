// Shared locale resolver for the i18n key-audit scripts across the monorepo
// (app, curriculum, interpreters). Single source of truth for "which locales
// should an audit check": the production set defined by SUPPORTED_LOCALES in
// app/lib/locales.ts, evaluated as production, with a --locales CLI override
// for local dev.
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
const LOCALES_TS = join(HERE, "..", "app", "lib", "locales.ts");

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

// Extract the array of string literals that follows a `const NAME = [ ... ]`
// (or the production branch of the SUPPORTED_LOCALES ternary) in locales.ts.
function extractArrayLiterals(segment) {
  const match = segment.match(/\[([^\]]*)\]/);
  if (!match) return null;
  const items = [...match[1].matchAll(/["'`]([^"'`]+)["'`]/g)].map((m) => m[1]);
  return items.length ? items : null;
}

// Resolve the production locale set from app/lib/locales.ts. We read
// ALL_LOCALES and the production branch of the SUPPORTED_LOCALES ternary
// (`process.env.NODE_ENV === "production" ? [...] : ALL_LOCALES`). If that
// branch is a literal array we use it; if it references ALL_LOCALES we use
// the full set.
export function resolveProductionLocales() {
  let src;
  try {
    src = readFileSync(LOCALES_TS, "utf8");
  } catch {
    // If we cannot find the source of truth, fail safe to English-only.
    return ["en"];
  }

  const allLine = src.match(/ALL_LOCALES\s*=\s*(\[[^\]]*\])/);
  const allLocales = allLine ? extractArrayLiterals(allLine[1]) : null;

  const supported = src.match(/SUPPORTED_LOCALES[^=]*=\s*([^;]+);/);
  if (supported) {
    const expr = supported[1];
    const ternary = expr.match(/\?([^:]+):(.+)/);
    const prodBranch = ternary ? ternary[1] : expr;
    if (/ALL_LOCALES/.test(prodBranch)) {
      return allLocales ?? ["en"];
    }
    const literals = extractArrayLiterals(prodBranch);
    if (literals) return literals;
  }

  return allLocales ?? ["en"];
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
