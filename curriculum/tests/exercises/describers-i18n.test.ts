import { describe, it, expect } from "vitest";
import MazeSolveBasicExercise from "../../src/exercises/maze-solve-basic/Exercise";
import EmojiCollectorExercise from "../../src/exercises/emoji-collector/Exercise";
import DndRollExercise from "../../src/exercises/dnd-roll/Exercise";
import AlienDetectorExercise from "../../src/exercises/alien-detector/Exercise";
import BattleProceduresExercise from "../../src/exercises/battle-procedures/Exercise";
import SpaceInvadersConditionalExercise from "../../src/exercises/space-invaders-conditional/Exercise";
import SpaceInvadersNestedRepeatExercise from "../../src/exercises/space-invaders-nested-repeat/Exercise";
import SpaceInvadersRepeatExercise from "../../src/exercises/space-invaders-repeat/Exercise";
import SpaceInvadersSolveBasicExercise from "../../src/exercises/space-invaders-solve-basic/Exercise";
import ScrollAndShootExercise from "../../src/exercises/scroll-and-shoot/ScrollAndShootExercise";

import mazeBaseEn from "../../src/exercise-categories/maze/locales/en/translation.json";
import emojiEn from "../../src/exercises/emoji-collector/locales/en/translation.json";
import dndEn from "../../src/exercises/dnd-roll/locales/en/translation.json";
import spaceInvadersBaseEn from "../../src/exercise-categories/space-invaders/locales/en/translation.json";
import alienDetectorEn from "../../src/exercises/alien-detector/locales/en/translation.json";
import battleProceduresEn from "../../src/exercises/battle-procedures/locales/en/translation.json";
import spaceInvadersConditionalEn from "../../src/exercises/space-invaders-conditional/locales/en/translation.json";
import spaceInvadersNestedRepeatEn from "../../src/exercises/space-invaders-nested-repeat/locales/en/translation.json";
import spaceInvadersRepeatEn from "../../src/exercises/space-invaders-repeat/locales/en/translation.json";
import spaceInvadersSolveBasicEn from "../../src/exercises/space-invaders-solve-basic/locales/en/translation.json";

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

const SPACE_INVADERS_BASE_DESCRIBERS: Record<string, string> = {
  moveLeft: "moved the laser cannon to the left",
  moveRight: "moved the laser cannon to the right",
  shoot: "shot the laser upwards",
  isAlienAbove: "determined if there was an alien above the laser cannon",
  getStartingAliensInRow: "retrieved the starting positions of row ${arg1} of aliens",
  fireFireworks: "fired off celebratory fireworks"
};

const ALIEN_DETECTOR_DESCRIBERS: Record<string, string> = {
  moveLeft: "moved the laser cannon to the left",
  moveRight: "moved the laser cannon to the right",
  shoot: "shot the laser upwards",
  getStartingAliensInRow: "retrieved the starting positions of row ${arg1} of aliens",
  fireFireworks: "fired off celebratory fireworks"
};

const BATTLE_PROCEDURES_DESCRIBERS: Record<string, string> = {
  moveLeft: "moved the laser cannon to the left",
  moveRight: "moved the laser cannon to the right",
  shoot: "shot the laser upwards",
  isAlienAbove: "determined if there was an alien above the laser cannon"
};

const MOVE_RIGHT_AND_SHOOT_DESCRIBERS: Record<string, string> = {
  move: "moved the laser cannon to the right",
  shoot: "shot the laser upwards"
};

const SPACE_INVADERS_CONDITIONAL_DESCRIBERS: Record<string, string> = {
  ...MOVE_RIGHT_AND_SHOOT_DESCRIBERS,
  isAlienAbove: "determined if there was an alien above the laser cannon"
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

  it("space-invaders base describers resolve to their original inline English (via base-catalog merge)", () => {
    const exercise = new ScrollAndShootExercise();
    // scroll-and-shoot has no own availableFunctions override; it inherits the base's.
    exercise.setMessages(spaceInvadersBaseEn as Tree);

    expect(resolvedDescriptions(exercise)).toEqual(SPACE_INVADERS_BASE_DESCRIBERS);
  });

  it("alien-detector describers (re-declared base functions) resolve to their original inline English", () => {
    const exercise = new AlienDetectorExercise();
    exercise.setMessages(deepMerge(spaceInvadersBaseEn as Tree, alienDetectorEn as Tree));

    expect(resolvedDescriptions(exercise)).toEqual(ALIEN_DETECTOR_DESCRIBERS);
  });

  it("battle-procedures describers (re-declared base functions) resolve to their original inline English", () => {
    const exercise = new BattleProceduresExercise();
    exercise.setMessages(deepMerge(spaceInvadersBaseEn as Tree, battleProceduresEn as Tree));

    expect(resolvedDescriptions(exercise)).toEqual(BATTLE_PROCEDURES_DESCRIBERS);
  });

  it("space-invaders-conditional describers (base + member) resolve to their original inline English", () => {
    const exercise = new SpaceInvadersConditionalExercise();
    exercise.setMessages(deepMerge(spaceInvadersBaseEn as Tree, spaceInvadersConditionalEn as Tree));

    expect(resolvedDescriptions(exercise)).toEqual(SPACE_INVADERS_CONDITIONAL_DESCRIBERS);
  });

  it("space-invaders-nested-repeat describers (base + member) resolve to their original inline English", () => {
    const exercise = new SpaceInvadersNestedRepeatExercise();
    exercise.setMessages(deepMerge(spaceInvadersBaseEn as Tree, spaceInvadersNestedRepeatEn as Tree));

    expect(resolvedDescriptions(exercise)).toEqual(MOVE_RIGHT_AND_SHOOT_DESCRIBERS);
  });

  it("space-invaders-repeat describers (base + member) resolve to their original inline English", () => {
    const exercise = new SpaceInvadersRepeatExercise();
    exercise.setMessages(deepMerge(spaceInvadersBaseEn as Tree, spaceInvadersRepeatEn as Tree));

    expect(resolvedDescriptions(exercise)).toEqual(MOVE_RIGHT_AND_SHOOT_DESCRIBERS);
  });

  it("space-invaders-solve-basic describers (base + member) resolve to their original inline English", () => {
    const exercise = new SpaceInvadersSolveBasicExercise();
    exercise.setMessages(deepMerge(spaceInvadersBaseEn as Tree, spaceInvadersSolveBasicEn as Tree));

    expect(resolvedDescriptions(exercise)).toEqual(MOVE_RIGHT_AND_SHOOT_DESCRIBERS);
  });
});
