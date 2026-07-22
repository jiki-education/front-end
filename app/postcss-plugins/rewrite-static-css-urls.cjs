/**
 * PostCSS plugin: rewrite `url("/static/...")` references to their content-hashed
 * copies using the manifest produced by scripts/generate-css-asset-hashes.js.
 *
 * Runs for app AND curriculum CSS (curriculum CSS is imported by the app and
 * flows through this pipeline), so every CSS-referenced /static asset ends up
 * pointing at a fingerprinted URL and the synced /static tree can be immutable.
 *
 * Must be a module referenced by string in postcss.config.mjs — Next.js rejects
 * inline plugin objects ("Malformed PostCSS Configuration").
 */
/* eslint-disable @typescript-eslint/no-require-imports --
   Must be CommonJS: Next.js loads postcss plugins via require(), which cannot
   load an ESM module, so this file uses require() by necessity. */
const fs = require("fs");
const path = require("path");

const MANIFEST_PATH = path.join(__dirname, "..", "lib/generated/css-asset-hashes.json");
const URL_RE = /url\(\s*(['"]?)(\/static\/[^'")]+)\1\s*\)/g;

function loadManifest() {
  try {
    return JSON.parse(fs.readFileSync(MANIFEST_PATH, "utf8"));
  } catch {
    // No manifest yet (first run before the generator) — leave url()s untouched.
    return {};
  }
}

const plugin = () => ({
  postcssPlugin: "rewrite-static-css-urls",
  // Read the manifest fresh per processed file (cheap) so `dev` + css-hashes:watch
  // pick up regenerated hashes without restarting the dev server.
  prepare() {
    const manifest = loadManifest();
    return {
      Declaration(decl) {
        if (!decl.value.includes("/static/")) return;
        decl.value = decl.value.replace(URL_RE, (full, quote, url) => {
          const hashed = manifest[url];
          return hashed ? `url(${quote}${hashed}${quote})` : full;
        });
      }
    };
  }
});
plugin.postcss = true;

module.exports = plugin;
