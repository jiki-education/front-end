#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Generate `lib/production-locales.json` from the language roster.
 *
 * ## Why the file exists at all
 *
 * The deploy gate (`verify-locale-completeness.js`) has to know which locales
 * production serves, and it runs as a plain node script before the build, in a
 * CI job with no install step. It cannot import TypeScript, and the roster has
 * to be TypeScript because `Locale` is derived from it. So the roster is
 * projected into JSON bytes the gate can read with `JSON.parse` and nothing else.
 *
 * ## Why it is generated rather than hand-edited
 *
 * It used to be a source file, which made launching a locale two edits in two
 * files that had to agree, discovered one CI failure at a time. Now it is output:
 * the roster is edited, this regenerates it, and the result is committed.
 *
 * Committed, not gitignored, because the deploy build and the gate's own CI job
 * never run any generator. The bytes have to be in the tree.
 *
 * Two things stop the committed copy drifting from the roster:
 *   - `pnpm locale:check` (in CI) regenerates and fails on any difference.
 *   - `lib/locales.ts` asserts the two agree at import, as a backstop.
 */

import fs from "fs";
import { PRODUCTION_LOCALES_FILE, productionLocales } from "./lib/language-registry.js";

// Formatted the way prettier formats this file, so `pnpm format:check` is happy
// with the generated output and nobody has to run prettier over a build artifact.
const content = `${JSON.stringify(productionLocales())}\n`.replace(/","/g, '", "');

const previous = fs.existsSync(PRODUCTION_LOCALES_FILE) ? fs.readFileSync(PRODUCTION_LOCALES_FILE, "utf8") : "";
if (previous === content) {
  console.log(`Production locales: ${PRODUCTION_LOCALES_FILE} already up to date (${content.trim()}).`);
} else {
  fs.writeFileSync(PRODUCTION_LOCALES_FILE, content);
  console.log(`Production locales: wrote ${PRODUCTION_LOCALES_FILE} -> ${content.trim()}`);
}
