import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches loop-based drawing with incrementing variables.
    Students learn to use variables to track position and color, updating them
    each iteration to create a gradient effect across the canvas.
    Key concepts: repeat loops, variable initialization and updates, HSL color system.
  `,

  tasks: {
    "draw-rainbow": {
      description: `
        Students must draw 100 vertical bars with different colors to create a rainbow.

        Key requirements:
        - 100 rectangles, each 1 unit wide and 100 units tall
        - x position increases by 1 each iteration (1 to 100)
        - hue increases by 3 each iteration (creates rainbow effect)
        - saturation and luminance set to 50

        Key teaching points:
        1. Initialize variables BEFORE the loop (x=0, hue=0)
        2. Update variables at the START of each iteration, BEFORE drawing
        3. HSL color: hue 0-360 determines color, saturation/luminance at 50 gives nice colors
        4. Color is the last argument: use hsl_to_hex() to convert HSL to a hex string

        Common mistakes:
        - Setting x to 1 initially (results in first bar at x=2)
        - Updating variables after drawing (off by one frame)
        - Forgetting to change hue (all bars same color)
        - Wrong rectangle dimensions

        Solution pattern:
        set x to 0, hue to 0
        repeat 100 times:
          x = x + 1
          hue = hue + 3
          rectangle(x, 0, 1, 100, hsl_to_hex(hue, 50, 50))
      `
    }
  }
};
