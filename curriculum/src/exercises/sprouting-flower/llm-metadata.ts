import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches variable relationships and incremental updates in animations.
    Students learn to build complex graphics by calculating related values from a central point.
    Key concept: Everything is derived from the flower center, which moves up each iteration.
  `,

  tasks: {
    "draw-scene": {
      description: `
        Students must create a flower that grows over 60 iterations.

        Key teaching points:
        1. Variable relationships: All elements (stem, leaves, pistil) are calculated relative to the flower center
        2. Incremental updates: flower_center_y decreases by 1 each iteration (moves up), radii increase
        3. Mathematical relationships: stem_width = stem_height / 10, leaf dimensions are % of flower_radius
        4. Work incrementally: Start with flower, then add pistil, stem, and leaves one at a time

        Common mistakes:
        - Using absolute positions instead of calculating from flower_center
        - Forgetting to update variables at the start of each iteration
        - Not understanding that y=0 is top, y=100 is bottom
        - Hardcoding values instead of using relationships (e.g., stem_width should be stem_height/10)
        - Drawing elements in wrong order (background should be drawn first)

        Solution approach:
        1. Initialize all variables before the loop (flower_center starts at 90, radii start at 0)
        2. At start of each iteration, update: flower_center_y (decrease), radii (increase)
        3. Calculate dependent values: stem dimensions, leaf positions
        4. Draw in order: sky, ground, stem, flower head, pistil, leaves
        5. Use the scrubber to debug - check first and last frames match expected shapes
      `
    }
  }
};
