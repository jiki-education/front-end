#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * CSS static-asset fingerprinting.
 *
 * Assets referenced from CSS via `url("/static/...")` are served cross-origin
 * from assets.jiki.io (the CSS itself is moved there by assetPrefix). To serve
 * them with an immutable, long-lived cache we must content-hash their URLs so a
 * change produces a new URL.
 *
 * This script scans every CSS file in the app AND the curriculum package (whose
 * CSS is imported by the app and flows through the same PostCSS pipeline), finds
 * `/static/...` url() references, content-hashes each target file under
 * public/static, copies it to a fingerprinted path, and writes a manifest:
 *
 *   public/static/hashed/<orig-path>-<hash>.<ext>   (fingerprinted copies, gitignored)
 *   lib/generated/css-asset-hashes.json             (/static/X -> /static/hashed/... , gitignored)
 *
 * The manifest is consumed by the PostCSS plugin in postcss.config.mjs, which
 * rewrites the url() references at build/dev time. Because every CSS-referenced
 * asset ends up hashed, the whole synced /static tree can be served immutable.
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_DIR = path.join(__dirname, "..");
const PUBLIC_STATIC = path.join(APP_DIR, "public/static");
const HASHED_DIR = path.join(PUBLIC_STATIC, "hashed");
const MANIFEST_PATH = path.join(APP_DIR, "lib/generated/css-asset-hashes.json");

// Roots to scan for CSS. Curriculum CSS is imported by the app and processed by
// the same pipeline, so its /static refs must be rewritten too.
const CSS_ROOTS = [
  path.join(APP_DIR, "app"),
  path.join(APP_DIR, "components"),
  path.join(APP_DIR, "lib"),
  path.join(APP_DIR, "../curriculum/src")
];

const URL_RE = /url\(\s*['"]?(\/static\/[^'")]+)['"]?\s*\)/g;

function walkCss(dir, out) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    if (e.name === "node_modules" || e.name === "dist" || e.name === ".next") continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkCss(full, out);
    else if (e.isFile() && e.name.endsWith(".css")) out.push(full);
  }
  return out;
}

function hashFile(absPath) {
  const buf = fs.readFileSync(absPath);
  return crypto.createHash("sha256").update(buf).digest("hex").slice(0, 12);
}

function main() {
  // Collect every distinct /static/... url() reference across all CSS.
  const refs = new Set();
  for (const root of CSS_ROOTS) {
    for (const file of walkCss(root, [])) {
      const css = fs.readFileSync(file, "utf8");
      for (const m of css.matchAll(URL_RE)) refs.add(m[1]);
    }
  }

  // Reset the hashed output dir so removed refs don't leave stale copies.
  fs.rmSync(HASHED_DIR, { recursive: true, force: true });
  fs.mkdirSync(HASHED_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(MANIFEST_PATH), { recursive: true });

  const manifest = {};
  const missing = [];

  for (const ref of [...refs].sort()) {
    const rel = ref.replace(/^\/static\//, ""); // e.g. images/landing-page/stars-0b091.svg
    const src = path.join(PUBLIC_STATIC, rel);
    if (!fs.existsSync(src)) {
      missing.push(ref);
      continue;
    }
    const hash = hashFile(src);
    const ext = path.extname(rel);
    const hashedRel = `${rel.slice(0, -ext.length || undefined)}-${hash}${ext}`;
    const dest = path.join(HASHED_DIR, hashedRel);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(src, dest);
    manifest[ref] = `/static/hashed/${hashedRel}`;
  }

  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + "\n");

  console.log(`CSS asset hashes: ${Object.keys(manifest).length} fingerprinted -> public/static/hashed`);
  if (missing.length) {
    // Not fatal: a ref may point at a file provided elsewhere. Surface it so a
    // genuine typo/missing asset is visible rather than silently un-hashed.
    console.warn(`⚠ ${missing.length} CSS /static ref(s) had no file under public/static (left un-rewritten):`);
    for (const r of missing) console.warn(`   ${r}`);
  }
}

main();
