import type { ProgressionMetric } from "./types";

// Progression stdlib: metrics any exercise can import. Exercise
// progressionMetrics files contain ONLY what is unique to that exercise;
// anything two exercises would write identically belongs here.

/**
 * Lines-of-code metric for exercises with a line-count bonus target. Scores 0
 * until the exercise is solved (every non-bonus scenario passing); from then
 * on, points scale up as the code shrinks toward `target` lines - full
 * points at or under the target.
 */
export function locMetric({ target, points }: { target: number; points: number }): ProgressionMetric {
  return {
    name: "loc",
    maxScore: 1,
    points,
    score: (runs) => {
      if (!runs.allPassed()) {
        return 0;
      }
      const linesOfCode = runs.anyResult()?.assertors.countLinesOfCode();
      if (linesOfCode === undefined || linesOfCode <= 0) {
        return 0;
      }
      return Math.min(target / linesOfCode, 1);
    }
  };
}
