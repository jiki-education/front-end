import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise introduces the rectangle function.
    Students learn basic shape drawing to fill holes in a wall.
    Key concepts: function calls with multiple arguments, coordinate positioning.
  `,

  tasks: {
    "fill-holes": {
      description: `
        Students must draw three rectangles to cover holes in a wall.

        Key teaching points:
        1. Rectangle parameters: (left, top, width, height)
        2. Coordinate system: (0,0) is top-left, (100,100) is bottom-right
        3. The color is automatically set to brick red

        Hole positions (all divisible by 10):
        - Top hole: position (10, 10), size 20x10
        - Middle hole: position (70, 30), size 20x10
        - Bottom hole: position (20, 60), size 20x10

        Common mistakes:
        - Confusing width/height with right/bottom coordinates

        Solution approach:
        Draw three rectangles at the correct positions
      `
    }
  }
};
