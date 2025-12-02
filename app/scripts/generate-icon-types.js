#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ICONS_DIR = path.join(__dirname, "../icons");
const OUTPUT_FILE = path.join(__dirname, "../components/ui-kit/icon-types.ts");

// Read all .svg files from icons directory
const files = fs.readdirSync(ICONS_DIR);
const iconNames = files
  .filter((file) => file.endsWith(".svg"))
  .map((file) => file.replace(".svg", ""))
  .sort();

// Generate TypeScript content
const typeUnion = iconNames.map((name) => `"${name}"`).join(" | ");

const content = `/**
 * Auto-generated icon types
 * Generated from SVG files in /icons/
 *
 * To regenerate manually: pnpm run icons:generate
 * Auto-regenerates during development via bin/dev watch mode
 *
 * Available icons: ${iconNames.join(", ")}
 */

export type IconName = ${typeUnion};
`;

// Write the file
fs.writeFileSync(OUTPUT_FILE, content, "utf8");
// eslint-disable-next-line no-console
console.log(`✅ Generated icon types for ${iconNames.length} icons`);

// Format the file with Prettier
const outputFileRelative = path.relative(path.join(__dirname, ".."), OUTPUT_FILE);
try {
  execSync(`pnpm exec prettier --write ${OUTPUT_FILE}`, { stdio: "inherit" });
  // eslint-disable-next-line no-console
  console.log(`💅 Formatted ${outputFileRelative}`);
} catch (error) {
  console.error(`⚠️ Failed to format ${outputFileRelative}:`, error.message);
}

// Stage the file with git
try {
  execSync(`git add ${OUTPUT_FILE}`, { stdio: "inherit" });
  // eslint-disable-next-line no-console
  console.log(`📝 Staged ${outputFileRelative}`);
} catch (error) {
  console.error(`⚠️ Failed to stage ${outputFileRelative}:`, error.message);
}
