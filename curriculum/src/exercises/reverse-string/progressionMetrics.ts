import { loopIterations } from "../progressionStdlib";
import type { ProgressionMetrics } from "../types";
import { scenarios } from "./scenarios";

// The scenarios grade the reversal itself. The common stall is appending
// (result + letter), which rebuilds the input unchanged and passes only the
// empty and palindrome scenarios. These metrics credit the steps a student
// has already got right on the way there: walking the string and building a
// result out of its letters.

function sortedCharacters(text: string): string {
  return Array.from(text).sort().join("");
}

// The longest plain-text input, so a working loop visits every character.
const SENTENCE_SLUG = "reverse-sentence-punctuation";
const sentence = String(scenarios.find((scenario) => scenario.slug === SENTENCE_SLUG)?.args[0] ?? "");

const nonEmptyScenarios = scenarios.filter((scenario) => String(scenario.args[0]).length > 0);

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress: how much of the sentence the loop walked.
      name: "reads_every_letter",
      maxScore: 1,
      points: 3,
      score: (runs, language) => {
        if (sentence.length === 0) {
          return 0;
        }
        return loopIterations(runs.bySlug(SENTENCE_SLUG), language) / Array.from(sentence).length;
      }
    },
    {
      // A loop built the result from exactly the input's letters, in any
      // order. Appending earns this in full while failing almost every
      // scenario, so it separates "builds the string, wrong way round" from
      // "returns the last letter". Returning the input untouched doesn't
      // count, since no loop built anything.
      name: "uses_every_letter",
      maxScore: nonEmptyScenarios.length,
      points: 4,
      score: (runs, language) =>
        nonEmptyScenarios.filter((scenario) => {
          const run = runs.bySlug(scenario.slug);
          const actual = run?.actual;
          return (
            loopIterations(run, language) > 0 &&
            typeof actual === "string" &&
            sortedCharacters(actual) === sortedCharacters(String(scenario.args[0]))
          );
        }).length
    }
  ]
};
