import { averageOverRuns } from "../progressionStdlib";
import type { ProgressionMetrics, ScenarioRun } from "../types";

// The scenarios grade each box's symbols, so these grade what they can't see:
// how far the loop got through the week, whether the descriptions are being
// mapped to different symbol arrays at all, and the weekday labels. The labels
// come from the parallel weekdays array indexed with the same counter as the
// box, which is the main new idea here, and no scenario checks them.

const BOX_COUNT = 6;
const WEEKDAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Every day in this scenario has a different description, so a full mapping
// draws six different symbol arrays.
const VARIED_SCENARIO_SLUG = "mixed-week";

interface DrawCall {
  box: unknown;
  day: unknown;
  elements: unknown;
}

// The draw() calls a run made. A call that fails validation halts the run
// before it is logged, so every logged call drew a box.
function drawCalls(run: ScenarioRun | undefined): DrawCall[] {
  return (run?.result?.meta.functionCallLog ?? [])
    .filter((entry) => entry.name === "draw")
    .map((entry) => ({ box: entry.args[0], day: entry.args[1], elements: entry.args[2] }));
}

// An order-independent key for a drawn symbol array (the exercise treats
// ["sun", "cloud"] and ["cloud", "sun"] as the same weather).
function symbolsKey(call: DrawCall): string {
  return JSON.stringify(Array.isArray(call.elements) ? [...(call.elements as unknown[])].sort() : call.elements);
}

function boxesDrawnRatio(run: ScenarioRun): number {
  const boxes = new Set(drawCalls(run).map((call) => call.box));
  return Math.min(boxes.size, BOX_COUNT) / BOX_COUNT;
}

// Boxes whose most recent draw carried that box's weekday label.
function labelledBoxesRatio(run: ScenarioRun): number {
  const labels = new Map<unknown, unknown>();
  for (const call of drawCalls(run)) {
    labels.set(call.box, call.day);
  }
  const correct = WEEKDAYS.filter((weekday, box) => labels.get(box) === weekday).length;
  return correct / BOX_COUNT;
}

export const progressionMetrics: ProgressionMetrics = {
  version: 1,

  metrics: [
    {
      // The headline concept: the parallel weekdays array, indexed with the
      // same counter as the box. Fraction of boxes labelled with their own
      // weekday, averaged across the weeks.
      name: "weekday_labels",
      maxScore: 1,
      points: 5,
      score: (runs) => averageOverRuns(runs, labelledBoxesRatio)
    },
    {
      // Partial progress through the week: fraction of the six boxes drawn,
      // averaged across the weeks. A single hardcoded draw() earns a sixth.
      name: "boxes_drawn",
      maxScore: 1,
      points: 3,
      score: (runs) => averageOverRuns(runs, boxesDrawnRatio)
    },
    {
      // Mapping descriptions to symbols: in a week of six different
      // descriptions, how many different symbol arrays were drawn. One fixed
      // array for every day earns a sixth. Whether each mapping is right is
      // the scenarios' job.
      name: "maps_descriptions",
      maxScore: BOX_COUNT,
      points: 3,
      score: (runs) => new Set(drawCalls(runs.bySlug(VARIED_SCENARIO_SLUG)).map(symbolsKey)).size
    }
  ]
};
