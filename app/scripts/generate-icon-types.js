#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require("fs");
const path = require("path");

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
