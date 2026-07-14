import { formatIdentifier } from "@jiki/interpreters/shared";
import type { Language } from "../../types";
import type { ProgressionMetrics, ScenarioRuns } from "../types";
import type DigitalClockExercise from "./Exercise";

function calledFunction(runs: ScenarioRuns, language: Language, name: string): boolean {
  const formatted = formatIdentifier(name, language);
  return runs.all.some((run) => run.result?.meta.functionCallLog.some((entry) => entry.name === formatted) === true);
}

// The fixed-time scenarios and the meridiem their display should end with.
// The "now" scenario is deliberately excluded: it depends on the wall clock.
const MERIDIEM_BY_SCENARIO: Record<string, "am" | "pm"> = {
  "morning-1": "am",
  "morning-2": "am",
  "afternoon-1": "pm",
  "afternoon-2": "pm",
  midnight: "am",
  noon: "pm"
};

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // One point each for reading the hour and the minute.
      name: "read_the_time",
      maxScore: 2,
      points: 2,
      score: (runs, language) =>
        (calledFunction(runs, language, "current_time_hour") ? 1 : 0) +
        (calledFunction(runs, language, "current_time_minute") ? 1 : 0)
    },
    {
      // Displaying at all vs displaying correctly: the exercise records the
      // displayed time even when it's wrong.
      name: "displayed_time",
      maxScore: 1,
      points: 3,
      score: (runs) => {
        const exercises = runs.all
          .filter((run) => run.isolated !== true)
          .map((run) => run.exercise as DigitalClockExercise | undefined)
          .filter((ex): ex is DigitalClockExercise => ex !== undefined);
        if (exercises.length === 0) {
          return 0;
        }
        return exercises.filter((ex) => ex.displayedTime !== undefined).length / exercises.length;
      }
    },
    {
      // Partial progress inside failing scenarios: the am/pm sub-step can be
      // right while the 12-hour conversion (midnight/noon/afternoon hours) is
      // still wrong, which fails the whole scenario.
      name: "meridiem_indicator",
      maxScore: 6,
      points: 5,
      score: (runs) => {
        let correct = 0;
        for (const [slug, meridiem] of Object.entries(MERIDIEM_BY_SCENARIO)) {
          const ex = runs.bySlug(slug)?.exercise as DigitalClockExercise | undefined;
          if (ex?.displayedTime?.endsWith(meridiem) === true) {
            correct += 1;
          }
        }
        return correct;
      }
    }
  ]
};
