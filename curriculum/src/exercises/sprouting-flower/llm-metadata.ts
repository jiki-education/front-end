import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    Objective: derive every element of a scene from one moving anchor (the flower center)
    and animate it via per-iteration variable updates.
  `,

  tasks: {
    "draw-scene": {
      description: `
        There is a single task that spans the entire solution (no sub-progression). The
        student is expected to build it incrementally: flower head -> pistil -> stem ->
        leaves, getting each working before adding the next.

        Two traps survive even with the solution in front of you, so steer towards them:
        - Update order: variables must be reassigned at the TOP of the loop body, before any
          draw call. Updating after drawing produces a frame-off result that still "looks"
          almost right and is hard to spot without the scrubber. If the student is stuck
          here, try to help them reason about why this needs to happen, rather than just
          enforce it as a rule for them.
        - Draw order: shapes paint over each other, so the back-to-front sequence (sky,
          ground, stem, flower head, pistil, leaves) matters. A wrong order hides elements.

        Point the student at the scrubber's info toggle to compare their first/last-frame
        values against the ones given in the instructions.
      `
    }
  }
};
