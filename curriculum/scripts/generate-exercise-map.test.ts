/**
 * Generates two manifests by importing every exercise module.
 * Run as part of the curriculum build via vitest.
 *
 * - dist/concepts/exercise-map.json: reverse index, concept slug -> exercise slugs[]
 * - dist/exercises/bonus-exercises.json: slugs of exercises with at least one
 *   bonus task. Tasks live in each exercise's scenarios.ts, so this is the only
 *   place the fact can be read without importing the module; the front-end
 *   compiles it into a manifest for the dashboard's bonus marker.
 */

import { it } from "vitest";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { exercises } from "../src/exercises";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "../dist/concepts/exercise-map.json");
const BONUS_OUTPUT_PATH = path.join(__dirname, "../dist/exercises/bonus-exercises.json");

it("generates exercise-map.json", { timeout: 10000 }, async () => {
  const map: Record<string, string[]> = {};
  const bonusSlugs: string[] = [];

  for (const [slug, loader] of Object.entries(exercises)) {
    const mod = await loader();
    const def = mod.default;
    if (def.tasks.some((task) => task.bonus === true)) {
      bonusSlugs.push(slug);
    }
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

  bonusSlugs.sort();
  fs.mkdirSync(path.dirname(BONUS_OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(BONUS_OUTPUT_PATH, JSON.stringify(bonusSlugs, null, 2) + "\n");

  const conceptCount = Object.keys(map).length;
  const exerciseCount = new Set(Object.values(map).flat()).size;
  // eslint-disable-next-line no-console
  console.log(`Generated exercise-map.json (${conceptCount} concepts, ${exerciseCount} exercises)`);
  // eslint-disable-next-line no-console
  console.log(`Generated bonus-exercises.json (${bonusSlugs.length} exercises with a bonus task)`);
});
