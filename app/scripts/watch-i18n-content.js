#!/usr/bin/env node

/**
 * Guard in front of the i18n content watcher.
 *
 * The watcher itself is one `onchange` over the sibling i18n repo's whole
 * `locales/` tree. That is the expensive half of translated content in dev:
 * chokidar holds a watch on thousands of files across every locale, and the
 * repo is updated often enough that the publisher is being re-run more or less
 * continuously even when nobody is looking at a translated page.
 *
 * So it only starts when JIKI_ALL_LOCALES is set, which `bin/dev --all-locales`
 * does. Exiting 0 otherwise leaves the rest of the parallel dev scripts running
 * and says nothing: generate-i18n-content.js has already printed the one line
 * explaining how to turn translations on, and repeating it here would just be
 * noise in the dev server's output.
 */

import { spawn } from "child_process";

if (!process.env.JIKI_ALL_LOCALES) process.exit(0);

const child = spawn(
  "onchange",
  ["../../i18n/locales/**", "--", "node", "scripts/generate-i18n-content.js", "{{changed}}"],
  {
    stdio: "inherit",
    shell: false
  }
);

child.on("exit", (code, signal) => process.exit(signal ? 1 : (code ?? 0)));
