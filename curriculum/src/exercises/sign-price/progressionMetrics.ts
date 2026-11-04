import { locMetric, loopIterations, TRAILING_NUMBER, trailingNumber } from "../progressionStdlib";
import type { ProgressionMetrics } from "../types";
import { scenarios } from "./scenarios";

// A scenario only passes when both the price and the message are right, so
// a student who has the counting working but returns a bare number (or the
// reverse) sees nothing but failures. These metrics grade the loop, the
// price and the message separately. The price is the number at the end of
// the message (trailingNumber), and a bare number counts as a price too.

function messageWithoutPrice(value: string): string {
  return value.replace(TRAILING_NUMBER, "");
}

// The longest sign, so a working loop visits every character.
const LONG_TEXT_SLUG = "long-text";
const longText = String(scenarios.find((scenario) => scenario.slug === LONG_TEXT_SLUG)?.args[0] ?? "");

// The main task's scenarios (the bonus re-runs one of them).
const priceScenarios = scenarios.filter((scenario) => scenario.taskId === "calculate-sign-price");

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress: how much of the sign the loop walked.
      name: "reads_every_letter",
      maxScore: 1,
      points: 3,
      score: (runs, language) => {
        if (longText.length === 0) {
          return 0;
        }
        return loopIterations(runs.bySlug(LONG_TEXT_SLUG), language) / Array.from(longText).length;
      }
    },
    {
      // The headline concept: letters are charged and spaces are skipped,
      // judged on the price alone so a bare number or a garbled message
      // still earns it. Counting the spaces gets only the space-free signs.
      name: "price_correct",
      maxScore: priceScenarios.length,
      points: 4,
      score: (runs) =>
        priceScenarios.filter((scenario) => {
          const price = trailingNumber(runs.bySlug(scenario.slug)?.actual);
          return price !== undefined && price === trailingNumber(scenario.expected);
        }).length
    },
    {
      // The message around the price is right, whatever the price.
      name: "formats_message",
      maxScore: 1,
      points: 2,
      score: (runs) =>
        priceScenarios.some((scenario) => {
          const actual = runs.bySlug(scenario.slug)?.actual;
          return (
            typeof actual === "string" &&
            typeof scenario.expected === "string" &&
            TRAILING_NUMBER.test(actual) &&
            messageWithoutPrice(actual) === messageWithoutPrice(scenario.expected)
          );
        })
          ? 1
          : 0
    },
    // Matches the "solve in 9 lines (6 for Python)" bonus scenario.
    locMetric({ target: { javascript: 9, jikiscript: 9, python: 6 }, points: 2 })
  ]
};
