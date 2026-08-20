/**
 * Video catalog resolution.
 *
 * Every video the platform plays is authored once in
 * `curriculum/src/videos/videos.json`, keyed by video slug. A video lesson's
 * slug IS its video slug; concepts reference a video slug from their
 * `config.json`.
 *
 * Each entry is a map of locale -> source, plus a required `fallback` used when
 * a locale has no recording of its own:
 *
 *   "for-while-loops": {
 *     "fallback": { provider, id, durationSeconds, uploadDate },
 *     "hu": { provider, id, durationSeconds, uploadDate }
 *   }
 *
 * Resolution happens here, at build time, so each locale's static payload
 * carries exactly one flat source and the app never resolves at runtime.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CATALOG_PATH = path.join(__dirname, "../../../curriculum/src/videos/videos.json");

const PROVIDERS = ["mux", "youtube"];

let catalog = null;

function validateSource(source, where) {
  if (!source || typeof source !== "object") {
    throw new Error(`Video ${where} must be an object`);
  }
  if (!PROVIDERS.includes(source.provider)) {
    throw new Error(`Video ${where} has unknown provider "${source.provider}" (expected ${PROVIDERS.join(", ")})`);
  }
  if (typeof source.id !== "string" || source.id.length === 0) {
    throw new Error(`Video ${where} is missing an id`);
  }
  // Both are required for the VideoObject JSON-LD on the public pages these
  // videos appear on, so a source without them is a broken source.
  if (typeof source.durationSeconds !== "number") {
    throw new Error(`Video ${where} is missing durationSeconds`);
  }
  if (typeof source.uploadDate !== "string") {
    throw new Error(`Video ${where} is missing uploadDate`);
  }
}

export function loadVideoCatalog() {
  if (catalog) {
    return catalog;
  }

  if (!fs.existsSync(CATALOG_PATH)) {
    throw new Error(`No video catalog at ${CATALOG_PATH}`);
  }

  const parsed = JSON.parse(fs.readFileSync(CATALOG_PATH, "utf8"));

  for (const [slug, entry] of Object.entries(parsed)) {
    if (!entry.fallback) {
      throw new Error(`Video "${slug}" has no fallback source`);
    }
    for (const [locale, source] of Object.entries(entry)) {
      validateSource(source, `"${slug}" (${locale})`);
    }
  }

  catalog = parsed;
  return catalog;
}

/**
 * The source to play for `slug` in `locale`: the locale's own recording, else
 * the base language's (pt-BR -> pt), else the fallback. Returns null when the
 * slug names no video at all.
 */
export function resolveVideo(slug, locale) {
  if (!slug) {
    return null;
  }

  const entry = loadVideoCatalog()[slug];
  if (!entry) {
    throw new Error(`Unknown video "${slug}" — not in curriculum/src/videos/videos.json`);
  }

  return entry[locale] || entry[locale.split("-")[0]] || entry.fallback;
}
