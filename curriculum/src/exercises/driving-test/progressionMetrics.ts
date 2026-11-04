import { locMetric, loopIterations } from "../progressionStdlib";
import type { ProgressionMetrics } from "../types";
import { scenarios } from "./scenarios";

// Constant answers pass two or three of the five scenarios (false alone gets
// six of the ten anchor points), so these metrics watch the loop itself:
// whether it reads the whole test sheet, and whether it stops at a major.

function marksFor(slug: string): string[] {
  return Array.from(String(scenarios.find((scenario) => scenario.slug === slug)?.args[0] ?? ""));
}

// A clean sheet with nothing to stop for, so a working loop reads every mark.
const CLEAN_SHEET_SLUG = "perfect-marks";
// A single major partway through an otherwise clean sheet.
const ONE_MAJOR_SLUG = "one-big-mistake";

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress: how much of the clean sheet the loop read. A loop
      // that returns on its first mark scores 1/20.
      name: "reads_every_mark",
      maxScore: 1,
      points: 3,
      score: (runs, language) => {
        const marks = marksFor(CLEAN_SHEET_SLUG);
        if (marks.length === 0) {
          return 0;
        }
        return loopIterations(runs.bySlug(CLEAN_SHEET_SLUG), language) / marks.length;
      }
    },
    {
      // The teaching point: fail as soon as a major appears, rather than
      // tallying majors and checking at the end. The loop must have stopped
      // at (or before) the major and answered false.
      name: "returns_early_on_major",
      maxScore: 1,
      points: 3,
      score: (runs, language) => {
        const run = runs.bySlug(ONE_MAJOR_SLUG);
        const majorPosition = marksFor(ONE_MAJOR_SLUG).indexOf("💥") + 1;
        const iterations = loopIterations(run, language);
        if (run?.actual !== false || majorPosition === 0) {
          return 0;
        }
        return iterations > 0 && iterations <= majorPosition ? 1 : 0;
      }
    },
    // Matches the "solve in 12 lines (8 for Python)" bonus scenario.
    locMetric({ target: { javascript: 12, jikiscript: 12, python: 8 }, points: 2 })
  ]
};
