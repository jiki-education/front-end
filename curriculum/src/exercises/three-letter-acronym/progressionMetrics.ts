import { locMetric } from "../progressionStdlib";
import type { ProgressionMetrics } from "../types";
import { scenarios } from "./scenarios";

// All four acronyms pass or fail together, so the scenarios can't see a
// student who has the shape right (one letter from each word, joined) but
// reaches for the wrong index. This metric grades that shape.

// The main task's scenarios (the bonus re-runs one of them).
const acronymScenarios = scenarios.filter((scenario) => scenario.taskId === "create-acronym-function");
const ACRONYM_LENGTH = 3;

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Each letter of the result comes from its own word, so indexing and
      // joining work even if the index is wrong ([1] instead of [0]).
      // Returning a single letter earns a third. Returning whole words
      // (anything longer than three letters) earns nothing.
      name: "letter_from_each_word",
      maxScore: acronymScenarios.length * ACRONYM_LENGTH,
      points: 5,
      score: (runs) =>
        acronymScenarios.reduce((total, scenario) => {
          const actual = runs.bySlug(scenario.slug)?.actual;
          if (typeof actual !== "string") {
            return total;
          }
          const letters = Array.from(actual);
          if (letters.length > ACRONYM_LENGTH) {
            return total;
          }
          const placed = letters.filter((letter, index) => String(scenario.args[index]).includes(letter)).length;
          return total + placed;
        }, 0)
    },
    // Matches the "solve in 3 lines (2 for Python)" bonus scenario.
    locMetric({ target: { javascript: 3, jikiscript: 3, python: 2 }, points: 2 })
  ]
};
