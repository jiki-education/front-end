#!/usr/bin/env node
/* eslint-disable no-console */

/**
 * Content R2 Upload Script
 *
 * Uploads the contents of .content-cache/ to the R2 `assets` bucket
 * under the `content/` prefix. Uses `wrangler r2 object put` for each file,
 * running uploads in parallel for speed.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exec } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CACHE_DIR = path.join(__dirname, "../.content-cache");
const BUCKET_NAME = "assets";
const KEY_PREFIX = "content";
const CONCURRENCY = 10;

/**
 * Recursively list all files in a directory
 */
function listFiles(dir, base = dir) {
  const results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...listFiles(fullPath, base));
    } else {
      results.push(path.relative(base, fullPath));
    }
  }

  return results;
}

/**
 * Upload a single file to R2
 */
function uploadFile(relativePath) {
  const localPath = path.join(CACHE_DIR, relativePath);
  const r2Key = `${KEY_PREFIX}/${relativePath}`;

  let contentType = "application/octet-stream";
  if (relativePath.endsWith(".json")) {
    contentType = "application/json";
  } else if (relativePath.endsWith(".md")) {
    contentType = "text/markdown";
  }

  return new Promise((resolve) => {
    exec(
      `wrangler r2 object put "${BUCKET_NAME}/${r2Key}" --file="${localPath}" --content-type="${contentType}"`,
      (error) => {
        if (error) {
          console.error(`  Failed to upload ${r2Key}: ${error.message}`);
          resolve(false);
        } else {
          resolve(true);
        }
      }
    );
  });
}

/**
 * Main upload function
 */
async function uploadContent() {
  console.log("Uploading content to R2...\n");

  if (!fs.existsSync(CACHE_DIR)) {
    console.error(`Content cache directory not found: ${CACHE_DIR}`);
    console.error("Run 'pnpm run content:generate' first.");
    process.exit(1);
  }

  const files = listFiles(CACHE_DIR);
  console.log(`  Found ${files.length} files to upload (concurrency: ${CONCURRENCY})\n`);

  let uploaded = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i += CONCURRENCY) {
    const batch = files.slice(i, i + CONCURRENCY);
    const results = await Promise.all(batch.map(uploadFile));

    for (const success of results) {
      if (success) {
        uploaded++;
      } else {
        failed++;
      }
    }
  }

  console.log(`\nUpload complete: ${uploaded} uploaded, ${failed} failed\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

try {
  await uploadContent();
} catch (error) {
  console.error("Failed to upload content to R2:", error);
  process.exit(1);
}
