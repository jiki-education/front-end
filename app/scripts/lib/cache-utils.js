 

/**
 * Shared helpers for the build-time cache generators (generate-*-cache.js).
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Compute a 12-char SHA-256 hash of content (the content fingerprint used in
 * every cache-tree filename).
 */
export function computeHash(content) {
  return crypto.createHash("sha256").update(content).digest("hex").slice(0, 12);
}

/**
 * Write a file, creating parent directories as needed.
 */
export function writeFile(filePath, content) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, content);
}
