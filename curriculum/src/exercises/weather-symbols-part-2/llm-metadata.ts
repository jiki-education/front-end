import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise allows a student to explore iterating a list of elements and
    drawing each, organising the work into helper functions. It follows Part 1
    (which produced these element lists) and reuses the drawing primitives from
    the cloud-rain-sun exercise.
  `,

  tasks: {
    "draw-weather": {
      description: `
        The genuinely tricky part is the sun: its size depends on whether a
        cloud is ALSO present, so the student must know the cloud's presence
        before/while drawing the sun (e.g. a pre-scan of the list, or checking
        for "cloud" in the same pass). A single-pass loop that draws the sun
        without that knowledge will always use the wrong size in mixed scenes.

        Other watch-points: sky background must be drawn first, and rain uses
        ellipses while snow uses circles (easy to confuse).
      `
    }
  }
};
