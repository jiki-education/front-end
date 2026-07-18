import { describe, it, expect } from "vitest";
import MazeSolveBasicExercise from "../../src/exercises/maze-solve-basic/Exercise";
import EmojiCollectorExercise from "../../src/exercises/emoji-collector/Exercise";
import DndRollExercise from "../../src/exercises/dnd-roll/Exercise";

import mazeBaseEn from "../../src/exercise-categories/maze/locales/en/translation.json";
import emojiEn from "../../src/exercises/emoji-collector/locales/en/translation.json";
import dndEn from "../../src/exercises/dnd-roll/locales/en/translation.json";

/**
 * Proves the `availableFunctions[].descriptionKey` seam is lossless: each keyed
 * describer resolves — through the injected merged message dict — to the EXACT
 * inline English template it replaced (byte-identical, with `${arg1}`/`${return}`
 * placeholders preserved so the interpreter's describer still substitutes them).
 *
 * The injected dict is the build-time merged pack (family base catalog deep-merged
 * into the member, member keys winning) — the same shape the app fetches from R2
 * and hands to `setMessages`. We reconstruct that merge here from source so the
 * proof is self-contained and matches the emitted
 * `public/static/i18n/exercises/<slug>/en/messages-*.json` packs.
 */

type Tree = Record<string, unknown>;

function isPlainObject(v: unknown): v is Tree {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function deepMerge(base: Tree, override: Tree): Tree {
  const out: Tree = { ...base };
  for (const [k, v] of Object.entries(override)) {
    const existing = out[k];
    if (isPlainObject(v) && isPlainObject(existing)) {
      out[k] = deepMerge(existing, v);
    } else {
      out[k] = v;
    }
  }
  return out;
}

// The ORIGINAL inline English templates that each `descriptionKey` replaced,
// keyed by the JavaScript (camelCase) function name `getExternalFunctions` emits.
const MAZE_BASE_DESCRIBERS: Record<string, string> = {
  move: "Move the character forward one cell",
  turnLeft: "Turn the character 90 degrees left",
  turnRight: "Turn the character 90 degrees right"
};

const EMOJI_DESCRIBERS: Record<string, string> = {
  ...MAZE_BASE_DESCRIBERS,
  look: "Look in a direction and see what's there",
  removeEmoji: "Remove the emoji from the current square",
  announceEmojis: "Announce the collected emojis"
};

const DND_DESCRIBERS: Record<string, string> = {
  roll: "rolled a die and got ${return}",
  announce: "announced ${arg1}",
  strike: "struck the goblin with attack ${arg1} and damage ${arg2}"
};

function resolvedDescriptions(exercise: {
  getExternalFunctions: (l: "javascript") => { name: string; description: string }[];
}): Record<string, string> {
  return Object.fromEntries(exercise.getExternalFunctions("javascript").map((f) => [f.name, f.description]));
}

describe("availableFunctions descriptionKey resolution", () => {
  it("maze base describers resolve to their original inline English (via base-catalog merge)", () => {
    const exercise = new MazeSolveBasicExercise();
    // maze-solve-basic has no own catalog; its pack is the family base catalog.
    exercise.setMessages(mazeBaseEn as Tree);

    expect(resolvedDescriptions(exercise)).toEqual(MAZE_BASE_DESCRIBERS);
  });

  it("emoji-collector describers (base + member) resolve to their original inline English", () => {
    const exercise = new EmojiCollectorExercise();
    exercise.setMessages(deepMerge(mazeBaseEn as Tree, emojiEn as Tree));

    expect(resolvedDescriptions(exercise)).toEqual(EMOJI_DESCRIBERS);
  });

  it("dnd-roll describers resolve to their original inline English with ${...} preserved", () => {
    const exercise = new DndRollExercise();
    exercise.setMessages(dndEn as Tree);

    expect(resolvedDescriptions(exercise)).toEqual(DND_DESCRIBERS);
  });
});
