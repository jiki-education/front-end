import { averageOverRuns, trustedResult, unwrap } from "../progressionStdlib";
import type { ProgressionMetrics, ScenarioRun, ScenarioRuns } from "../types";
import type AdventuresInPoetryExercise from "./Exercise";
import { FLAG } from "./Exercise";

// Every scenario carries the style checks (continue, break, no &&/!, flat
// nesting, one recite), so the scenarios anchor stays at 0 until the walk is
// both right and the right shape. These grade the walk in the order the
// llm-metadata anchors it: walk and stop at the flag, collect the words and
// leave out the scenery, then reshape into guard clauses. Spacing, the
// apostrophe and comma joins, and the seven-word cut-off stay with the
// scenarios.
const EMOJI_PATTERN = /\p{Extended_Pictographic}/u;
const PUNCTUATION = ["'", ","];
const WORD_LIMIT = 7;

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The poet walked, stopped without walking off the end of the path,
      // and recited.
      name: "walk_completes",
      maxScore: 1,
      points: 2,
      score: (runs) =>
        averageOverPoems(runs, (run, ex) => (movesMade(run).length > 0 && !run.result?.error && ex.recited ? 1 : 0))
    },
    {
      // The share of the words the poet walked past (up to the seven-word
      // limit) that appear in the recited poem, in order. Read from what
      // move() actually returned, so nothing about the tracks is restated.
      name: "words_collected",
      maxScore: 1,
      points: 4,
      score: (runs) =>
        averageOverPoems(runs, (run, ex) => {
          const words = movesMade(run)
            .filter((found) => found !== "" && !EMOJI_PATTERN.test(found) && !PUNCTUATION.includes(found))
            .slice(0, WORD_LIMIT);
          if (words.length === 0) {
            return 0;
          }
          const poem = ex.recitedPoem ?? "";
          let from = 0;
          let found = 0;
          for (const word of words) {
            const at = poem.indexOf(word, from);
            if (at === -1) {
              continue;
            }
            found++;
            from = at + word.length;
          }
          return found / words.length;
        })
    },
    {
      // A non-empty poem with no scenery (or flag) in it.
      name: "skips_scenery",
      maxScore: 1,
      points: 2,
      score: (runs) =>
        averageOverPoems(runs, (_run, ex) => {
          const poem = ex.recitedPoem ?? "";
          return poem.trim() !== "" && !EMOJI_PATTERN.test(poem) ? 1 : 0;
        })
    },
    {
      // The guard-clause shape the exercise teaches: continue to skip a
      // square and break to leave the walk, one point each.
      name: "guard_clauses",
      maxScore: 2,
      points: 3,
      score: (runs) => {
        const result = trustedResult(runs);
        if (!result) {
          return 0;
        }
        return (
          (result.assertors.assertStatement("ContinueStatement") ? 1 : 0) +
          (result.assertors.assertStatement("BreakStatement") ? 1 : 0)
        );
      }
    }
  ]
};

// Average a per-run score over the primary runs. A run with no exercise
// instance scores 0.
function averageOverPoems(
  runs: ScenarioRuns,
  scoreRun: (run: ScenarioRun, ex: AdventuresInPoetryExercise) => number
): number {
  return averageOverRuns(runs, (run) => {
    const ex = run.exercise as AdventuresInPoetryExercise | undefined;
    return ex ? scoreRun(run, ex) : 0;
  });
}

// What each move() call returned, up to (not including) the flag.
function movesMade(run: ScenarioRun): string[] {
  const moves: string[] = [];
  for (const entry of run.result?.meta.functionCallLog ?? []) {
    if (entry.name !== "move") {
      continue;
    }
    const found = unwrap(entry.return);
    if (typeof found !== "string" || found === FLAG) {
      break;
    }
    moves.push(found);
  }
  return moves;
}
