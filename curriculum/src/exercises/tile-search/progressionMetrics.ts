import { locMetric, loopIterations } from "../progressionStdlib";
import type { ProgressionMetrics } from "../types";
import { scenarios } from "./scenarios";

// A function that always returns true already passes five of the eight
// scenarios, and the classic trap (returning false inside the loop) passes
// five too. The scenarios can't tell those apart from real progress, so these
// metrics watch the loop itself: did it run, and did it check every tile
// before giving up?

// The not-found scenario must visit every tile before it can answer false.
const NOT_FOUND_SLUG = "letter-not-found";
const notFoundRack = String(scenarios.find((scenario) => scenario.slug === NOT_FOUND_SLUG)?.args[0] ?? "");

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The first step: a loop that walks the rack at all.
      name: "loops_through_rack",
      maxScore: 1,
      points: 3,
      score: (runs, language) => (runs.all.some((run) => loopIterations(run, language) > 0) ? 1 : 0)
    },
    {
      // The headline concept: false is only known once every tile has been
      // checked. Returning false inside the loop stops after the first tile,
      // so this grades how much of the rack the not-found search covered.
      name: "checks_every_tile",
      maxScore: 1,
      points: 5,
      score: (runs, language) => {
        if (notFoundRack.length === 0) {
          return 0;
        }
        return loopIterations(runs.bySlug(NOT_FOUND_SLUG), language) / Array.from(notFoundRack).length;
      }
    },
    // Matches the "solve in 8 lines (5 for Python)" bonus scenario.
    locMetric({ target: { javascript: 8, jikiscript: 8, python: 5 }, points: 2 })
  ]
};
