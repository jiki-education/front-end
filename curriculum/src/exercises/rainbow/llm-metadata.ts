import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore a loop that updates two variables
    (x position and hue) each iteration to paint a gradient.
  `,

  tasks: {
    "draw-rainbow": {
      description: `
        Anchor steps:
        1. Initialise x and hue BEFORE the loop (both at 0).
        2. Each iteration: draw the bar, THEN increment x and hue.

        Drawing before updating is the key ordering point: update-first pushes the
        first bar to x=1 and skips x=0. Other slips are forgetting to change hue
        (uniform color) and using saturation/luminosity that's too low.
      `
    }
  }
};
