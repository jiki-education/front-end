import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise introduces the rectangle and fill_color_hex functions.
    Students learn basic shape drawing and color setting to fill holes in a wall.
    Key concepts: function calls with multiple arguments, hex colors, coordinate positioning.
  `,

  tasks: {
    "fill-holes": {
      description: `
        Students must draw three brick-colored rectangles to cover holes in a wall.

        Key teaching points:
        1. Set color BEFORE drawing: fill_color_hex must be called before rectangle
        2. Coordinate system: (0,0) is top-left, (100,100) is bottom-right
        3. Rectangle parameters: (left, top, width, height)
        4. Hex colors: Use strings like "#AA4A44" for brick red

        Hole positions (all divisible by 10):
        - Top hole: position (10, 10), size 20x10
        - Middle hole: position (70, 30), size 20x10
        - Bottom hole: position (20, 60), size 20x10

        Common mistakes:
        - Forgetting to set the fill color first
        - Confusing width/height with right/bottom coordinates
        - Using wrong color format (must be a string)

        Solution approach:
        1. Call fill_color_hex with a brick color
        2. Draw three rectangles at the correct positions
      `
    }
  }
};
