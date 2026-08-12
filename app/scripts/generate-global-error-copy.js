#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Inline the global-error page's copy, for every locale, into a generated module.
 *
 * ## The constraint
 *
 * `app/global-error.tsx` replaces the entire HTML tree when the app has already
 * failed, possibly BECAUSE catalog loading failed. It cannot await a catalog, so
 * its three strings have to be bundled synchronously.
 *
 * That is a constraint on DELIVERY, not on authorship, and it used to be treated
 * as both: the strings lived in a hand-written `Record<Locale, ...>` inside the
 * `.tsx`. Every locale meant a hand edit; the Hungarian in there was invisible to
 * the i18n repo's checker, never stale-checked, and the exhaustive Record made
 * that file the single reason widening `Locale` broke compilation.
 *
 * So authorship goes back where it belongs — English in `messages.json` under
 * `globalError`, every other locale in the i18n repo's copy of that catalog —
 * and this script does the inlining. The page keeps zero runtime dependencies.
 *
 * ## Why the output is committed
 *
 * The translations live in a different repo, and neither the production build
 * nor CI checks out that repo (every other locale's content is fetched from R2
 * at runtime, which this one page cannot do). So the generated module is
 * committed: run this when the copy changes, commit the result, and every build
 * everywhere has the bytes with no checkout and no network.
 *
 * This is the ONE piece of locale-varying content bundled at build time, and
 * `tests/unit/lib/i18n/bundled.test.ts` names it as the only allowed exception
 * so a second one cannot creep in.
 *
 * ## Without an i18n checkout
 *
 * It refuses to write anything and says so. A run that quietly emitted
 * English-only would look like a successful regeneration and would delete every
 * translation from the committed file.
 */

import fs from "fs";
import path from "path";
import { DEFAULT_LOCALE, GLOBAL_ERROR_COPY_FILE, resolveI18nRepo } from "./lib/language-registry.js";
import { buildGlobalErrorCopy, renderModule } from "./lib/global-error-copy.js";

const i18nRepo = resolveI18nRepo();
if (!i18nRepo) {
  console.log(
    `Global error copy: no i18n checkout (set JIKI_I18N_REPO or clone it beside this repo), so nothing was\n` +
      `regenerated. ${path.relative(process.cwd(), GLOBAL_ERROR_COPY_FILE)} is committed and left untouched.`
  );
  process.exit(0);
}

const { entries, problems } = buildGlobalErrorCopy(i18nRepo);

if (!entries.some(([locale]) => locale === DEFAULT_LOCALE)) {
  console.error(
    `Global error copy: messages.json has no usable \`globalError\` section. English is the fallback every\n` +
      `other locale relies on, so this refuses to write a module without it.`
  );
  process.exit(1);
}

const content = renderModule(entries);
fs.mkdirSync(path.dirname(GLOBAL_ERROR_COPY_FILE), { recursive: true });
const previous = fs.existsSync(GLOBAL_ERROR_COPY_FILE) ? fs.readFileSync(GLOBAL_ERROR_COPY_FILE, "utf8") : "";
if (previous === content) {
  console.log(`Global error copy: already up to date (${entries.map(([locale]) => locale).join(", ")}).`);
} else {
  fs.writeFileSync(GLOBAL_ERROR_COPY_FILE, content);
  console.log(`Global error copy: wrote ${entries.map(([locale]) => locale).join(", ")}.`);
}

// Reported, never fatal. A locale whose translation has not landed yet is a
// normal state on the way to launching it, and it is `locale:check`'s job to say
// so in one place alongside everything else. Failing here would just move that
// message somewhere nobody is looking.
for (const problem of problems) {
  console.log(`  note: ${problem}`);
}
