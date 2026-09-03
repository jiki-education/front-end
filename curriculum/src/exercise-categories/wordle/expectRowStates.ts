import type { VisualTestExpect } from "../../exercises/types";
import type WordleExercise from "./WordleExercise";
import type { LetterState } from "./WordleExercise";

// Builds the failure message for one row of a Wordle board by diffing what the
// student's code coloured against what the row should be, and naming the first
// square that differs. Reporting one square at a time keeps the message a single
// translatable sentence, and gives the student one thing to fix per run rather
// than a dump of the whole expected row.
//
// `showRow` is false for exercises whose board only ever has one guess, where a
// "row 1" clause is noise.
export function expectRowStates(
  exercise: WordleExercise,
  rowIdx: number,
  expected: LetterState[],
  showRow = true
): VisualTestExpect {
  const actual = exercise.statesForRow(rowIdx);
  const row = rowIdx + 1;
  const suffix = showRow ? "WithRow" : "";

  if (actual.length === 0) {
    return {
      pass: false,
      errorHtml: exercise.t(`checks.rowNotColored${suffix}`, { row })
    };
  }

  if (actual.length !== expected.length) {
    return {
      pass: false,
      errorHtml: exercise.t(`checks.rowWrongLength${suffix}`, {
        row,
        actual: actual.length,
        expected: expected.length
      })
    };
  }

  for (let idx = 0; idx < expected.length; idx++) {
    if (actual[idx] === expected[idx]) continue;
    const square = idx + 1;
    return {
      pass: false,
      errorHtml: exercise.t(`checks.rowMismatch${suffix}`, {
        row,
        square,
        // Upper case because a lower case "l" is indistinguishable from an
        // upper case "I" in the message font, which sent a student hunting for
        // the wrong square.
        letter: exercise.letterForRow(rowIdx, square).toUpperCase(),
        expected: expected[idx],
        actual: actual[idx]
      })
    };
  }

  return { pass: true };
}
