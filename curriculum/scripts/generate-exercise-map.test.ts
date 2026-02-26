/**
 * Generates dist/concepts/exercise-map.json from exercises' conceptSlugs.
 *
 * Builds a reverse index: concept slug -> exercise slugs[].
 * Run as part of the curriculum build via vitest.
 */

import { it } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exercises } from "../src/exercises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "../dist/concepts/exercise-map.json");

it("generates exercise-map.json", async () => {
  const map: Record<string, string[]> = {};

  for (const [slug, loader] of Object.entries(exercises)) {
    const mod = await loader();
    const def = mod.default;
    if (def.conceptSlugs) {
      for (const concept of def.conceptSlugs) {
        if (map[concept] === undefined) map[concept] = [];
        map[concept].push(slug);
      }
    }
  }

  for (const slugs of Object.values(map)) {
    slugs.sort();
  }

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(map, null, 2) + "\n");

  const conceptCount = Object.keys(map).length;
  const exerciseCount = new Set(Object.values(map).flat()).size;
  // eslint-disable-next-line no-console
  console.log(`Generated exercise-map.json (${conceptCount} concepts, ${exerciseCount} exercises)`);
});
