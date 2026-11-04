import { loopIterations, TRAILING_NUMBER, trailingNumber } from "../progressionStdlib";
import type { ProgressionMetrics } from "../types";
import { scenarios } from "./scenarios";

// The usual mistakes (counter starting at 0, incrementing before the
// comparison, returning the error inside the loop) fail every found-tile
// scenario at once, so the scenarios alone can't tell an off-by-one from a
// missing counter. These metrics grade the loop, the position tracking and
// the message separately. The position is the number at the end of the
// message (trailingNumber), and a bare number counts as a position too.

// The not-found search has to visit every tile before giving up.
const NOT_FOUND_SLUG = "tile-not-found";
const notFoundRack = String(scenarios.find((scenario) => scenario.slug === NOT_FOUND_SLUG)?.args[0] ?? "");

// The scenarios whose tile is on the rack (their expected message ends in a
// position).
const foundScenarios = scenarios.filter((scenario) => trailingNumber(scenario.expected) !== undefined);

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // Partial progress: how much of the rack the not-found search covered.
      // Returning the error inside the loop stops after the first tile.
      name: "checks_whole_rack",
      maxScore: 1,
      points: 3,
      score: (runs, language) => {
        if (notFoundRack.length === 0) {
          return 0;
        }
        return loopIterations(runs.bySlug(NOT_FOUND_SLUG), language) / Array.from(notFoundRack).length;
      }
    },
    {
      // The headline concept: a counter that moves with the loop. Off-by-one
      // positions (starting at 0, or incrementing before the comparison) are
      // still a working counter, so this scores the largest set of found-tile
      // scenarios that agree on one offset from the right answer. A counter
      // that never moves returns the same number everywhere and scores 0.
      name: "tracks_position",
      maxScore: foundScenarios.length,
      points: 4,
      score: (runs) => {
        const offsets: number[] = [];
        const positions = new Set<number>();
        for (const scenario of foundScenarios) {
          const position = trailingNumber(runs.bySlug(scenario.slug)?.actual);
          const expected = trailingNumber(scenario.expected);
          if (position !== undefined && expected !== undefined) {
            offsets.push(position - expected);
            positions.add(position);
          }
        }
        if (positions.size < 2) {
          return 0;
        }
        return Math.max(...offsets.map((offset) => offsets.filter((other) => other === offset).length));
      }
    },
    {
      // The message around the position is right, whatever the position.
      name: "formats_message",
      maxScore: 1,
      points: 2,
      score: (runs) =>
        foundScenarios.some((scenario) => {
          const actual = runs.bySlug(scenario.slug)?.actual;
          return (
            typeof actual === "string" &&
            typeof scenario.expected === "string" &&
            TRAILING_NUMBER.test(actual) &&
            actual.replace(TRAILING_NUMBER, "") === scenario.expected.replace(TRAILING_NUMBER, "")
          );
        })
          ? 1
          : 0
    }
  ]
};
