import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { exercises } from "../../src/exercises";

/**
 * Some exercises require the student to return an exact sentence-like string
 * (e.g. `No table found`, `Not on the list!`). Those strings are compared
 * byte-for-byte by the scenario runner, so they are effectively code — but
 * unlike `getAge()` they read as ordinary English prose, which makes them very
 * tempting for a translator to translate.
 *
 * If a locale translates one, that locale's exercise becomes unpassable, with
 * no obvious cause: the instructions tell the student to return one string and
 * the runner demands another.
 *
 * This guard derives the literals from the scenarios themselves (so it cannot
 * drift from the source of truth) and asserts that wherever the English text
 * mentions one, every other locale's corresponding text mentions it verbatim.
 */

const EXERCISES_DIR = path.resolve(fileURLToPath(import.meta.url), "../../../src/exercises");

type Tree = Record<string, unknown>;

function leafStrings(obj: Tree, prefix = ""): [string, string][] {
  return Object.entries(obj).flatMap(([k, v]) => {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === "object") return leafStrings(v as Tree, key);
    return typeof v === "string" ? [[key, v] as [string, string]] : [];
  });
}

function readJson(file: string): Tree {
  return JSON.parse(readFileSync(file, "utf8")) as Tree;
}

/**
 * A sentinel is a string return value with a space in it. Single-word expected
 * values ("true", "ACGT") are far too short to distinguish a deliberate mention
 * from an incidental one, so they are out of scope.
 */
function sentinelsOf(scenarios: readonly { expected?: unknown }[]): string[] {
  const found = scenarios.map((s) => s.expected).filter((e): e is string => typeof e === "string" && e.includes(" "));
  return [...new Set(found)];
}

describe("literal return values survive translation", () => {
  for (const [slug, loader] of Object.entries(exercises)) {
    it(`${slug}: sentinel return strings are byte-identical across locales`, async () => {
      const exercise = (await loader()).default;
      const sentinels = sentinelsOf(exercise.scenarios as readonly { expected?: unknown }[]);
      if (sentinels.length === 0) return;

      const exerciseDir = path.join(EXERCISES_DIR, slug);

      // --- message catalogs: compare leaf-by-leaf against `en` ---
      const localesDir = path.join(exerciseDir, "locales");
      if (existsSync(localesDir)) {
        const enFile = path.join(localesDir, "en", "translation.json");
        if (existsSync(enFile)) {
          const enLeaves = new Map(leafStrings(readJson(enFile)));
          const otherLocales = readdirSync(localesDir, { withFileTypes: true })
            .filter((d) => d.isDirectory() && d.name !== "en")
            .map((d) => d.name);

          for (const locale of otherLocales) {
            const file = path.join(localesDir, locale, "translation.json");
            if (!existsSync(file)) continue;
            const leaves = new Map(leafStrings(readJson(file)));

            for (const sentinel of sentinels) {
              for (const [key, enValue] of enLeaves) {
                if (!enValue.includes(sentinel)) continue;
                expect(
                  leaves.get(key),
                  `${slug}: locale "${locale}" key "${key}" must contain the exact return value ` +
                    `"${sentinel}". It is compared byte-for-byte by the scenario runner, so it must ` +
                    `not be translated.`
                ).toContain(sentinel);
              }
            }
          }
        }
      }

      // --- instructions: if source.md mentions it, every locale must too ---
      const instructionsDir = path.join(exerciseDir, "instructions");
      if (existsSync(instructionsDir)) {
        const sourceFile = path.join(instructionsDir, "source.md");
        if (existsSync(sourceFile)) {
          const source = readFileSync(sourceFile, "utf8");
          const otherFiles = readdirSync(instructionsDir).filter((f) => f.endsWith(".md") && f !== "source.md");

          for (const sentinel of sentinels) {
            if (!source.includes(sentinel)) continue;
            for (const file of otherFiles) {
              const content = readFileSync(path.join(instructionsDir, file), "utf8");
              expect(
                content,
                `${slug}: instructions/${file} must contain the exact return value "${sentinel}". ` +
                  `It is compared byte-for-byte by the scenario runner, so it must not be translated.`
              ).toContain(sentinel);
            }
          }
        }
      }
    });
  }
});
