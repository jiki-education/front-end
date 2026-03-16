import type { tasks } from "./scenarios";

type TaskId = (typeof tasks)[number]["id"];

interface LLMMetadata {
  description: string;
  tasks: Record<TaskId, { description: string }>;
}

export const llmMetadata: LLMMetadata = {
  description: `
    This exercise teaches using random numbers in a loop to create visual art.
    Students combine Math.randomInt(), circle(), and hsl() to draw 200
    randomly positioned, randomly colored circles. Key concepts: using return
    values from functions as arguments to other functions, random number generation,
    HSL color system, and repeat loops. This is a creative exercise with flexible
    constraints rather than exact requirements.
  `,

  tasks: {
    "draw-splodges": {
      description: `
        Students must draw 200 circles at random positions with random colors.

        Rules (from instructions):
        1. Saturation and luminosity must be between 20 and 80 (fixed or random within range)
        2. Radius must be >= 1 and < 30 (student chooses within this range)
        3. Circles should touch the edges but not go outside the box

        Key teaching points:
        1. Using return values: Math.randomInt() returns a value that gets stored in a variable
        2. Composing functions: hsl() returns a color string used as argument to circle()
        3. Each iteration should generate NEW random values (variables inside the loop)
        4. The HSL color model: hue 0-360 gives the full color spectrum

        Common mistakes:
        - Declaring variables outside the loop (same position/color every iteration)
        - Forgetting to use hsl() to convert hue to a color string
        - Using wrong ranges for Math.randomInt()
        - Passing hue directly as color instead of converting with hsl()
        - Circles going outside the canvas (need to account for radius when picking position)
        - Saturation or luminosity outside 20-80 range

        Example solution pattern:
        repeat(200) {
          let radius = Math.randomInt(1, 29)
          let x = Math.randomInt(radius, 100 - radius)
          let y = Math.randomInt(radius, 100 - radius)
          let hue = Math.randomInt(0, 360)
          circle(x, y, radius, hsl(hue, 50, 50))
        }
      `
    }
  }
};
