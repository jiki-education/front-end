import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise introduces the circle function.
    Students draw three circles to build a snowman on a provided background.
    Key concepts: function calls with multiple arguments, coordinate positioning.
  `,

  tasks: {
    "build-snowman": {
      description: `
        Students must draw three circles to build a snowman.

        Key teaching points:
        1. Circle parameters: (x, y, radius)
        2. x and y are the CENTER of the circle, not the top-left
        3. Coordinate system: (0,0) is top-left, (100,100) is bottom-right
        4. The color is automatically set to white

        Circle positions:
        - Base (bottom, biggest): center (50, 72), radius 20
        - Body (middle): center (50, 50), radius 15
        - Head (top, smallest): center (50, 33), radius 10

        Common mistakes:
        - Using wrong coordinates for the centers
        - Confusing radius with diameter
        - Getting the sizes in the wrong order
      `
    }
  }
};
