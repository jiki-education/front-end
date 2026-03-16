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
        - x position goes from 0 to 99
        - hue starts at 0 and increases each iteration (e.g. by 3) to create a rainbow effect
        - saturation and luminosity should be at least 20 (around 50 gives nice colors)

        Key teaching points:
        1. Initialize variables BEFORE the loop (let x = 0, let hue = 0)
        2. Draw FIRST, then update variables at the END of each iteration
        3. HSL color: hue 0-360 determines color, saturation/luminosity at 50 gives nice colors
        4. Use hsl() to generate a color string, then pass it to rectangle()

        Common mistakes:
        - Updating variables before drawing (first bar ends up at x=1 instead of x=0)
        - Forgetting to change hue (all bars same color)
        - Wrong rectangle dimensions
        - Using very low saturation or luminosity (colors look washed out or too dark)

        Solution pattern:
        let x = 0
        let hue = 0
        repeat(100) {
          let color = hsl(hue, 50, 50)
          rectangle(x, 0, 1, 100, color)
          x = x + 1
          hue = hue + 3
        }
      `
    }
  }
};
